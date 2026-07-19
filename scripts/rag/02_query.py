"""
scripts/rag/02_query.py
========================
Interfaz de consulta del RAG ENSO-Huila

Flujo:
  1. Tu pregunta → embedding (Ollama nomic-embed-text)
  2. Búsqueda semántica en Qdrant (top-k chunks relevantes)
  3. Contexto + pregunta → LLM (Ollama llama3.1 / mistral)
  4. Respuesta con citas (fuente, autores, año, página)

Uso:
  python3 scripts/rag/02_query.py
  python3 scripts/rag/02_query.py --modelo llama3.1
  python3 scripts/rag/02_query.py --k 8 --modelo mistral

Autor: CENIGAA / Claude (Cowork) — 2026-07-18
"""

import argparse
import requests
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

# ── Configuración ──────────────────────────────────────────────────────────────
QDRANT_URL   = "http://localhost:6333"
OLLAMA_URL   = "http://localhost:11434"
COLLECTION   = "enso_huila"
EMBED_MODEL  = "nomic-embed-text"
DEFAULT_LLM  = "llama3.1"   # cambia a "mistral", "qwen2.5", etc.
DEFAULT_K    = 6             # chunks de contexto a recuperar

SYSTEM_PROMPT = """Eres un asistente científico especializado en hidroclimatología,
variabilidad climática ENSO y precipitación en los Andes colombianos.
Trabajas para CENIGAA en el Observatorio Climático del Huila «Efraín Domínguez Calle».

Responde en español con precisión científica.
Cuando cites información, indica SIEMPRE la fuente entre corchetes:
[Apellido Año, p. X] o [Apellido Año].
Si la información no está en el contexto, dilo explícitamente.
No inventes datos ni correlaciones."""

QUERY_TEMPLATE = """CONTEXTO DE REFERENCIAS CIENTÍFICAS:
{contexto}

---
PREGUNTA:
{pregunta}

Responde con base en el contexto anterior. Cita las fuentes con [Autores Año, p. X]."""


def get_embedding(texto: str) -> list[float]:
    resp = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": texto},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


def buscar(client: QdrantClient, pregunta: str, k: int = DEFAULT_K,
           filtro_fuente: str | None = None) -> list[dict]:
    """Búsqueda semántica. Devuelve lista de chunks con metadata."""
    emb = get_embedding(pregunta)

    qfilter = None
    if filtro_fuente:
        qfilter = Filter(
            must=[FieldCondition(
                key="archivo",
                match=MatchValue(value=filtro_fuente)
            )]
        )

    resultados = client.search(
        collection_name=COLLECTION,
        query_vector=emb,
        limit=k,
        query_filter=qfilter,
        with_payload=True,
    )
    return [
        {
            "score":     r.score,
            "texto":     r.payload.get("texto", ""),
            "autores":   r.payload.get("autores", "?"),
            "año":       r.payload.get("año", "?"),
            "titulo":    r.payload.get("titulo", "?"),
            "archivo":   r.payload.get("archivo", "?"),
            "pagina_ini":r.payload.get("pagina_ini", "?"),
            "pagina_fin":r.payload.get("pagina_fin", "?"),
        }
        for r in resultados
    ]


def generar_respuesta(pregunta: str, chunks: list[dict], modelo: str) -> str:
    """Construye el prompt y llama al LLM en Ollama."""
    # Construir contexto con citas
    bloques = []
    for i, c in enumerate(chunks, 1):
        cita = f"[{c['autores']} {c['año']}, p.{c['pagina_ini']}]"
        bloques.append(
            f"[FUENTE {i}] {cita}\n"
            f"Archivo: {c['archivo']}\n"
            f"Score de relevancia: {c['score']:.3f}\n"
            f"Texto: {c['texto'][:800]}..."
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
            "options": {
                "temperature": 0.1,   # respuestas conservadoras para ciencia
                "num_ctx":     8192,
            },
        },
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()["response"]


def imprimir_fuentes(chunks: list[dict]):
    print("\n── Fuentes recuperadas ──────────────────────────────")
    for i, c in enumerate(chunks, 1):
        print(f"  [{i}] {c['autores']} ({c['año']}) — p.{c['pagina_ini']}")
        print(f"       Score: {c['score']:.3f} | {c['titulo'][:60]}...")


def main():
    parser = argparse.ArgumentParser(description="RAG ENSO-Huila")
    parser.add_argument("--modelo", default=DEFAULT_LLM,
                        help=f"Modelo Ollama (default: {DEFAULT_LLM})")
    parser.add_argument("--k", type=int, default=DEFAULT_K,
                        help=f"Chunks de contexto (default: {DEFAULT_K})")
    parser.add_argument("--fuente", default=None,
                        help="Filtrar por archivo (ej: CC_VCE_Huila_2018.pdf)")
    parser.add_argument("--solo-buscar", action="store_true",
                        help="Solo muestra chunks, sin llamar al LLM")
    args = parser.parse_args()

    # Verificar servicios
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=10)
        info = client.get_collection(COLLECTION)
        print(f"✅ Qdrant · colección '{COLLECTION}' · {info.points_count} puntos")
    except Exception as e:
        print(f"❌ Qdrant no disponible: {e}")
        return

    print(f"✅ Modelo LLM : {args.modelo}")
    print(f"   Chunks k  : {args.k}")
    if args.fuente:
        print(f"   Filtro    : {args.fuente}")
    print("\nEscribe tu pregunta (o 'salir' para terminar):\n")

    while True:
        try:
            pregunta = input("❓ > ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nHasta luego.")
            break

        if not pregunta or pregunta.lower() in ("salir", "exit", "quit"):
            print("Hasta luego.")
            break

        print("\n🔍 Buscando en referencias...")
        try:
            chunks = buscar(client, pregunta, k=args.k, filtro_fuente=args.fuente)
        except Exception as e:
            print(f"❌ Error en búsqueda: {e}")
            continue

        if not chunks:
            print("No se encontraron chunks relevantes.")
            continue

        imprimir_fuentes(chunks)

        if args.solo_buscar:
            print("\n── Texto del chunk más relevante ───────────────────")
            print(chunks[0]["texto"][:1000])
            print()
            continue

        print(f"\n🤖 Generando respuesta ({args.modelo})...")
        try:
            respuesta = generar_respuesta(pregunta, chunks, args.modelo)
        except Exception as e:
            print(f"❌ Error LLM: {e}")
            print("Tip: verifica que el modelo esté disponible con `ollama list`")
            continue

        print("\n── Respuesta ────────────────────────────────────────")
        print(respuesta)
        print("─" * 52 + "\n")


if __name__ == "__main__":
    main()
