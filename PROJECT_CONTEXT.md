# Royal Haven Realty & Property Managers Ltd. — Comprehensive System Context & Architecture Guide

> **Important Note for Future Agents / Developers**:  
> This file contains the complete system architecture, operational guidelines, credentials, database schema, business logic, and live production endpoints for the Royal Haven web application. Read this document first when starting a new session on this repository.

---

## 1. Executive Summary & Company Identity
* **Company Legal Name**: Royal Haven Realty & Property Managers Ltd.
* **Slogan**: *"Building Trust. Managing Excellence. Creating Value."*
* **Core Geographic Focus**: Lagos State (Lekki Peninsula, Victoria Island, Ikoyi, Ikeja GRA, Magodo GRA) & Ogun State (Abeokuta, Sagamu, Mowe) Environs, Nigeria.
* **Executive Leadership**:
  * **CEO & Managing Director**: Ibrahim Ridwan Olasunkanmi
  * **Associate Partner & Head of Operations**: Babatunde Ridwan
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
   * **Admin Password**: `royalhaven2026`

---

## 3. Database & Backend Architecture (Supabase)
* **Supabase Project URL**: `https://pspftbflzfkbpndvhike.supabase.co`
* **Environment Variables**:
  * `VITE_SUPABASE_URL`: `https://pspftbflzfkbpndvhike.supabase.co`
  * `VITE_SUPABASE_ANON_KEY`: In `.env` (public client-side key)
* **SQL Schema Files**:
  * `supabase_schema_portal.sql`: The primary 11-table enterprise schema + RLS policies + security functions. **Executed and verified live in cloud** (all tables return HTTP 200).
  * `supabase_schema.sql`: Initial public schema for blog posts and inquiries.

### Entity Hierarchy:
$$\text{Owner} \longrightarrow \text{Property} \longrightarrow \text{Unit} \longrightarrow \text{Tenant} \longrightarrow \text{Lease} \longrightarrow \text{Transaction / Remittance} \longrightarrow \text{Maintenance} \longrightarrow \text{Inspection} \longrightarrow \text{Document}$$

### Relational Tables:
1. `profiles`: Extends Supabase `auth.users` with roles (`super_admin`, `property_manager`, `accountant`, `maintenance_staff`, `property_owner`, `tenant`) and bank account info.
2. `portal_properties`: Managed multi-family complexes, estates, and single-family terraces.
3. `property_owners`: Junction table mapping owners to properties (supports multi-property owners and co-ownership).
4. `units`: Individual flats/apartments with rent amounts, service charges, bed/bath count, and status (`occupied`, `vacant`, `maintenance`).
5. `tenants`: Vetted tenant details, phone numbers, and status.
6. `leases`: Annual lease contracts with commencement and expiration dates.
7. `transactions`: Detailed financial ledger with itemized deductions:
   * Gross Rent Collected
   * Royal Haven Professional Management Fee (10%)
   * Audited Maintenance Deductions
   * Net Remitted to Landlord
   * NIP Interbank Reference Codes
8. `maintenance_requests`: Supervised repairs with before/after photos, vetted artisan names, audited costs, and status badges.
9. `inspections`: Routine physical condition checks, manager field notes, and site photos.
10. `documents`: Encrypted document vault for C of O, Governor's Consent, Survey Plans, and Tenancy Agreements.
11. `audit_logs`: Immutable security audit trail tracking administrative actions.
12. `posts`: CMS for Royal Haven real estate insights & blog articles.
13. `inquiries`: Lead inbox storing consultation requests submitted via the website.

### Row Level Security (RLS) & Isolation:
* Strict PostgreSQL RLS policies enforce that property owners can **only** view records linked to their assigned properties via `property_owners`:
  ```sql
  CREATE POLICY "Owners view assigned properties" ON portal_properties
      FOR SELECT USING (is_owner_of_property(id) OR is_staff());
  ```
