"""
MÓDULO 0 — Parseo y normalización de índices ENSO
===================================================
Proyecto : OBS-CLIMA-HUILA · CENIGAA
Script   : scripts/enso/01_parse_indices.py
Versión  : 1.0 · 2026-07-17
Autor    : CENIGAA / Jorge Chavarro

Lee los archivos crudos descargados por 00_download_indices.py,
los normaliza a un DataFrame mensual unificado y filtra al período
de análisis 1950–2017 (limitado por ONI y CCYVCE_DB).

Uso:
    cd ~/webstack/obs-clima-huila
    python scripts/enso/01_parse_indices.py

Requiere:
    data/enso_indices/raw/*.txt  (generados por 00_download_indices.py)

Output:
    data/enso_indices/enso_indices_1950_2017.csv
    data/enso_indices/enso_indices_1950_2017_resumen.txt

Formatos de archivo NOAA:
    ONI     : columnas YR + JAN..DEC (NOAA CPC)
    PSL     : primera línea = anio inicial, luego anio + 12 valores mensuales
    MEI v2  : bimestral DJ JF FM MA AM MJ JJ JA AS SO ON ND
              → se convierte a mensual promediando bimestres adyacentes
"""

import sys
import textwrap
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------
RAWDIR  = Path("data/enso_indices/raw")
OUTDIR  = Path("data/enso_indices")
OUTFILE = OUTDIR / "enso_indices_1950_2017.csv"

anio_INI = 1950
anio_FIN = 2017

MISSING = -99.0   # valor de dato faltante en archivos NOAA
MESES   = ["jan", "feb", "mar", "apr", "may", "jun",
           "jul", "aug", "sep", "oct", "nov", "dec"]


# ---------------------------------------------------------------------------
# Parsers por formato
# ---------------------------------------------------------------------------

def parse_oni(filepath: Path) -> pd.DataFrame:
    """
    Formato ONI (NOAA CPC): SEAS  YR  TOTAL  ANOM
    Cada estación de 3 meses se asigna a su mes central.
    """
    SEASON_TO_MONTH = {
        "DJF": 1, "JFM": 2, "FMA": 3, "MAM": 4,
        "AMJ": 5, "MJJ": 6, "JJA": 7, "JAS": 8,
        "ASO": 9, "SON": 10, "OND": 11, "NDJ": 12,
    }
    rows = []
    with open(filepath, encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) < 4:
                continue
            season = parts[0].upper()
            if season not in SEASON_TO_MONTH:
                continue
            try:
                year = int(parts[1])
                anom = float(parts[3])
            except ValueError:
                continue
            if abs(anom - MISSING) < 0.01:
                anom = np.nan
            rows.append({"anio": year, "mes": SEASON_TO_MONTH[season], "oni": anom})
    return pd.DataFrame(rows)


