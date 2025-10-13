# CMS Measurements – LHCI & k6

Diese Repo-Struktur implementiert **§3.5.4 Messdokumentation & Reproduzierbarkeit** deiner Arbeit:
- **Dokumentation je Lauf:** Zeitstempel, Commit-/Build-ID, `cache-control`-Header, CDN-Hit/Miss (falls vorhanden), Netzwerk-/CPU-Profil, Throttling-Methode, ISR-Revalidate (falls relevant).
- **Rohberichte versioniert:** `lhci-reports/` (HTML/JSON) und `k6/outputs/` (JSON/CSV).

## Quickstart

### 1) Voraussetzungen
- Node.js 18+
- Chrome/Chromium
- `npm i` (installiert Lighthouse & LHCI)
- k6 (Install: https://k6.io/docs/get-started/installation/)

### 2) Umgebungsvariablen setzen
```bash
export WP_BASE="https://issnuss.pixel-crafting.com"
export NX_BASE="https://luxe-coral.vercel.app"
# Optional für Build/Commit-Referenz
export BUILD_ID="$(git rev-parse --short HEAD 2>/dev/null || echo manual)"
```

### 3) LHCI Messläufe (Mobil/Desktop) starten
```bash
./scripts/lhci-mobile.sh
./scripts/lhci-desktop.sh
```

### 4) Response-Header & Meta erfassen
```bash
./scripts/metadata.sh
```

### 5) k6 Lasttests (Basis-Szenarien)
```bash
BASE_URL="$WP_BASE" k6 run k6/scenarios/browse.js
BASE_URL="$WP_BASE" k6 run k6/scenarios/checkout.js
BASE_URL="$NX_BASE" k6 run k6/scenarios/browse.js
BASE_URL="$NX_BASE" k6 run k6/scenarios/checkout.js
```

### 6) Auswertung (CSV-Reports für LaTeX-Tabellen)
```bash
python3 tools/extract_lhci.py --in lhci-reports --out tools/lhci-summary.csv
python3 tools/extract_k6.py   --in k6/outputs   --out tools/k6-summary.csv
```

### 7) GitHub Push
```bash
git init
git add .
git commit -m "feat(measurements): initial LHCI+k6 scaffold with reproducible scripts"
git branch -M main
git remote add origin <DEIN_REMOTE>
git push -u origin main
```

## Ordnerstruktur
```
lhci-reports/        # LHCI HTML/JSON Artefakte pro Lauf
k6/outputs/          # k6 JSON/CSV Export pro Szenario & Stufe
k6/scenarios/        # k6 Testskripte (browse, checkout)
scripts/             # LHCI- und Meta-Skripte (mobil/desktop, routes)
tools/               # Python-Parser -> CSV-Summaries
.github/workflows/   # optional: CI-Workflow für LHCI (Artefakt-Upload)
```

## Reproduzierbarkeits-Notizen
- Throttling (DevTools): RTT=400ms, Down/Up=400/400 kbps, CPU x4 (mobil).
- Desktop: `provided` (keine Drosselung). 
- Pro Route **≥12 Läufe**; Kennzahlen: Median & p95.
- Meta erfasst: Zeit, BUILD_ID, `cache-control`, CDN-Hit/Miss (falls Server-Header), Profil (mobil/desktop), Route.
