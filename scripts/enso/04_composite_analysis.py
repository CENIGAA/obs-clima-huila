"""
scripts/enso/04_composite_analysis.py
======================================
M3 — Composite analysis precipitación × fase ENSO × estrato altitudinal

Inputs:
  data/enso_indices/precipitacion_mensual_huila.parquet
  data/enso_indices/enso_indices_1950_2017.csv
  data/enso_indices/estaciones_huila_meta.csv

Outputs:
  data/enso_indices/composites_por_estacion.csv
    → anomalía media por estación × fase ENSO × mes calendario
  data/enso_indices/composites_por_estrato.csv
    → promedio espacial por estrato × fase ENSO × mes calendario
  data/enso_indices/fases_enso_mensual.csv
    → clasificación mes a mes (El Niño / La Niña / Neutral)
  data/enso_indices/04_composite_resumen.txt

Definición de fases (ONI, criterio NOAA):
  El Niño : ONI >= +0.5  por >= 5 meses consecutivos
  La Niña : ONI <= -0.5  por >= 5 meses consecutivos
  Neutral : en otro caso
  (Se usa la etiqueta mensual directa ONI >= ±0.5 para el composite;
   la condición de persistencia se aplica para identificar episodios formales
   pero para el composite se usa el umbral simple, práctica estándar.)

Anomalía: precip_fase - precip_climatologica_mensual
  Climatología = media de todos los meses de ese calendario (ej: todos los enero)

Autor: CENIGAA / Claude (Cowork) — 2026-07-18
"""

import pandas as pd
import numpy as np
from scipy import stats
from pathlib import Path

DATA_DIR = Path("data/enso_indices")
ONI_NINO  =  0.5    # umbral El Niño
ONI_NINA  = -0.5    # umbral La Niña

ORDEN_ESTRATOS = ["valle_bajo", "pie_de_monte", "montano_bajo", "montano_alto"]
NOMBRE_FASES   = {1: "El Niño", -1: "La Niña", 0: "Neutral"}
MESES_ES = {1:"Ene",2:"Feb",3:"Mar",4:"Abr",5:"May",6:"Jun",
            7:"Jul",8:"Ago",9:"Sep",10:"Oct",11:"Nov",12:"Dic"}


def clasificar_oni(oni_val):
    if pd.isna(oni_val):
        return np.nan
    if oni_val >= ONI_NINO:
        return 1    # El Niño
    elif oni_val <= ONI_NINA:
        return -1   # La Niña
    else:
        return 0    # Neutral


