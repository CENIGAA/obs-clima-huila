"""
scripts/enso/05_geojson_gradient.py
=====================================
M4 — GeoJSON estaciones enriquecido + análisis de gradiente altitudinal ENSO

Inputs:
  data/enso_indices/estaciones_huila_meta.csv
  data/enso_indices/correlaciones_resumen.csv
  data/enso_indices/composites_por_estacion.csv

Outputs:
  data/enso_indices/estaciones_enso.geojson
    → GeoJSON listo para Leaflet con atributos científicos por estación
  data/enso_indices/gradiente_altitudinal.csv
    → Regresión r_pearson(ONI) ~ altitud para cuantificar el gradiente
  data/enso_indices/05_geojson_resumen.txt
    → Tabla resumen para publicación

Contenido del GeoJSON por estación (properties):
  - Metadatos: codigo, nombre, municipio, latitud, longitud, altitud, estrato
  - Correlaciones: r_oni, r_nino34, r_soi, lag_optimo_oni (índice más canónico)
  - Composites: anom_nino_anual, anom_nina_anual (mm/mes, promedio 12 meses)
  - QC: completitud_pct, n_meses

Gradiente altitudinal:
  Regresión lineal: r_pearson_ONI ~ altitud (msnm)
  Pendiente = cambio en r por cada 100 m de elevación
  Interpretación: si la pendiente es negativa, la señal ENSO se intensifica
  con la altitud (valores más negativos = correlación inversa más fuerte)

Atribución:
  Domínguez Calle, E.A. et al. (2018) ISBN 978-620-2-16957-8
  CENIGAA (2026) — Observatorio Climático del Huila

Autor: CENIGAA / Claude (Cowork) — 2026-07-18
"""

import pandas as pd
import numpy as np
import json
from scipy import stats
from pathlib import Path

DATA_DIR = Path("data/enso_indices")

INDICES_PRINCIPALES = ["oni", "nino34", "soi", "nino4"]

