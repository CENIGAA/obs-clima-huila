"""
MÓDULO 0 — Descarga de índices ENSO
=====================================
Proyecto : OBS-CLIMA-HUILA · CENIGAA
Script   : scripts/enso/00_download_indices.py
Versión  : 1.0 · 2026-07-17
Autor    : CENIGAA / Jorge Chavarro

Descarga los 6 índices ENSO desde NOAA CPC y NOAA PSL.
No requiere autenticación ni API key.

Uso:
    cd ~/webstack/obs-clima-huila
    python scripts/enso/00_download_indices.py

Output:
    data/enso_indices/raw/oni.txt
    data/enso_indices/raw/nino34.txt
    data/enso_indices/raw/soi.txt
    data/enso_indices/raw/mei_v2.txt
    data/enso_indices/raw/nino12.txt
    data/enso_indices/raw/nino4.txt
    data/enso_indices/raw/_descarga_meta.json
"""

import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

# ---------------------------------------------------------------------------
# Configuración de fuentes
# ---------------------------------------------------------------------------
INDICES = {
    "oni": {
        "url": "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt",
        "fuente": "NOAA CPC",
        "descripcion": "Oceanic Niño Index (ONI) — anomalía SST región Niño 3.4, promedio 3 meses",
        "periodo": "1950–presente",
    },
    "nino34": {
        "url": "https://psl.noaa.gov/data/correlation/nina34.data",
        "fuente": "NOAA PSL",
        "descripcion": "Niño 3.4 SST Index (ERSST v5) — anomalía mensual región 5°N-5°S, 170°W-120°W",
        "periodo": "1854–presente",
    },
    "soi": {
        "url": "https://psl.noaa.gov/data/correlation/soi.data",
        "fuente": "NOAA PSL",
        "descripcion": "Southern Oscillation Index (SOI) — diferencia normalizada presión Tahití–Darwin",
        "periodo": "1951–presente",
    },
    "mei_v2": {
        "url": "https://psl.noaa.gov/enso/mei/data/meiv2.data",
        "fuente": "NOAA PSL",
        "descripcion": "Multivariate ENSO Index v2 (MEI.v2) — índice bivariado bimestral",
        "periodo": "1979–presente",
    },
    "nino12": {
        "url": "https://psl.noaa.gov/data/correlation/nina1.data",
        "fuente": "NOAA PSL",
        "descripcion": "Niño 1+2 SST Index — región costera Ecuador/Perú (0-10°S, 90°W-80°W)",
        "periodo": "1854–presente",
    },
    "nino4": {
        "url": "https://psl.noaa.gov/data/correlation/nina4.data",
        "fuente": "NOAA PSL",
        "descripcion": "Niño 4 SST Index — Pacífico central ecuatorial (5°N-5°S, 160°E-150°W)",
        "periodo": "1854–presente",
    },
}

# ---------------------------------------------------------------------------
# Directorios de output
# ---------------------------------------------------------------------------
# Ejecutar siempre desde la raíz del proyecto: ~/webstack/obs-clima-huila/
OUTDIR = Path("data/enso_indices/raw")


def descargar_indice(name: str, cfg: dict, outdir: Path, timeout: int = 30) -> dict:
    """Descarga un índice ENSO y guarda el archivo crudo. Retorna metadatos."""
    url = cfg["url"]
    outfile = outdir / f"{name}.txt"

    print(f"  ↓ {name:<10} {url}")

    try:
        resp = requests.get(url, timeout=timeout, headers={"User-Agent": "CENIGAA-OBS-CLIMA/1.0"})
        resp.raise_for_status()
    except requests.exceptions.Timeout:
        print(f"    ✗ TIMEOUT ({timeout}s) — intenta de nuevo o verifica conectividad")
        return {"nombre": name, "ok": False, "error": "timeout"}
    except requests.exceptions.HTTPError as e:
        print(f"    ✗ HTTP {e.response.status_code} — {url}")
        return {"nombre": name, "ok": False, "error": f"http_{e.response.status_code}"}
    except requests.exceptions.ConnectionError:
        print(f"    ✗ Sin conexión — verifica internet")
        return {"nombre": name, "ok": False, "error": "connection_error"}

    outfile.write_text(resp.text, encoding="utf-8")
    bytes_descargados = len(resp.content)
    lineas = resp.text.strip().count("\n") + 1

    print(f"    ✓ {bytes_descargados:,} bytes · {lineas} líneas → {outfile}")
    return {
        "nombre": name,
        "ok": True,
        "url": url,
        "fuente": cfg["fuente"],
        "descripcion": cfg["descripcion"],
        "periodo": cfg["periodo"],
        "archivo": str(outfile),
        "bytes": bytes_descargados,
        "lineas": lineas,
        "descargado_utc": datetime.now(timezone.utc).isoformat(),
    }


def main():
    print("=" * 60)
    print("MÓDULO 0 — Descarga de índices ENSO · CENIGAA")
    print(f"Fecha   : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output  : {OUTDIR.resolve()}")
    print("=" * 60)

    OUTDIR.mkdir(parents=True, exist_ok=True)

    resultados = []
    errores = []

    for name, cfg in INDICES.items():
        meta = descargar_indice(name, cfg, OUTDIR)
        resultados.append(meta)
        if not meta["ok"]:
            errores.append(name)
        time.sleep(0.5)  # cortesía — no saturar servidores NOAA

    # Guardar metadatos de la descarga
    meta_file = OUTDIR / "_descarga_meta.json"
    meta_file.write_text(
        json.dumps(
            {
                "generado_utc": datetime.now(timezone.utc).isoformat(),
                "script": "scripts/enso/00_download_indices.py",
                "version": "1.0",
                "total_indices": len(INDICES),
                "exitosos": len(resultados) - len(errores),
                "fallidos": len(errores),
                "indices": resultados,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    print()
    print("─" * 60)
    ok = len(resultados) - len(errores)
    print(f"Resultado: {ok}/{len(INDICES)} índices descargados correctamente")
    print(f"Metadatos: {meta_file}")

    if errores:
        print(f"\n⚠  Fallaron: {', '.join(errores)}")
        print("   Verifica conectividad y vuelve a ejecutar el script.")
        sys.exit(1)
    else:
        print("\n✅ Todos los índices descargados. Siguiente paso:")
        print("   python scripts/enso/01_parse_indices.py")

    print("─" * 60)


if __name__ == "__main__":
    main()