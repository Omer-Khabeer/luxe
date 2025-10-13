#!/usr/bin/env python3
import argparse, json, os, csv, glob
from statistics import median

def collect_values(report_path):
    with open(report_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    audits = data.get('audits', {})
    # Lighthouse 12 JSON structure: metrics in 'audits' and 'audits.metrics.details.items[0]'
    details = audits.get('metrics', {}).get('details', {}).get('items', [{}])[0]
    lcp = details.get('observedLargestContentfulPaint', None)
    cls = details.get('cumulativeLayoutShift', None)
    ttfb = details.get('observedTimeToFirstByte', None)
    # INP may be in 'audits.interactive' not correct; better: 'audits.interaction-to-next-paint'
    inp_audit = audits.get('interaction-to-next-paint', {})
    inp = None
    if 'numericValue' in inp_audit:
        inp = inp_audit['numericValue']
    return lcp, inp, cls, ttfb

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--in', dest='indir', required=True)
    ap.add_argument('--out', dest='out', required=True)
    args = ap.parse_args()

    rows = []
    for profile in ['mobile', 'desktop']:
        for path in glob.glob(os.path.join(args.indir, profile, '**/*.report.json'), recursive=True):
            # infer target and route from the adjacent lhr directory name if possible
            # fallback: store profile only
            rel = os.path.relpath(path, args.indir)
            profile_name = profile
            # load JSON and take metrics
            lcp, inp, cls, ttfb = collect_values(path)
            rows.append({
                'profile': profile_name,
                'file': rel,
                'lcp_ms': lcp,
                'inp_ms': inp,
                'cls': cls,
                'ttfb_ms': ttfb
            })

    # write CSV
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['profile','file','lcp_ms','inp_ms','cls','ttfb_ms'])
        w.writeheader()
        for r in rows:
            w.writerow(r)

if __name__ == '__main__':
    main()