* Functions `is_staff()` and `is_owner_of_property(prop_id)` use `SECURITY DEFINER` to guarantee tamper-proof database-level isolation.

---

## 4. Dual-Mode Authentication & Demo Fallback
Implemented in `src/context/AuthContext.jsx` and `src/components/portal/OwnerLogin.jsx`:
1. **Live Cloud Authentication**:
   * Uses Supabase Auth (`supabase.auth.signInWithPassword`).
   * Password reset requests trigger Supabase's transactional email service directly from the login modal.
2. **Instant Interactive Demo Mode**:
   * Designed for immediate client evaluation without setting up a new Supabase user.
   * **Credentials**: `owner@royalhaven.com.ng` / `demo1234`
   * **Profile**: Chief Babatunde Alabi (Zenith Bank PLC: `•••••••• 4812`).
   * Seeded with realistic showcase properties in **Ikeja GRA** (Royal Crest Heights) and **Magodo GRA Phase 2** (Haven Terraces).

---

## 5. UI/UX, Typography & Design Tokens
* **Typography**:
  * **Headings**: `Playfair Display` & `Cinzel` (Google Fonts) — gives a regal, established luxury impression.
  * **Body & Numbers**: `Plus Jakarta Sans` — modern, crisp, and legible across all devices.
* **Color Palette**:
  * **Obsidian**: `#060608` (deepest black background) / `#08080A` (cards & surface) / `#121217` (glassmorphism cards).
  * **Royal Gold**: `#D4AF37` (primary accent), `#F3E5AB` (champagne highlights), `#AA7C11` (shadows).
  * **Emerald**: Completed status badges, verified remittances.
  * **Amber**: Expiration alerts, pending items.
* **Print-to-PDF Engine (`StatementPrintView.jsx`)**:
  * Avoids heavy external PDF libraries (e.g. `jspdf` or `html2pdf`) to keep bundles data-lean.
  * Implements clean CSS `@media print` rules: renders an official statement with Royal Haven letterhead, CAC registration info, itemized deductions, and Managing Director Ibrahim Ridwan Olasunkanmi's executive sign-off.

---

## 6. Admin Portal Capabilities (`AdminPortal.jsx`)
Password: `royalhaven2026`
1. **Articles / Blog CMS**: Create, edit, image-compress, and publish articles.
2. **Property Listings**: Add and manage properties displayed on the public portfolio slider.
3. **Consultation Leads Inbox**: View incoming website leads, mark as contacted, and follow up via direct WhatsApp link.
4. **Owner Remittance Recorder**: Record new rent remittances that immediately post into the Owner Portal ledger.

---

## 7. Key Constraints & Design Rationale
1. **₦0 / $0 Email Strategy**: Client explicitly requested no paid professional email overhead. Handled via Supabase transactional email + pre-filled WhatsApp concierge links.
2. **Data-Lean / Fast Load**: Kept frontend bundle under 850KB. Compressed all uploaded photos before storing in state/localStorage/cloud.
3. **No Localhost Requirement from Client**: The user tests directly on production (`https://www.royalhaven.com.ng`). Never tell the user to test on localhost unless they explicitly request it.
4. **Unambiguous Language**: Avoid developer jargon (e.g., "UUID", "RLS", "mutation") in user-facing UI. Use natural Nigerian real estate terms ("C of O", "Remittance Ledger", "Tenancy File", "Service Charge").

---

## 8. Antigravity & Development Quick Reference
* **Build Command**: `npm run build` (Vite build, output to `dist/`)
* **Dev Server**: `npm run dev` (Vite port 5173)
* **Git Remote**: `origin/main` (`https://github.com/royalhavenmanagers/royalhavenmanagers.git`)
* **Deployment Workflow**:
  ```bash
  git add -A
  git commit -m "Your descriptive commit message"
  git push origin main
  ```
  Vercel automatically triggers and finishes deployment in ~40 seconds.
