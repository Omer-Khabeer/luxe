#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const reportsDir = 'lhci-reports/mobile';
const files = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.report.json'))
  .sort();

const csvRows = [
  'Timestamp,Page Type,URL,Performance Score,FCP (ms),LCP (ms),TBT (ms),CLS,Speed Index (ms),TTI (ms),Total Size (MB),Requests,DOM Size,TTFB (ms)'
];

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
  const url = data.finalUrl || data.requestedUrl;
  const audits = data.audits || {};
  
  let pageType = 'homepage';
  if (url.includes('/shop')) pageType = 'shop';
  else if (url.includes('/badami-pistazien')) pageType = 'product';
  else if (url.includes('/cart')) pageType = 'cart';
  else if (url.includes('/checkout')) pageType = 'checkout';
  
  const row = [
    data.fetchTime || '',
    pageType,
    url,
    (data.categories?.performance?.score * 100 || '').toString(),
    audits['first-contentful-paint']?.numericValue?.toFixed(0) || '',
    audits['largest-contentful-paint']?.numericValue?.toFixed(0) || '',
    audits['total-blocking-time']?.numericValue?.toFixed(0) || '',
    audits['cumulative-layout-shift']?.numericValue?.toFixed(4) || '',
    audits['speed-index']?.numericValue?.toFixed(0) || '',
    audits['interactive']?.numericValue?.toFixed(0) || '',
    (audits['total-byte-weight']?.numericValue / 1024 / 1024)?.toFixed(2) || '',
    audits['network-requests']?.details?.items?.length || '',
    audits['dom-size']?.numericValue || '',
    audits['server-response-time']?.numericValue?.toFixed(0) || ''
  ];
  
  csvRows.push(row.join(','));
});

const csvPath = path.join(reportsDir, 'measurements.csv');
fs.writeFileSync(csvPath, csvRows.join('\n'));
console.log(`CSV exported to: ${csvPath}`);
console.log(`Total measurements: ${csvRows.length - 1}`);
