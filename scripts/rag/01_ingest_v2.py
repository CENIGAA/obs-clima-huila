"""
scripts/rag/01_ingest_v2.py
============================
Ingesta v2 de PDFs científicos al RAG ENSO-Huila
Arquitectura: Pauta de Configuración RAG Replicable v2 (CENIGAA 2026)

Mejoras sobre v1:
  1. Extracción: pdfplumber (texto) + PyMuPDF/fitz (imágenes)
  2. Chunking: llama_index SentenceSplitter (semántico)
  3. Contextual Retrieval: llama3.2 genera frase de contexto por chunk
  4. Figuras: qwen2.5vl:7b describe figuras → chunk de texto
  5. BM25: índice sparse guardado junto a Qdrant
  6. Payload enriquecido: has_figure, contextualized, figure_page, etc.

Uso:
  cd ~/webstack/obs-clima-huila
  python3 scripts/rag/01_ingest_v2.py

  # Solo un PDF (para pruebas):
  python3 scripts/rag/01_ingest_v2.py --archivo CC_VCE_Huila_2018.pdf

  # Sin figuras (más rápido):
  python3 scripts/rag/01_ingest_v2.py --sin-figuras

  # Sin contextual retrieval (más rápido):
  python3 scripts/rag/01_ingest_v2.py --sin-contexto

Autor: CENIGAA / Claude (Cowork) — 2026-07-19
"""

import argparse
import hashlib
import json
import pickle
import re
import struct
import tempfile
from pathlib import Path

import fitz  # PyMuPDF
import pdfplumber
import requests
from llama_index.core.node_parser import SentenceSplitter
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)
from rank_bm25 import BM25Okapi
from tqdm import tqdm

# ── Configuración ──────────────────────────────────────────────────────────────
REFS_DIR        = Path("data/referencias")
FIGURES_DIR     = Path("data/figuras_rag")   # donde se guardan imágenes extraídas
BM25_INDEX_PATH = Path("scripts/rag/bm25_index.pkl")

QDRANT_URL   = "http://localhost:6333"
OLLAMA_URL   = "http://localhost:11434"
COLLECTION   = "enso_huila"
EMBED_MODEL  = "nomic-embed-text"
EMBED_DIMS   = 768

# Contextual Retrieval
CONTEXTUAL_ENABLED  = True
CONTEXT_LLM         = "llama3.2"   # ya disponible, bueno para frases cortas
CONTEXT_MAX_TOKENS  = 80

# Figuras
FIGURES_ENABLED  = True
VLM_MODEL        = "qwen2.5vl:7b"
MIN_FIGURE_SIZE  = 5000   # bytes — ignora íconos pequeños

# Chunking (SentenceSplitter)
CHUNK_SIZE      = 384   # tokens
CHUNK_OVERLAP   = 128
MAX_CHARS       = 1200  # truncar chunks muy largos

PROJECT = "enso_huila"

