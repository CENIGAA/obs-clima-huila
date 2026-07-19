"""
scripts/rag/02_query_v2.py
===========================
Consulta v2 del RAG ENSO-Huila
Arquitectura: Pauta de Configuración RAG Replicable v2 (CENIGAA 2026)

Pipeline:
  query
    → embed (nomic-embed-text) + BM25 sparse
    → recuperar top-50 híbrido (Qdrant coseno ∪ BM25)
    → RERANKER cross-encoder BAAI/bge-reranker-v2-m3 → top-8
    → score enforcement (PRESENT / ABSENT / UNCERTAIN)
    → chunks al LLM → respuesta con citas

Uso:
  python3 scripts/rag/02_query_v2.py
  python3 scripts/rag/02_query_v2.py --modelo llama3.2
  python3 scripts/rag/02_query_v2.py --k 5
  python3 scripts/rag/02_query_v2.py --solo-buscar

Autor: CENIGAA / Claude (Cowork) — 2026-07-19
"""

import argparse
import pickle
import re
from pathlib import Path

import requests
from sentence_transformers import CrossEncoder
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

# ── Configuración ──────────────────────────────────────────────────────────────
QDRANT_URL      = "http://localhost:6333"
OLLAMA_URL      = "http://localhost:11434"
COLLECTION      = "enso_huila"
EMBED_MODEL     = "nomic-embed-text"
DEFAULT_LLM     = "llama3.2"
BM25_INDEX_PATH = Path("scripts/rag/bm25_index.pkl")

# Reranker
RERANK_MODEL    = "BAAI/bge-reranker-v2-m3"
RETRIEVE_TOP_N  = 50    # candidatos al reranker
RERANK_TOP_K    = 8     # los que llegan al LLM

# Umbrales sobre score de RERANKER (recalibrar con §6 de la pauta)
THRESHOLD_PRESENT   = 0.70
THRESHOLD_ABSENT    = 0.30
CONSENSUS_TRIGGER   = 0.50

SYSTEM_PROMPT = """Eres un asistente científico especializado en hidroclimatología,
variabilidad climática ENSO y precipitación en los Andes colombianos.
Trabajas para CENIGAA en el Observatorio Climático del Huila «Efraín Domínguez Calle».

Responde en español con precisión científica.
Cuando cites información, indica SIEMPRE la fuente entre corchetes:
[Apellido Año, p. X] o [Apellido Año].
Si la información no está en el contexto, dilo explícitamente.
No inventes datos ni correlaciones."""

QUERY_TEMPLATE = """CONTEXTO DE REFERENCIAS CIENTÍFICAS (chunks rerankeados):
{contexto}

---
PREGUNTA:
{pregunta}

Responde con base en el contexto anterior. Cita las fuentes con [Autores Año, p. X].
Si algún chunk tiene has_figure=True, menciona que existe una figura en esa página."""


# ── Embeddings ─────────────────────────────────────────────────────────────────

def get_embedding(texto: str) -> list[float]:
    resp = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": texto},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


# ── BM25 sparse ───────────────────────────────────────────────────────────────

def tokenizar(texto: str) -> list[str]:
    return re.findall(r'\w+', texto.lower())


def cargar_bm25():
    if BM25_INDEX_PATH.exists():
        with open(BM25_INDEX_PATH, "rb") as f:
            data = pickle.load(f)
        return data["bm25"], data["ids"]
    return None, []


def buscar_bm25(bm25, ids_bm25: list, query: str, top_n: int) -> list[str]:
    if bm25 is None:
        return []
    tokens = tokenizar(query)
    scores = bm25.get_scores(tokens)
    ranked = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)[:top_n]
    return [ids_bm25[i] for i, s in ranked if s > 0]


# ── Recuperación híbrida ───────────────────────────────────────────────────────

