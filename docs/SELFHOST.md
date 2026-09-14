# gotify selfhost notes

Alert hub. Only service here that earns a place on the 4gb vps
(~20mb ram, sqlite). Laptop copy is for chaos experiments.

## up (laptop)

```bash
cp selfhost/.env.example selfhost/.env
docker compose -f selfhost/docker-compose.yml --env-file selfhost/.env up -d
```

open http://localhost:8087, login, create an app, save the client token
as `GOTIFY_TOKEN` — other services' alertmanager will use it.

## up (vps)

same compose, behind caddy (see selfhost/Caddyfile), port 8087 loopback
only — never expose gotify without tls + strong password.

## backup

```bash
docker compose -f selfhost/docker-compose.yml stop
docker run --rm -v gotify-data:/data -v $(pwd)/backups:/b alpine \
  tar czf /b/gotify-$(date +%F).tar.gz /data
docker compose -f selfhost/docker-compose.yml start
```

## SLO

see selfhost/SLO.md. if GotifyDown fires and you're asleep — that's what
the morning postmortem is for (template in postmortems/).
