import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  scenarios: {
    checkout: {
      executor: 'constant-arrival-rate',
      rate: 25, timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 100, maxVUs: 300,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<1200'],
  },
};

const BASE = __ENV.BASE_URL;

export default function () {
  let res;

  group('PDP', () => {
    res = http.get(`${BASE}/badami-pistazien-gerostet-und-gesalzen/`, { tags: { step: 'pdp' } });
    check(res, { '200': r => r.status === 200 });
    sleep(0.5);
  });

  group('Cart', () => {
    res = http.get(`${BASE}/cart`, { tags: { step: 'cart' } });
    check(res, { '200': r => r.status === 200 });
    sleep(0.5);
  });

  group('Checkout', () => {
    res = http.get(`${BASE}/checkout`, { tags: { step: 'checkout' } });
    check(res, { '200': r => r.status === 200 });
    sleep(0.5);
  });
}
