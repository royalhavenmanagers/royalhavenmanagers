# System Context and Architecture Guide

This document outlines the architecture, business logic, endpoints, and credentials for Royal Haven Realty & Property Managers Ltd.

---

## 1. Company Information

- Company Name: Royal Haven Realty & Property Managers Ltd.
- Slogan: Building Trust. Managing Excellence. Creating Value.
- Core Operating Zones: Lagos State (Lekki, Ikoyi, Victoria Island, Ikeja GRA, Magodo, Ajah) and Ogun State (Abeokuta, Sagamu, Mowe)
- CEO and Managing Director: Ibrahim Ridwan Olasunkanmi
- Official Phones: +234 815 378 5297, +234 812 085 0733
- WhatsApp: +234 815 378 5297
- Official Email: royalhavenrealtyproperty@gmail.com
- Domain: www.royalhaven.com.ng

---

## 2. Live Deployments and Routes

- Live Site: https://www.royalhaven.com.ng
- GitHub Repository: https://github.com/royalhavenmanagers/royalhavenmanagers.git
- Hosting: Vercel (connected to main branch)
- Single Page Application routing handled through vercel.json rewrites

### Main Routes
- Homepage: https://www.royalhaven.com.ng/
- Landlord Calculator: https://www.royalhaven.com.ng/#calculator
- Owner Portal: https://www.royalhaven.com.ng/#portal (or /portal)
- Admin Portal: https://www.royalhaven.com.ng/#admin (Password: royalhaven2026)
- Article Links: https://www.royalhaven.com.ng/?article=slug#blog

---

## 3. Landlord Rental Income Calculator

Component file: src/components/LandlordCalculator.jsx

This tool helps property owners calculate their expected returns before onboarding.

Key points:
- Supports four currencies: NGN, USD, GBP, and CAD
- Sliders for unit count (1 to 24) and rent per unit
- Quick presets for apartments, duplexes, blocks of flats, and estates
- Calculations:
  - Total Gross Rent: Units multiplied by rent per unit
  - Owner Net Payout: 90% of total rent, deposited to the owner bank account
  - Management Fee: 10% of total rent
  - Monthly Average: Annual net payout divided by 12
- Plain English explanations showing what the 10% fee covers: tenant vetting, rent collection, routine photo inspections, artisan oversight, and tenancy agreements
- Clear side-by-side comparison between self-managing and professional management
- A direct button that pre-fills the ContactModal with the calculated figures

---

## 4. Search Engine Optimization and Structured Data

Implementation files: index.html, public/sitemap.xml

- Google FAQPage Schema: Includes 6 common landlord questions and answers in plain English, enabling Google to show accordion snippets in search results
- Local Geo-targeting: Targets searches in Lekki Phase 1, Ikoyi, Victoria Island, Ikeja GRA, Magodo, Ajah, and Abeokuta
- XML Sitemap: Canonical links with weekly update frequency and high priority for the calculator

---

## 5. Portal Architecture and Data Storage

Implementation file: src/data/portalStore.js

Dual storage model using persistent localStorage with optional Supabase cloud synchronization.

Key features:
- Document Vault: Landlords can view and download title deeds, survey plans, and tenancy contracts
- Routine Inspections: Photo-backed inspection reports accessible in both the Admin and Landlord portals
- Safe Deletions: Confirmation prompts before deleting properties, remittances, documents, or inspections
- Account Deduplication: Automated checks prevent duplicate property listings when accounts are created

---

## 6. Database and Backend

Supabase project URL: https://pspftbflzfkbpndvhike.supabase.co

Data hierarchy:
Owner -> Property -> Unit -> Tenant -> Lease -> Transaction -> Maintenance -> Inspection -> Document

Relational tables:
- profiles: User accounts and banking details
- portal_properties: Managed buildings and complexes
- units: Flats, apartments, and suites
- tenants: Tenant profiles and contact information
- leases: Tenancy contracts and dates
- transactions: Remittance ledger with itemized breakdown
- maintenance_requests: Repair logs and contractor details
- inspections: Routine property audit reports and photos
- documents: Digital vault records
- posts: Blog articles and guides
- inquiries: Contact and calculator leads

---

## 7. Article Sharing Engine

Files: api/article-preview.js, vercel.json, src/components/BlogSection.jsx

- Dynamic social preview tags generated for WhatsApp, Twitter, and LinkedIn
- Visiting an article link opens the reading modal directly
- Share toolbar includes one-click buttons for WhatsApp, Twitter, LinkedIn, and copying direct links

---

## 8. Development Commands

- Install packages: npm install
- Start local server: npm run dev
- Build for production: npm run build
- Deploy: git push origin main
