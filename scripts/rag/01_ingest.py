"""
scripts/rag/01_ingest.py
==========================
Ingesta de PDFs científicos al RAG ENSO-Huila

Stack:
  - PDFs       : pdfminer.six (extracción de texto)
  - Embeddings : Ollama (nomic-embed-text, multilingual, 768 dims)
  - Vector DB  : Qdrant (Docker local, puerto 6333)

PDFs a ingestar (data/referencias/):
  CC_VCE_Huila_2018.pdf        → libro base (Domínguez Calle et al. 2018)
  De_Leon_Perez_2026.pdf
  Diaz_2022.pdf
  Grimm_2000.pdf
  Gutierrez_Cardenas_2025.pdf
  Jonaitis_2021.pdf
  Thielen_2023.pdf

Uso:
  # 1. Levantar Qdrant
  cd scripts/rag && docker compose up -d

  # 2. Asegurarse que Ollama tiene nomic-embed-text
  ollama pull nomic-embed-text

  # 3. Correr ingestión
  cd ~/webstack/obs-clima-huila
  python3 scripts/rag/01_ingest.py

Autor: CENIGAA / Claude (Cowork) — 2026-07-18
"""

import re
import json
import hashlib
import requests
from pathlib import Path
from tqdm import tqdm
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter,
    FieldCondition, MatchValue
)

# ── Configuración ──────────────────────────────────────────────────────────────
REFS_DIR        = Path("data/referencias")
QDRANT_URL      = "http://localhost:6333"
OLLAMA_URL      = "http://localhost:11434"
COLLECTION      = "enso_huila"
EMBED_MODEL     = "nomic-embed-text"   # ollama pull nomic-embed-text
EMBED_DIMS      = 768
CHUNK_SIZE      = 400    # palabras por chunk
CHUNK_OVERLAP   = 60     # palabras de solapamiento

# Metadatos por archivo
FUENTES = {
    "CC_VCE_Huila_2018.pdf": {
        "tipo": "libro",
        "autores": "Domínguez Calle et al.",
        "año": 2018,
        "titulo": "Cambio Climático y Variabilidad Climática Extrema en el Huila",
        "isbn": "978-620-2-16957-8",
        "idioma": "es",
        "prioridad": "alta",
    },
    "De_Leon_Perez_2026.pdf": {
        "tipo": "articulo",
        "autores": "De León Pérez et al.",
        "año": 2026,
        "titulo": "Regional synchronization patterns between climate indices and colombian hydroclimatic variables",
        "journal": "Hydrological Sciences Journal",
        "idioma": "en",
        "prioridad": "alta",
    },
    "Diaz_2022.pdf": {
        "tipo": "articulo",
        "autores": "Díaz et al.",
        "año": 2020,
        "titulo": "Wavelet coherence between ENSO indices and precipitation for the Andes region of Colombia",
        "journal": "Atmosfera",
        "idioma": "en",
        "prioridad": "alta",
    },
    "Grimm_2000.pdf": {
        "tipo": "articulo",
        "autores": "Grimm et al.",
        "año": 2000,
        "titulo": "Climate Variability in Southern South America Associated with El Niño and La Niña Events",
        "journal": "Journal of Climate",
        "idioma": "en",
        "prioridad": "media",
    },
    "Gutierrez_Cardenas_2025.pdf": {
        "tipo": "articulo",
        "autores": "Gutiérrez-Cárdenas et al.",
        "año": 2024,
        "titulo": "Similar teleconnection patterns of ENSO-NAO and ENSO-precipitation in Colombia",
        "journal": "Environmental Science and Pollution Research",
        "idioma": "en",
        "prioridad": "alta",
    },
    "Jonaitis_2021.pdf": {
        "tipo": "articulo",
        "autores": "Jonaitis et al.",
        "año": 2021,
        "titulo": "Spatiotemporal patterns of ENSO-precipitation relationships in the tropical Andes",
        "journal": "International Journal of Climatology",
        "idioma": "en",
        "prioridad": "alta",
    },
    "Thielen_2023.pdf": {
        "tipo": "articulo",
        "autores": "Thielen et al.",
        "año": 2023,
        "titulo": "Effect of extreme El Niño events on the precipitation of Ecuador",
        "journal": "Natural Hazards and Earth System Sciences",
        "idioma": "en",
        "prioridad": "alta",
    },
}


# ── Utilidades ────────────────────────────────────────────────────────────────

def extraer_texto_pdf(path: Path) -> list[tuple[int, str]]:
    """Extrae texto página por página. Devuelve lista de (num_pagina, texto)."""
    paginas = []
    for i, page_layout in enumerate(extract_pages(str(path))):
        texto = ""
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                texto += element.get_text()
        texto = limpiar_texto(texto)
        if len(texto.strip()) > 50:
            paginas.append((i + 1, texto))
    return paginas


def limpiar_texto(texto: str) -> str:
    """Normaliza espacios, elimina caracteres problemáticos."""
    texto = re.sub(r'\(cid:\d+\)', '', texto)   # artefactos pdfminer
    texto = re.sub(r'\s+', ' ', texto)
    texto = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', texto)
    return texto.strip()