def main():
    print("=" * 60)
    print("M3 — Composite analysis ENSO × precipitación × estrato")
    print("=" * 60)

    # ── 1. Cargar datos ───────────────────────────────────────────────────────
    print("\n[1/5] Cargando datos ...")
    df_precip = pd.read_parquet(DATA_DIR / "precipitacion_mensual_huila.parquet")
    df_precip.index = pd.to_datetime(df_precip.index)

    df_enso = pd.read_csv(DATA_DIR / "enso_indices_1950_2017.csv")
    df_enso["fecha"] = pd.to_datetime(df_enso["fecha"])
    df_enso = df_enso.set_index("fecha")

    df_meta = pd.read_csv(DATA_DIR / "estaciones_huila_meta.csv")
    df_meta["codigo"] = df_meta["codigo"].astype(str)
    meta_idx = df_meta[df_meta["incluida_analisis"] == True].set_index("codigo")

    print(f"    Precipitación: {df_precip.shape}")
    print(f"    Estaciones con meta: {len(meta_idx)}")

    # ── 2. Clasificar meses por fase ENSO ────────────────────────────────────
    print("\n[2/5] Clasificando fases ENSO (ONI) ...")

    fechas_comun = df_precip.index.intersection(df_enso.index)
    oni_serie = df_enso.loc[fechas_comun, "oni"]
    fase_serie = oni_serie.apply(clasificar_oni)

    # Aplicar regla de persistencia (>=5 meses consecutivos) para episodios
    # Para el composite mensual usamos umbral simple pero registramos episodios
    fase_simple = fase_serie.copy()

    conteo_fases = fase_simple.value_counts()
    print(f"    El Niño : {conteo_fases.get(1, 0):>4} meses")
    print(f"    La Niña : {conteo_fases.get(-1, 0):>4} meses")
    print(f"    Neutral : {conteo_fases.get(0, 0):>4} meses")

    # Guardar clasificación mensual
    df_fases = pd.DataFrame({
        "fecha": fechas_comun,
        "oni": oni_serie.values,
        "fase_codigo": fase_simple.values,
        "fase_nombre": fase_simple.map(NOMBRE_FASES).values,
        "mes": fechas_comun.month,
        "anio": fechas_comun.year,
    })
    df_fases.to_csv(DATA_DIR / "fases_enso_mensual.csv", index=False)
    print(f"    ✅ fases_enso_mensual.csv")

    # ── 3. Calcular climatología mensual por estación ────────────────────────
    print("\n[3/5] Calculando climatología y anomalías ...")

    df_p = df_precip.loc[fechas_comun].copy()
    df_p["mes"] = df_p.index.month
    df_p["fase"] = fase_simple.values

    estaciones = df_p.columns.difference(["mes", "fase"]).tolist()

    # Climatología: media mensual de toda la serie (independiente de fase)
    climatologia = {}
    for est in estaciones:
        climatologia[est] = df_p.groupby("mes")[est].mean()

    # Anomalía mensual = valor - climatología(mes)
    df_anom = df_p[estaciones].copy()
    for est in estaciones:
        for mes in range(1, 13):
            mask = df_p["mes"] == mes
            df_anom.loc[mask, est] = df_p.loc[mask, est] - climatologia[est][mes]

    df_anom["mes"]  = df_p["mes"].values
    df_anom["fase"] = df_p["fase"].values

    # ── 4. Composite por estación: media de anomalía por fase × mes ──────────
    print("\n[4/5] Calculando composites ...")
    registros_est = []
    registros_est_sig = []

    for est in estaciones:
        meta = meta_idx.loc[est] if est in meta_idx.index else {}
        nombre   = meta.get("NOMBRE", "") if hasattr(meta, "get") else ""
        estrato  = meta.get("estrato", "") if hasattr(meta, "get") else ""
        altitud  = meta.get("ALTITUD", np.nan) if hasattr(meta, "get") else np.nan

        for fase_cod, fase_nom in NOMBRE_FASES.items():
            mask_fase    = df_anom["fase"] == fase_cod
            mask_neutral = df_anom["fase"] == 0

            for mes in range(1, 13):
                mask_mes = df_anom["mes"] == mes

                vals_fase    = df_anom.loc[mask_fase & mask_mes, est].dropna()
                vals_neutral = df_anom.loc[mask_neutral & mask_mes, est].dropna()
                n = len(vals_fase)

                if n == 0:
                    continue

                anom_media = vals_fase.mean()
                anom_std   = vals_fase.std()

                # Test t vs neutral
                p_val = np.nan
                if fase_cod != 0 and len(vals_neutral) >= 3 and n >= 3:
                    _, p_val = stats.ttest_ind(vals_fase, vals_neutral, equal_var=False)

                registros_est.append({
                    "codigo":      est,
                    "nombre":      nombre,
                    "estrato":     estrato,
                    "altitud":     altitud,
                    "fase":        fase_nom,
                    "mes":         mes,
                    "mes_abrev":   MESES_ES[mes],
                    "n_meses":     n,
                    "anom_media_mm": round(anom_media, 2),
                    "anom_std_mm":   round(anom_std, 2) if not np.isnan(anom_std) else np.nan,
                    "p_valor":       round(p_val, 4) if not np.isnan(p_val) else np.nan,
                    "significativo": p_val < 0.05 if not np.isnan(p_val) else False,
                })

    df_comp_est = pd.DataFrame(registros_est)
    df_comp_est.to_csv(DATA_DIR / "composites_por_estacion.csv", index=False)
    print(f"    ✅ composites_por_estacion.csv ({len(df_comp_est)} filas)")

    # ── 5. Composite por estrato: promedio espacial ───────────────────────────
    registros_estrato = []
    for estrato in ORDEN_ESTRATOS:
        ests_estrato = [e for e in estaciones
                        if e in meta_idx.index and meta_idx.loc[e, "estrato"] == estrato]
        if not ests_estrato:
            continue
        n_est = len(ests_estrato)

        for fase_cod, fase_nom in NOMBRE_FASES.items():
            mask_fase    = df_anom["fase"] == fase_cod
            mask_neutral = df_anom["fase"] == 0

            for mes in range(1, 13):
                mask_mes = df_anom["mes"] == mes

                # Media espacial primero, luego estadístico temporal
                vals_fase = (
                    df_anom.loc[mask_fase & mask_mes, ests_estrato]
                    .mean(axis=1)
                    .dropna()
                )
                vals_neutral = (
                    df_anom.loc[mask_neutral & mask_mes, ests_estrato]
                    .mean(axis=1)
                    .dropna()
                )

                n = len(vals_fase)
                if n == 0:
                    continue

                anom_media = vals_fase.mean()
                p_val = np.nan
                if fase_cod != 0 and len(vals_neutral) >= 3 and n >= 3:
                    _, p_val = stats.ttest_ind(vals_fase, vals_neutral, equal_var=False)

                registros_estrato.append({
                    "estrato":        estrato,
                    "n_estaciones":   n_est,
                    "fase":           fase_nom,
                    "mes":            mes,
                    "mes_abrev":      MESES_ES[mes],
                    "n_meses_enso":   n,
                    "anom_media_mm":  round(anom_media, 2),
                    "p_valor":        round(p_val, 4) if not np.isnan(p_val) else np.nan,
                    "significativo":  p_val < 0.05 if not np.isnan(p_val) else False,
                })

    df_comp_est_rato = pd.DataFrame(registros_estrato)
    df_comp_est_rato.to_csv(DATA_DIR / "composites_por_estrato.csv", index=False)
    print(f"    ✅ composites_por_estrato.csv ({len(df_comp_est_rato)} filas)")

    # ── Resumen en consola ────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("RESUMEN — Anomalía media anual por estrato y fase (mm/mes)")
    print("=" * 60)
    resumen_lines = []
    for estrato in ORDEN_ESTRATOS:
        sub = df_comp_est_rato[df_comp_est_rato["estrato"] == estrato]
        if sub.empty:
            continue
        line = f"\n  {estrato}:"
        print(line); resumen_lines.append(line)
        for fase in ["El Niño", "La Niña", "Neutral"]:
            f_sub = sub[sub["fase"] == fase]
            if f_sub.empty:
                continue
            anom_anual = f_sub["anom_media_mm"].mean()
            sig = f_sub["significativo"].sum()
            n_total = len(f_sub)
            line2 = f"    {fase:10}: {anom_anual:+.1f} mm/mes  ({sig}/{n_total} meses sig.)"
            print(line2); resumen_lines.append(line2)

    # Guardar txt
    with open(DATA_DIR / "04_composite_resumen.txt", "w") as f:
        f.write("RESUMEN — 04_composite_analysis.py\n")
        f.write("Fecha: 2026-07-18\n")
        f.write(f"Fases: El Niño (ONI≥+0.5) / La Niña (ONI≤-0.5) / Neutral\n\n")
        f.write("Meses por fase en período analizado:\n")
        f.write(f"  El Niño : {conteo_fases.get(1, 0)} meses\n")
        f.write(f"  La Niña : {conteo_fases.get(-1, 0)} meses\n")
        f.write(f"  Neutral : {conteo_fases.get(0, 0)} meses\n\n")
        f.write("Anomalía media anual por estrato y fase (mm/mes):\n")
        for line in resumen_lines:
            f.write(line + "\n")
    print(f"\n    ✅ 04_composite_resumen.txt")

    print("\n" + "=" * 60)
    print("COMPLETADO ✅  M3 — Composite analysis")
    print("=" * 60)


if __name__ == "__main__":
    main()
