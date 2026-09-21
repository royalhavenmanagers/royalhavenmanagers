# Royal Haven Realty & Property Managers Ltd.

> Official web platform, Property Owner Portal, Landlord Income Calculator, and Management System for Royal Haven Realty & Property Managers Ltd.  
> **Live Production**: [https://www.royalhaven.com.ng](https://www.royalhaven.com.ng)

---

## 🏛️ Company Identity
* **Legal Entity**: Royal Haven Realty & Property Managers Ltd.
* **Motto**: *"Building Trust. Managing Excellence. Creating Value."*
* **Core Operating Zones**: Lagos State (Lekki, Ikoyi, Victoria Island, Ikeja GRA, Magodo, Ajah) & Ogun State (Abeokuta, Sagamu, Mowe) Environs, Nigeria.
* **Managing Director & CEO**: Ibrahim Ridwan Olasunkanmi (Sole Executive MD & CEO)
* **Diaspora Coverage**: UK, USA, Canada, and global Nigerian diaspora property owners.

---

## 🌐 Live Routes & Access
| Portal / Feature | Live URL | Access Note |
| :--- | :--- | :--- |
| **Public Website** | [`royalhaven.com.ng`](https://www.royalhaven.com.ng/) | Portfolio, company profile, services, executive leadership, knowledge hub |
| **Income Calculator** | [`royalhaven.com.ng/#calculator`](https://www.royalhaven.com.ng/#calculator) | Interactive Landlord Rental Income & Remittance Calculator (NGN, USD, GBP, CAD) |
| **Owner Portal** | [`royalhaven.com.ng/#portal`](https://www.royalhaven.com.ng/#portal) | Real property owner registration & sign in (Live remittances, documents, inspections) |
| **Staff Admin** | [`royalhaven.com.ng/#admin`](https://www.royalhaven.com.ng/#admin) | Password: `royalhaven2026` (Traffic analytics, leads inbox, remittances, document vault, inspection logs) |
| **Direct Article Link** | [`royalhaven.com.ng/?article=slug#blog`](https://www.royalhaven.com.ng/?article=slug#blog) | Instant reading modal deep link with dynamic social media preview cards |

---

## 🚀 Key Modules Built
1. **Landlord Rental Income & Remittance Calculator (`src/components/LandlordCalculator.jsx`)**:
   - Interactive sliders (1 to 24 units) and fast presets (*1 Luxury Flat*, *Duplex*, *Block of 4 Flats*, *8-Unit Building*, *12-Unit Estate*).
   - Multi-currency support: **NGN (₦)**, **USD ($)**, **GBP (£)**, and **CAD (C$)** with realistic default rent ranges.
   - Plain-English financial breakdown: **100% Gross Rent Collected**, **90% Guaranteed Net Remittance** (direct bank deposit), and **10% Royal Haven Management Fee** (transparently covering vetting, rent collection, routine photo inspections, artisan oversight, and tenancy contracts).
   - "Managing On Your Own vs. Royal Haven Managed" side-by-side comparison table.
   - 1-click consultation bridge: automatically pre-fills the Contact Modal with estimated units, rent, and projected take-home income.

2. **Property Owner Portal (`src/components/portal/OwnerPortal.jsx`)**:
   - Executive KPI Dashboard (Units & Occupancy %, Gross Rent Roll, Net Remittances, Maintenance).
   - Multi-Property Selector with real-time property status.
   - Tenancy drill-down files with lease expiration warnings.
   - Itemized Remittance Statements with MD & CAC Signatures (`@media print` PDF).
   - Facility Maintenance Log with before/after photos and vetted contractors.
   - **Routine Physical Inspection Audits**: Live inspection reports with photo evidence.
   - **Asset Document Vault**: 1-click downloading for C of O, Survey Plans, and Tenancy Agreements.

3. **Staff Admin Operations Portal (`src/components/AdminPortal.jsx`)**:
   - Complete property, tenant, lease, and remittance management.
   - **Deletion Safeguards**: High-contrast "Are you sure?" modal dialogs before deleting properties, remittances, documents, or inspections.
   - **Property Deduplication Guard**: Permanent fix preventing property doubling upon new owner account creation.
   - Live Leads Inbox linked directly to website contact and calculator inquiries.

4. **SEO Supercharge & Google Rich Snippets (`index.html`, `public/sitemap.xml`)**:
   - **Google `FAQPage` JSON-LD Schema**: 6 high-intent landlord questions answered in plain English to unlock expandable FAQ accordion snippets on Google Search.
   - **Local Geo-Targeting**: Meta keywords and `areaServed` expanded to include Lekki Phase 1, Ikoyi, Victoria Island, Ikeja GRA, Magodo, Ajah, and Abeokuta.
   - **XML Sitemap**: Canonical URLs, weekly change frequency, and high priority for `#calculator`.

5. **Article Sharing & Dynamic Open Graph Engine (`api/article-preview.js`, `src/components/BlogSection.jsx`)**:
   - Dynamic social preview tags for WhatsApp, Twitter/X, and LinkedIn.
   - Deep-linking (`?article=slug#blog` and `#article/slug`) for instant modal reading.

6. **Website Traffic & Daily Analytics (`src/data/analyticsStore.js`)**:
   - Pageview tracking (Today, Yesterday, Past 7 Days, and All-Time).
   - Interactive 14-day graphical bar chart and daily log table in the Admin Portal.

---

## 📖 System Documentation
For in-depth technical architecture, database schema, and operational setup, see:
* **[`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)** — Complete developer & system context
* **[`TASKS.md`](./TASKS.md)** — Google Search Console, Google Business Profile & DNS setup
* **[`HUMAN_TASKS.md`](./HUMAN_TASKS.md)** — Resend email deliverability & Supabase Auth guide

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
