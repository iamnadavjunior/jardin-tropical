#!/bin/sh
set -e

echo "=> Applying database schema..."
node_modules/.bin/prisma db push --skip-generate
echo "=> Schema ready."

echo "=> Seeding rooms and admin user..."
node_modules/.bin/tsx prisma/seed.ts
echo "=> Seed done."

echo "=> Starting Aparthotel Jardin Tropical..."
exec node_modules/.bin/next start -p "${PORT:-3000}"