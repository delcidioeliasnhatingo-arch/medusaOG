# AVEART Medusa backend

Standalone Medusa v2 application package using the original Medusa v2.22.0 package line. The upstream `medusaOG` monorepo remains unchanged; this app lives in a dedicated subdirectory on branch `aveart/setup`.

## Requirements
- Node.js >= 22.22.0
- PostgreSQL (Neon is the intended database)
- For production multi-process/server-worker setups, configure a supported Redis service and explicit Medusa Redis-backed modules before scaling.

## Local setup
1. From this directory, install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in secrets locally.
3. Run `npm run db:migrate`.
4. Run `npm run dev`.

## Deployment notes
- Configure the deployment root directory as `apps/aveart-backend`.
- Set `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `STORE_CORS`, `ADMIN_CORS`, and `AUTH_CORS` as encrypted environment variables in the hosting provider.
- Do not deploy this backend as a Vite frontend. Validate runtime compatibility with a persistent Node.js server before production.
- This initial configuration does not include Redis. Keep it for initial testing only; configure Redis-backed modules and a worker before a multi-instance production deployment.
- Run health/API, migration, admin authentication, and storefront integration tests before marking the deployment ready.
