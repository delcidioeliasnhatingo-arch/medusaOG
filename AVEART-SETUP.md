# AVEART deployment setup

This branch is an AVEART-specific preparation branch based on the upstream Medusa source. It intentionally does not replace upstream source files or contain secrets.

## Current services

- Source baseline: `medusaOG`, branch `develop` (Medusa v2.22.0 package inspected).
- Database: Neon project `AVEART`, PostgreSQL 18, region `aws-us-east-2`.
- Staging database branch: `aveart-medusa-staging` (Neon reports state `ready`).
- Production database branch: `production` (Neon reports state `ready`).
- Redis: no confirmed connected Redis service yet.
- Vercel: existing `medusa-og` project is detected as Vite; this is not proof of a working Medusa backend.

## Required runtime configuration

Set these as encrypted/sensitive environment variables only in the backend runtime, never commit actual values:

- `DATABASE_URL`: Neon staging connection string for initial validation; use pooled connection string if the runtime needs pooling, with SSL enabled.
- `REDIS_URL`: required for production components configured to use Redis. Do not set a fake or empty value.
- `JWT_SECRET`: a newly generated, high-entropy secret.
- `COOKIE_SECRET`: a separate newly generated, high-entropy secret.
- `STORE_CORS`: exact AVEART storefront origin(s).
- `ADMIN_CORS`: exact admin origin(s).
- `AUTH_CORS`: exact origins used for authentication.
- `PORT`: runtime-provided port where supported.

Do not reuse production credentials in staging. Do not expose database credentials in frontend/public environment variables.

## Deployment shape

1. Keep the upstream monorepo intact.
2. Build a dedicated Medusa application from the official Medusa v2 application starter, pinning a compatible version, and port only AVEART-specific configuration/modules into that application. The upstream monorepo is source code and is not itself automatically a configured AVEART store.
3. Run the backend in a persistent Node.js runtime that supports the Medusa server and required worker/background processing. Do not assume a Vercel static/Vite deployment can host the full backend.
4. Connect the backend to Neon staging and Redis, run migrations, and test the health endpoint, Store API, Admin authentication, and storefront CORS.
5. Only after staging tests pass, configure production credentials and deploy.
6. Connect the existing AVEART storefront project to the backend URL. Keep frontend and backend projects separate.

## Acceptance checklist

- [ ] Node.js version supported by the selected Medusa release.
- [ ] Clean install and production build pass.
- [ ] Database connection and migrations pass on staging.
- [ ] Redis connection and worker processing pass.
- [ ] `/health` returns HTTP 200.
- [ ] Store API can read products.
- [ ] Admin login works.
- [ ] Storefront requests pass CORS.
- [ ] No secrets are committed or exposed to the browser.
- [ ] Production rollout approved only after staging passes.
