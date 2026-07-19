"""
scripts/enso/02_extract_stations.py
====================================
M1 — Extracción y QC de precipitación mensual Huila desde CCYVCE_DB.db

Fuente:    data/CCYVCE_DB.db  (sensor PT_4, frecuencia diaria)
Output:    data/enso_indices/precipitacion_mensual_huila.parquet
           data/enso_indices/estaciones_huila_meta.csv
           data/enso_indices/02_extract_resumen.txt

Lógica:
  1. Extrae PT_4 para estaciones del Huila (1950-01 a 2017-12)
  2. Agrega diario → mensual (suma de precipitación)
  3. Calcula completitud por estación (meses observados / meses esperados)
  4. Asigna estrato altitudinal según ESTRATOS_ALTITUD del Roadmap A
  5. Exporta tabla pivote: filas=fecha_mensual, columnas=codigo_estacion
     Solo incluye estaciones con completitud >= UMBRAL_MIN (defecto 60%)

Autor:     CENIGAA / Claude (Cowork) — 2026-07-18
Referencia: Domínguez Calle et al. (2018) ISBN 978-620-2-16957-8
"""

import sqlite3
import pandas as pd
from pathlib import Path
import sys

# ── Configuración ──────────────────────────────────────────────────────────────
DB_PATH       = Path("data/CCYVCE_DB.db")
OUT_DIR       = Path("data/enso_indices")
PERIODO_INI   = "1950-01-01"
PERIODO_FIN   = "2017-12-31"
UMBRAL_MIN    = 0.60          # completitud mínima para incluir estación
MESES_TOTAL   = 816           # 1950-01 a 2017-12

ESTRATOS_ALTITUD = {
    "valle_bajo":   (0,    800),
    "pie_de_monte": (800,  1800),
    "montano_bajo": (1800, 2600),
    "montano_alto": (2600, 9999),
}

