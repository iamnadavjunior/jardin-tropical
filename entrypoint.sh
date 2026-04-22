#!/bin/sh
set -e

echo "→ Applying database schema..."
node_modules/.bin/prisma db push --skip-generate
echo "✓ Schema ready."

echo "→ Starting Aparthotel Jardin Tropical..."
exec node_modules/.bin/next start -p "${PORT:-3000}"
