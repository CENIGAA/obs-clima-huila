"""
scripts/enso/06_regression_model.py
=====================================
M5 — Modelo de regresión: anomalía precipitación ~ ONI × altitud

Pregunta central:
  ¿Cuánto explica el ONI la variabilidad de la precipitación mensual
  en el Huila, y cómo varía ese efecto con la altitud?

Modelos ajustados (por OLS, datos panel estación-mes):
  M1: anom_precip ~ ONI                          (línea base)
  M2: anom_precip ~ ONI + altitud                (efectos principales)
  M3: anom_precip ~ ONI + altitud + ONI*altitud  (interacción)
  M4: anom_precip ~ ONI + altitud + ONI*altitud + factor_mes  (estacional)

Datos de entrada (panel):
  Para cada mes del período y cada estación, un par (ONI_t, anomalía_t).
  Se usa lag=1 (lag óptimo más frecuente en M2) para alinear ONI → precip.

Outputs:
  data/enso_indices/modelo_regresion_resultados.csv   → coeficientes de todos los modelos
  data/enso_indices/modelo_prediccion_superficie.csv  → grilla ONI × altitud para visualización
  data/enso_indices/06_regression_resumen.txt         → tabla de publicación

Interpretación del término de interacción ONI×altitud:
  β_interaccion < 0 → el efecto negativo del ENSO sobre la lluvia
                       se AMPLIFICA a mayor altitud
  β_interaccion > 0 → el efecto se AMORTIGUA a mayor altitud

Supuestos y limitaciones:
  - OLS asume independencia de errores; aquí hay autocorrelación espacial
    (estaciones próximas tienen residuos correlacionados). Se reportan
    errores estándar robustos (HC3) para corrección parcial.
  - La heterogeneidad no observada por estación no está controlada
    (se requeriría modelo de efectos fijos, apropiado para extensión futura).
  - Período: 1957-01 a 2017-09 (644 meses) × 54 estaciones = hasta 34,776 obs.

Atribución: Domínguez Calle et al. (2018) ISBN 978-620-2-16957-8
            CENIGAA (2026) — Observatorio Climático del Huila
Autor: CENIGAA / Claude (Cowork) — 2026-07-18
"""

import pandas as pd
import numpy as np
from scipy import stats
from pathlib import Path
import statsmodels.api as sm
import warnings
warnings.filterwarnings("ignore")

DATA_DIR = Path("data/enso_indices")
LAG_ONI  = 1   # lag óptimo más frecuente (M2)

ESTRATOS_ORDEN = ["valle_bajo", "pie_de_monte", "montano_bajo"]


def ols_con_errores_robustos(X, y):
    """
    OLS con errores estándar HC3 via statsmodels (eficiente en memoria).
    Devuelve: beta, se_hc3, t_stat, p_val, r2, r2_adj, n, k
    """
    modelo = sm.OLS(y, X).fit(cov_type="HC3")
    k = X.shape[1]
    return {
        "beta":   np.array(modelo.params),
        "se":     np.array(modelo.bse),
        "t":      np.array(modelo.tvalues),
        "p":      np.array(modelo.pvalues),
        "r2":     modelo.rsquared,
        "r2_adj": modelo.rsquared_adj,
        "n":      int(modelo.nobs),
        "k":      k,
    }


