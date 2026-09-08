# Royal Haven Realty & Property Managers Ltd.

> Official web platform, Property Owner Portal, and Management System for Royal Haven Realty & Property Managers Ltd.  
> **Live Production**: [https://www.royalhaven.com.ng](https://www.royalhaven.com.ng)

---

## 🏛️ Company Identity
* **Legal Entity**: Royal Haven Realty & Property Managers Ltd.
* **Motto**: *"Building Trust. Managing Excellence. Creating Value."*
* **Core Operating Zones**: Lagos State (Lekki, Ikoyi, Victoria Island, Ikeja GRA, Magodo) & Ogun State (Abeokuta, Sagamu, Mowe) Environs, Nigeria.
* **Managing Director & CEO**: Ibrahim Ridwan Olasunkanmi

---

## 🌐 Live Routes & Access
| Portal | Live URL | Access Note |
| :--- | :--- | :--- |
| **Public Website** | [`royalhaven.com.ng`](https://www.royalhaven.com.ng/) | Portfolio, company brochure, services, leadership |
| **Owner Portal** | [`royalhaven.com.ng/#portal`](https://www.royalhaven.com.ng/#portal) | Live Supabase login + 1-Click Instant Demo as Chief Alabi |
| **Staff Admin** | [`royalhaven.com.ng/#admin`](https://www.royalhaven.com.ng/#admin) | Password: `royalhaven2026` (Leads inbox, Remittance recorder, CMS) |

---

## 🚀 Key Modules Built
1. **Property Owner Portal (`src/components/portal/OwnerPortal.jsx`)**:
   - Executive KPI Dashboard (Units & Occupancy %, Gross Rent Roll, Net Remittances, Maintenance).
   - Multi-Property Selector (Ikeja GRA, Magodo GRA Phase 2).
   - Tenancy Drill-down Files with lease expiration warnings.
   - Itemized Remittance Statements with MD & CAC Signatures (`@media print` PDF).
   - Facility Maintenance Log with before/after photos and vetted contractors.
   - Routine Physical Inspection Audits.
   - Encrypted Document Vault (C of O, Tenancy Contracts, Survey Plans).
2. **Zero-Cost Authentication (`src/context/AuthContext.jsx`)**:
   - Live Supabase Cloud Auth + Instant Demo fallback.
   - Free transactional email password reset workflow.
   - One-touch WhatsApp Owner Concierge link.
3. **Database Architecture (`supabase_schema_portal.sql`)**:
   - 11 enterprise relational tables with authentic Row Level Security (RLS) policies.
   - Verified active on Supabase (`pspftbflzfkbpndvhike.supabase.co`).

---

## 📖 Detailed System Architecture & Context
For the complete technical specifications, database schema diagrams, RLS rules, and future agent instructions, see:  
👉 **[`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)**

---

## 💻 Local Development
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev

# Production build
npm run build
```
Deployment is automatic to Vercel upon pushing to the `main` branch of `royalhavenmanagers/royalhavenmanagers`.
