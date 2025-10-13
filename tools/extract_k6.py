#!/usr/bin/env python3
import argparse, json, os, csv, glob

def parse_k6(path):
    # expect JSON summary exports (can be produced with --summary-export=...json)
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    out = {'file': os.path.basename(path)}
    # p(95) http_req_duration, error rate, rps if present
    metrics = data.get('metrics', {})
    dur = metrics.get('http_req_duration', {}).get('percentiles', {}).get('p(95)', None)
    fail_rate = metrics.get('http_req_failed', {}).get('rate', None)
    rps = metrics.get('http_reqs', {}).get('rate', None)
    out.update({'p95_ms': dur, 'fail_rate': fail_rate, 'rps': rps})
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--in', dest='indir', required=True)
    ap.add_argument('--out', dest='out', required=True)
    args = ap.parse_args()

    rows = []
    for path in glob.glob(os.path.join(args.indir, '**/*.json'), recursive=True):
        try:
            rows.append(parse_k6(path))
        except Exception as e:
            # skip non-summary JSON
            continue

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['file','p95_ms','fail_rate','rps'])
        w.writeheader()
        for r in rows:
            w.writerow(r)

if __name__ == '__main__':
    main()
