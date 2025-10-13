#!/usr/bin/env bash
set -euo pipefail

: "${WP_BASE:?WP_BASE ist nicht gesetzt}"
: "${NX_BASE:?NX_BASE ist nicht gesetzt}"

ROUTES=("/" "/shop" "/badami-pistazien-gerostet-und-gesalzen/" "/cart" "/checkout" "/about")
OUTDIR="lhci-reports/desktop"
mkdir -p "$OUTDIR"

run_one () {
  local BASE="$1"; local R="$2"
  npx lhci autorun     --collect.url="${BASE}${R}"     --collect.numberOfRuns=12     --collect.settings.formFactor=desktop     --collect.settings.screenEmulation.disabled=true     --collect.settings.throttlingMethod=provided     --upload.target=filesystem     --upload.outputDir="${OUTDIR}"
}

for BASE in "$WP_BASE" "$NX_BASE"; do
  for R in "${ROUTES[@]}"; do
    echo ">>> DESKTOP ${BASE}${R}"
    run_one "$BASE" "$R"
  done
done
