-- ===================================================================
-- ROYAL HAVEN REALTY & PROPERTY MANAGERS LTD. - SUPABASE DATABASE SETUP
-- ===================================================================
-- Safe to run multiple times (idempotent).
-- Copy and paste this entire file into your Supabase SQL Editor and click "Run".

-- -------------------------------------------------------------------
-- 1. POSTS TABLE (For Blog & Educational Articles in Admin Portal)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    category TEXT,
    cover_image TEXT,
    author TEXT DEFAULT 'Royal Haven Realty & Property Managers Ltd.',
    date TEXT,
    read_time TEXT,
    status TEXT DEFAULT 'published',
    summary TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies before recreating them
DROP POLICY IF EXISTS "Allow public read access to posts" ON public.posts;
DROP POLICY IF EXISTS "Allow full access to posts" ON public.posts;

-- Allow public read access to all articles
CREATE POLICY "Allow public read access to posts" 
ON public.posts 
FOR SELECT 
USING (true);

-- Allow full access for admin operations
CREATE POLICY "Allow full access to posts" 
ON public.posts 
FOR ALL 
USING (true)
WITH CHECK (true);


-- -------------------------------------------------------------------
-- 2. INQUIRIES TABLE (For Website Consultation & Lead Submissions)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    service TEXT,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies before recreating them
DROP POLICY IF EXISTS "Allow anonymous insert on inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow read on inquiries" ON public.inquiries;

-- Allow website visitors to insert inquiries
CREATE POLICY "Allow anonymous insert on inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- Allow reading inquiries
CREATE POLICY "Allow read on inquiries" 
ON public.inquiries 
FOR SELECT 
USING (true);


-- -------------------------------------------------------------------
-- 3. PROPERTIES TABLE (Portfolio & Real Estate Listings)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    property_type TEXT NOT NULL,
    listing_type TEXT NOT NULL DEFAULT 'For Rent',
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    cover_image TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies before recreating them
DROP POLICY IF EXISTS "Public properties read" ON public.properties;
DROP POLICY IF EXISTS "Public properties insert" ON public.properties;
DROP POLICY IF EXISTS "Public properties update" ON public.properties;
DROP POLICY IF EXISTS "Public properties delete" ON public.properties;

CREATE POLICY "Public properties read" 
ON public.properties FOR SELECT 
USING (true);

CREATE POLICY "Public properties insert" 
ON public.properties FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public properties update" 
ON public.properties FOR UPDATE 
USING (true);

CREATE POLICY "Public properties delete" 
ON public.properties FOR DELETE 
USING (true);


-- -------------------------------------------------------------------
-- 4. SEED INITIAL VERIFIED ARTICLES
-- -------------------------------------------------------------------
INSERT INTO public.posts (id, title, slug, category, cover_image, author, date, read_time, status, summary, content)
VALUES 
(
  'blog-1',
  'Key Things Property Owners in Lagos & Ogun State Must Know About Tenant Screening',
  'key-things-about-tenant-screening-lagos-ogun',
  'Tenant Screening',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  'Ibrahim Ridwan Olasunkanmi (CEO & MD)',
  '2026-08-28',
  '4 min read',
  'published',
  'Conducting thorough multi-stage background checks and document verification is the single most effective way to protect your rental income and property integrity.',
  'For real estate owners across Lagos State, Ogun State, and surrounding environs, securing reliable tenants is essential to maintaining property value and guaranteeing consistent rental income.

Relying solely on informal interviews or verbal promises often leads to delayed rent remittances, unmanaged property damage, and legal complications.

The Royal Haven 4-Point Vetting Protocol:
1. Identity & Official Document Verification: Confirming government-issued identification and legal standing.
2. Employment & Income Audit: Verifying stable employment or business registration to ensure rental affordability.
3. Past Landlord & Character References: Auditing past tenancy history for compliance and cleanliness.
4. Custom Tenancy Agreement Drafting: Structuring legally binding agreements that protect the landlord asset rights.

By partnering with professional property managers, landlords ensure peace of mind knowing their property is in reliable hands.'
),
(
  'blog-2',
  'How Professional Property Management Maximizes Rental Yield & Long-Term Asset Value',
  'how-professional-property-management-maximizes-rental-yield',
  'Property Management',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'Ibrahim Ridwan Olasunkanmi (CEO & MD)',
  '2026-08-25',
  '5 min read',
  'published',
  'Routine inspections, proactive maintenance, and transparent financial remittance prevent asset decay while optimizing long-term rental income.',
  'Many landlords assume property management is simply collecting annual rent. In reality, true property management is an active financial safeguard.

Minor plumbing leaks or structural wear left uninspected can quickly escalate into major structural damage. Scheduled physical inspections preserve property standards and prevent costly emergency repairs.

Key Benefits of Professional Management:
- Prompt Rent Remittance: Transparent accounting statements and direct remittance to property owners.
- Vacancy Reduction: Active marketing and quick turnover procedures to keep units occupied.
- Regulatory Compliance: Ensuring compliance with local state housing laws and estate rules.

At Royal Haven Realty & Property Managers Ltd., every property under our care is managed with the exact level of commitment as if it were our own.'
),
(
  'blog-3',
  'The Importance of Accurate Estate Surveying and Valuation Reports Before Investing',
  'importance-of-estate-surveying-and-valuation-reports',
  'Estate Surveying',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'Royal Haven Valuation Team',
  '2026-08-20',
  '6 min read',
  'published',
  'Accurate survey reports and valuation audits support informed decision-making, secure bank financing, and prevent land boundary disputes.',
  'Whether purchasing residential duplexes, apartment complexes, or commercial office spaces, understanding the exact legal boundary and market value of an asset is crucial.

What an Estate Survey & Valuation Covers:
- Boundary Verification: Confirming physical survey beacons against official land registry records.
- Current Market Valuation: Assessing rental income potential, comparable sales data, and structural condition.
- Legal Protection: Verifying title documents (Deed of Assignment, Governor Consent, Certificate of Occupancy).

Professional estate surveying gives investors and property owners total confidence in their acquisitions.'
)
ON CONFLICT (id) DO NOTHING;
