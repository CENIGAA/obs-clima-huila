"""
scripts/enso/03_correlation_lag.py
====================================
M2 — Correlación lag ENSO × precipitación mensual por estación

Inputs:
  data/enso_indices/precipitacion_mensual_huila.parquet
  data/enso_indices/enso_indices_1950_2017.csv
  data/enso_indices/estaciones_huila_meta.csv

Output:
  data/enso_indices/correlaciones_lag.csv
    columnas: codigo, indice_enso, lag_meses, r_pearson, r_spearman,
              p_pearson, p_spearman, n_pares, lag_optimo
  data/enso_indices/correlaciones_resumen.csv
    fila por (estacion, indice): lag óptimo + r en ese lag
  data/enso_indices/03_correlation_resumen.txt

Lógica:
  Para cada estación y cada índice ENSO (oni, nino34, soi, mei_v2, nino12, nino4):
    - Calcular Pearson y Spearman con lags 0 a MAX_LAG meses
      (lag positivo = ENSO lidera la precipitación)
    - Identificar el lag óptimo = lag donde |r_pearson| es máximo
    - Guardar todos los lags (para curvas de correlación) y el óptimo

Autor:  CENIGAA / Claude (Cowork) — 2026-07-18
"""

import pandas as pd
import numpy as np
from scipy import stats
from pathlib import Path
import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)

# ── Configuración ──────────────────────────────────────────────────────────────
DATA_DIR    = Path("data/enso_indices")
MAX_LAG     = 6          # máximo lag en meses a explorar
MIN_PARES   = 60         # mínimo de pares válidos para calcular correlación
INDICES_ENSO = ["oni", "nino34", "soi", "mei_v2", "nino12", "nino4"]


def correlacion_con_lag(serie_enso: pd.Series, serie_precip: pd.Series,
                         lag: int) -> dict:
    """
    Calcula correlación entre ENSO(t-lag) y precipitación(t).
    lag > 0 significa que ENSO ocurre antes que la precipitación.
    Devuelve dict con r_pearson, r_spearman, p_pearson, p_spearman, n_pares.
    """
    if lag == 0:
        enso_lag = serie_enso
        precip   = serie_precip
    else:
        enso_lag = serie_enso.shift(lag)   # ENSO desplazado hacia adelante
        precip   = serie_precip

    # Alinear y eliminar NaN
    df_pair = pd.DataFrame({"enso": enso_lag, "precip": precip}).dropna()
    n = len(df_pair)

    if n < MIN_PARES:
        return {"r_pearson": np.nan, "r_spearman": np.nan,
                "p_pearson": np.nan, "p_spearman": np.nan, "n_pares": n}

    r_p, p_p = stats.pearsonr(df_pair["enso"], df_pair["precip"])
    r_s, p_s = stats.spearmanr(df_pair["enso"], df_pair["precip"])

    return {
        "r_pearson":  round(r_p, 4),
        "r_spearman": round(r_s, 4),
        "p_pearson":  round(p_p, 4),
        "p_spearman": round(p_s, 4),
        "n_pares":    n,
    }


