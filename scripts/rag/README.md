# RAG ENSO-Huila

Sistema de recuperación aumentada (RAG) para el paper científico del Observatorio Climático del Huila.

**Stack:** Qdrant (Docker) + Ollama (local) + pdfminer.six

## Setup — una sola vez

```bash
# 1. Instalar dependencias Python
pip3 install -r scripts/rag/requirements.txt

# 2. Bajar modelo de embeddings en Ollama
ollama pull nomic-embed-text

# 3. Bajar LLM (elige uno)
ollama pull llama3.1        # recomendado, 4.7 GB
# ollama pull mistral       # alternativa, 4.1 GB
# ollama pull qwen2.5       # bueno para multilingüe

# 4. Levantar Qdrant
cd ~/webstack/obs-clima-huila/scripts/rag
docker compose up -d

# Verificar que está corriendo
curl http://localhost:6333/healthz
```

## Ingestión de PDFs

```bash
cd ~/webstack/obs-clima-huila
python3 scripts/rag/01_ingest.py
```

La ingestión es **idempotente** — si la corres dos veces no duplica chunks.
Cuando añadas nuevos PDFs a `data/referencias/`, vuelve a correr `01_ingest.py`.

## Consultas

```bash
cd ~/webstack/obs-clima-huila

# Consulta interactiva
python3 scripts/rag/02_query.py

# Con modelo específico
python3 scripts/rag/02_query.py --modelo mistral

# Filtrar por un solo documento
python3 scripts/rag/02_query.py --fuente CC_VCE_Huila_2018.pdf

# Solo recuperar chunks sin LLM (más rápido para exploración)
python3 scripts/rag/02_query.py --solo-buscar
```

## Ejemplos de preguntas útiles para el paper

```
¿Qué lag reportaron para el efecto ENSO sobre la precipitación en el Huila?
¿Qué índices ENSO muestran mayor correlación con precipitación en Colombia?
¿Cómo varía la señal ENSO con la altitud en los Andes?
¿Qué metodología usaron para la correlación cruzada entre ENSO y precipitación?
¿Cuáles son los rezagos documentados entre ONI y caudales en Colombia?
¿Qué dicen sobre El Niño tipo Pacífico Central vs Oriental en Colombia?
```

## Agregar más referencias

1. Descarga el PDF a `data/referencias/`
2. Agrega su metadata al dict `FUENTES` en `01_ingest.py`
3. Corre `python3 scripts/rag/01_ingest.py` — solo procesa el PDF nuevo

## Arquitectura

```
data/referencias/*.pdf
        ↓ pdfminer (extracción por página)
        ↓ chunking por ventana deslizante (400 palabras, overlap 60)
        ↓ Ollama nomic-embed-text (768 dims)
        ↓ Qdrant (colección: enso_huila)
               ↑
         02_query.py
               ↓ embedding de la pregunta
               ↓ búsqueda coseno top-6
               ↓ prompt con contexto → Ollama llama3.1
               ↓ respuesta con citas [Autores Año, p. X]
```