def clasificar_estrato(alt_msnm):
    """Clasifica una altitud en estrato altitudinal."""
    try:
        alt = float(alt_msnm)
    except (TypeError, ValueError):
        return "sin_dato"
    for nombre, (lo, hi) in ESTRATOS_ALTITUD.items():
        if lo <= alt < hi:
            return nombre
    return "sin_dato"


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("M1 — Extracción precipitación mensual Huila")
    print("=" * 60)

    # ── 1. Conectar y extraer datos crudos ────────────────────────────────────
    print(f"\n[1/5] Conectando a {DB_PATH} ...")
    if not DB_PATH.exists():
        print(f"ERROR: {DB_PATH} no encontrada. Ejecutar desde raíz del proyecto.")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)

    print("[1/5] Extrayendo PT_4 para Huila (puede tardar 30-60 s) ...")
    query = """
        SELECT
            b.station  AS codigo,
            b.date     AS fecha,
            b.value    AS precip_mm
        FROM base_line b
        JOIN CATALOGO  c ON b.station = c.CODIGO
        WHERE b.sensor          = 'PT_4'
          AND c.DEPARTAMENTO    = 'HUILA'
          AND b.date           >= ?
          AND b.date           <= ?
          AND b.value          IS NOT NULL
          AND b.value          >= 0
        ORDER BY b.station, b.date
    """
    df_raw = pd.read_sql_query(query, conn, params=(PERIODO_INI, PERIODO_FIN))
    conn.close()

    print(f"    → {len(df_raw):,} registros diarios cargados")
    print(f"    → {df_raw['codigo'].nunique()} estaciones con datos")

    # ── 2. Agregar diario → mensual ───────────────────────────────────────────
    print("\n[2/5] Agregando diario → mensual (suma) ...")
    df_raw["fecha"] = pd.to_datetime(df_raw["fecha"])
    df_raw["anio_mes"] = df_raw["fecha"].dt.to_period("M")

    df_mensual = (
        df_raw
        .groupby(["codigo", "anio_mes"])["precip_mm"]
        .sum()
        .reset_index()
    )
    df_mensual["fecha"] = df_mensual["anio_mes"].dt.to_timestamp()
    df_mensual = df_mensual.drop(columns="anio_mes")

    print(f"    → {len(df_mensual):,} registros mensuales generados")

    # ── 3. Calcular completitud por estación ──────────────────────────────────
    print("\n[3/5] Calculando completitud por estación ...")
    completitud = (
        df_mensual
        .groupby("codigo")["fecha"]
        .count()
        .reset_index()
        .rename(columns={"fecha": "meses_con_dato"})
    )
    completitud["completitud_pct"] = (
        completitud["meses_con_dato"] / MESES_TOTAL * 100
    ).round(1)

    aptas = completitud[completitud["completitud_pct"] >= UMBRAL_MIN * 100]
    print(f"    → {len(completitud)} estaciones totales")
    print(f"    → {len(aptas)} estaciones con completitud >= {UMBRAL_MIN*100:.0f}%")

    # ── 4. Metadatos de estaciones ─────────────────────────────────────────────
    print("\n[4/5] Recuperando metadatos del CATÁLOGO ...")
    conn2 = sqlite3.connect(DB_PATH)
    df_cat = pd.read_sql_query(
        """SELECT CODIGO, NOMBRE, MUNICIPIO, LATITUD, LONGITUD, ALTITUD,
                  FECHA_INSTALACION, FECHA_SUSPENSION, ESTADO
           FROM CATALOGO WHERE DEPARTAMENTO = 'HUILA'""",
        conn2
    )
    conn2.close()
    df_cat = df_cat.rename(columns={"CODIGO": "codigo"})

    df_meta = completitud.merge(df_cat, on="codigo", how="left")
    df_meta["estrato"] = df_meta["ALTITUD"].apply(clasificar_estrato)
    df_meta["incluida_analisis"] = df_meta["completitud_pct"] >= UMBRAL_MIN * 100

    # Distribución altitudinal de aptas
    dist_estratos = (
        df_meta[df_meta["incluida_analisis"]]
        .groupby("estrato")["codigo"]
        .count()
        .to_dict()
    )

    # ── 5. Exportar ────────────────────────────────────────────────────────────
    print("\n[5/5] Exportando archivos ...")

    # 5a. Metadatos
    meta_path = OUT_DIR / "estaciones_huila_meta.csv"
    df_meta.to_csv(meta_path, index=False)
    print(f"    ✅ {meta_path} ({meta_path.stat().st_size:,} bytes)")

    # 5b. Tabla pivote — solo estaciones aptas
    codigos_aptos = set(aptas["codigo"])
    df_aptas = df_mensual[df_mensual["codigo"].isin(codigos_aptos)].copy()

    df_pivot = (
        df_aptas
        .pivot(index="fecha", columns="codigo", values="precip_mm")
        .sort_index()
    )
    df_pivot.index.name = "fecha"

    parquet_path = OUT_DIR / "precipitacion_mensual_huila.parquet"
    df_pivot.to_parquet(parquet_path)
    print(f"    ✅ {parquet_path} ({parquet_path.stat().st_size:,} bytes)")
    print(f"       Shape: {df_pivot.shape} (meses × estaciones)")

    # 5c. CSV de respaldo (más liviano: formato largo)
    csv_path = OUT_DIR / "precipitacion_mensual_huila.csv"
    df_aptas.to_csv(csv_path, index=False)
    print(f"    ✅ {csv_path} ({csv_path.stat().st_size:,} bytes)")

    # 5d. Resumen
    resumen_path = OUT_DIR / "02_extract_resumen.txt"
    with open(resumen_path, "w") as f:
        f.write("RESUMEN — 02_extract_stations.py\n")
        f.write(f"Ejecutado: 2026-07-18\n")
        f.write(f"Fuente: {DB_PATH}\n")
        f.write(f"Período: {PERIODO_INI} → {PERIODO_FIN}\n")
        f.write(f"Sensor: PT_4 (precipitación diaria → mensual)\n\n")
        f.write(f"Estaciones totales Huila con PT_4: {len(completitud)}\n")
        f.write(f"Estaciones aptas (>={UMBRAL_MIN*100:.0f}%): {len(aptas)}\n\n")
        f.write("Distribución por completitud:\n")
        for umbral, label in [(80, ">80%"), (60, "60-80%"), (40, "40-60%"),
                               (20, "20-40%"), (0, "<20%")]:
            if umbral == 80:
                n = len(completitud[completitud["completitud_pct"] > 80])
            elif umbral == 0:
                n = len(completitud[completitud["completitud_pct"] < 20])
            else:
                lo, hi = umbral, umbral + 20
                n = len(completitud[
                    (completitud["completitud_pct"] >= lo) &
                    (completitud["completitud_pct"] < hi)
                ])
            f.write(f"  {label:10}: {n}\n")
        f.write("\nDistribución altitudinal (estaciones aptas):\n")
        for est, n in sorted(dist_estratos.items()):
            rango = next(
                f"({lo}-{hi}m)" for nombre, (lo, hi) in ESTRATOS_ALTITUD.items()
                if nombre == est
            )
            f.write(f"  {est:20} {rango}: {n}\n")
        f.write(f"\nArchivos generados:\n")
        f.write(f"  {parquet_path}\n")
        f.write(f"  {csv_path}\n")
        f.write(f"  {meta_path}\n")
    print(f"    ✅ {resumen_path}")

    # ── Resumen en consola ─────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("COMPLETADO ✅")
    print(f"  Período:            1950-01 → 2017-12")
    print(f"  Estaciones aptas:   {len(aptas)} (de {len(completitud)} totales)")
    print(f"  Shape del parquet:  {df_pivot.shape}")
    print("\n  Distribución altitudinal (aptas):")
    for est, n in sorted(dist_estratos.items()):
        print(f"    {est:20}: {n}")
    print("=" * 60)


if __name__ == "__main__":
    main()