def recuperar_hibrido(
    client: QdrantClient,
    bm25, ids_bm25: list,
    pregunta: str,
    top_n: int = RETRIEVE_TOP_N,
) -> list[dict]:
    """
    Combina búsqueda densa (Qdrant coseno) + BM25 sparse.
    Devuelve lista de chunks únicos con payload.
    """
    emb = get_embedding(pregunta)

    # Dense
    res_dense = client.query_points(
        collection_name=COLLECTION,
        query=emb,
        limit=top_n,
        with_payload=True,
    ).points

    # BM25
    ids_bm25_top = buscar_bm25(bm25, ids_bm25, pregunta, top_n // 2)

    # Recuperar payloads de los hits BM25
    chunks_vistos = {r.id for r in res_dense}
    chunks = [
        {
            "id":          r.id,
            "score_cosine":r.score,
            "score_rerank":None,
            "texto":       r.payload.get("texto", ""),
            "autores":     r.payload.get("autores", "?"),
            "year":        r.payload.get("year", "?"),
            "title":       r.payload.get("title", "?"),
            "archivo":     r.payload.get("archivo", "?"),
            "pagina":      r.payload.get("pagina", "?"),
            "has_figure":  r.payload.get("has_figure", False),
            "figure_path": r.payload.get("figure_path", None),
            "contextualized": r.payload.get("contextualized", False),
        }
        for r in res_dense
    ]

    if ids_bm25_top:
        bm25_hits = client.retrieve(
            collection_name=COLLECTION,
            ids=ids_bm25_top,
            with_payload=True,
            with_vectors=False,
        )
        for hit in bm25_hits:
            if hit.id not in chunks_vistos:
                chunks_vistos.add(hit.id)
                chunks.append({
                    "id":          hit.id,
                    "score_cosine":0.0,
                    "score_rerank":None,
                    "texto":       hit.payload.get("texto", ""),
                    "autores":     hit.payload.get("autores", "?"),
                    "year":        hit.payload.get("year", "?"),
                    "title":       hit.payload.get("title", "?"),
                    "archivo":     hit.payload.get("archivo", "?"),
                    "pagina":      hit.payload.get("pagina", "?"),
                    "has_figure":  hit.payload.get("has_figure", False),
                    "figure_path": hit.payload.get("figure_path", None),
                    "contextualized": hit.payload.get("contextualized", False),
                })

    return chunks


# ── Reranker ──────────────────────────────────────────────────────────────────

_reranker = None

def get_reranker():
    global _reranker
    if _reranker is None:
        print("  ⏳ Cargando reranker BGE-m3 (primera vez, ~30s) ...")
        _reranker = CrossEncoder(RERANK_MODEL, max_length=512)
        print("  ✅ Reranker cargado")
    return _reranker


def rerankear(pregunta: str, chunks: list[dict], top_k: int = RERANK_TOP_K) -> list[dict]:
    """Reordena chunks con cross-encoder. Devuelve top_k con score_rerank."""
    if not chunks:
        return []
    reranker = get_reranker()
    pares = [(pregunta, c["texto"]) for c in chunks]
    scores = reranker.predict(pares)
    # Normalizar a [0,1] con sigmoid
    import numpy as np
    scores = 1 / (1 + np.exp(-scores))
    for chunk, score in zip(chunks, scores):
        chunk["score_rerank"] = float(score)
    reranked = sorted(chunks, key=lambda x: x["score_rerank"], reverse=True)
    return reranked[:top_k]


# ── Score enforcement ─────────────────────────────────────────────────────────

def veredicto(score: float) -> str:
    if score >= THRESHOLD_PRESENT:
        return "PRESENT"
    elif score <= THRESHOLD_ABSENT:
        return "ABSENT"
    else:
        return "UNCERTAIN"


# ── LLM ───────────────────────────────────────────────────────────────────────

def generar_respuesta(pregunta: str, chunks: list[dict], modelo: str) -> str:
    bloques = []
    for i, c in enumerate(chunks, 1):
        cita = f"[{c['autores']} {c['year']}, p.{c['pagina']}]"
        fig_nota = " [FIGURA DISPONIBLE]" if c.get("has_figure") else ""
        bloques.append(
            f"[FUENTE {i}] {cita}{fig_nota}\n"
            f"Score reranker: {c['score_rerank']:.3f} ({veredicto(c['score_rerank'])})\n"
            f"Texto: {c['texto'][:800]}"
        )
    contexto = "\n\n---\n\n".join(bloques)
    prompt = QUERY_TEMPLATE.format(contexto=contexto, pregunta=pregunta)

    resp = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={
            "model":  modelo,
            "system": SYSTEM_PROMPT,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.1, "num_ctx": 8192},
        },
        timeout=180,
    )
    resp.raise_for_status()
    return resp.json()["response"]


