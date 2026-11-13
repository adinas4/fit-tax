#!/usr/bin/env bash
# =========================================================================
# FIT-TAX Cakrawala Sinergi — Production setup / redeploy helper
# =========================================================================
# Run this ON THE HOSTINGER SERVER from the project root after pulling the
# latest code (or uploading the files). It is safe to re-run on every deploy.
#
# What it does:
#   1. Installs dependencies
#   2. Generates the Prisma client
#   3. Pushes the database schema (creates/migrates db/custom.db)
#   4. Seeds initial content + admin user (idempotent — skips if data exists)
#   5. Builds the Next.js standalone production bundle
#   6. (Re)starts the app with PM2
#
# Prerequisites (one-time, see DEPLOY.md):
#   - Node.js 20+, npm/bun, PM2 installed globally
#   - .env created from .env.production.example with real values
# -------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 1/6  Installing dependencies..."
if command -v bun >/dev/null 2>&1; then
  bun install --frozen-lockfile
else
  npm ci
fi

echo "==> 2/6  Generating Prisma client..."
npx prisma generate

echo "==> 3/6  Pushing database schema..."
# Ensures the SQLite file + tables exist. Safe to re-run.
npx prisma db push --accept-data-loss

echo "==> 4/6  Seeding initial content + admin (idempotent)..."
# Loads vars from .env so ADMIN_EMAIL / ADMIN_PASSWORD / DATABASE_URL are used.
set -a
. ./.env
set +a
if command -v bun >/dev/null 2>&1; then
  bun run scripts/seed.ts
else
  npx tsx scripts/seed.ts || node --import tsx scripts/seed.ts
fi

echo "==> 5/6  Building Next.js standalone bundle..."
if command -v bun >/dev/null 2>&1; then
  bun run build
else
  npm run build
fi

# Ensure the persistent uploads directory exists (if UPLOADS_DIR is set).
if [ -n "${UPLOADS_DIR:-}" ]; then
  mkdir -p "$UPLOADS_DIR"
  echo "     uploads dir: $UPLOADS_DIR"
fi

echo "==> 6/6  (Re)starting with PM2..."
mkdir -p logs
if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrRestart ecosystem.config.cjs --env production
  pm2 save
  echo
  echo "✓ Deployed. App running on port ${PORT:-3000}."
  echo "  View logs:    pm2 logs fittax --lines 50"
  echo "  Status:       pm2 status"
else
  echo "PM2 not found. Start the server manually:"
  echo "  NODE_ENV=production node .next/standalone/server.js"
fi
