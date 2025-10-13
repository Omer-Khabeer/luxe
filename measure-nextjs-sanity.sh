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
  "notes": "Mobile profile - Slow 4G-like parameters per thesis specification"
}
METADATA

# Create metadata for desktop profile
cat > "lhci-reports/${CMS_NAME}-desktop/measurement-metadata.json" << METADATA
{
  "measurement_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "cms_type": "headless",
  "cms_name": "Next.js + Sanity",
  "cms_variant": "nextsanity",
  "site_url": "${NEXT_BASE}",
  "lighthouse_version": "12.6.1",
  "chrome_version": "141.0.0.0",
  "number_of_runs": ${RUNS},
  "profile": "desktop",
  "settings": {
    "formFactor": "desktop",
    "screenEmulation": {
      "disabled": true
    },
    "throttlingMethod": "provided",
    "throttling": {
      "note": "No throttling for desktop profile"
    }
  },
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'not_in_git')",
  "thesis_section": "3.5.4",
  "notes": "Desktop profile - No throttling per thesis specification"
}
METADATA

echo "✓ Metadata files created"

# Create generic puppeteer script for Next.js
cat > tools/puppeteer/nextjs-generic.js << 'PUPPET'
// Generic puppeteer script for Next.js + Sanity
// Handles cookie consent and waits for hydration

module.exports = async (browser, context) => {
  const url = context.url;
  
  if (!url) {
    throw new Error('No URL provided in context');
  }
  
  const pages = await browser.pages();
  const page = pages[pages.length - 1];
  
  console.log('Preparing Next.js page:', url);
  
  // Wait for initial hydration
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Try to handle cookie consent
  try {
    const consentSelectors = [
      'button[aria-label*="Accept"]',
      'button[aria-label*="accept"]',
      'button:has-text("Accept")',
      '#onetrust-accept-btn-handler',
      '.cookie-consent-accept'
    ];
    
    for (const selector of consentSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        console.log('Clicked cookie consent');
        break;
      } catch {}
    }
  } catch {}
  
  // Wait for network idle
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
    # Mobile profile with DevTools throttling
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
    # Desktop profile without throttling
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
  
  # Convert to uppercase for display
  profile_upper=$(echo "$profile" | tr '[:lower:]' '[:upper:]')
  
  echo "════════════════════════════════════════════════════════════════"
  echo "PROFILE: ${profile_upper}"
  echo "════════════════════════════════════════════════════════════════"
  echo ""
  
  # Measure each page
  measure_page "home" "/" "$profile" "$output_dir"
  measure_page "plp" "/shop" "$profile" "$output_dir"
  measure_page "pdp" "/badami-pistazien-gerostet-und-gesalzen/" "$profile" "$output_dir"
  measure_page "cart" "/cart" "$profile" "$output_dir"
  measure_page "checkout" "/checkout" "$profile" "$output_dir"
  measure_page "content" "/about" "$profile" "$output_dir"
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
echo "  2. Compare with WordPress:"
for profile in $PROFILES; do
  echo "     node compare-for-thesis.js lhci-reports/${profile} lhci-reports/${CMS_NAME}-${profile}"
done
echo ""
