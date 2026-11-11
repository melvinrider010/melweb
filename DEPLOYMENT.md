# Production Deployment & Operations Manual
## St. Philomena's College (Autonomous), Mysuru

This document details the production architecture, hosting environment setup, SSL configuration, database persistence strategy, and zero-downtime deployment workflow for St. Philomena's College official portal.

---

## 1. Production Architecture Overview

The system runs as a decoupled full-stack application under a unified SSL domain reverse-proxied by Nginx:

```
                                      [ Internet / Visitors & Admins ]
                                                     │
                                                     ▼
                                      [ HTTPS (Port 443) / Nginx ]
                                                     │
                         ┌───────────────────────────┴───────────────────────────┐
                         ▼                                                       ▼
           [ Static React SPA & Assets ]                               [ Laravel API Engine ]
           • Path: /                                                   • Path: /api/v1/*
           • Directory: /var/www/stphilos/dist                         • Directory: /var/www/stphilos/backend/public
           • Direct file serving + Gzip                                • FastCGI to PHP 8.3-FPM
           • Instant caching on media & PDFs                           • Database (MySQL / PostgreSQL / SQLite)
```

---

## 2. Server Prerequisites

A Linux VPS or dedicated server (Ubuntu 22.04 LTS or 24.04 LTS recommended):
- **CPU & RAM:** Minimum 2 vCPU, 4GB RAM (8GB recommended for concurrent PDF rendering)
- **Disk:** 40GB+ SSD (accommodates institutional PDFs, crawled galleries, and media archives)
- **Software Stack:**
  - Nginx 1.18+
  - PHP 8.3 with extensions: `php8.3-fpm`, `php8.3-cli`, `php8.3-mbstring`, `php8.3-xml`, `php8.3-curl`, `php8.3-sqlite3`, `php8.3-pdo`, `php8.3-intl`, `php8.3-bcmath`, `php8.3-zip`
  - Node.js 20 LTS & npm
  - Composer 2+
  - Git & Git LFS
  - Certbot (Let's Encrypt)

---

## 3. Step-by-Step Initial Production Setup

### Step 1: Install System Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git git-lfs certbot python3-certbot-nginx \
  php8.3-fpm php8.3-cli php8.3-common php8.3-mbstring php8.3-xml php8.3-curl \
  php8.3-sqlite3 php8.3-intl php8.3-bcmath php8.3-zip unzip

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Step 2: Clone the Verified Repository
```bash
sudo mkdir -p /var/www/stphilos
sudo chown -R $USER:$USER /var/www/stphilos
git clone https://github.com/melvinrider010/melweb.git /var/www/stphilos
cd /var/www/stphilos

# Pull Git LFS objects (campus video & media)
git lfs install
git lfs pull
```

### Step 3: Configure Backend Environment
```bash
cd /var/www/stphilos/backend
cp .env.example .env
```
Edit `/var/www/stphilos/backend/.env` with production settings:
```ini
APP_NAME="St. Philomena's College"
APP_ENV=production
APP_KEY=base64:... # Generate via php artisan key:generate
APP_DEBUG=false
APP_URL=https://stphilos.ac.in

# Database Configuration (SQLite or MySQL)
DB_CONNECTION=sqlite
# If MySQL is preferred:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=stphilos_production
# DB_USERNAME=stphilos_user
# DB_PASSWORD=<STRONG_SECURE_PASSWORD>

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true

FILESYSTEM_DISK=public
```

Run installation & database setup:
```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force --seed
php artisan storage:link
```

Ensure storage and bootstrap directories are writable by `www-data`:
```bash
sudo chown -R www-data:www-data /var/www/stphilos/backend/storage
sudo chown -R www-data:www-data /var/www/stphilos/backend/bootstrap/cache
sudo chown -R www-data:www-data /var/www/stphilos/backend/database
```

### Step 4: Build Frontend Production Artifacts
```bash
cd /var/www/stphilos
cp .env.example .env.production
```
Configure `.env.production`:
```ini
VITE_API_BASE_URL=/api/v1
VITE_COLLEGE_NAME="St. Philomena's College (Autonomous)"
VITE_APP_ENV=production
```

Run frontend build:
```bash
npm ci
npm run build
```

### Step 5: Configure Nginx & SSL
Copy the pre-configured Nginx profile:
```bash
sudo cp /var/www/stphilos/deploy/nginx.conf /etc/nginx/sites-available/stphilos.conf
sudo ln -s /etc/nginx/sites-available/stphilos.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

Obtain Let's Encrypt SSL:
```bash
sudo certbot --nginx -d stphilos.ac.in -d www.stphilos.ac.in
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Continuous Deployment & Releases

For future updates, run the automated zero-downtime deployment script:
```bash
chmod +x /var/www/stphilos/deploy/deploy.sh
sudo /var/www/stphilos/deploy/deploy.sh
```

The script automatically:
1. Backs up the current database before any schema change.
2. Pulls verified commits from `main`.
3. Optimizes composer autoloader and caches Laravel config, routes, and views.
4. Executes non-destructive migrations.
5. Builds optimized Vite production assets.
6. Gracefully reloads PHP-FPM and Nginx.

---

## 5. Security & Operational Checklist

- [x] `.env` files with credentials excluded from Git tracking.
- [x] `APP_DEBUG=false` enforced on production.
- [x] HTTP Strict Transport Security (HSTS) and security headers enabled in Nginx.
- [x] Sanctum CSRF and Bearer token rotation configured for administrative sessions.
- [x] Automated hourly database snapshots configured via cron.
- [x] Git LFS initialized for large institutional video assets.
