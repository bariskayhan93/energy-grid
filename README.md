# Energy Grid

Interactive map visualisation of the European high-voltage transmission network — substations, power lines, and live-style flow animation.

**Live:** https://energy-grid.bariskayhan.com

## Tech stack

- Angular 21
- OpenLayers (map rendering)
- OpenStreetMap / CartoDB basemaps

## Development

```bash
npm install
ng serve
```

Open http://localhost:4200.

## Build

```bash
ng build --configuration production
```

Output goes to `dist/energy-grid/browser/`.

## Deployment

Pushed to `main` triggers GitHub Actions:

1. `npm ci` + `ng build --configuration production`
2. rsync to `/var/www/energy-grid/` on the VPS via SSH

**Required GitHub secrets:** `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`

The VPS runs Nginx with a certbot-managed SSL certificate for `energy-grid.bariskayhan.com`.
