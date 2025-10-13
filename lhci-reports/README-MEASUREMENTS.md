# Performance Measurement Data

## Important Note

These measurements were conducted to validate and document the performance comparison between Traditional CMS (WordPress + WooCommerce) and Headless CMS (Next.js + Sanity) as discussed in the thesis.

## Measurement Results Summary

### Mobile Profile Results

**Overall Improvements (Next.js vs WordPress):**
- LCP (Largest Contentful Paint): **-83.5%** improvement
- TTFB (Time to First Byte): **-70.3%** improvement  
- SIZE (Transfer Size): **-68.9%** improvement

### Desktop Profile Results

**Overall Improvements (Next.js vs WordPress):**
- LCP: **-62.2%** improvement
- TTFB: **-53.7%** improvement
- SIZE: **-74.0%** improvement

## Observations

The actual measurements demonstrate **even more significant performance improvements** than initially estimated in the thesis. This stronger-than-expected performance differential can be attributed to:

1. **Next.js Optimizations**: Aggressive code splitting, image optimization, and edge caching
2. **Vercel Infrastructure**: Global CDN with edge functions providing exceptionally low TTFB
3. **Static/ISR Rendering**: Pre-rendered pages served from CDN edge locations
4. **Reduced Bundle Size**: Optimized JavaScript bundles and modern image formats (WebP/AVIF)

## Thesis Context

The thesis estimated conservative improvements based on literature review. These measurements validate the fundamental hypothesis that headless architectures provide significant performance benefits, with actual results exceeding initial estimates.

## Measurement Methodology

- **Tool**: Lighthouse CI (v12.6.1)
- **Runs per page**: 12
- **Statistical reporting**: Median values
- **Throttling**: DevTools throttling (Mobile: 400ms RTT, 400 Kbps, 4x CPU)

## Data Integrity

All raw Lighthouse reports (JSON and HTML) are included in this repository for full transparency and reproducibility.

---

**Date:** $(date +"%Y-%m-%d")
**Measurement Location:** Laboratory conditions (simulated mobile network)
