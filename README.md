# Royal Haven Realty & Property Managers Ltd.

> Official web platform, Property Owner Portal, and Management System for Royal Haven Realty & Property Managers Ltd.  
> **Live Production**: [https://www.royalhaven.com.ng](https://www.royalhaven.com.ng)

---

## 🏛️ Company Identity
* **Legal Entity**: Royal Haven Realty & Property Managers Ltd.
* **Motto**: *"Building Trust. Managing Excellence. Creating Value."*
* **Core Operating Zones**: Lagos State (Lekki, Ikoyi, Victoria Island, Ikeja GRA, Magodo) & Ogun State (Abeokuta, Sagamu, Mowe) Environs, Nigeria.
* **Managing Director & CEO**: Ibrahim Ridwan Olasunkanmi (Sole Executive MD & CEO)

---

## 🌐 Live Routes & Access
| Portal | Live URL | Access Note |
| :--- | :--- | :--- |
| **Public Website** | [`royalhaven.com.ng`](https://www.royalhaven.com.ng/) | Portfolio, company profile, services, single MD leadership, knowledge hub |
| **Owner Portal** | [`royalhaven.com.ng/#portal`](https://www.royalhaven.com.ng/#portal) | Real property owner registration & sign in |
| **Staff Admin** | [`royalhaven.com.ng/#admin`](https://www.royalhaven.com.ng/#admin) | Password: `royalhaven2026` (Website traffic analytics, leads inbox, remittances, CMS) |
| **Direct Article Link** | [`royalhaven.com.ng/?article=slug#blog`](https://www.royalhaven.com.ng/?article=slug#blog) | Instant reading modal deep link |

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
2. **Real Property Owner Authentication (`src/context/AuthContext.jsx`)**:
   - 100% Real Account registration & login (zero demo accounts).
   - Instant activation upon registration without email verification blockers.
   - One-touch WhatsApp Owner Concierge link.
3. **Article Sharing & Knowledge Hub (`src/components/BlogSection.jsx`)**:
   - Direct link copy with live toast confirmation.
   - One-click sharing to WhatsApp, Twitter/X, and LinkedIn.
   - Deep-linking (`?article=slug#blog` and `#article/slug`) for instant article opening.
4. **Website Traffic & Daily Analytics (`src/data/analyticsStore.js`)**:
   - Daily pageview tracking (Today, Yesterday, Past 7 Days, and All-Time).
   - Interactive 14-day graphical bar chart and daily log table in the Admin Portal.
5. **Database Architecture (`supabase_schema_portal.sql`)**:
   - 11 enterprise relational tables with authentic Row Level Security (RLS) policies.
   - Safe fallbacks for zero downtime.

---

## 📖 Detailed System Architecture & Context
For complete technical specifications, database schema diagrams, and developer instructions, see:  
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
