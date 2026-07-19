"""
scripts/rag/03_mcp_server.py
=============================
MCP Server stdio para RAG ENSO-Huila v2
Arquitectura: Pauta de Configuración RAG Replicable v2 (CENIGAA 2026)

Herramientas expuestas:
  kb_search(query, top_k=8, min_score=0.30)
    → Busca en la base de conocimiento ENSO-Huila.
    → Pipeline: dense+BM25 híbrido → reranker BGE-m3 → top-k chunks.
    → Devuelve chunks con score_rerank, veredicto PRESENT/ABSENT/UNCERTAIN y citas.

  neg_check(term, ref_id?)
    → Verifica si un término/claim está PRESENT, ABSENT o UNCERTAIN en el corpus.
    → Útil para verificar afirmaciones antes de escribir el paper.

Registro en Claude Desktop (~/.claude/claude_desktop_config.json):
  {
    "mcpServers": {
      "enso-huila-kb": {
        "command": "python3",
        "args": ["/Users/<tu-usuario>/webstack/obs-clima-huila/scripts/rag/03_mcp_server.py"],
        "cwd": "/Users/<tu-usuario>/webstack/obs-clima-huila"
      }
    }
  }

Requisitos: pip install mcp qdrant-client FlagEmbedding rank_bm25 requests
Autor: CENIGAA / Claude (Cowork) — 2026-07-19
"""

import json
import pickle
import re
import sys
from pathlib import Path

import numpy as np
import requests
from sentence_transformers import CrossEncoder
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool
from qdrant_client import QdrantClient

# ── Configuración ──────────────────────────────────────────────────────────────
QDRANT_URL      = "http://localhost:6333"
OLLAMA_URL      = "http://localhost:11434"
COLLECTION      = "enso_huila"
EMBED_MODEL     = "nomic-embed-text"
BM25_INDEX_PATH = Path("scripts/rag/bm25_index.pkl")
RERANK_MODEL    = "BAAI/bge-reranker-v2-m3"
RETRIEVE_TOP_N  = 50
RERANK_TOP_K    = 8
THRESHOLD_PRESENT  = 0.70
THRESHOLD_ABSENT   = 0.30


# ── Utilidades ─────────────────────────────────────────────────────────────────

def get_embedding(texto: str) -> list[float]:
    resp = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": texto},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


def tokenizar(texto: str) -> list[str]:
    return re.findall(r'\w+', texto.lower())


def veredicto(score: float) -> str:
    if score >= THRESHOLD_PRESENT:
        return "PRESENT"
    elif score <= THRESHOLD_ABSENT:
        return "ABSENT"
    return "UNCERTAIN"


# ── Singletons ─────────────────────────────────────────────────────────────────

_client   = None
_reranker = None
_bm25     = None
_bm25_ids = []


def get_client():
    global _client
    if _client is None:
        _client = QdrantClient(url=QDRANT_URL, timeout=10)
    return _client


def get_reranker():
    global _reranker
    if _reranker is None:
        _reranker = CrossEncoder(RERANK_MODEL, max_length=512)
    return _reranker


def get_bm25():
    global _bm25, _bm25_ids
    if _bm25 is None and BM25_INDEX_PATH.exists():
        with open(BM25_INDEX_PATH, "rb") as f:
            data = pickle.load(f)
        _bm25     = data["bm25"]
        _bm25_ids = data["ids"]
    return _bm25, _bm25_ids


# ── Pipeline de recuperación ───────────────────────────────────────────────────

