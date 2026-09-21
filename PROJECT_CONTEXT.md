# Royal Haven Realty & Property Managers Ltd. — Comprehensive System Context & Architecture Guide

> **Important Note for Future Agents / Developers**:  
> This file contains the complete system architecture, operational guidelines, credentials, database schema, business logic, and live production endpoints for the Royal Haven web application. Read this document first when starting a new session on this repository.

---

## 1. Executive Summary & Company Identity
* **Company Legal Name**: Royal Haven Realty & Property Managers Ltd.
* **Slogan**: *"Building Trust. Managing Excellence. Creating Value."*
* **Core Geographic Focus**: Lagos State (Lekki Peninsula, Victoria Island, Ikoyi, Ikeja GRA, Magodo GRA, Ajah) & Ogun State (Abeokuta, Sagamu, Mowe) Environs, Nigeria.
* **Executive Leadership**:
  * **CEO & Managing Director**: Ibrahim Ridwan Olasunkanmi (Sole Executive MD & CEO)
* **Official Contact**:
  * **Phones**: `+234 815 378 5297`, `+234 812 085 0733`
  * **WhatsApp Concierge**: `+234 815 378 5297` (`2348153785297`)
  * **Email**: `royalhavenrealtyproperty@gmail.com`
  * **Primary Domain**: `www.royalhaven.com.ng`

---