# ── Interfaz CLI ───────────────────────────────────────────────────────────────

def imprimir_fuentes(chunks: list[dict]):
    print("\n── Fuentes rerankeadas ──────────────────────────────────")
    for i, c in enumerate(chunks, 1):
        verd = veredicto(c["score_rerank"])
        fig  = " 🖼" if c.get("has_figure") else ""
        print(f"  [{i}] {c['autores']} ({c['year']}) — p.{c['pagina']}{fig}")
        print(f"       Rerank: {c['score_rerank']:.3f} [{verd}] | {c['title'][:55]}...")


def main():
    parser = argparse.ArgumentParser(description="RAG ENSO-Huila v2 — Consulta")
    parser.add_argument("--modelo", default=DEFAULT_LLM)
    parser.add_argument("--k", type=int, default=RERANK_TOP_K,
                        help=f"Chunks al LLM tras reranking (default: {RERANK_TOP_K})")
    parser.add_argument("--top-n", type=int, default=RETRIEVE_TOP_N,
                        help=f"Candidatos al reranker (default: {RETRIEVE_TOP_N})")
    parser.add_argument("--solo-buscar", action="store_true",
                        help="Solo muestra chunks rerankeados, sin LLM")
    args = parser.parse_args()

    # Servicios
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=10)
        info   = client.get_collection(COLLECTION)
        print(f"✅ Qdrant · '{COLLECTION}' · {info.points_count} puntos")
    except Exception as e:
        print(f"❌ Qdrant: {e}")
        return

    bm25, ids_bm25 = cargar_bm25()
    if bm25:
        print(f"✅ BM25  · {len(ids_bm25)} documentos indexados")
    else:
        print("⚠️  BM25 no encontrado — solo búsqueda densa")

    print(f"✅ Modelo LLM : {args.modelo}")
    print(f"   Retrieve   : top-{args.top_n} → reranker → top-{args.k}")
    print("\nEscribe tu pregunta (o 'salir'):\n")

    while True:
        try:
            pregunta = input("❓ > ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nHasta luego.")
            break

        if not pregunta or pregunta.lower() in ("salir", "exit", "quit"):
            print("Hasta luego.")
            break

        print(f"\n🔍 Recuperando top-{args.top_n} candidatos ...")
        try:
            candidatos = recuperar_hibrido(client, bm25, ids_bm25, pregunta, args.top_n)
        except Exception as e:
            print(f"❌ Error búsqueda: {e}")
            continue

        print(f"   Rerankeando {len(candidatos)} candidatos → top-{args.k} ...")
        try:
            chunks = rerankear(pregunta, candidatos, args.k)
        except Exception as e:
            print(f"❌ Error reranker: {e}")
            continue

        imprimir_fuentes(chunks)

        if args.solo_buscar:
            print("\n── Texto del chunk #1 ──────────────────────────────────")
            print(chunks[0]["texto"][:1000])
            print()
            continue

        print(f"\n🤖 Generando respuesta ({args.modelo}) ...")
        try:
            respuesta = generar_respuesta(pregunta, chunks, args.modelo)
        except Exception as e:
            print(f"❌ Error LLM: {e}")
            continue

        print("\n── Respuesta ───────────────────────────────────────────")
        print(respuesta)
        print("─" * 55 + "\n")


if __name__ == "__main__":
    main()