def main():
    print("=" * 60)
    print("M2 — Correlación lag ENSO × precipitación")
    print("=" * 60)

    # ── Cargar datos ──────────────────────────────────────────────────────────
    print("\n[1/4] Cargando datos ...")

    df_precip = pd.read_parquet(DATA_DIR / "precipitacion_mensual_huila.parquet")
    df_precip.index = pd.to_datetime(df_precip.index)
    print(f"    Precipitación: {df_precip.shape} (meses × estaciones)")

    df_enso = pd.read_csv(DATA_DIR / "enso_indices_1950_2017.csv")
    df_enso["fecha"] = pd.to_datetime(df_enso["fecha"])
    df_enso = df_enso.set_index("fecha")
    print(f"    ENSO:          {df_enso.shape} (meses × índices)")

    df_meta = pd.read_csv(DATA_DIR / "estaciones_huila_meta.csv")
    meta_dict = df_meta.set_index("codigo")[["NOMBRE","MUNICIPIO","ALTITUD","estrato"]].to_dict("index")

    estaciones = df_precip.columns.tolist()
    indices    = [i for i in INDICES_ENSO if i in df_enso.columns]
    print(f"    Estaciones: {len(estaciones)}  ·  Índices ENSO: {len(indices)}")
    print(f"    Lags a explorar: 0 a {MAX_LAG} meses")

    # ── Alinear fechas ────────────────────────────────────────────────────────
    print("\n[2/4] Alineando series temporales ...")
    fechas_comun = df_precip.index.intersection(df_enso.index)
    df_p = df_precip.loc[fechas_comun]
    df_e = df_enso.loc[fechas_comun]
    print(f"    Período común: {fechas_comun[0].date()} → {fechas_comun[-1].date()} ({len(fechas_comun)} meses)")

    # ── Calcular correlaciones ────────────────────────────────────────────────
    print(f"\n[3/4] Calculando correlaciones ({len(estaciones)} × {len(indices)} × {MAX_LAG+1} lags) ...")

    registros_todos   = []   # todos los lags
    registros_optimos = []   # solo lag óptimo por (estacion, indice)

    total = len(estaciones) * len(indices)
    contador = 0

    for codigo in estaciones:
        serie_precip = df_p[codigo]
        meta = meta_dict.get(codigo, {})

        for indice in indices:
            serie_enso = df_e[indice]
            contador += 1
            if contador % 50 == 0:
                print(f"    {contador}/{total} combinaciones procesadas ...")

            resultados_lag = []
            for lag in range(MAX_LAG + 1):
                res = correlacion_con_lag(serie_enso, serie_precip, lag)
                row = {
                    "codigo":      codigo,
                    "nombre":      meta.get("NOMBRE", ""),
                    "municipio":   meta.get("MUNICIPIO", ""),
                    "altitud":     meta.get("ALTITUD", np.nan),
                    "estrato":     meta.get("estrato", ""),
                    "indice_enso": indice,
                    "lag_meses":   lag,
                    **res,
                }
                registros_todos.append(row)
                resultados_lag.append((lag, res["r_pearson"]))

            # Lag óptimo = mayor |r_pearson| con datos válidos
            validos = [(l, r) for l, r in resultados_lag if not np.isnan(r)]
            if validos:
                lag_opt, r_opt = max(validos, key=lambda x: abs(x[1]))
                res_opt = next(
                    r for r in registros_todos
                    if r["codigo"] == codigo
                    and r["indice_enso"] == indice
                    and r["lag_meses"] == lag_opt
                )
                registros_optimos.append({
                    "codigo":         codigo,
                    "nombre":         meta.get("NOMBRE", ""),
                    "municipio":      meta.get("MUNICIPIO", ""),
                    "altitud":        meta.get("ALTITUD", np.nan),
                    "estrato":        meta.get("estrato", ""),
                    "indice_enso":    indice,
                    "lag_optimo":     lag_opt,
                    "r_pearson_opt":  res_opt["r_pearson"],
                    "r_spearman_opt": res_opt["r_spearman"],
                    "p_pearson_opt":  res_opt["p_pearson"],
                    "n_pares":        res_opt["n_pares"],
                    "significativo":  res_opt["p_pearson"] < 0.05 if not np.isnan(res_opt.get("p_pearson", np.nan)) else False,
                })

    # ── Exportar ──────────────────────────────────────────────────────────────
    print("\n[4/4] Exportando resultados ...")

    df_todos = pd.DataFrame(registros_todos)
    df_opt   = pd.DataFrame(registros_optimos)

    path_todos = DATA_DIR / "correlaciones_lag.csv"
    path_opt   = DATA_DIR / "correlaciones_resumen.csv"

    df_todos.to_csv(path_todos, index=False)
    df_opt.to_csv(path_opt, index=False)
    print(f"    ✅ {path_todos} ({path_todos.stat().st_size:,} bytes)")
    print(f"    ✅ {path_opt} ({path_opt.stat().st_size:,} bytes)")

    # ── Estadísticas resumen ──────────────────────────────────────────────────
    sig = df_opt[df_opt["significativo"]]
    print(f"\n  Combinaciones (estacion × indice): {len(df_opt)}")
    print(f"  Significativas (p<0.05):           {len(sig)} ({len(sig)/len(df_opt)*100:.1f}%)")

    # Correlación media por índice
    print("\n  Correlación media |r_pearson| por índice ENSO (lag óptimo):")
    for idx in indices:
        sub = df_opt[df_opt["indice_enso"] == idx]["r_pearson_opt"].dropna()
        print(f"    {idx:10}: mean={sub.mean():.3f}  median={sub.median():.3f}  "
              f"max_abs={sub.abs().max():.3f}")

    # Distribución de lags óptimos (para ONI, el más canónico)
    print("\n  Distribución lag óptimo (ONI):")
    oni_opt = df_opt[df_opt["indice_enso"] == "oni"]["lag_optimo"].value_counts().sort_index()
    for lag, n in oni_opt.items():
        print(f"    lag={lag}: {n} estaciones")

    # Resumen por estrato
    print("\n  Correlación ONI media por estrato altitudinal:")
    oni = df_opt[df_opt["indice_enso"] == "oni"]
    for estrato, grp in oni.groupby("estrato"):
        r_med = grp["r_pearson_opt"].median()
        print(f"    {estrato:20}: r_median={r_med:.3f}  n={len(grp)}")

    # Guardar resumen en txt
    resumen_path = DATA_DIR / "03_correlation_resumen.txt"
    with open(resumen_path, "w") as f:
        f.write("RESUMEN — 03_correlation_lag.py\n")
        f.write(f"Fecha: 2026-07-18\n")
        f.write(f"Período analizado: {fechas_comun[0].date()} → {fechas_comun[-1].date()}\n")
        f.write(f"Estaciones: {len(estaciones)}  ·  Índices: {len(indices)}\n")
        f.write(f"Lags explorados: 0 a {MAX_LAG} meses\n\n")
        f.write(f"Combinaciones totales: {len(df_opt)}\n")
        f.write(f"Significativas (p<0.05): {len(sig)} ({len(sig)/len(df_opt)*100:.1f}%)\n\n")
        f.write("r_pearson medio |lag óptimo| por índice:\n")
        for idx in indices:
            sub = df_opt[df_opt["indice_enso"] == idx]["r_pearson_opt"].dropna()
            f.write(f"  {idx:10}: mean={sub.mean():.3f}  median={sub.median():.3f}\n")
        f.write("\nMediana r_pearson ONI por estrato altitudinal:\n")
        for estrato, grp in oni.groupby("estrato"):
            f.write(f"  {estrato:20}: {grp['r_pearson_opt'].median():.3f}  (n={len(grp)})\n")
    print(f"    ✅ {resumen_path}")

    print("\n" + "=" * 60)
    print("COMPLETADO ✅  M2 — Correlación lag ENSO × precipitación")
    print("=" * 60)


if __name__ == "__main__":
    main()