def main():
    print("=" * 60)
    print("M5 — Modelo regresión anom_precip ~ ONI × altitud")
    print("=" * 60)

    # ── 1. Construir panel de datos ───────────────────────────────────────────
    print("\n[1/4] Construyendo panel estación-mes ...")

    df_precip = pd.read_parquet(DATA_DIR / "precipitacion_mensual_huila.parquet")
    df_precip.index = pd.to_datetime(df_precip.index)

    df_enso = pd.read_csv(DATA_DIR / "enso_indices_1950_2017.csv")
    df_enso["fecha"] = pd.to_datetime(df_enso["fecha"])
    df_enso = df_enso.set_index("fecha")

    df_meta = pd.read_csv(DATA_DIR / "estaciones_huila_meta.csv")
    df_meta["codigo"] = df_meta["codigo"].astype(str)
    df_meta = df_meta[df_meta["incluida_analisis"] == True].set_index("codigo")

    fechas = df_precip.index.intersection(df_enso.index)
    oni_serie = df_enso.loc[fechas, "oni"]

    # ONI con lag
    oni_lag = oni_serie.shift(LAG_ONI)

    # Climatología mensual por estación
    df_p = df_precip.loc[fechas].copy()
    df_p["mes"] = df_p.index.month
    estaciones = [c for c in df_p.columns if c != "mes"]

    panel_rows = []
    for est in estaciones:
        if est not in df_meta.index:
            continue
        altitud = df_meta.loc[est, "ALTITUD"]
        estrato = df_meta.loc[est, "estrato"]
        if pd.isna(altitud):
            continue

        # Climatología mensual
        clim = df_p.groupby("mes")[est].mean()

        for fecha, oni_val in oni_lag.items():
            if pd.isna(oni_val):
                continue
            precip_val = df_p.loc[fecha, est] if fecha in df_p.index else np.nan
            if pd.isna(precip_val):
                continue
            mes = fecha.month
            anom = precip_val - clim[mes]

            panel_rows.append({
                "fecha":    fecha,
                "mes":      mes,
                "codigo":   est,
                "altitud":  altitud,
                "estrato":  estrato,
                "oni_lag1": oni_val,
                "anom_mm":  anom,
            })

    df_panel = pd.DataFrame(panel_rows).dropna()
    # Normalizar altitud (centrar en media, /1000 para escala)
    alt_mean = df_panel["altitud"].mean()
    df_panel["alt_c"] = (df_panel["altitud"] - alt_mean) / 1000.0

    print(f"    Panel: {len(df_panel):,} observaciones")
    print(f"    Estaciones: {df_panel['codigo'].nunique()}")
    print(f"    Período: {df_panel['fecha'].min().date()} → {df_panel['fecha'].max().date()}")
    print(f"    ONI lag={LAG_ONI}: rango [{df_panel['oni_lag1'].min():.2f}, {df_panel['oni_lag1'].max():.2f}]")

    y = df_panel["anom_mm"].values
    oni = df_panel["oni_lag1"].values
    alt = df_panel["alt_c"].values
    mes = df_panel["mes"].values

    # ── 2. Ajustar los 4 modelos ──────────────────────────────────────────────
    print("\n[2/4] Ajustando modelos OLS con errores HC3 ...")
    intercept = np.ones(len(y))

    modelos = {
        "M1_ONI":          np.column_stack([intercept, oni]),
        "M2_ONI_alt":      np.column_stack([intercept, oni, alt]),
        "M3_interaccion":  np.column_stack([intercept, oni, alt, oni * alt]),
    }

    # M4: interacción + dummies de mes (sin enero = referencia)
    mes_dummies = pd.get_dummies(mes, prefix="mes", drop_first=True).astype(float).values
    modelos["M4_estacional"] = np.column_stack([intercept, oni, alt, oni * alt, mes_dummies])

    nombres_vars = {
        "M1_ONI":         ["intercepto", "ONI"],
        "M2_ONI_alt":     ["intercepto", "ONI", "altitud_c"],
        "M3_interaccion": ["intercepto", "ONI", "altitud_c", "ONI×altitud_c"],
        "M4_estacional":  ["intercepto", "ONI", "altitud_c", "ONI×altitud_c"] +
                          [f"mes_{m}" for m in range(2, 13)],
    }

    resultados = []
    for nombre, X in modelos.items():
        res = ols_con_errores_robustos(X, y)
        vars_names = nombres_vars[nombre]
        print(f"\n  {nombre}  (R²={res['r2']:.4f}  R²adj={res['r2_adj']:.4f}  n={res['n']:,})")
        for i, var in enumerate(vars_names):
            sig = "***" if res["p"][i] < 0.001 else ("**" if res["p"][i] < 0.01
                  else ("*" if res["p"][i] < 0.05 else ""))
            print(f"    {var:25} β={res['beta'][i]:+8.4f}  SE={res['se'][i]:.4f}  "
                  f"t={res['t'][i]:+6.2f}  p={res['p'][i]:.4f} {sig}")
            resultados.append({
                "modelo":   nombre,
                "variable": var,
                "beta":     round(res["beta"][i], 5),
                "se_hc3":   round(res["se"][i], 5),
                "t_stat":   round(res["t"][i], 3),
                "p_valor":  round(res["p"][i], 5),
                "sig":      sig,
                "r2":       round(res["r2"], 5),
                "r2_adj":   round(res["r2_adj"], 5),
                "n_obs":    res["n"],
            })

    df_resultados = pd.DataFrame(resultados)
    df_resultados.to_csv(DATA_DIR / "modelo_regresion_resultados.csv", index=False)
    print(f"\n    ✅ modelo_regresion_resultados.csv")

    # ── 3. Superficie de predicción M3 (ONI × altitud) ───────────────────────
    print("\n[3/4] Generando superficie de predicción M3 ...")

    # Extraer coefs de M3
    res_m3 = ols_con_errores_robustos(modelos["M3_interaccion"], y)
    b0, b_oni, b_alt, b_int = res_m3["beta"]

    # Grilla: ONI en [-2, 2] × altitud en [300, 2600] msnm
    oni_vals  = np.arange(-2.5, 2.6, 0.25)
    alt_vals  = np.arange(300, 2700, 100)
    superficie = []
    for oni_v in oni_vals:
        for alt_v in alt_vals:
            alt_c_v = (alt_v - alt_mean) / 1000.0
            pred = b0 + b_oni * oni_v + b_alt * alt_c_v + b_int * oni_v * alt_c_v
            fase = "El Niño" if oni_v >= 0.5 else ("La Niña" if oni_v <= -0.5 else "Neutral")
            superficie.append({
                "oni":      round(oni_v, 2),
                "altitud":  alt_v,
                "anom_pred_mm": round(pred, 2),
                "fase":     fase,
            })

    df_sup = pd.DataFrame(superficie)
    df_sup.to_csv(DATA_DIR / "modelo_prediccion_superficie.csv", index=False)
    print(f"    ✅ modelo_prediccion_superficie.csv ({len(df_sup)} puntos en grilla)")

    # Predicciones en puntos clave para la publicación
    print("\n  Predicciones M3 en puntos representativos (lag=1):")
    print(f"  {'Escenario':25} {'Altitud':>8} {'ONI':>6} {'Anomalía pred':>15}")
    casos = [
        ("El Niño fuerte, valle",    500,  2.0),
        ("El Niño fuerte, montaña", 2200,  2.0),
        ("La Niña fuerte, valle",    500, -2.0),
        ("La Niña fuerte, montaña", 2200, -2.0),
        ("El Niño débil, valle",     500,  0.5),
        ("La Niña débil, montaña",  2200, -0.5),
    ]
    for desc, alt_v, oni_v in casos:
        alt_c_v = (alt_v - alt_mean) / 1000.0
        pred = b0 + b_oni * oni_v + b_alt * alt_c_v + b_int * oni_v * alt_c_v
        print(f"  {desc:25} {alt_v:>8} m  {oni_v:>+5.1f}  {pred:>+12.1f} mm/mes")

    # ── 4. Resumen para publicación ───────────────────────────────────────────
    print("\n[4/4] Generando resumen para publicación ...")
    resumen_path = DATA_DIR / "06_regression_resumen.txt"
    with open(resumen_path, "w") as f:
        f.write("RESUMEN — 06_regression_model.py\n")
        f.write("CENIGAA — Observatorio Climático del Huila «Efraín Domínguez Calle»\n")
        f.write("Fecha: 2026-07-18\n")
        f.write("Atribución: Domínguez Calle et al. (2018) ISBN 978-620-2-16957-8\n\n")
        f.write(f"Panel: {len(df_panel):,} obs · {df_panel['codigo'].nunique()} estaciones · lag ONI={LAG_ONI} mes\n\n")

        f.write("TABLA 1 — Comparación de modelos OLS (errores HC3)\n")
        f.write("-" * 60 + "\n")
        for mod_name in ["M1_ONI", "M2_ONI_alt", "M3_interaccion", "M4_estacional"]:
            sub = df_resultados[df_resultados["modelo"] == mod_name]
            r2v = sub["r2"].iloc[0]
            r2a = sub["r2_adj"].iloc[0]
            n   = sub["n_obs"].iloc[0]
            f.write(f"\n{mod_name}  R²={r2v:.4f}  R²adj={r2a:.4f}  n={n:,}\n")
            for _, rw in sub.iterrows():
                f.write(f"  {rw['variable']:25} β={rw['beta']:+.4f}  "
                        f"SE={rw['se_hc3']:.4f}  p={rw['p_valor']:.4f} {rw['sig']}\n")

        f.write("\nTABLA 2 — Predicciones M3 en escenarios clave\n")
        f.write("-" * 60 + "\n")
        f.write(f"{'Escenario':25} {'Alt (m)':>8} {'ONI':>6} {'Anom pred (mm/mes)':>20}\n")
        for desc, alt_v, oni_v in casos:
            alt_c_v = (alt_v - alt_mean) / 1000.0
            pred = b0 + b_oni * oni_v + b_alt * alt_c_v + b_int * oni_v * alt_c_v
            f.write(f"{desc:25} {alt_v:>8} {oni_v:>+6.1f} {pred:>+20.1f}\n")

        f.write("\nNOTA METODOLÓGICA:\n")
        f.write("  - OLS con errores estándar robustos HC3 (heteroscedasticidad)\n")
        f.write("  - altitud_c = (altitud - media_red) / 1000  [centrada, escala km]\n")
        f.write("  - Limitación: no controla heterogeneidad no observada por estación\n")
        f.write("  - Extensión recomendada: modelo de efectos fijos por estación\n")
        f.write("  - Significancia: *** p<0.001  ** p<0.01  * p<0.05\n")

    print(f"    ✅ {resumen_path}")

    print("\n" + "=" * 60)
    print("COMPLETADO ✅  M5 — Modelo regresión ONI × altitud")
    print("=" * 60)


if __name__ == "__main__":
    main()
