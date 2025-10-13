#!/usr/bin/env bash

echo "════════════════════════════════════════════════════════════════"
echo "PREVIEW OF YOUR MEASUREMENT RESULTS"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Analyze what we have first (quietly, just to get summaries)
echo "Analyzing measurements..."
node analyze-all-measurements.js lhci-reports/mobile > /dev/null 2>&1
node analyze-all-measurements.js lhci-reports/desktop > /dev/null 2>&1
node analyze-all-measurements.js lhci-reports/nextjs-sanity-mobile > /dev/null 2>&1
node analyze-all-measurements.js lhci-reports/nextjs-sanity-desktop > /dev/null 2>&1

# Create a quick comparison preview
cat > preview-comparison.js << 'JSEOF'
const fs = require('fs');

const wpMobile = JSON.parse(fs.readFileSync('lhci-reports/mobile/measurement-summary.json', 'utf8'));
const wpDesktop = JSON.parse(fs.readFileSync('lhci-reports/desktop/measurement-summary.json', 'utf8'));
const nextMobile = JSON.parse(fs.readFileSync('lhci-reports/nextjs-sanity-mobile/measurement-summary.json', 'utf8'));
const nextDesktop = JSON.parse(fs.readFileSync('lhci-reports/nextjs-sanity-desktop/measurement-summary.json', 'utf8'));

const calc = (wp, next) => wp && next ? ((wp - next) / wp * 100).toFixed(1) : 'N/A';

console.log('\n📊 MOBILE PROFILE COMPARISON');
console.log('═'.repeat(70));

const mobilePages = ['homepage', 'shop', 'product', 'cart'];
let mobileImprovements = { lcp: [], ttfb: [], size: [], cls: [] };

mobilePages.forEach(page => {
  const wp = wpMobile.summary[page];
  const nx = nextMobile.summary[page];
  
  if (wp && nx) {
    console.log(`\n${page.toUpperCase()}:`);
    if (wp.lcp && nx.lcp) {
      const imp = calc(wp.lcp.median, nx.lcp.median);
      console.log(`  LCP:  ${wp.lcp.median.toFixed(0)}ms → ${nx.lcp.median.toFixed(0)}ms (${imp}%)`);
      mobileImprovements.lcp.push(parseFloat(imp));
    }
    if (wp.serverResponseTime && nx.serverResponseTime) {
      const imp = calc(wp.serverResponseTime.median, nx.serverResponseTime.median);
      console.log(`  TTFB: ${wp.serverResponseTime.median.toFixed(0)}ms → ${nx.serverResponseTime.median.toFixed(0)}ms (${imp}%)`);
      mobileImprovements.ttfb.push(parseFloat(imp));
    }
    if (wp.totalSize && nx.totalSize) {
      const imp = calc(wp.totalSize.median, nx.totalSize.median);
      console.log(`  SIZE: ${wp.totalSize.median.toFixed(2)}MB → ${nx.totalSize.median.toFixed(2)}MB (${imp}%)`);
      mobileImprovements.size.push(parseFloat(imp));
    }
    if (wp.cls && nx.cls) {
      const diff = (wp.cls.median - nx.cls.median).toFixed(3);
      console.log(`  CLS:  ${wp.cls.median.toFixed(3)} → ${nx.cls.median.toFixed(3)} (Δ${diff})`);
      mobileImprovements.cls.push(wp.cls.median - nx.cls.median);
    }
  }
});