# ── Metadatos por archivo ──────────────────────────────────────────────────────
FUENTES = {
    "CC_VCE_Huila_2018.pdf": {
        "ref_id":  "dominguez2018",
        "tipo":    "libro",
        "autores": "Domínguez Calle et al.",
        "year":    2018,
        "title":   "Cambio Climático y Variabilidad Climática Extrema en el Huila",
        "isbn":    "978-620-2-16957-8",
        "lang":    "es",
    },
    "De_Leon_Perez_2026.pdf": {
        "ref_id":  "deleon2026",
        "tipo":    "articulo",
        "autores": "De León Pérez et al.",
        "year":    2026,
        "title":   "Regional synchronization patterns between climate indices and colombian hydroclimatic variables",
        "journal": "Hydrological Sciences Journal",
        "lang":    "en",
    },
    "Diaz_2022.pdf": {
        "ref_id":  "diaz2022",
        "tipo":    "articulo",
        "autores": "Díaz et al.",
        "year":    2022,
        "title":   "Wavelet coherence between ENSO indices and precipitation for the Andes region of Colombia",
        "journal": "Atmosfera",
        "lang":    "en",
    },
    "Grimm_2000.pdf": {
        "ref_id":  "grimm2000",
        "tipo":    "articulo",
        "autores": "Grimm et al.",
        "year":    2000,
        "title":   "Climate Variability in Southern South America Associated with El Niño and La Niña Events",
        "journal": "Journal of Climate",
        "lang":    "en",
    },
    "Gutierrez_Cardenas_2025.pdf": {
        "ref_id":  "gutierrez2025",
        "tipo":    "articulo",
        "autores": "Gutiérrez-Cárdenas et al.",
        "year":    2025,
        "title":   "Similar teleconnection patterns of ENSO-NAO and ENSO-precipitation in Colombia",
        "journal": "Environmental Science and Pollution Research",
        "lang":    "en",
    },
    "Jonaitis_2021.pdf": {
        "ref_id":  "jonaitis2021",
        "tipo":    "articulo",
        "autores": "Jonaitis et al.",
        "year":    2021,
        "title":   "Spatiotemporal patterns of ENSO-precipitation relationships in the tropical Andes",
        "journal": "International Journal of Climatology",
        "lang":    "en",
    },
    "Thielen_2023.pdf": {
        "ref_id":  "thielen2023",
        "tipo":    "articulo",
        "autores": "Thielen et al.",
        "year":    2023,
        "title":   "Effect of extreme El Niño events on the precipitation of Ecuador",
        "journal": "Natural Hazards and Earth System Sciences",
        "lang":    "en",
    },
}


# ── Utilidades de texto ────────────────────────────────────────────────────────

def limpiar_texto(texto: str) -> str:
    texto = re.sub(r'\(cid:\d+\)', '', texto)
    texto = re.sub(r'\s+', ' ', texto)
    texto = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', texto)
    return texto.strip()


def truncar(texto: str, max_chars: int = MAX_CHARS) -> str:
    return texto[:max_chars] if len(texto) > max_chars else texto


# ── Extracción de texto (pdfplumber) ──────────────────────────────────────────

def extraer_texto_pdf(path: Path) -> list[tuple[int, str]]:
    """Devuelve lista de (num_pagina, texto). Usa pdfplumber."""
    paginas = []
    with pdfplumber.open(str(path)) as pdf:
        for i, page in enumerate(pdf.pages):
            texto = page.extract_text() or ""
            texto = limpiar_texto(texto)
            if len(texto.strip()) > 50:
                paginas.append((i + 1, texto))
    return paginas


# ── Chunking (SentenceSplitter) ───────────────────────────────────────────────

def chunkar_texto(paginas: list[tuple[int, str]]) -> list[dict]:
    """
    Aplica SentenceSplitter sobre texto concatenado con marcadores de página.
    Recupera página aproximada por posición en el texto.
    """
    splitter = SentenceSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    # Mapa posición→página para recuperar número de página del chunk
    texto_completo = ""
    pos_a_pagina = {}
    for num_pag, texto in paginas:
        inicio = len(texto_completo)
        texto_completo += texto + " "
        for pos in range(inicio, len(texto_completo)):
            pos_a_pagina[pos] = num_pag

    nodos = splitter.split_text(texto_completo)

    chunks = []
    cursor = 0
    for nodo in nodos:
        texto_nodo = nodo.strip()
        if len(texto_nodo) < 30:
            continue
        # Buscar posición aproximada en el texto completo
        pos = texto_completo.find(texto_nodo[:80], cursor)
        if pos == -1:
            pos = cursor
        pagina = pos_a_pagina.get(pos, paginas[0][0] if paginas else 1)
        cursor = max(cursor, pos)
        chunks.append({
            "texto":   truncar(texto_nodo),
            "pagina":  pagina,
        })

    return chunks


