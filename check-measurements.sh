#!/usr/bin/env bash

echo "════════════════════════════════════════════════════════════════"
echo "MEASUREMENT STATUS CHECK"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Function to check a directory and count measurements
check_directory() {
  local dir=$1
  local label=$2
  
  if [ -d "$dir" ]; then
    local json_count=$(find "$dir" -name "*.report.json" 2>/dev/null | wc -l | tr -d ' ')
    local html_count=$(find "$dir" -name "*.report.html" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$json_count" -gt 0 ]; then
      echo "✅ $label"
      echo "   Location: $dir"
      echo "   Reports: $json_count JSON, $html_count HTML"
      
      # Check for metadata
      if [ -f "$dir/measurement-metadata.json" ]; then
        echo "   Metadata: ✓"
        # Extract key info from metadata
        local cms_name=$(cat "$dir/measurement-metadata.json" | grep -o '"cms_name": "[^"]*"' | cut -d'"' -f4)
        local profile=$(cat "$dir/measurement-metadata.json" | grep -o '"profile": "[^"]*"' | cut -d'"' -f4)
        local runs=$(cat "$dir/measurement-metadata.json" | grep -o '"number_of_runs": [0-9]*' | grep -o '[0-9]*')
        echo "   CMS: $cms_name"
        echo "   Profile: $profile"
        echo "   Runs per page: $runs"
      fi
      
      # Check for summary
      if [ -f "$dir/measurement-summary.json" ]; then
        echo "   Summary: ✓"
      else
        echo "   Summary: ⚠️  Not generated yet (run: node analyze-all-measurements.js $dir)"
      fi
      
      # Try to identify unique pages measured
      local pages=$(find "$dir" -name "*.report.json" | xargs -I {} basename {} | sed 's/_-2025.*//' | sed 's/--2025.*//' | sort -u | wc -l | tr -d ' ')
      echo "   Unique pages: ~$pages"
      
      echo ""
      return 0
    else
      echo "⚠️  $label"
      echo "   Location: $dir"
      echo "   Status: Directory exists but no reports found"
      echo ""
      return 1
    fi
  else
    echo "❌ $label"
    echo "   Location: $dir"
    echo "   Status: Directory does not exist"
    echo ""
    return 1
  fi
}

# Check all potential measurement directories
echo "TRADITIONAL CMS (WordPress + WooCommerce)"
echo "────────────────────────────────────────────────────────────────"
check_directory "lhci-reports/mobile" "WordPress - Mobile Profile"
check_directory "lhci-reports/desktop" "WordPress - Desktop Profile"

echo ""
echo "HEADLESS CMS (Next.js + Sanity)"
echo "────────────────────────────────────────────────────────────────"
check_directory "lhci-reports/nextjs-sanity-mobile" "Next.js - Mobile Profile"
check_directory "lhci-reports/nextjs-sanity-desktop" "Next.js - Desktop Profile"

echo ""
echo "BACKUPS"
echo "────────────────────────────────────────────────────────────────"
if ls lhci-reports/mobile-backup-* 1> /dev/null 2>&1; then
  for backup in lhci-reports/mobile-backup-*; do
    if [ -d "$backup" ]; then
      echo "📦 Backup found: $backup"
    fi
  done
else
  echo "No backups found"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "DETAILED FILE BREAKDOWN"
echo "════════════════════════════════════════════════════════════════"
echo ""

for dir in lhci-reports/*/; do
  if [ -d "$dir" ]; then
    basename_dir=$(basename "$dir")
    report_count=$(find "$dir" -name "*.report.json" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$report_count" -gt 0 ]; then
      echo "Directory: $basename_dir"
      echo "  Total reports: $report_count"
      
      # List unique page identifiers
      echo "  Pages measured:"
      find "$dir" -name "*.report.json" | xargs -I {} basename {} | \
        sed 's/_-2025.*//' | sed 's/--2025.*//' | sed 's/-2025.*//' | \
        sed 's/\.report\.json//' | sort -u | sed 's/^/    - /'
      echo ""
    fi
  fi
done

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "COMPARISON & ANALYSIS FILES"
echo "════════════════════════════════════════════════════════════════"
echo ""

check_file() {
  local file=$1
  local desc=$2
  if [ -f "$file" ]; then
    local size=$(ls -lh "$file" | awk '{print $5}')
    echo "✅ $desc"
    echo "   File: $file"
    echo "   Size: $size"
  else
    echo "❌ $desc"
    echo "   File: $file"
    echo "   Status: Not created yet"
  fi
  echo ""
}

check_file "lhci-reports/thesis-comparison.json" "Thesis Comparison"
check_file "lhci-reports/cms-comparison.json" "CMS Comparison"
check_file "lhci-reports/chart-data.json" "Chart Data"
check_file "lhci-reports/comparison-chart-data.csv" "CSV Export"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Count totals
total_json=$(find lhci-reports -name "*.report.json" 2>/dev/null | wc -l | tr -d ' ')
total_html=$(find lhci-reports -name "*.report.html" 2>/dev/null | wc -l | tr -d ' ')
total_size=$(du -sh lhci-reports 2>/dev/null | awk '{print $1}')

echo "📊 Total Measurements:"
echo "   JSON Reports: $total_json"
echo "   HTML Reports: $total_html"
echo "   Total Size: ${total_size:-N/A}"
echo ""

# Calculate what's needed
echo "📋 Next Steps:"
echo ""

if [ ! -d "lhci-reports/nextjs-sanity-mobile" ] || [ $(find lhci-reports/nextjs-sanity-mobile -name "*.report.json" 2>/dev/null | wc -l) -eq 0 ]; then
  echo "⏳ 1. Measure Next.js (Headless) - Mobile Profile"
  echo "      Run: ./measure-nextjs-minimal.sh"
  echo ""
fi

if [ ! -d "lhci-reports/nextjs-sanity-desktop" ] || [ $(find lhci-reports/nextjs-sanity-desktop -name "*.report.json" 2>/dev/null | wc -l) -eq 0 ]; then
  echo "⏳ 2. Measure Next.js (Headless) - Desktop Profile"
  echo "      Run: ./measure-nextjs-minimal.sh (select desktop)"
  echo ""
fi

# Check if summaries exist
missing_summaries=0
for dir in lhci-reports/mobile lhci-reports/desktop lhci-reports/nextjs-sanity-mobile lhci-reports/nextjs-sanity-desktop; do
  if [ -d "$dir" ] && [ $(find "$dir" -name "*.report.json" 2>/dev/null | wc -l) -gt 0 ]; then
    if [ ! -f "$dir/measurement-summary.json" ]; then
      missing_summaries=$((missing_summaries + 1))
    fi
  fi
done

if [ $missing_summaries -gt 0 ]; then
  echo "⏳ 3. Generate Analysis Summaries"
  for dir in lhci-reports/mobile lhci-reports/desktop lhci-reports/nextjs-sanity-mobile lhci-reports/nextjs-sanity-desktop; do
    if [ -d "$dir" ] && [ $(find "$dir" -name "*.report.json" 2>/dev/null | wc -l) -gt 0 ]; then
      if [ ! -f "$dir/measurement-summary.json" ]; then
        echo "      Run: node analyze-all-measurements.js $dir"
      fi
    fi
  done
  echo ""
fi

if [ -f "lhci-reports/mobile/measurement-summary.json" ] && [ -f "lhci-reports/nextjs-sanity-mobile/measurement-summary.json" ]; then
  if [ ! -f "lhci-reports/thesis-comparison.json" ]; then
    echo "⏳ 4. Generate Comparison for Thesis"
    echo "      Run: node compare-for-thesis.js lhci-reports/mobile lhci-reports/nextjs-sanity-mobile"
    echo ""
  fi
fi

if [ -f "lhci-reports/thesis-comparison.json" ]; then
  echo "✅ All measurements and analysis complete!"
  echo "   Ready to push to GitHub: ./push-to-github.sh"
  echo ""
fi

echo "════════════════════════════════════════════════════════════════"
