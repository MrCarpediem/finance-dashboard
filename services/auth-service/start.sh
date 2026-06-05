#!/bin/sh

echo "=== Generating Prisma Client ==="
npx prisma generate || echo "Prisma generate warning (non-fatal)"

echo "=== Running Prisma migrations ==="
npx prisma migrate deploy || echo "Migration warning (non-fatal, tables may already exist)"

echo "=== Starting auth service ==="
node src/server.js