# ── Contextual Retrieval ───────────────────────────────────────────────────────

def generar_contexto(titulo: str, year: int, chunk: str) -> str:
    """Llama a CONTEXT_LLM para generar frase de contexto del chunk."""
    prompt = (
        f"Documento: {titulo} ({year}). "
        f"Da UNA frase que sitúe el siguiente fragmento en el argumento global del paper, "
        f"para mejorar su recuperación semántica. "
        f"Fragmento: {chunk[:400]}"
    )
    try:
        resp = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model":  CONTEXT_LLM,
                "prompt": prompt,
                "stream": False,
                "options": {"num_predict": CONTEXT_MAX_TOKENS, "temperature": 0.1},
            },
            timeout=30,
        )
        resp.raise_for_status()
        ctx = resp.json().get("response", "").strip()
        return ctx
    except Exception as e:
        print(f"     ⚠️  Contextual retrieval error: {e}")
        return ""


# ── Extracción de figuras (PyMuPDF) ───────────────────────────────────────────

def extraer_figuras(path: Path, archivo: str) -> list[dict]:
    """
    Extrae imágenes embebidas del PDF vía PyMuPDF.
    Devuelve lista de dicts con ruta local + número de página.
    """
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(str(path))
    figuras = []

    for num_pag in range(len(doc)):
        page = doc[num_pag]
        imagen_list = page.get_images(full=True)
        for img_idx, img in enumerate(imagen_list):
            xref = img[0]
            try:
                base = doc.extract_image(xref)
                img_bytes = base["image"]
                if len(img_bytes) < MIN_FIGURE_SIZE:
                    continue  # íconos/logos pequeños
                ext = base["ext"]
                nombre = f"{Path(archivo).stem}_p{num_pag+1}_fig{img_idx}.{ext}"
                ruta = FIGURES_DIR / nombre
                ruta.write_bytes(img_bytes)
                figuras.append({
                    "ruta":   str(ruta),
                    "pagina": num_pag + 1,
                    "nombre": nombre,
                })
            except Exception:
                continue

    doc.close()
    return figuras


def describir_figura(ruta: str, pagina: int) -> str:
    """Llama a qwen2.5vl:7b para describir una figura científica."""
    import base64
    try:
        img_bytes = Path(ruta).read_bytes()
        b64 = base64.b64encode(img_bytes).decode()
        # Detectar extensión para MIME type
        ext = Path(ruta).suffix.lstrip(".").lower()
        mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg",
                "png": "image/png", "gif": "image/gif"}.get(ext, "image/png")

        prompt = (
            "Describe esta figura de un paper científico en 3-5 frases: "
            "tipo de gráfico, ejes/variables, patrón o resultado que muestra, "
            "y su relevancia para el estudio de ENSO y precipitación."
        )
        resp = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model":   VLM_MODEL,
                "prompt":  prompt,
                "images":  [b64],
                "stream":  False,
                "options": {"num_predict": 200, "temperature": 0.1},
            },
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json().get("response", "").strip()
    except Exception as e:
        print(f"     ⚠️  VLM error figura {ruta}: {e}")
        return ""


# ── Embeddings ─────────────────────────────────────────────────────────────────

def get_embedding(texto: str) -> list[float]:
    resp = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": texto},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


# ── ID único por chunk ─────────────────────────────────────────────────────────

def chunk_id(archivo: str, idx: int, tipo: str = "text") -> str:
    raw = f"{archivo}::{tipo}::{idx}"
    return hashlib.md5(raw.encode()).hexdigest()


# ── BM25 ───────────────────────────────────────────────────────────────────────

