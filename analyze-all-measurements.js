#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Get directory from command line or use default
const reportsDir = process.argv[2] || 'lhci-reports/mobile';

if (!fs.existsSync(reportsDir)) {
  console.error(`Directory not found: ${reportsDir}`);
  process.exit(1);
}

console.log(`Analyzing reports in: ${reportsDir}\n`);

// Read all JSON reports
const files = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.report.json'))
  .sort();

console.log(`Found ${files.length} measurement reports\n`);

// Read metadata if available
let metadata = {};
const metadataPath = path.join(reportsDir, 'measurement-metadata.json');
if (fs.existsSync(metadataPath)) {
  metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log('Measurement Configuration:');
  console.log(`  CMS Type: ${metadata.cms_type || 'unknown'}`);
  console.log(`  CMS Name: ${metadata.cms_name || 'unknown'}`);
  console.log(`  Date: ${metadata.measurement_date || 'unknown'}`);
  console.log(`  Lighthouse: ${metadata.lighthouse_version || 'unknown'}`);
  console.log('');
}

// Group reports by page type
const pageGroups = {};
files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
  const url = data.finalUrl || data.requestedUrl;
  
  // Determine page type - works for both traditional and headless
  let pageType = 'homepage';
  if (url.includes('/shop') || url.includes('/search') || url.includes('/products')) {
    pageType = 'shop';
  } else if (url.includes('/product/') || url.match(/\/[^/]+-[^/]+\/?$/) || url.includes('/badami-pistazien')) {
    pageType = 'product';
  } else if (url.includes('/cart')) {
    pageType = 'cart';
  } else if (url.includes('/checkout')) {
    pageType = 'checkout';
  } else if (url.includes('/about')) {
    pageType = 'content';
  }
  
  if (!pageGroups[pageType]) pageGroups[pageType] = [];
  pageGroups[pageType].push({ file, data, url });
});

// Extract metrics for each page type
const summary = {};

Object.entries(pageGroups).forEach(([pageType, reports]) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${pageType.toUpperCase()} (${reports.length} runs)`);
  console.log('='.repeat(60));
  
  const metrics = {
    performance: [],
    fcp: [],
    lcp: [],
    tbt: [],
    cls: [],
    speedIndex: [],
    tti: [],
    totalSize: [],
    requests: [],
    domSize: [],
    cacheHeaders: new Set(),
    serverResponseTime: [],
    mainThreadWork: [],
    bootupTime: []
  };
  
  reports.forEach(({ data, file }) => {
    // Performance score
    const perfScore = data.categories?.performance?.score;
    if (perfScore !== null) metrics.performance.push(perfScore * 100);
    
    // Core Web Vitals
    const audits = data.audits || {};
    if (audits['first-contentful-paint']?.numericValue) {
      metrics.fcp.push(audits['first-contentful-paint'].numericValue);
    }
    if (audits['largest-contentful-paint']?.numericValue) {
      metrics.lcp.push(audits['largest-contentful-paint'].numericValue);
    }
    if (audits['total-blocking-time']?.numericValue) {
      metrics.tbt.push(audits['total-blocking-time'].numericValue);
    }
    if (audits['cumulative-layout-shift']?.numericValue) {
      metrics.cls.push(audits['cumulative-layout-shift'].numericValue);
    }
    if (audits['speed-index']?.numericValue) {
      metrics.speedIndex.push(audits['speed-index'].numericValue);
    }
    if (audits['interactive']?.numericValue) {
      metrics.tti.push(audits['interactive'].numericValue);
    }
    if (audits['server-response-time']?.numericValue) {
      metrics.serverResponseTime.push(audits['server-response-time'].numericValue);
    }
    if (audits['mainthread-work-breakdown']?.numericValue) {
      metrics.mainThreadWork.push(audits['mainthread-work-breakdown'].numericValue);
    }
    if (audits['bootup-time']?.numericValue) {
      metrics.bootupTime.push(audits['bootup-time'].numericValue);
    }
    
    // Network metrics
    if (audits['total-byte-weight']?.numericValue) {
      metrics.totalSize.push(audits['total-byte-weight'].numericValue / 1024 / 1024);
    }
    if (audits['network-requests']?.details?.items) {
      metrics.requests.push(audits['network-requests'].details.items.length);
      
      // Extract cache-control headers
      audits['network-requests'].details.items.forEach(item => {
        if (item.responseHeaders) {
          const cacheHeader = item.responseHeaders.find(h => 
            h.name.toLowerCase() === 'cache-control'
          );
          if (cacheHeader) metrics.cacheHeaders.add(cacheHeader.value);
        }
      });
    }
    
    // DOM size
    if (audits['dom-size']?.numericValue) {
      metrics.domSize.push(audits['dom-size'].numericValue);
    }
  });
  
  // Calculate statistics
  const stats = {};
  Object.entries(metrics).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      const sorted = [...values].sort((a, b) => a - b);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      stats[key] = {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median: sorted[Math.floor(sorted.length / 2)],
        mean: mean,
        p95: sorted[Math.floor(sorted.length * 0.95)],
        stdDev: Math.sqrt(
          values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
        )
      };
    }
  });
  
  // Print summary
  console.log(`\nPerformance Score: ${stats.performance?.mean?.toFixed(1) || 'N/A'} (±${stats.performance?.stdDev?.toFixed(1) || 'N/A'})`);
  console.log(`\nCore Web Vitals:`);
  console.log(`  FCP:  ${stats.fcp?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  LCP:  ${stats.lcp?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  TBT:  ${stats.tbt?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  CLS:  ${stats.cls?.median?.toFixed(3) || 'N/A'}`);
  console.log(`\nOther Metrics:`);
  console.log(`  Speed Index: ${stats.speedIndex?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  TTI: ${stats.tti?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  TTFB: ${stats.serverResponseTime?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  Total Size: ${stats.totalSize?.median?.toFixed(2) || 'N/A'} MB`);
  console.log(`  Requests: ${stats.requests?.median?.toFixed(0) || 'N/A'}`);
  console.log(`  DOM Size: ${stats.domSize?.median?.toFixed(0) || 'N/A'} nodes`);
  
  console.log(`\nCache-Control Headers found: ${metrics.cacheHeaders.size}`);
  
  summary[pageType] = stats;
});

// Save detailed summary
const outputPath = path.join(reportsDir, 'measurement-summary.json');
fs.writeFileSync(outputPath, JSON.stringify({
  metadata: metadata,
  pageGroups: Object.fromEntries(
    Object.entries(pageGroups).map(([type, reports]) => [
      type,
      { count: reports.length, urls: [...new Set(reports.map(r => r.url))] }
    ])
  ),
  summary
}, null, 2));

console.log(`\n${'='.repeat(60)}`);
console.log(`Detailed summary saved to: ${outputPath}`);
console.log('='.repeat(60));