def pipeline(query: str, top_k: int = RERANK_TOP_K) -> list[dict]:
    client = get_client()
    bm25, ids_bm25 = get_bm25()
    emb = get_embedding(query)

    # Dense
    res_dense = client.query_points(
        collection_name=COLLECTION,
        query=emb,
        limit=RETRIEVE_TOP_N,
        with_payload=True,
    ).points
    vistos = {r.id for r in res_dense}
    chunks = [
        {
            "id":         r.id,
            "texto":      r.payload.get("texto", ""),
            "autores":    r.payload.get("autores", "?"),
            "year":       r.payload.get("year", "?"),
            "title":      r.payload.get("title", "?"),
            "archivo":    r.payload.get("archivo", "?"),
            "pagina":     r.payload.get("pagina", "?"),
            "has_figure": r.payload.get("has_figure", False),
            "figure_path":r.payload.get("figure_path", None),
        }
        for r in res_dense
    ]

    # BM25 complementario
    if bm25 is not None:
        tokens = tokenizar(query)
        scores = bm25.get_scores(tokens)
        ranked = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)[: RETRIEVE_TOP_N // 2]
        bm25_top_ids = [ids_bm25[i] for i, s in ranked if s > 0]
        if bm25_top_ids:
            hits = client.retrieve(
                collection_name=COLLECTION,
                ids=bm25_top_ids,
                with_payload=True,
                with_vectors=False,
            )
            for h in hits:
                if h.id not in vistos:
                    vistos.add(h.id)
                    chunks.append({
                        "id":         h.id,
                        "texto":      h.payload.get("texto", ""),
                        "autores":    h.payload.get("autores", "?"),
                        "year":       h.payload.get("year", "?"),
                        "title":      h.payload.get("title", "?"),
                        "archivo":    h.payload.get("archivo", "?"),
                        "pagina":     h.payload.get("pagina", "?"),
                        "has_figure": h.payload.get("has_figure", False),
                        "figure_path":h.payload.get("figure_path", None),
                    })

    # Reranker
    if not chunks:
        return []
    reranker = get_reranker()
    pares  = [(query, c["texto"]) for c in chunks]
    scores = reranker.predict(pares)
    scores = 1 / (1 + np.exp(-scores))   # sigmoid → [0,1]
    for c, s in zip(chunks, scores):
        c["score_rerank"] = float(s)
        c["veredicto"]    = veredicto(float(s))

    return sorted(chunks, key=lambda x: x["score_rerank"], reverse=True)[:top_k]


# ── Formateo de resultado ──────────────────────────────────────────────────────

def formatear_chunks(chunks: list[dict]) -> str:
    lineas = []
    for i, c in enumerate(chunks, 1):
        fig = " [FIGURA DISPONIBLE]" if c.get("has_figure") else ""
        lineas.append(
            f"[{i}] [{c['autores']} {c['year']}, p.{c['pagina']}]{fig}\n"
            f"    Veredicto: {c['veredicto']} (score_rerank={c['score_rerank']:.3f})\n"
            f"    Fuente: {c['archivo']}\n"
            f"    Texto: {c['texto'][:600]}\n"
        )
    return "\n".join(lineas)


# ── MCP Server ────────────────────────────────────────────────────────────────

app = Server("enso-huila-kb")


@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="kb_search",
            description=(
                "Busca en la base de conocimiento ENSO-Huila (7 referencias científicas). "
                "Usa búsqueda híbrida densa+BM25 con reranker cross-encoder BGE-m3. "
                "Devuelve chunks con veredicto PRESENT/ABSENT/UNCERTAIN y citas. "
                "Ideal para obtener contexto bibliográfico antes de redactar el paper."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Pregunta o claim a verificar en el corpus",
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "Número de chunks a devolver (default: 8)",
                        "default": 8,
                    },
                    "min_score": {
                        "type": "number",
                        "description": "Umbral mínimo score_rerank para incluir chunk (default: 0.0 = todos)",
                        "default": 0.0,
                    },
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="neg_check",
            description=(
                "Verifica si un término, claim o concepto está PRESENT, ABSENT o UNCERTAIN "
                "en el corpus ENSO-Huila. Útil para detectar ausencias antes de escribir. "
                "Devuelve el veredicto y el chunk de mayor score_rerank."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "term": {
                        "type": "string",
                        "description": "Término o claim a verificar",
                    },
                    "ref_id": {
                        "type": "string",
                        "description": "ref_id opcional para limitar a un paper (ej: 'dominguez2018')",
                    },
                },
                "required": ["term"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "kb_search":
        query    = arguments["query"]
        top_k    = int(arguments.get("top_k", RERANK_TOP_K))
        min_score= float(arguments.get("min_score", 0.0))

        chunks = pipeline(query, top_k=top_k)
        if min_score > 0:
            chunks = [c for c in chunks if c["score_rerank"] >= min_score]

        if not chunks:
            text = "No se encontraron chunks con score_rerank >= min_score."
        else:
            text = f"=== kb_search: {len(chunks)} resultados ===\n\n" + formatear_chunks(chunks)

        return [TextContent(type="text", text=text)]

    elif name == "neg_check":
        term   = arguments["term"]
        ref_id = arguments.get("ref_id")

        chunks = pipeline(term, top_k=5)
        if ref_id:
            chunks = [c for c in chunks if c.get("ref_id") == ref_id or ref_id in c.get("archivo","")]

        if not chunks:
            verd = "ABSENT"
            detalle = "No se encontraron chunks para este término."
        else:
            top = chunks[0]
            verd = top["veredicto"]
            detalle = (
                f"Score reranker: {top['score_rerank']:.3f}\n"
                f"Fuente: [{top['autores']} {top['year']}, p.{top['pagina']}]\n"
                f"Texto: {top['texto'][:400]}"
            )

        text = f"=== neg_check: '{term}' ===\nVeredicto: {verd}\n\n{detalle}"
        return [TextContent(type="text", text=text)]

    else:
        return [TextContent(type="text", text=f"Herramienta desconocida: {name}")]


# ── Entry point ────────────────────────────────────────────────────────────────

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