def parse_psl_mensual(filepath: Path, col_name: str) -> pd.DataFrame:
    """
    Formato PSL estándar (Niño 3.4, SOI, Niño 1+2, Niño 4):
        Primera línea puede ser el anio inicial (ignorar si es un solo número)
        Luego: anio  val1  val2  ... val12
    Retorna DataFrame con columnas: anio, mes (1-12), col_name
    """
    rows = []
    with open(filepath, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            # Línea de solo un número → encabezado de anio inicial, ignorar
            if len(parts) == 1:
                continue
            # Necesitamos al menos anio + 12 valores
            if len(parts) < 13:
                continue
            try:
                year = int(parts[0])
            except ValueError:
                continue
            # anios válidos: 1800–2100
            if not (1800 <= year <= 2100):
                continue
            for m, val_str in enumerate(parts[1:13], start=1):
                try:
                    val = float(val_str)
                except ValueError:
                    val = np.nan
                if val < -90:
                    val = np.nan
                rows.append({"anio": year, "mes": m, col_name: val})
    return pd.DataFrame(rows)


def parse_mei_v2(filepath: Path) -> pd.DataFrame:
    """
    Formato MEI v2 (NOAA PSL) — BIMESTRAL:
        YEAR  DJ  JF  FM  MA  AM  MJ  JJ  JA  AS  SO  ON  ND
        1979   ...

    Estrategia de conversión a mensual:
        Cada bimestre XY representa la media de los meses X e Y.
        Para obtener el valor del mes M se promedian los dos bimestres
        que lo contienen: (M-1,M) y (M,M+1).
        Para enero: solo está en DJ (dic-ene) y JF (ene-feb) → promedio de ambos.
        Para diciembre: solo en ND (nov-dic) y DJ (dic-ene siguiente) → se usa ND del anio actual
        y DJ del anio siguiente si está disponible; si no, solo ND.

    Esta aproximación introduce ~0.05 de sesgo pero es estándar en la literatura.
    """
    BIMESTRES = ["dj", "jf", "fm", "ma", "am", "mj", "jj", "ja", "as", "so", "on", "nd"]
    # Meses incluidos en cada bimestre (índice 1=enero)
    BIMESTRE_MESES = {
        "dj": (12, 1), "jf": (1, 2),  "fm": (2, 3),  "ma": (3, 4),
        "am": (4, 5),  "mj": (5, 6),  "jj": (6, 7),  "ja": (7, 8),
        "as": (8, 9),  "so": (9, 10), "on": (10, 11), "nd": (11, 12),
    }

    raw_rows = []
    with open(filepath, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if parts[0].upper() in ("YEAR", "YR"):
                continue
            if len(parts) < 13:
                continue
            try:
                year = int(parts[0])
            except ValueError:
                continue
            row = {"anio": year}
            for b, val_str in zip(BIMESTRES, parts[1:13]):
                try:
                    val = float(val_str)
                except ValueError:
                    val = np.nan
                if val < -90:
                    val = np.nan
                row[b] = val
            raw_rows.append(row)

    if not raw_rows:
        return pd.DataFrame()

    df_bi = pd.DataFrame(raw_rows).set_index("anio")

    # Convertir a mensual: para cada mes promediamos los 2 bimestres que lo contienen
    # Mapa mes → bimestres que lo contienen
    MES_A_BIMESTRES = {
        1: ["dj", "jf"],  2: ["jf", "fm"],  3: ["fm", "ma"],
        4: ["ma", "am"],  5: ["am", "mj"],  6: ["mj", "jj"],
        7: ["jj", "ja"],  8: ["ja", "as"],  9: ["as", "so"],
        10: ["so", "on"], 11: ["on", "nd"], 12: ["nd", "dj"],
    }

    years = sorted(df_bi.index)
    rows_mensual = []
    for year in years:
        for mes in range(1, 13):
            b1, b2 = MES_A_BIMESTRES[mes]
            v1 = df_bi.loc[year, b1] if year in df_bi.index else np.nan

            # Para diciembre, b2 = "dj" que pertenece al anio siguiente
            if mes == 12:
                next_year = year + 1
                v2 = df_bi.loc[next_year, b2] if next_year in df_bi.index else np.nan
            else:
                v2 = df_bi.loc[year, b2] if year in df_bi.index else np.nan

            vals = [x for x in [v1, v2] if not np.isnan(x)]
            mei_val = float(np.mean(vals)) if vals else np.nan
            rows_mensual.append({"anio": year, "mes": mes, "mei_v2": mei_val})

    return pd.DataFrame(rows_mensual)


# ---------------------------------------------------------------------------
# Pipeline principal
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("MÓDULO 0 — Parseo de índices ENSO · CENIGAA")
    print(f"Período de análisis: {anio_INI}–{anio_FIN}")
    print("=" * 60)

    OUTDIR.mkdir(parents=True, exist_ok=True)

    # 1. Parsear cada índice
    print("\n[1/4] Leyendo archivos crudos...")

    def check_raw(name):
        p = RAWDIR / f"{name}.txt"
        if not p.exists():
            print(f"  ✗ {p} no encontrado — ejecuta primero 00_download_indices.py")
            sys.exit(1)
        return p

    df_oni   = parse_oni(check_raw("oni"))
    df_n34   = parse_psl_mensual(check_raw("nino34"), "nino34")
    df_soi   = parse_psl_mensual(check_raw("soi"),    "soi")
    df_mei   = parse_mei_v2(check_raw("mei_v2"))
    df_n12   = parse_psl_mensual(check_raw("nino12"), "nino12")
    df_n4    = parse_psl_mensual(check_raw("nino4"),  "nino4")

    for name, df in [("oni", df_oni), ("nino34", df_n34), ("soi", df_soi),
                     ("mei_v2", df_mei), ("nino12", df_n12), ("nino4", df_n4)]:
        print(f"  ✓ {name:<10} {len(df):>5} filas  "
              f"({int(df['anio'].min())}–{int(df['anio'].max())})")

    # 2. Merge sobre grilla anio/mes completa 1950–2017
    print(f"\n[2/4] Filtrando y unificando ({anio_INI}–{anio_FIN})...")

    anios  = range(anio_INI, anio_FIN + 1)
    meses = range(1, 13)
    grilla = pd.DataFrame(
        [{"anio": y, "mes": m} for y in anios for m in meses]
    )

    df = grilla.copy()
    for df_idx, col in [(df_oni, "oni"), (df_n34, "nino34"), (df_soi, "soi"),
                        (df_mei, "mei_v2"), (df_n12, "nino12"), (df_n4, "nino4")]:
        df_filt = df_idx[(df_idx["anio"] >= anio_INI) & (df_idx["anio"] <= anio_FIN)].copy()
        df = df.merge(df_filt[["anio", "mes", col]], on=["anio", "mes"], how="left")

    # Añadir columna fecha para facilidad de uso posterior
    df.insert(0, "fecha", pd.to_datetime(
        df["anio"].astype(str) + "-" + df["mes"].astype(str).str.zfill(2) + "-01"
    ))
    df = df.sort_values(["anio", "mes"]).reset_index(drop=True)

    print(f"  → DataFrame final: {len(df)} filas × {len(df.columns)} columnas")

    # 3. Reporte de completitud
    print("\n[3/4] Completitud por índice:")
    total = len(df)
    for col in ["oni", "nino34", "soi", "mei_v2", "nino12", "nino4"]:
        n_ok  = df[col].notna().sum()
        n_nan = df[col].isna().sum()
        pct   = n_ok / total * 100
        flag  = "✓" if pct >= 95 else "⚠"
        print(f"  {flag} {col:<10}  {n_ok:>3}/{total} ({pct:.1f}%)  "
              f"NaN={n_nan}")

    # 4. Guardar CSV
    print(f"\n[4/4] Guardando → {OUTFILE}")
    df.to_csv(OUTFILE, index=False, float_format="%.4f")
    print(f"  ✓ {OUTFILE}  ({OUTFILE.stat().st_size / 1024:.1f} KB)")

    # Reporte de texto para referencia
    resumen_path = OUTDIR / "enso_indices_1950_2017_resumen.txt"
    with open(resumen_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(f"""\
            ÍNDICES ENSO — RESUMEN DE PROCESAMIENTO
            ========================================
            Proyecto  : OBS-CLIMA-HUILA · CENIGAA
            Script    : scripts/enso/01_parse_indices.py
            Período   : {anio_INI}–{anio_FIN}
            Filas     : {len(df)}
            Columnas  : {', '.join(df.columns.tolist())}

            COMPLETITUD
            -----------
        """))
        for col in ["oni", "nino34", "soi", "mei_v2", "nino12", "nino4"]:
            n_ok = df[col].notna().sum()
            f.write(f"  {col:<10}  {n_ok}/{total} ({n_ok/total*100:.1f}%)\n")
        f.write(f"\nGenerado : {pd.Timestamp.now().isoformat()}\n")

    print()
    print("─" * 60)
    print("✅ Parseo completado.")
    print(f"   CSV  → {OUTFILE}")
    print(f"   Info → {resumen_path}")
    print()
    print("   Siguiente paso:")
    print("   python scripts/enso/02_correlacion_basica.py   (requiere CCYVCE_DB.db)")
    print("─" * 60)

    # Vista previa
    print("\nPrimeras 5 filas:")
    print(df.head().to_string(index=False))
    print("\nEstadísticas básicas (período completo):")
    print(df[["oni", "nino34", "soi", "mei_v2"]].describe().round(3).to_string())


if __name__ == "__main__":
    main()