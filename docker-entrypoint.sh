#!/bin/sh
set -e

# Ensure data directory exists
mkdir -p /app/data

# Default Database URL if not specified
export DATABASE_URL="${DATABASE_URL:-file:/app/data/local.db}"
export PORT="${PORT:-3000}"

# Auto seed if requested or if DB does not exist
DB_FILE=$(echo "$DATABASE_URL" | sed 's/^file://')

if [ "${AUTO_SEED}" = "true" ] || [ "${AUTO_SEED}" = "1" ] || [ ! -f "$DB_FILE" ]; then
  echo "🌱 [ChatBotGallery] Initializing / Seeding database (${DATABASE_URL})..."
  node seed_bots.mjs || echo "⚠️ Seed script completed with warning or table already populated."
fi

echo "🚀 [ChatBotGallery] Starting application on port ${PORT}..."
exec npm run preview --prefix chatbotgallery -- --host 0.0.0.0 --port "${PORT}"
