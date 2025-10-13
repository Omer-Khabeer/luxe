#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read all JSON reports
const reportsDir = 'lhci-reports/mobile';
const files = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.report.json'))
  .sort();

console.log(`Found ${files.length} measurement reports\n`);

// Group reports by page type
const pageGroups = {};
files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
  const url = data.finalUrl || data.requestedUrl;
  
  // Determine page type
  let pageType = 'homepage';
  if (url.includes('/shop')) pageType = 'shop';
  else if (url.includes('/badami-pistazien')) pageType = 'product';
  else if (url.includes('/cart')) pageType = 'cart';
  else if (url.includes('/checkout')) pageType = 'checkout';
  
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
    serverResponseTime: []
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
    
    // Network metrics
    if (audits['total-byte-weight']?.numericValue) {
      metrics.totalSize.push(audits['total-byte-weight'].numericValue / 1024 / 1024); // Convert to MB
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
      stats[key] = {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median: sorted[Math.floor(sorted.length / 2)],
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        p95: sorted[Math.floor(sorted.length * 0.95)],
        stdDev: Math.sqrt(
          values.reduce((sq, n) => sq + Math.pow(n - (values.reduce((a,b) => a + b, 0) / values.length), 2), 0) / values.length
        )
      };
    }
  });
  
  // Print summary
  console.log(`\nPerformance Score: ${stats.performance?.mean?.toFixed(1) || 'N/A'} (±${stats.performance?.stdDev?.toFixed(1) || 'N/A'})`);
  console.log(`\nCore Web Vitals:`);
  console.log(`  FCP:  ${stats.fcp?.median?.toFixed(0) || 'N/A'} ms (min: ${stats.fcp?.min?.toFixed(0) || 'N/A'}, max: ${stats.fcp?.max?.toFixed(0) || 'N/A'})`);
  console.log(`  LCP:  ${stats.lcp?.median?.toFixed(0) || 'N/A'} ms (min: ${stats.lcp?.min?.toFixed(0) || 'N/A'}, max: ${stats.lcp?.max?.toFixed(0) || 'N/A'})`);
  console.log(`  TBT:  ${stats.tbt?.median?.toFixed(0) || 'N/A'} ms (min: ${stats.tbt?.min?.toFixed(0) || 'N/A'}, max: ${stats.tbt?.max?.toFixed(0) || 'N/A'})`);
  console.log(`  CLS:  ${stats.cls?.median?.toFixed(3) || 'N/A'} (min: ${stats.cls?.min?.toFixed(3) || 'N/A'}, max: ${stats.cls?.max?.toFixed(3) || 'N/A'})`);
  console.log(`\nOther Metrics:`);
  console.log(`  Speed Index: ${stats.speedIndex?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  TTI: ${stats.tti?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  Server Response: ${stats.serverResponseTime?.median?.toFixed(0) || 'N/A'} ms`);
  console.log(`  Total Size: ${stats.totalSize?.median?.toFixed(2) || 'N/A'} MB`);
  console.log(`  Requests: ${stats.requests?.median?.toFixed(0) || 'N/A'}`);
  console.log(`  DOM Size: ${stats.domSize?.median?.toFixed(0) || 'N/A'} nodes`);
  
  console.log(`\nCache-Control Headers found: ${metrics.cacheHeaders.size}`);
  if (metrics.cacheHeaders.size > 0) {
    Array.from(metrics.cacheHeaders).slice(0, 5).forEach(h => console.log(`  - ${h}`));
    if (metrics.cacheHeaders.size > 5) console.log(`  ... and ${metrics.cacheHeaders.size - 5} more`);
  }
  
  summary[pageType] = stats;
});

// Save detailed summary
const outputPath = path.join(reportsDir, 'measurement-summary.json');
fs.writeFileSync(outputPath, JSON.stringify({
  metadata: JSON.parse(fs.readFileSync(path.join(reportsDir, 'measurement-metadata.json'), 'utf8')),
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
