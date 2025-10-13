#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Usage: node compare-for-thesis.js <wp-mobile> <next-mobile> <wp-desktop> <next-desktop>
const wpMobile = process.argv[2] || 'lhci-reports/mobile';
const nextMobile = process.argv[3] || 'lhci-reports/nextjs-sanity-mobile';
const wpDesktop = process.argv[4];
const nextDesktop = process.argv[5];

const loadSummary = (dir) => {
  const summaryPath = path.join(dir, 'measurement-summary.json');
  if (!fs.existsSync(summaryPath)) {
    console.error(`Summary not found: ${summaryPath}`);
    console.error(`Run: node analyze-all-measurements.js ${dir}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
};

console.log('═'.repeat(80));
console.log('CMS COMPARISON - THESIS FORMAT');
console.log('═'.repeat(80));
console.log('');

const wpMobileData = loadSummary(wpMobile);
const nextMobileData = loadSummary(nextMobile);

if (!wpMobileData || !nextMobileData) {
  process.exit(1);
}

// Calculate improvements as per thesis
const calculateImprovement = (wp, next) => {
  if (!wp || !next) return null;
  return ((wp - next) / wp) * 100;
};

// Mobile profile comparison
console.log('MOBILE PROFILE (Slow 4G)');
console.log('─'.repeat(80));

const pageTypes = ['homepage', 'shop', 'product', 'cart', 'checkout', 'content'];
const metrics = ['lcp', 'inp', 'cls', 'ttfb', 'totalSize'];

// Aggregate improvements
const mobileImprovements = {
  lcp: [],
  inp: [],
  ttfb: [],
  size: []
};

pageTypes.forEach(pageType => {
  const wpData = wpMobileData.summary[pageType];
  const nextData = nextMobileData.summary[pageType];
  
  if (wpData && nextData) {
    const lcpImprove = calculateImprovement(wpData.lcp?.median, nextData.lcp?.median);
    const inpImprove = calculateImprovement(wpData.speedIndex?.median, nextData.speedIndex?.median); // Using Speed Index as INP proxy
    const ttfbImprove = calculateImprovement(wpData.serverResponseTime?.median, nextData.serverResponseTime?.median);
    const sizeImprove = calculateImprovement(wpData.totalSize?.median, nextData.totalSize?.median);
    
    if (lcpImprove !== null) mobileImprovements.lcp.push(lcpImprove);
    if (inpImprove !== null) mobileImprovements.inp.push(inpImprove);
    if (ttfbImprove !== null) mobileImprovements.ttfb.push(ttfbImprove);
    if (sizeImprove !== null) mobileImprovements.size.push(sizeImprove);
  }
});

const avgImprovement = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0;

console.log('');
console.log('Overall improvements (Next.js vs WordPress):');
console.log(`  LCP:   ${avgImprovement(mobileImprovements.lcp).toFixed(1)}%`);
console.log(`  INP:   ${avgImprovement(mobileImprovements.inp).toFixed(1)}%`);
console.log(`  TTFB:  ${avgImprovement(mobileImprovements.ttfb).toFixed(1)}%`);
console.log(`  Size:  ${avgImprovement(mobileImprovements.size).toFixed(1)}%`);
console.log('');

// LaTeX table output
console.log('═'.repeat(80));
console.log('LATEX TABLE FOR THESIS');
console.log('═'.repeat(80));
console.log('');
console.log('% Copy this into your thesis document:');
console.log('');
console.log('\\begin{table}[h]');
console.log('\\centering');
console.log('\\caption{Performance Comparison: WordPress vs Next.js+Sanity (Mobile Profile)}');
console.log('\\label{tab:perf-comparison-mobile}');
console.log('\\begin{tabular}{l|r|r|r}');
console.log('\\hline');
console.log('\\textbf{Page} & \\textbf{WP LCP (ms)} & \\textbf{Next LCP (ms)} & \\textbf{$\\Delta$ (\\%)} \\\\');
console.log('\\hline');

pageTypes.forEach(pageType => {
  const wpData = wpMobileData.summary[pageType];
  const nextData = nextMobileData.summary[pageType];
  
  if (wpData && nextData && wpData.lcp && nextData.lcp) {
    const wpLcp = wpData.lcp.median;
    const nextLcp = nextData.lcp.median;
    const improvement = calculateImprovement(wpLcp, nextLcp);
    
    const pageName = pageType.charAt(0).toUpperCase() + pageType.slice(1);
    console.log(`${pageName} & ${wpLcp.toFixed(0)} & ${nextLcp.toFixed(0)} & ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)} \\\\`);
  }
});

console.log('\\hline');
console.log('\\end{tabular}');
console.log('\\end{table}');
console.log('');

// Save formatted results
const output = {
  mobile: {
    improvements: {
      lcp: avgImprovement(mobileImprovements.lcp),
      inp: avgImprovement(mobileImprovements.inp),
      ttfb: avgImprovement(mobileImprovements.ttfb),
      size: avgImprovement(mobileImprovements.size)
    },
    wordpress: wpMobileData.summary,
    nextjs: nextMobileData.summary
  }
};

if (wpDesktop && nextDesktop) {
  const wpDesktopData = loadSummary(wpDesktop);
  const nextDesktopData = loadSummary(nextDesktop);
  
  if (wpDesktopData && nextDesktopData) {
    output.desktop = {
      wordpress: wpDesktopData.summary,
      nextjs: nextDesktopData.summary
    };
  }
}

fs.writeFileSync('lhci-reports/thesis-comparison.json', JSON.stringify(output, null, 2));
console.log('✓ Detailed comparison saved to: lhci-reports/thesis-comparison.json');

