# Royal Haven Realty & Property Managers Ltd. — Comprehensive System Context & Architecture Guide

> **Important Note for Future Agents / Developers**:  
> This file contains the complete system architecture, operational guidelines, credentials, database schema, business logic, and live production endpoints for the Royal Haven web application. Read this document first when starting a new session on this repository.

---

## 1. Executive Summary & Company Identity
* **Company Legal Name**: Royal Haven Realty & Property Managers Ltd.
* **Slogan**: *"Building Trust. Managing Excellence. Creating Value."*
* **Core Geographic Focus**: Lagos State (Lekki Peninsula, Victoria Island, Ikoyi, Ikeja GRA, Magodo GRA) & Ogun State (Abeokuta, Sagamu, Mowe) Environs, Nigeria.
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
2. **Property Owner Portal**: `https://www.royalhaven.com.ng/#portal` (or `/portal`)
3. **Staff Admin Portal**: `https://www.royalhaven.com.ng/#admin` (or `/admin`)
   * **Admin Master Password**: `royalhaven2026`
4. **Direct Article Deep Links**:
   * Format A: `https://www.royalhaven.com.ng/?article=slug#blog`
   * Format B: `https://www.royalhaven.com.ng/#article/slug`

---

## 3. Database & Backend Architecture (Supabase)
* **Supabase Project URL**: `https://pspftbflzfkbpndvhike.supabase.co`
* **Environment Variables & Safe Fallbacks**:
  * Configured in `src/lib/supabaseClient.js` with hardcoded public fallbacks to ensure Vercel production deployments never fail due to missing `.env` files.
* **SQL Schema Files**:
  * `supabase_schema_portal.sql`: The primary 11-table enterprise schema + RLS policies + security functions.
  * `supabase_schema.sql`: Initial public schema for blog posts and inquiries.

### Entity Hierarchy:
$$\text{Owner} \longrightarrow \text{Property} \longrightarrow \text{Unit} \longrightarrow \text{Tenant} \longrightarrow \text{Lease} \longrightarrow \text{Transaction / Remittance} \longrightarrow \text{Maintenance} \longrightarrow \text{Inspection} \longrightarrow \text{Document}$$

### Relational Tables:
1. `profiles`: Extends Supabase `auth.users` with roles (`property_owner`, `property_manager`, `super_admin`) and bank remittance accounts.
2. `portal_properties`: Managed residential complexes, blocks of flats, and terraces.
3. `property_owners`: Junction table mapping owners to properties.
4. `units`: Individual apartments with rent amounts, service charges, bed/bath counts, and status (`occupied`, `vacant`).
5. `tenants`: Vetted tenant details, phone numbers, and lease statuses.
6. `leases`: Annual lease contracts with commencement and expiration dates.
7. `transactions`: Detailed financial ledger with itemized deductions:
   * Gross Rent Collected
   * Royal Haven Professional Management Fee (10%)
   * Audited Maintenance Deductions
   * Net Remitted to Property Owner
   * NIP Interbank Reference Codes
8. `maintenance_requests`: Supervised repairs with before/after photos, artisan names, and audited costs.
9. `inspections`: Routine physical condition checks and manager field notes.
10. `documents`: Encrypted document vault for C of O, Survey Plans, and Tenancy Agreements.
11. `posts`: CMS for Royal Haven real estate insights & educational articles.
12. `inquiries`: Consultation leads submitted via the website.

---

## 4. Property Owner Authentication (100% Real Accounts)
Implemented in `src/context/AuthContext.jsx` and `src/components/portal/OwnerLogin.jsx`:
* **Zero Demo Accounts**: No mock logins, no prefill buttons, and no fake accounts.
* **Instant Verification**: When a property owner registers (`Full Name`, `Email`, `Phone`, `Password`, `Bank Name`, `Account Number`, `Account Name`), the account is created and verified immediately.
* **No Email Verification Blocker**: Prevents users from being locked out by missing email confirmations or third-party SMTP limits.
* **Automatic Cloud Sync**: Syncs with Supabase in the background while keeping full local persistence.
* **Admin Registration**: The Master Admin can also register client accounts in `#admin` and send them their login credentials directly.

---

## 5. Article Sharing & Deep Linking Engine
Implemented in `src/components/BlogSection.jsx`:
* **Share Toolbar**: Every article includes one-click sharing for:
  * **WhatsApp**: Formatted message with article title and direct link.
  * **Twitter / X**: Pre-composed tweet with title and link.
  * **LinkedIn**: Direct URL sharing to professional networks.
  * **Copy Direct Link**: Interactive button with a "Link Copied!" toast.
* **Deep Linking**: Supports both `?article=slug#blog` and `#article/slug`. Visiting the link opens the article modal directly in full-reading view.

---

## 6. Website Traffic & Analytics (`analyticsStore.js`)
* **Tracking**: Automatically records daily pageviews and visitor sessions upon website entry.
* **Admin Dashboard Integration** (`AdminPortal.jsx`):
  * **Top Metrics Ribbon**: Displays Today's Pageviews (Live badge), Yesterday's Views, Past 7 Days Total, and All-Time Views.
  * **Dedicated Traffic Tab**: Displays a 14-day graphical bar chart highlighting today's traffic in gold, a daily log table with percentage breakdowns, and a "Test Visitor View (+1)" simulator button.

---

## 7. UI/UX, Typography & Design Tokens
* **Typography**:
  * **Headings**: `Playfair Display` & `Cinzel` (Google Fonts) — gives a regal, established luxury impression.
  * **Body & Numbers**: `Plus Jakarta Sans` — modern, crisp, and legible across all devices.
* **Color Palette**:
  * **Obsidian**: `#060608` (deepest black background) / `#08080A` (cards & surface) / `#121217` (glassmorphism cards).
  * **Royal Gold**: `#D4AF37` (primary accent), `#F3E5AB` (champagne highlights), `#AA7C11` (shadows).
  * **Emerald**: Completed status badges, verified remittances.
  * **Amber**: Expiration alerts, pending items.
* **Print-to-PDF Engine (`StatementPrintView.jsx`)**:
  * Clean CSS `@media print` rules render official statements with Royal Haven letterhead, CAC registration info, itemized deductions, and Managing Director Ibrahim Ridwan Olasunkanmi's executive sign-off.

---

## 8. Development & Deployment Quick Reference
* **Build Command**: `npm run build` (Vite build, output to `dist/`)
* **Dev Server**: `npm run dev` (Vite port 5173)
* **Git Remote**: `origin/main` (`https://github.com/royalhavenmanagers/royalhavenmanagers.git`)
* **Deployment Workflow**:
  ```powershell
  git add . ; git commit -m "Your descriptive message" ; git push origin main
  ```
  Vercel automatically triggers and deploys live to `https://www.royalhaven.com.ng`.
