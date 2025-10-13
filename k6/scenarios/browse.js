import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  scenarios: {
    browse: {
      executor: 'ramping-arrival-rate',
      startRate: 5, timeUnit: '1s',
      preAllocatedVUs: 50, maxVUs: 200,
      stages: [
        { target: 10, duration: '3m' },
        { target: 25, duration: '3m' },
        { target: 50, duration: '3m' },
        { target: 100, duration: '3m' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

const BASE = __ENV.BASE_URL;

export default function () {
  group('PLP', () => {
    const res = http.get(`${BASE}/shop`, { tags: { page: 'PLP' } });
    check(res, { '200': r => r.status === 200 });
    sleep(1);
  });
  group('PDP', () => {
    const res = http.get(`${BASE}/badami-pistazien-gerostet-und-gesalzen/`, { tags: { page: 'PDP' } });
    check(res, { '200': r => r.status === 200 });
    sleep(1);
  });
}
