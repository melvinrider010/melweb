# St. Philomena's College (Autonomous), Mysuru
## Official Institutional Web Portal & Administrative CMS

[![CI & Verification Pipeline](https://github.com/melvinrider010/melweb/actions/workflows/ci.yml/badge.svg)](https://github.com/melvinrider010/melweb/actions/workflows/ci.yml)
[![Institution](https://img.shields.io/badge/Institution-St._Philomena's_College-081B4B.svg)](https://stphilos.ac.in)
[![Accreditation](https://img.shields.io/badge/NAAC-A%2B_Grade_(CGPA_3.28)-C9A646.svg)](https://stphilos.ac.in)
[![Status](https://img.shields.io/badge/Affiliation-University_of_Mysore-081B4B.svg)](https://stphilos.ac.in)

> **Live Official Reference:** [https://stphilos.ac.in/](https://stphilos.ac.in/)  
> **Repository:** [https://github.com/melvinrider010/melweb](https://github.com/melvinrider010/melweb)

---

## 🏛️ Project Overview

This repository hosts the full-stack web portal and administrative management system for **St. Philomena's College (Autonomous)**, Mysuru — established in 1946 by Rev. Fr. T. Norohna and managed by the Mysore Diocesan Educational Society (MDES).

The project faithfully models and reconciles the institutional structure, official crawled datasets, historical documents, faculty records, academic courses, dynamic organogram, and administrative publishing workflows.

### 🌟 Core Capabilities

1. **Institutional Public Portal**
   - **Academic Continuum:** Complete UG, PG, Diploma, and Ph.D. degree matrices across 24 departments.
   - **Interactive Interlocking Honeycomb:** Exact 9-block hexagonal programme showcase with floating hover details and mobile fallback.
   - **Institutional Governance & Leadership:** Formal hierarchy spanning Bishop of Mysore (Patron), Rector, Principal, Financial Officer, and IQAC.
   - **Dynamic Organogram:** Multi-tier SVG/Canvas administrative chart with full-tree framing, zoom/pan navigation, high-res PNG/PDF export, and printable layout.
   - **Academics & Departmental CMS:** 24 dedicated department portals featuring faculty directories, infrastructure galleries, syllabus catalogs, and dynamic section editors.
   - **Examinations, NIRF, NAAC & Compliance:** Complete archival disclosures, IQAC minutes, AQAR reports, NEP regulations, and downloadable institutional PDFs.

2. **Administrative Management System (CMS)**
   - **Authentication:** Sanctum token-based authentication with role-based access control (`SUPER_ADMIN`, `IQAC_MANAGER`, `ACADEMIC_MANAGER`, `HOD_DEPARTMENT`).
   - **Canva-Style Administrative Organogram Editor:** Interactive node hierarchy builder, relationship re-parenting, color-coded designations, draft staging, and one-click live publication.
   - **Unified Live Publishing Pipeline:** Direct synchronization from admin drafts to production database tables and public endpoints.
   - **Media & Document Hub:** Secure document uploader with mime-type validation, size verification, and localized storage.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, GSAP 3, Lucide Icons, html2canvas, jspdf |
| **Backend** | Laravel 11 / 13 (PHP 8.3), Laravel Sanctum, SQLite / MySQL / PostgreSQL |
| **Media & Assets** | Git LFS (for large video assets), WebP / JPEG image pipeline |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`), Bash zero-downtime deploy scripts |
| **Web Server** | Nginx reverse proxy with HTTP/2, Let's Encrypt SSL, and PHP-FPM |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or v20+)
- PHP (v8.2 or v8.3+) with `sqlite3`, `mbstring`, `pdo`, `xml`, `iconv`
- Composer (v2+)
- Git & Git LFS

### 1. Clone the Repository
```bash
git clone https://github.com/melvinrider010/melweb.git
cd melweb
git lfs install
git lfs pull
```

### 2. Frontend Setup
```bash
npm install
cp .env.example .env
npm run dev
```
The frontend starts on `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve --port=8000
```
The backend API starts on `http://127.0.0.1:8000`.

---

## 🔐 Administrative Access & Credentials

For local development and testing, default administrative users are seeded in `backend/database/seeders/DatabaseSeeder.php`:

| Role | Username / Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Central Super Administrator** | `admin@stphilos.ac.in` | `SPC_Admin!946#Sec` | Full CMS, Organogram, Departments & Publishing |
| **IQAC Coordinator** | `iqac@stphilos.ac.in` | `SPC_Iqac!2026#Hub` | IQAC, NAAC, NIRF & Compliance modules |
| **Academic Manager** | `academics@stphilos.ac.in` | `SPC_Acad!2026#Mgr` | Courses, Programmes, Syllabi & Admissions |

*Note: In production environments, passwords must be changed immediately via the administrative user manager.*

---

## 📦 Directory Structure

```text
Stphilos/
├── backend/                   # Laravel API application
│   ├── app/                   # Models, Controllers, Policies & Sanctum Auth
│   ├── database/              # Migrations, SQLite database & Seeders
│   ├── routes/api.php         # Versioned REST endpoints (/api/v1)
│   └── composer.json          # PHP package configuration
├── deploy/                    # Production deployment scripts & Nginx configs
├── public/                    # Static assets, institutional PDFs & crawled media
│   ├── assets/                # Logos, department banners, crests & icons
│   ├── media/                 # Campus photographs, notice scans & hero video
│   └── storage/               # Administrative user uploads
├── src/                       # React frontend source code
│   ├── admin/                 # Metronic CMS Admin Portal & Page Editors
│   ├── components/            # Reusable components (Header, Footer, Organogram)
│   ├── data/                  # Institutional JSON datasets (reconciled from stphilos.ac.in)
│   ├── lib/                   # API client, auth context & CMS data stores
│   └── pages/                 # Public website page routes
├── .github/workflows/ci.yml   # GitHub Actions automated build & test workflow
├── .gitattributes             # Git LFS tracking rules
├── .gitignore                 # Exclusion rules for secrets & build outputs
└── package.json               # Node.js project manifest
```

---

## 🚢 Production Deployment

Detailed production deployment instructions for VPS, Cloud hosting, and Nginx reverse proxies are provided in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📄 License & Institutional Copyright

Copyright © 1946–2026 **St. Philomena's College (Autonomous), Mysuru**. All institutional logos, crests, historical photographs, and academic documents are proprietary assets of St. Philomena's College and Mysore Diocesan Educational Society (MDES).
