// k6 load shape for gotify. message post path, the thing that must not break.
// run: k6 run k6/load.js -e BASE_URL=http://localhost:8087 -e TOKEN=xxx
import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:8087';
const TOKEN = __ENV.TOKEN || '';

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // warm
    { duration: '3m', target: 100 }, // normal day
    { duration: '1m', target: 300 }, // spike
    { duration: '1m', target: 0 }, // recover
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const res = http.post(
    `${BASE}/message?token=${TOKEN}`,
    JSON.stringify({ title: 'load', message: 'k6 probe', priority: 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'accepted': (r) => r.status === 200 });
}