def chunkar(paginas: list[tuple[int, str]], chunk_size=CHUNK_SIZE,
            overlap=CHUNK_OVERLAP) -> list[dict]:
    """
    Divide el texto en chunks por ventana deslizante de palabras.
    Preserva número de página del inicio del chunk.
    """
    # Concatenar todo con marcadores de página
    tokens_con_meta = []
    for num_pag, texto in paginas:
        palabras = texto.split()
        for palabra in palabras:
            tokens_con_meta.append((num_pag, palabra))

    chunks = []
    i = 0
    while i < len(tokens_con_meta):
        ventana = tokens_con_meta[i : i + chunk_size]
        if len(ventana) < 20:   # chunk demasiado corto → descartar
            break
        pagina_ini = ventana[0][0]
        pagina_fin = ventana[-1][0]
        texto_chunk = " ".join(w for _, w in ventana)
        chunks.append({
            "texto":      texto_chunk,
            "pagina_ini": pagina_ini,
            "pagina_fin": pagina_fin,
            "n_palabras": len(ventana),
        })
        i += chunk_size - overlap

    return chunks


def get_embedding(texto: str) -> list[float]:
    """Llama a Ollama para generar embedding."""
    resp = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": texto},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


def chunk_id(archivo: str, idx: int) -> str:
    """ID único por chunk (hash estable)."""
    raw = f"{archivo}::{idx}"
    return hashlib.md5(raw.encode()).hexdigest()


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("RAG ENSO-Huila — Ingestión de referencias")
    print("=" * 60)

    # ── 1. Verificar Qdrant ───────────────────────────────────────────────────
    print("\n[1/4] Verificando Qdrant ...")
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=10)
        client.get_collections()
        print(f"    ✅ Qdrant online en {QDRANT_URL}")
    except Exception as e:
        print(f"    ❌ Qdrant no disponible: {e}")
        print("    → Ejecuta: cd scripts/rag && docker compose up -d")
        return

    # ── 2. Verificar Ollama + modelo ─────────────────────────────────────────
    print(f"\n[2/4] Verificando Ollama ({EMBED_MODEL}) ...")
    try:
        test_emb = get_embedding("test")
        assert len(test_emb) == EMBED_DIMS, f"dims={len(test_emb)} ≠ {EMBED_DIMS}"
        print(f"    ✅ Ollama online · {EMBED_MODEL} · {EMBED_DIMS} dims")
    except Exception as e:
        print(f"    ❌ Ollama error: {e}")
        print(f"    → Asegúrate de correr: ollama pull {EMBED_MODEL}")
        return

    # ── 3. Crear/verificar colección ─────────────────────────────────────────
    print(f"\n[3/4] Colección Qdrant: '{COLLECTION}' ...")
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=EMBED_DIMS, distance=Distance.COSINE),
        )
        print(f"    ✅ Colección '{COLLECTION}' creada")
    else:
        info = client.get_collection(COLLECTION)
        print(f"    ℹ️  Colección existente · {info.points_count} puntos")

    # ── 4. Procesar PDFs ─────────────────────────────────────────────────────
    print("\n[4/4] Procesando PDFs ...")
    pdfs = sorted(REFS_DIR.glob("*.pdf"))
    total_chunks = 0

    for pdf_path in pdfs:
        nombre = pdf_path.name
        meta_base = FUENTES.get(nombre, {
            "tipo": "articulo", "autores": "Desconocido",
            "año": 0, "titulo": nombre, "idioma": "en", "prioridad": "media",
        })

        print(f"\n  📄 {nombre}")

        # Extraer y chunkar
        paginas = extraer_texto_pdf(pdf_path)
        chunks  = chunkar(paginas)
        print(f"     {len(paginas)} páginas → {len(chunks)} chunks")

        # Verificar cuántos ya están en Qdrant (evitar duplicados)
        ids_nuevos = []
        puntos = []
        for idx, chunk in enumerate(chunks):
            cid = chunk_id(nombre, idx)
            ids_nuevos.append(cid)

        # Buscar existentes
        try:
            existentes = client.retrieve(
                collection_name=COLLECTION,
                ids=ids_nuevos,
                with_payload=False,
                with_vectors=False,
            )
            ids_existentes = {p.id for p in existentes}
        except Exception:
            ids_existentes = set()

        chunks_nuevos = [
            (chunk_id(nombre, idx), chunk)
            for idx, chunk in enumerate(chunks)
            if chunk_id(nombre, idx) not in ids_existentes
        ]

        if not chunks_nuevos:
            print(f"     ✅ Ya ingresado — saltando")
            continue

        print(f"     Generando embeddings para {len(chunks_nuevos)} chunks ...")
        for cid, chunk in tqdm(chunks_nuevos, desc=f"     {nombre[:30]}"):
            try:
                embedding = get_embedding(chunk["texto"])
            except Exception as e:
                print(f"     ⚠️  Error embedding chunk: {e}")
                continue

            payload = {
                **meta_base,
                "archivo":    nombre,
                "pagina_ini": chunk["pagina_ini"],
                "pagina_fin": chunk["pagina_fin"],
                "n_palabras": chunk["n_palabras"],
                "texto":      chunk["texto"],
            }
            puntos.append(PointStruct(id=cid, vector=embedding, payload=payload))

        # Subir en batches de 50
        BATCH = 50
        for i in range(0, len(puntos), BATCH):
            client.upsert(collection_name=COLLECTION, points=puntos[i:i+BATCH])

        total_chunks += len(puntos)
        print(f"     ✅ {len(puntos)} chunks subidos a Qdrant")

    # ── Resumen ───────────────────────────────────────────────────────────────
    info_final = client.get_collection(COLLECTION)
    print(f"\n{'='*60}")
    print(f"COMPLETADO ✅")
    print(f"  Colección : {COLLECTION}")
    print(f"  Total puntos en Qdrant : {info_final.points_count}")
    print(f"  Chunks añadidos esta ejecución : {total_chunks}")
    print(f"{'='*60}")
    print(f"\nYa puedes consultar el RAG:")
    print(f"  python3 scripts/rag/02_query.py")


if __name__ == "__main__":
    main()