def tokenizar(texto: str) -> list[str]:
    return re.findall(r'\w+', texto.lower())


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="RAG ENSO-Huila Ingestión v2")
    parser.add_argument("--archivo", default=None,
                        help="Procesar solo este archivo (ej: CC_VCE_Huila_2018.pdf)")
    parser.add_argument("--sin-figuras", action="store_true",
                        help="Omitir extracción de figuras (más rápido)")
    parser.add_argument("--sin-contexto", action="store_true",
                        help="Omitir contextual retrieval (más rápido)")
    args = parser.parse_args()

    figuras_on  = FIGURES_ENABLED and not args.sin_figuras
    contexto_on = CONTEXTUAL_ENABLED and not args.sin_contexto

    print("=" * 65)
    print("RAG ENSO-Huila v2 — Ingestión")
    print(f"  Contextual Retrieval : {'✅ ON' if contexto_on else '⏭  OFF'} ({CONTEXT_LLM})")
    print(f"  Figuras VLM          : {'✅ ON' if figuras_on else '⏭  OFF'} ({VLM_MODEL})")
    print("=" * 65)

    # ── Qdrant ────────────────────────────────────────────────────────────────
    print("\n[1/5] Verificando Qdrant ...")
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=10)
        client.get_collections()
        print(f"  ✅ Qdrant online")
    except Exception as e:
        print(f"  ❌ Qdrant no disponible: {e}")
        return

    # ── Ollama ────────────────────────────────────────────────────────────────
    print(f"\n[2/5] Verificando Ollama ({EMBED_MODEL}) ...")
    try:
        test_emb = get_embedding("test")
        assert len(test_emb) == EMBED_DIMS
        print(f"  ✅ Ollama online · {EMBED_DIMS} dims")
    except Exception as e:
        print(f"  ❌ Ollama error: {e}")
        return

    # ── Colección ─────────────────────────────────────────────────────────────
    print(f"\n[3/5] Colección '{COLLECTION}' ...")
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=EMBED_DIMS, distance=Distance.COSINE),
        )
        print(f"  ✅ Colección creada")
    else:
        info = client.get_collection(COLLECTION)
        print(f"  ℹ️  Colección existente · {info.points_count} puntos")

    # ── PDFs ──────────────────────────────────────────────────────────────────
    print("\n[4/5] Procesando PDFs ...")
    pdfs = sorted(REFS_DIR.glob("*.pdf"))
    if args.archivo:
        pdfs = [p for p in pdfs if p.name == args.archivo]
        if not pdfs:
            print(f"  ❌ No se encontró: {args.archivo}")
            return

    todos_los_textos = []   # para BM25
    todos_los_ids    = []

    for pdf_path in pdfs:
        nombre = pdf_path.name
        meta   = FUENTES.get(nombre, {
            "ref_id": nombre, "tipo": "articulo", "autores": "Desconocido",
            "year": 0, "title": nombre, "lang": "en",
        })

        print(f"\n  📄 {nombre}")

        # Extraer texto
        paginas = extraer_texto_pdf(pdf_path)
        chunks  = chunkar_texto(paginas)
        print(f"     {len(paginas)} páginas → {len(chunks)} chunks de texto")

        # Verificar existentes (idempotencia)
        ids_todos = [chunk_id(nombre, i, "text") for i in range(len(chunks))]
        try:
            existentes = {p.id for p in client.retrieve(
                collection_name=COLLECTION, ids=ids_todos,
                with_payload=False, with_vectors=False,
            )}
        except Exception:
            existentes = set()

        puntos = []
        for idx, chunk in enumerate(tqdm(chunks, desc=f"  texto {nombre[:25]}")):
            cid = chunk_id(nombre, idx, "text")
            if cid in existentes:
                continue

            texto_chunk = chunk["texto"]

            # Contextual Retrieval
            if contexto_on:
                ctx = generar_contexto(meta.get("title",""), meta.get("year",0), texto_chunk)
                if ctx:
                    texto_indexado = ctx + "\n\n" + texto_chunk
                    contextualized = True
                else:
                    texto_indexado = texto_chunk
                    contextualized = False
            else:
                texto_indexado = texto_chunk
                contextualized = False

            try:
                emb = get_embedding(texto_indexado)
            except Exception as e:
                print(f"     ⚠️  Embedding error: {e}")
                continue

            payload = {
                **meta,
                "project":       PROJECT,
                "archivo":       nombre,
                "pagina":        chunk["pagina"],
                "texto":         texto_chunk,
                "texto_indexado":texto_indexado,
                "chunk_index":   idx,
                "section_type":  "text",
                "has_figure":    False,
                "figure_page":   None,
                "figure_path":   None,
                "contextualized":contextualized,
                "fallback":      False,
            }
            puntos.append(PointStruct(id=cid, vector=emb, payload=payload))
            todos_los_textos.append(tokenizar(texto_indexado))
            todos_los_ids.append(cid)

        # Figuras
        if figuras_on:
            figuras = extraer_figuras(pdf_path, nombre)
            print(f"     {len(figuras)} figuras encontradas")

            ids_figs = [chunk_id(nombre, i, "fig") for i in range(len(figuras))]
            try:
                ex_figs = {p.id for p in client.retrieve(
                    collection_name=COLLECTION, ids=ids_figs,
                    with_payload=False, with_vectors=False,
                )}
            except Exception:
                ex_figs = set()

            for fig_idx, fig in enumerate(tqdm(figuras, desc=f"  figs  {nombre[:25]}")):
                fid = chunk_id(nombre, fig_idx, "fig")
                if fid in ex_figs:
                    continue

                descripcion = describir_figura(fig["ruta"], fig["pagina"])
                if not descripcion:
                    continue

                texto_fig = f"[FIGURA — {nombre}, p.{fig['pagina']}]\n{descripcion}"

                try:
                    emb = get_embedding(texto_fig)
                except Exception as e:
                    print(f"     ⚠️  Embedding figura error: {e}")
                    continue

                payload_fig = {
                    **meta,
                    "project":       PROJECT,
                    "archivo":       nombre,
                    "pagina":        fig["pagina"],
                    "texto":         texto_fig,
                    "texto_indexado":texto_fig,
                    "chunk_index":   fig_idx,
                    "section_type":  "figure",
                    "has_figure":    True,
                    "figure_page":   fig["pagina"],
                    "figure_path":   fig["ruta"],
                    "contextualized":False,
                    "fallback":      False,
                }
                puntos.append(PointStruct(id=fid, vector=emb, payload=payload_fig))
                todos_los_textos.append(tokenizar(texto_fig))
                todos_los_ids.append(fid)

        # Subir a Qdrant en batches
        BATCH = 50
        for i in range(0, len(puntos), BATCH):
            client.upsert(collection_name=COLLECTION, points=puntos[i:i+BATCH])

        print(f"     ✅ {len(puntos)} puntos subidos")

    # ── BM25 ──────────────────────────────────────────────────────────────────
    print("\n[5/5] Construyendo índice BM25 ...")
    if todos_los_textos:
        bm25 = BM25Okapi(todos_los_textos)
        BM25_INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(BM25_INDEX_PATH, "wb") as f:
            pickle.dump({"bm25": bm25, "ids": todos_los_ids}, f)
        print(f"  ✅ BM25 guardado en {BM25_INDEX_PATH} ({len(todos_los_ids)} docs)")
    else:
        print("  ℹ️  Sin textos nuevos — BM25 no actualizado")

    # ── Resumen ───────────────────────────────────────────────────────────────
    info_final = client.get_collection(COLLECTION)
    print(f"\n{'='*65}")
    print(f"COMPLETADO ✅")
    print(f"  Colección       : {COLLECTION}")
    print(f"  Puntos en Qdrant: {info_final.points_count}")
    print(f"\nPróximo paso:")
    print(f"  python3 scripts/rag/02_query_v2.py")
    print(f"{'='*65}")


if __name__ == "__main__":
    main()
