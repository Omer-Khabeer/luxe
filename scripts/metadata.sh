#!/usr/bin/env bash
set -euo pipefail

: "${WP_BASE:?WP_BASE ist nicht gesetzt}"
: "${NX_BASE:?NX_BASE ist nicht gesetzt}"
BUILD_ID="${BUILD_ID:-manual}"
TS="$(date -Iseconds)"

routes=( "/" "/shop" "/badami-pistazien-gerostet-und-gesalzen/" "/cart" "/checkout" "/about" )

mkdir -p tools/meta
meta_file="tools/meta/meta-${TS}.json"

collect_headers () {
  local url="$1"
  # -sS: silent but show errors; -D -: dump headers to stdout; -o /dev/null: discard body
  curl -sS -I "$url" | awk 'BEGIN{print "{"} 
    BEGIN{first=1} 
    /^[Hh]TTP\//{{next}} 
    /^[[:space:]]*$/{{next}} 
    {{gsub("\r$","",$0); split($0,a,": "); key=a[1]; $0=substr($0,length(key)+3); val=$0; gsub("\"","\\\"",val); 
      if(!first) printf(",\n"); first=0; printf("\"%s\": \"%s\"", key, val)} 
  END{print "}"}'
}

jq_bin="$(command -v jq || true)"
if [[ -z "$jq_bin" ]]; then
  echo "Warnung: jq nicht gefunden. Roh-Header werden als Text abgelegt."
fi

declare -A payload
echo "[" > "$meta_file"
first=1
for BASE in "$WP_BASE" "$NX_BASE"; do
  for r in "${routes[@]}"; do
    url="${BASE}${r}"
    headers_json=$(collect_headers "$url")
    [[ $first -eq 0 ]] && echo "," >> "$meta_file"
    first=0
    cat <<EOF >> "$meta_file"
{{
  "timestamp": "$TS",
  "build_id": "$BUILD_ID",
  "url": "$url",
  "headers": $headers_json
}}
EOF
  done
done
echo "]" >> "$meta_file"
echo "Meta geschrieben: $meta_file"
