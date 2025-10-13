#!/usr/bin/env bash
set -euo pipefail

: "${WP_BASE:?WP_BASE ist nicht gesetzt}"
: "${NX_BASE:?NX_BASE ist nicht gesetzt}"

ROUTES=("/" "/shop" "/badami-pistazien-gerostet-und-gesalzen/" "/cart" "/checkout" "/about")
OUTDIR="lhci-reports/mobile"
mkdir -p "$OUTDIR"

run_one () {
  local BASE="$1"; local R="$2"
  npx lhci autorun     --collect.url="${BASE}${R}"     --collect.numberOfRuns=12     --collect.settings.formFactor=mobile     --collect.settings.screenEmulation.mobile=true     --collect.settings.throttlingMethod=devtools     --collect.settings.throttling.requestLatencyMs=400     --collect.settings.throttling.downloadThroughputKbps=400     --collect.settings.throttling.uploadThroughputKbps=400     --collect.settings.throttling.cpuSlowdownMultiplier=4     --upload.target=filesystem     --upload.outputDir="${OUTDIR}"
}

for BASE in "$WP_BASE" "$NX_BASE"; do
  for R in "${ROUTES[@]}"; do
    echo ">>> MOBILE ${BASE}${R}"
    run_one "$BASE" "$R"
  done
done
