# gotify SLO

Alert hub for the whole fleet — if this is down, nothing pages.

## SLI/SLO (30d window)

| signal | SLI | SLO |
|---|---|---|
| availability | `probe_success{job="gotify"}` | 99.5% |
| latency | p95 of `probe_http_duration_seconds` on `/health` | < 500ms |
| delivery | messages accepted / messages sent (k6 check rate) | 99.9% |

## error budget

99.5% over 30d = ~3.6h downtime allowed. Burn it faster than
~1%/hour and the `GotifyDown` alert fires (see prometheus/alerts.yml).

Budget exhausted → freeze feature work on the fleet, only fixes
until back in budget. (Solo setup, so "freeze" means: don't touch
anything except the fix. Write it down anyway — interviewers ask.)

## measuring

blackbox-style: k6 hits `/health` + posts a message with a client
token every minute via cron, gotify plugin confirms delivery.
See `k6/load.js` for the load shape, `k6/smoke.js` for the probe.
