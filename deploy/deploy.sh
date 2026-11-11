#!/usr/bin/env bash
# ==============================================================================
# St. Philomena's College (Autonomous) - Production Zero-Downtime Deployment
# ==============================================================================
set -e

APP_DIR="/var/www/stphilos"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${APP_DIR}/backups"

echo "=== [1/6] Navigating to Application Root ==="
cd "$APP_DIR"
mkdir -p "$BACKUP_DIR"

echo "=== [2/6] Automated Pre-Deployment Database Backup ==="
if [ -f "$APP_DIR/backend/database/database.sqlite" ]; then
    cp "$APP_DIR/backend/database/database.sqlite" "$BACKUP_DIR/db_backup_${TIMESTAMP}.sqlite"
    echo "SQLite database safely backed up to $BACKUP_DIR/db_backup_${TIMESTAMP}.sqlite"
fi

echo "=== [3/6] Pulling Latest Verified Production Code ==="
git fetch origin main
git checkout main
git pull origin main

echo "=== [4/6] Backend Deployment & Optimizations ==="
cd "$APP_DIR/backend"
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link || true

echo "=== [5/6] Frontend Production Build ==="
cd "$APP_DIR"
npm ci
npm run build

echo "=== [6/6] Reloading Web Server & PHP-FPM ==="
sudo systemctl reload php8.3-fpm
sudo systemctl reload nginx

echo "=== Deployment Successfully Completed at $(date) ==="
