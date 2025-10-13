#!/usr/bin/env bash

set -e

# Configuration matching thesis specifications
NEXT_BASE="https://luxe-coral.vercel.app"
CMS_NAME="nextjs-sanity"
RUNS=12

# Chrome path
if [ -z "$CHROME_PATH" ]; then
  export CHROME_PATH="/Users/omerkhaber/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome"
fi

echo "════════════════════════════════════════════════════════════════"
echo "Measuring Next.js + Sanity (Headless CMS)"
echo "Following thesis specifications (Section 3.5.4)"
echo "════════════════════════════════════════════════════════════════"
echo "Site: $NEXT_BASE"
echo "Runs per page: $RUNS"
echo "Throttling: DevTools (400ms RTT, 400 Kbps, 4x CPU)"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check which pages exist
echo "Checking which pages exist..."
PAGES_TO_MEASURE=()

check_page() {
  local url=$1
  local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$url: $status"
  if [ "$status" == "200" ]; then
    return 0
  else
    return 1
  fi
}

if check_page "${NEXT_BASE}/"; then
  PAGES_TO_MEASURE+=("home:/")
fi

if check_page "${NEXT_BASE}/shop"; then
  PAGES_TO_MEASURE+=("plp:/shop")
fi

if check_page "${NEXT_BASE}/about"; then
  PAGES_TO_MEASURE+=("content:/about")
fi

echo ""
echo "Pages to measure: ${#PAGES_TO_MEASURE[@]}"
for page in "${PAGES_TO_MEASURE[@]}"; do
  echo "  - $page"
done
echo ""

if [ ${#PAGES_TO_MEASURE[@]} -eq 0 ]; then
  echo "❌ No pages found to measure!"
  exit 1
fi

read -p "Continue with these pages? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
  echo "Aborted."
  exit 0
fi

# Create output directories
mkdir -p "lhci-reports/${CMS_NAME}-mobile"
mkdir -p "lhci-reports/${CMS_NAME}-desktop"
mkdir -p "tools/puppeteer"

# Create metadata for mobile profile
cat > "lhci-reports/${CMS_NAME}-mobile/measurement-metadata.json" << METADATA
{
  "measurement_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "cms_type": "headless",
  "cms_name": "Next.js + Sanity",
  "cms_variant": "nextsanity",
  "site_url": "${NEXT_BASE}",
  "lighthouse_version": "12.6.1",
  "chrome_version": "141.0.0.0",
  "number_of_runs": ${RUNS},
  "profile": "mobile",
  "pages_measured": ${#PAGES_TO_MEASURE[@]},
  "settings": {
    "formFactor": "mobile",
    "screenEmulation": {
      "mobile": true
    },
    "throttlingMethod": "devtools",
    "throttling": {
      "requestLatencyMs": 400,
      "downloadThroughputKbps": 400,
      "uploadThroughputKbps": 400,
      "cpuSlowdownMultiplier": 4
    }
  },
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'not_in_git')",
  "thesis_section": "3.5.4",
  "notes": "Mobile profile - Slow 4G-like parameters per thesis specification. Only measuring pages that exist."
}
METADATA

echo "✓ Metadata files created"

# Create generic puppeteer script
cat > tools/puppeteer/nextjs-generic.js << 'PUPPET'
module.exports = async (browser, context) => {
  const url = context.url;
  
  if (!url) {
    throw new Error('No URL provided in context');
  }
  
  const pages = await browser.pages();
  const page = pages[pages.length - 1];
  
  console.log('Preparing Next.js page:', url);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const consentSelectors = [
      'button[aria-label*="Accept"]',
      'button[aria-label*="accept"]',
      '#onetrust-accept-btn-handler'
    ];
    
    for (const selector of consentSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch {}
    }
  } catch {}
  
  try {
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 });
  } catch {}
  
  console.log('Page prepared for Lighthouse measurement');
};
PUPPET

echo "✓ Puppeteer script created"
echo ""

# Function to measure one page
measure_page() {
  local route_name=$1
  local route_path=$2
  local profile=$3
  local output_dir=$4
  
  local full_url="${NEXT_BASE}${route_path}"
  
  echo "────────────────────────────────────────────────────────────────"
  echo "Measuring: $route_name ($profile profile)"
  echo "URL: $full_url"
  echo "────────────────────────────────────────────────────────────────"
  
  if [ "$profile" == "mobile" ]; then
    npx @lhci/cli@latest autorun \
      --collect.url="${full_url}" \
      --collect.numberOfRuns="${RUNS}" \
      --collect.settings.formFactor=mobile \
      --collect.settings.screenEmulation.mobile=true \
      --collect.settings.throttlingMethod=devtools \
      --collect.settings.throttling.requestLatencyMs=400 \
      --collect.settings.throttling.downloadThroughputKbps=400 \
      --collect.settings.throttling.uploadThroughputKbps=400 \
      --collect.settings.throttling.cpuSlowdownMultiplier=4 \
      --collect.chromePath="${CHROME_PATH}" \
      --collect.puppeteerScript=tools/puppeteer/nextjs-generic.js \
      --upload.target=filesystem \
      --upload.outputDir="${output_dir}"
  else
    npx @lhci/cli@latest autorun \
      --collect.url="${full_url}" \
      --collect.numberOfRuns="${RUNS}" \
      --collect.settings.formFactor=desktop \
      --collect.settings.screenEmulation.disabled=true \
      --collect.settings.throttlingMethod=provided \
      --collect.chromePath="${CHROME_PATH}" \
      --collect.puppeteerScript=tools/puppeteer/nextjs-generic.js \
      --upload.target=filesystem \
      --upload.outputDir="${output_dir}"
  fi
  
  if [ $? -eq 0 ]; then
    echo "✓ $route_name ($profile) completed"
  else
    echo "✗ $route_name ($profile) failed"
    return 1
  fi
  echo ""
}

# Ask which profile to measure
echo "Which profile do you want to measure?"
echo "1) Mobile only (Slow 4G)"
echo "2) Desktop only (No throttling)"
echo "3) Both profiles"
echo ""
read -p "Select option (1-3): " profile_choice

case $profile_choice in
  1)
    PROFILES="mobile"
    ;;
  2)
    PROFILES="desktop"
    ;;
  3)
    PROFILES="mobile desktop"
    ;;
  *)
    echo "Invalid option"
    exit 1
    ;;
esac

echo ""
echo "Starting measurements..."
echo ""

# Measure all routes for selected profiles
for profile in $PROFILES; do
  output_dir="lhci-reports/${CMS_NAME}-${profile}"
  
  profile_upper=$(echo "$profile" | tr '[:lower:]' '[:upper:]')
  
  echo "════════════════════════════════════════════════════════════════"
  echo "PROFILE: ${profile_upper}"
  echo "════════════════════════════════════════════════════════════════"
  echo ""
  
  # Measure each existing page
  for page_info in "${PAGES_TO_MEASURE[@]}"; do
    IFS=':' read -r name path <<< "$page_info"
    measure_page "$name" "$path" "$profile" "$output_dir"
  done
done

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "All measurements completed!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Output directories:"
for profile in $PROFILES; do
  echo "  - lhci-reports/${CMS_NAME}-${profile}/"
done
echo ""
echo "Next steps:"
echo "  1. Analyze results:"
for profile in $PROFILES; do
  echo "     node analyze-all-measurements.js lhci-reports/${CMS_NAME}-${profile}"
done
echo "  2. Compare with WordPress (only matching pages):"
for profile in $PROFILES; do
  echo "     node compare-for-thesis.js lhci-reports/${profile} lhci-reports/${CMS_NAME}-${profile}"
done
echo ""