## 2. Live Deployments & URLs
* **Production Live Site**: [https://www.royalhaven.com.ng](https://www.royalhaven.com.ng)
* **Hosting Platform**: Vercel (Auto-deploys from GitHub `main` branch).
* **GitHub Repository**: `https://github.com/royalhavenmanagers/royalhavenmanagers.git`
* **Vercel Routing**: Configured via `vercel.json` with SPA catch-all rewrites (`/((?!assets/|images/|.*\\..*).*)` $\rightarrow$ `/index.html`) to prevent 404 errors on direct browser navigation or reload.

### Key Navigation Routes:
1. **Public Marketing Website**: `https://www.royalhaven.com.ng/`
2. **Interactive Income Calculator**: `https://www.royalhaven.com.ng/#calculator`
3. **Property Owner Portal**: `https://www.royalhaven.com.ng/#portal` (or `/portal`)
4. **Staff Admin Portal**: `https://www.royalhaven.com.ng/#admin` (or `/admin`)
   * **Admin Master Password**: `royalhaven2026`
5. **Direct Article Deep Links**:
   * Format A: `https://www.royalhaven.com.ng/?article=slug#blog`
   * Format B: `https://www.royalhaven.com.ng/#article/slug`

---

## 3. Landlord Rental Income & Remittance Calculator
* **Component File**: `src/components/LandlordCalculator.jsx`
* **Purpose**: Allows landlords and diaspora property owners to calculate their net rental income dynamically before signing with Royal Haven.
* **Core Mechanics**:
  * **Currencies**: Supports NGN (₦), USD ($), GBP (£), and CAD (C$) with tailored unit rent ranges.
  * **Unit Sliders & Presets**: 1 to 24 units with fast preset configurations (*1 Luxury Flat*, *Duplex*, *Block of 4 Flats*, *8-Unit Building*, *12-Unit Estate*).
  * **Calculations**:
    $$\text{Total Gross Annual Rent} = \text{Units} \times \text{Rent Per Unit}$$
    $$\text{Owner Net Annual Remittance (90\%)} = \text{Total Gross Annual Rent} \times 0.90$$
    $$\text{Management Fee (10\%)} = \text{Total Gross Annual Rent} \times 0.10$$
    $$\text{Owner Monthly Average} = \frac{\text{Owner Net Annual Remittance}}{12}$$
  * **Plain-English Explanations**: Eliminates financial jargon ("cap rates", "amortization") in favor of clear terminology: *Total Rent Collected*, *What You Receive (Direct Bank Deposit)*, and *What the 10% Fee Covers* (tenant vetting, on-time collection, routine photo inspections, artisan oversight, and tenancy contracts).
  * **Side-by-Side Comparison**: Contrasts the headaches of self-managing against hands-free Royal Haven management.
  * **Direct Lead Bridge**: The "Have Royal Haven Manage My Property" button opens `ContactModal.jsx` with pre-filled estimates of units, expected rent, and estimated payout.

---

## 4. SEO Supercharge & Google Rich Snippets
* **Google `FAQPage` JSON-LD Schema** (`index.html`):
  * Features 6 plain-English questions addressing common landlord inquiries (management fees, diaspora property monitoring, tenant screening, remittance speed, coverage areas, maintenance handling).
  * Enables Google to generate expandable accordion rich snippets directly on search engine results pages (SERPs).
* **Enhanced Geo-Targeting & Meta Tags**:
  * Targets prime corridors: Lekki Phase 1, Ikoyi, Victoria Island, Ikeja GRA, Magodo, Ajah, Surulere, and Abeokuta.
  * Captures high-intent search phrases: *"Landlord Rental Income Calculator Lagos"*, *"Diaspora Landlord Nigeria"*, *"Property Management Remittance Lekki"*.
* **XML Sitemap** (`public/sitemap.xml`):
  * Fully indexed canonical routes with `#calculator` prioritized at `0.95`.

---

## 5. Portal & Data Architecture (`portalStore.js`)
* **State Management**: Dual-engine architecture operating with instant offline `localStorage` fallback and asynchronous Supabase cloud sync.
* **Key Modules**:
  * **Secure Asset Document Vault**: 1-click downloading and previewing for C of O, Survey Plans, Tenancy Agreements, and Financial Statements.
  * **Routine Inspection Sessions**: Photo-verified quarterly/annual physical property audits with manager notes.
  * **Safe Deletion Safeguards**: Modal confirmation dialogs ("Are you sure?") prevent accidental deletion of properties, remittances, documents, or inspections.
  * **Property Deduplication**: Idempotent property addition and `Set` deduplication on owner accounts permanently prevents property doubling upon account creation.

---

## 6. Database & Backend Architecture (Supabase)
* **Supabase Project URL**: `https://pspftbflzfkbpndvhike.supabase.co`
* **Environment Variables & Safe Fallbacks**: Configured in `src/lib/supabaseClient.js` with public fallbacks to ensure zero build or runtime failures.
* **SQL Schema Files**:
  * `supabase_schema_portal.sql`: 11-table enterprise schema + RLS policies + security functions.
  * `supabase_schema.sql`: Public schema for blog posts and inquiries.

### Entity Hierarchy:
$$\text{Owner} \longrightarrow \text{Property} \longrightarrow \text{Unit} \longrightarrow \text{Tenant} \longrightarrow \text{Lease} \longrightarrow \text{Transaction / Remittance} \longrightarrow \text{Maintenance} \longrightarrow \text{Inspection} \longrightarrow \text{Document}$$

---

## 7. Article Sharing & Dynamic Open Graph Engine
* **Serverless Social Preview Engine** (`api/article-preview.js`, `vercel.json`):
  * When articles are shared on WhatsApp, Twitter/X, or LinkedIn via `/article/:slug`, dynamic Open Graph meta tags render the article's actual cover image and summary.
  * Human visitors are seamlessly redirected to `/?article=:slug#blog` to open the full interactive reading modal.
* **Share Toolbar**: Native copy-link with toast feedback and 1-click dispatch to WhatsApp, Twitter, and LinkedIn.

---

## 8. Development & Deployment Quick Reference
* **Build Command**: `npm run build` (Vite build, outputs to `dist/`)
* **Dev Server**: `npm run dev` (Vite port 5173)
* **Git Remote**: `origin/main` (`https://github.com/royalhavenmanagers/royalhavenmanagers.git`)
* **Deployment Workflow**:
  ```powershell
  git add . ; git commit -m "Your descriptive message" ; git push origin main
  ```
  Vercel automatically triggers and deploys live to `https://www.royalhaven.com.ng`.