const avg = arr => arr.length > 0 ? (arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(1) : 'N/A';
const avgCls = arr => arr.length > 0 ? (arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(3) : 'N/A';

console.log('\n\n📈 MOBILE AVERAGE IMPROVEMENTS:');
console.log('═'.repeat(70));
console.log(`  LCP:  ${avg(mobileImprovements.lcp)}%`);
console.log(`  TTFB: ${avg(mobileImprovements.ttfb)}%`);
console.log(`  SIZE: ${avg(mobileImprovements.size)}%`);
console.log(`  CLS Δ: ${avgCls(mobileImprovements.cls)}`);

console.log('\n\n📊 DESKTOP PROFILE COMPARISON');
console.log('═'.repeat(70));

const desktopPages = ['homepage', 'shop', 'product', 'cart'];
let desktopImprovements = { lcp: [], ttfb: [], size: [], cls: [] };

desktopPages.forEach(page => {
  const wp = wpDesktop.summary[page];
  const nx = nextDesktop.summary[page];
  
  if (wp && nx) {
    console.log(`\n${page.toUpperCase()}:`);
    if (wp.lcp && nx.lcp) {
      const imp = calc(wp.lcp.median, nx.lcp.median);
      console.log(`  LCP:  ${wp.lcp.median.toFixed(0)}ms → ${nx.lcp.median.toFixed(0)}ms (${imp}%)`);
      desktopImprovements.lcp.push(parseFloat(imp));
    }
    if (wp.serverResponseTime && nx.serverResponseTime) {
      const imp = calc(wp.serverResponseTime.median, nx.serverResponseTime.median);
      console.log(`  TTFB: ${wp.serverResponseTime.median.toFixed(0)}ms → ${nx.serverResponseTime.median.toFixed(0)}ms (${imp}%)`);
      desktopImprovements.ttfb.push(parseFloat(imp));
    }
    if (wp.totalSize && nx.totalSize) {
      const imp = calc(wp.totalSize.median, nx.totalSize.median);
      console.log(`  SIZE: ${wp.totalSize.median.toFixed(2)}MB → ${nx.totalSize.median.toFixed(2)}MB (${imp}%)`);
      desktopImprovements.size.push(parseFloat(imp));
    }
    if (wp.cls && nx.cls) {
      const diff = (wp.cls.median - nx.cls.median).toFixed(3);
      console.log(`  CLS:  ${wp.cls.median.toFixed(3)} → ${nx.cls.median.toFixed(3)} (Δ${diff})`);
      desktopImprovements.cls.push(wp.cls.median - nx.cls.median);
    }
  }
});

console.log('\n\n📈 DESKTOP AVERAGE IMPROVEMENTS:');
console.log('═'.repeat(70));
console.log(`  LCP:  ${avg(desktopImprovements.lcp)}%`);
console.log(`  TTFB: ${avg(desktopImprovements.ttfb)}%`);
console.log(`  SIZE: ${avg(desktopImprovements.size)}%`);
console.log(`  CLS Δ: ${avgCls(desktopImprovements.cls)}`);

console.log('\n\n🎯 COMPARISON WITH YOUR THESIS VALUES:');
console.log('═'.repeat(70));
console.log('\nYour Thesis (Mobile):');
console.log('  LCP:  -28.9%');
console.log('  TTFB: -70.9%');
console.log('  SIZE: -18.8%');
console.log('  CLS Δ: -0.028');

console.log('\nYour Measurements (Mobile):');
console.log(`  LCP:  ${avg(mobileImprovements.lcp)}%`);
console.log(`  TTFB: ${avg(mobileImprovements.ttfb)}%`);
console.log(`  SIZE: ${avg(mobileImprovements.size)}%`);
console.log(`  CLS Δ: ${avgCls(mobileImprovements.cls)}`);

console.log('\n\nYour Thesis (Desktop):');
console.log('  LCP:  -27.8%');
console.log('  TTFB: -71.4%');
console.log('  SIZE: -18.6%');
console.log('  CLS Δ: -0.017');

console.log('\nYour Measurements (Desktop):');
console.log(`  LCP:  ${avg(desktopImprovements.lcp)}%`);
console.log(`  TTFB: ${avg(desktopImprovements.ttfb)}%`);
console.log(`  SIZE: ${avg(desktopImprovements.size)}%`);
console.log(`  CLS Δ: ${avgCls(desktopImprovements.cls)}`);

const withinRange = (actual, expected, tolerance = 10) => {
  if (actual === 'N/A') return false;
  const diff = Math.abs(parseFloat(actual) - parseFloat(expected));
  return diff <= tolerance;
};

console.log('\n\n⚠️  COMPATIBILITY CHECK:');
console.log('═'.repeat(70));

const mobileLcpMatch = withinRange(avg(mobileImprovements.lcp), -28.9, 10);
const mobileTtfbMatch = withinRange(avg(mobileImprovements.ttfb), -70.9, 15);
const mobileSizeMatch = withinRange(avg(mobileImprovements.size), -18.8, 10);

const desktopLcpMatch = withinRange(avg(desktopImprovements.lcp), -27.8, 10);
const desktopTtfbMatch = withinRange(avg(desktopImprovements.ttfb), -71.4, 15);
const desktopSizeMatch = withinRange(avg(desktopImprovements.size), -18.6, 10);

console.log(`Mobile LCP:  ${mobileLcpMatch ? '✅' : '⚠️'}  (within ±10% tolerance)`);
console.log(`Mobile TTFB: ${mobileTtfbMatch ? '✅' : '⚠️'}  (within ±15% tolerance)`);
console.log(`Mobile SIZE: ${mobileSizeMatch ? '✅' : '⚠️'}  (within ±10% tolerance)`);
console.log(`Desktop LCP:  ${desktopLcpMatch ? '✅' : '⚠️'}  (within ±10% tolerance)`);
console.log(`Desktop TTFB: ${desktopTtfbMatch ? '✅' : '⚠️'}  (within ±15% tolerance)`);
console.log(`Desktop SIZE: ${desktopSizeMatch ? '✅' : '⚠️'}  (within ±10% tolerance)`);

console.log('\n');
JSEOF

node preview-comparison.js
rm preview-comparison.js

echo ""
echo "════════════════════════════════════════════════════════════════"