def main():
    print("=" * 60)
    print("M4 — GeoJSON + gradiente altitudinal ENSO × precipitación")
    print("=" * 60)

    # ── 1. Cargar insumos ─────────────────────────────────────────────────────
    print("\n[1/4] Cargando insumos ...")

    df_meta = pd.read_csv(DATA_DIR / "estaciones_huila_meta.csv")
    df_meta["codigo"] = df_meta["codigo"].astype(str)
    df_meta = df_meta[df_meta["incluida_analisis"] == True].copy()

    df_corr = pd.read_csv(DATA_DIR / "correlaciones_resumen.csv")
    df_corr["codigo"] = df_corr["codigo"].astype(str)

    df_comp = pd.read_csv(DATA_DIR / "composites_por_estacion.csv")
    df_comp["codigo"] = df_comp["codigo"].astype(str)

    print(f"    Estaciones: {len(df_meta)}")
    print(f"    Correlaciones: {len(df_corr)} filas")
    print(f"    Composites: {len(df_comp)} filas")

    # ── 2. Construir tabla maestra por estación ────────────────────────────────
    print("\n[2/4] Construyendo tabla maestra ...")

    registros = []
    for _, row in df_meta.iterrows():
        cod = row["codigo"]

        # Correlaciones por índice (lag óptimo)
        corr_est = df_corr[df_corr["codigo"] == cod]
        corr_dict = {}
        for _, cr in corr_est.iterrows():
            idx = cr["indice_enso"]
            corr_dict[f"r_{idx}"]     = cr["r_pearson_opt"]
            corr_dict[f"lag_{idx}"]   = int(cr["lag_optimo"]) if not pd.isna(cr["lag_optimo"]) else None
            corr_dict[f"p_{idx}"]     = cr["p_pearson_opt"]

        # Composites ONI: anomalía media anual por fase
        comp_est = df_comp[df_comp["codigo"] == cod]
        anom_nino  = comp_est[comp_est["fase"] == "El Niño"]["anom_media_mm"].mean()
        anom_nina  = comp_est[comp_est["fase"] == "La Niña"]["anom_media_mm"].mean()

        # Completitud
        completitud = df_meta[df_meta["codigo"] == cod]["completitud_pct"].values
        comp_pct = float(completitud[0]) if len(completitud) > 0 else None

        registros.append({
            "codigo":          cod,
            "nombre":          str(row.get("NOMBRE", "")),
            "municipio":       str(row.get("MUNICIPIO", "")),
            "latitud":         float(row["LATITUD"])   if pd.notna(row.get("LATITUD"))  else None,
            "longitud":        float(row["LONGITUD"])  if pd.notna(row.get("LONGITUD")) else None,
            "altitud_msnm":    float(row["ALTITUD"])   if pd.notna(row.get("ALTITUD"))  else None,
            "estrato":         str(row.get("estrato", "")),
            "completitud_pct": round(comp_pct, 1) if comp_pct else None,
            "anom_nino_mm":    round(float(anom_nino), 2) if not np.isnan(anom_nino) else None,
            "anom_nina_mm":    round(float(anom_nina), 2) if not np.isnan(anom_nina) else None,
            **{k: (round(float(v), 4) if isinstance(v, (float, np.floating)) and not np.isnan(v) else v)
               for k, v in corr_dict.items()},
        })

    df_maestra = pd.DataFrame(registros)
    # Eliminar filas sin coordenadas
    df_maestra = df_maestra.dropna(subset=["latitud", "longitud"])
    print(f"    Estaciones con coordenadas válidas: {len(df_maestra)}")

    # ── 3. GeoJSON ────────────────────────────────────────────────────────────
    print("\n[3/4] Generando GeoJSON ...")

    features = []
    for _, row in df_maestra.iterrows():
        props = {k: v for k, v in row.items()
                 if k not in ("latitud", "longitud")
                 and v is not None
                 and not (isinstance(v, float) and np.isnan(v))}
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [row["longitud"], row["latitud"]],
            },
            "properties": props,
        })

    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "titulo":     "Estaciones Climáticas del Huila — Huella ENSO",
            "fuente":     "CCYVCE_DB · Domínguez Calle et al. (2018) ISBN 978-620-2-16957-8",
            "institucion":"CENIGAA (2026) — Observatorio Climático del Huila",
            "periodo":    "1957-01 a 2017-09",
            "n_estaciones": len(features),
            "indice_referencia": "ONI (NOAA CPC)",
            "nota_lag":   "lag_oni = meses en que ONI lidera la precipitación",
            "nota_anom":  "anom_nino_mm / anom_nina_mm = anomalía media mensual (mm/mes) vs climatología",
        },
        "features": features,
    }

    geojson_path = DATA_DIR / "estaciones_enso.geojson"
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
    size_kb = geojson_path.stat().st_size / 1024
    print(f"    ✅ {geojson_path} ({size_kb:.1f} KB, {len(features)} features)")

    # ── 4. Gradiente altitudinal ──────────────────────────────────────────────
    print("\n[4/4] Calculando gradiente altitudinal ...")

    df_grad = df_maestra[["codigo", "altitud_msnm", "estrato",
                           "r_oni", "r_nino34", "r_soi", "r_nino4"]].dropna(subset=["altitud_msnm", "r_oni"])

    grad_rows = []
    for indice in ["r_oni", "r_nino34", "r_soi", "r_nino4"]:
        sub = df_grad[["altitud_msnm", indice]].dropna()
        if len(sub) < 5:
            continue
        slope, intercept, r_val, p_val, stderr = stats.linregress(sub["altitud_msnm"], sub[indice])
        grad_rows.append({
            "indice":               indice.replace("r_", ""),
            "n_estaciones":         len(sub),
            "pendiente_por_100m":   round(slope * 100, 5),
            "r2":                   round(r_val**2, 4),
            "p_valor":              round(p_val, 4),
            "significativo":        p_val < 0.05,
            "intercepto":           round(intercept, 4),
            "interpretacion":       (
                "señal se intensifica con altitud" if slope < 0
                else "señal se debilita con altitud"
            ),
        })
        print(f"    {indice:10}: pendiente={slope*100:+.5f}/100m  R²={r_val**2:.3f}  p={p_val:.4f}  {'✅ sig' if p_val<0.05 else '— n.s.'}")

    df_grad_out = pd.DataFrame(grad_rows)
    grad_path = DATA_DIR / "gradiente_altitudinal.csv"
    df_grad_out.to_csv(grad_path, index=False)
    print(f"    ✅ {grad_path}")

    # ── Resumen para publicación ───────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("TABLA — Gradiente altitudinal de la correlación ENSO")
    print("=" * 60)
    print(df_grad_out[["indice","pendiente_por_100m","r2","p_valor","significativo"]].to_string(index=False))

    # Estadísticos descriptivos ONI por estrato
    print("\nTABLA — r_ONI por estrato altitudinal (para publicación):")
    print(f"{'Estrato':20} {'n':>4} {'media r':>8} {'mediana r':>10} {'min r':>7} {'max r':>7}")
    for estrato in ["valle_bajo", "pie_de_monte", "montano_bajo"]:
        sub = df_maestra[df_maestra["estrato"] == estrato]["r_oni"].dropna()
        if sub.empty:
            continue
        print(f"{estrato:20} {len(sub):>4} {sub.mean():>8.3f} {sub.median():>10.3f} "
              f"{sub.min():>7.3f} {sub.max():>7.3f}")

    # Guardar resumen txt
    resumen_path = DATA_DIR / "05_geojson_resumen.txt"
    with open(resumen_path, "w") as f:
        f.write("RESUMEN — 05_geojson_gradient.py\n")
        f.write("Fecha: 2026-07-18 | CENIGAA — Observatorio Climático del Huila\n")
        f.write("Atribución: Domínguez Calle et al. (2018) ISBN 978-620-2-16957-8\n\n")
        f.write(f"GeoJSON generado: {geojson_path.name}\n")
        f.write(f"  {len(features)} estaciones con coordenadas válidas\n")
        f.write(f"  Properties por feature: codigo, nombre, municipio, altitud, estrato,\n")
        f.write(f"    r_oni, r_nino34, r_soi, r_nino4, lag_oni, anom_nino_mm, anom_nina_mm\n\n")
        f.write("Gradiente altitudinal (Δr por cada 100 m de elevación):\n")
        for _, gr in df_grad_out.iterrows():
            f.write(f"  {gr['indice']:10}: Δr={gr['pendiente_por_100m']:+.5f}/100m  "
                    f"R²={gr['r2']:.3f}  p={gr['p_valor']:.4f}  {gr['interpretacion']}\n")
        f.write("\nEstadísticos r_ONI por estrato altitudinal:\n")
        f.write(f"{'Estrato':20} {'n':>4} {'media':>8} {'mediana':>9} {'min':>7} {'max':>7}\n")
        for estrato in ["valle_bajo", "pie_de_monte", "montano_bajo"]:
            sub = df_maestra[df_maestra["estrato"] == estrato]["r_oni"].dropna()
            if sub.empty:
                continue
            f.write(f"{estrato:20} {len(sub):>4} {sub.mean():>8.3f} {sub.median():>9.3f} "
                    f"{sub.min():>7.3f} {sub.max():>7.3f}\n")
        f.write("\nComposites anuales medios (ONI, mm/mes vs climatología):\n")
        f.write(f"{'Estrato':20} {'El Niño':>10} {'La Niña':>10}\n")
        for estrato in ["valle_bajo", "pie_de_monte", "montano_bajo"]:
            sub = df_maestra[df_maestra["estrato"] == estrato]
            n_mm  = sub["anom_nino_mm"].mean()
            na_mm = sub["anom_nina_mm"].mean()
            f.write(f"{estrato:20} {n_mm:>+10.1f} {na_mm:>+10.1f}\n")
    print(f"\n    ✅ {resumen_path}")

    print("\n" + "=" * 60)
    print("COMPLETADO ✅  M4 — GeoJSON + gradiente altitudinal")
    print("=" * 60)


if __name__ == "__main__":
    main()
