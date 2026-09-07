-- ===================================================================
-- ROYAL HAVEN REALTY & PROPERTY MANAGERS LTD.
-- ENTERPRISE OWNER PORTAL & PROPERTY MANAGEMENT SCHEMA
-- ===================================================================
-- Safe to execute in Supabase SQL Editor (Idempotent).
-- Sets up complete Relational Architecture:
-- Owner -> Property -> Unit -> Tenant -> Lease -> Transaction -> Maintenance -> Inspection -> Document
-- With Row Level Security (RLS) enforcing strict backend isolation.

-- -------------------------------------------------------------------
-- 1. EXTENSIONS
-- -------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------
-- 2. USER PROFILES & ROLES
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'property_owner' 
        CHECK (role IN ('super_admin', 'property_manager', 'accountant', 'maintenance_staff', 'property_owner', 'tenant')),
    avatar_url TEXT,
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 3. PROPERTIES TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portal_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Lagos',
    state TEXT NOT NULL DEFAULT 'Lagos State',
    property_type TEXT NOT NULL DEFAULT 'Residential Block',
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_renovation')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 4. PROPERTY OWNERS JUNCTION (Many-to-Many Ownership)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.portal_properties(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ownership_percentage NUMERIC DEFAULT 100 CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, owner_id)
);

-- -------------------------------------------------------------------
-- 5. UNITS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.portal_properties(id) ON DELETE CASCADE,
    unit_number TEXT NOT NULL,
    floor_plan_type TEXT NOT NULL DEFAULT '3-Bedroom Apartment',
    rent_amount NUMERIC NOT NULL DEFAULT 0,
    service_charge NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 6. TENANTS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    emergency_contact TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past', 'evicted')),
    id_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 7. LEASES TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount NUMERIC NOT NULL,
    deposit_amount NUMERIC DEFAULT 0,
    payment_frequency TEXT NOT NULL DEFAULT 'annual' CHECK (payment_frequency IN ('annual', 'bi-annual', 'quarterly', 'monthly')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expiring_soon', 'terminated', 'renewed')),
    agreement_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 8. TRANSACTIONS & REMITTANCES TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.portal_properties(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    lease_id UUID REFERENCES public.leases(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('rent_income', 'service_charge', 'maintenance_expense', 'management_fee', 'owner_remittance')),
    amount NUMERIC NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'reconciled')),
    payment_method TEXT DEFAULT 'Bank Transfer',
    reference_code TEXT,
    description TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 9. MAINTENANCE REQUESTS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.portal_properties(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'plumbing' CHECK (category IN ('plumbing', 'electrical', 'structural', 'painting', 'carpentry', 'ac_cooling', 'other')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'completed', 'cancelled')),
    estimated_cost NUMERIC DEFAULT 0,
    actual_cost NUMERIC DEFAULT 0,
    contractor_name TEXT,
    contractor_phone TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    reported_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- -------------------------------------------------------------------
-- 10. INSPECTIONS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.portal_properties(id) ON DELETE CASCADE,
    inspector_name TEXT NOT NULL,
    inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    overall_condition TEXT NOT NULL DEFAULT 'good' CHECK (overall_condition IN ('pristine', 'good', 'fair', 'needs_repair')),
    notes TEXT,
    report_pdf_url TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 11. DOCUMENTS TABLE (Title deeds, agreements, statements)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.portal_properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('deed_title', 'survey_plan', 'tenancy_agreement', 'financial_statement', 'tax_receipt', 'insurance', 'other')),
    file_url TEXT NOT NULL,
    file_size TEXT,
    is_confidential BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- 12. AUDIT LOGS TABLE
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- 13. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- ===================================================================

-- Check if current authenticated user is Royal Haven staff
CREATE OR REPLACE FUNCTION public.is_staff() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'property_manager', 'accountant', 'maintenance_staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user owns the given property
CREATE OR REPLACE FUNCTION public.is_owner_of_property(p_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.property_owners 
        WHERE property_id = p_id 
        AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- 14. ENABLE RLS ON ALL TABLES
-- ===================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- 15. RLS POLICIES
-- ===================================================================

-- Profiles: Users can view their own profile; staff can view all profiles
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy" ON public.profiles
FOR SELECT USING (id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS "Profiles update self" ON public.profiles;
CREATE POLICY "Profiles update self" ON public.profiles
FOR UPDATE USING (id = auth.uid() OR public.is_staff());

-- Properties: Staff full access; Owners read ONLY their assigned properties
DROP POLICY IF EXISTS "Staff all on portal_properties" ON public.portal_properties;
CREATE POLICY "Staff all on portal_properties" ON public.portal_properties
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select assigned portal_properties" ON public.portal_properties;
CREATE POLICY "Owners select assigned portal_properties" ON public.portal_properties
FOR SELECT USING (public.is_owner_of_property(id));

-- Property Owners junction: Staff full access; Owners read their own mappings
DROP POLICY IF EXISTS "Staff all on property_owners" ON public.property_owners;
CREATE POLICY "Staff all on property_owners" ON public.property_owners
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select their property_owners" ON public.property_owners;
CREATE POLICY "Owners select their property_owners" ON public.property_owners
FOR SELECT USING (owner_id = auth.uid());

-- Units: Staff full access; Owners read units of their properties
DROP POLICY IF EXISTS "Staff all on units" ON public.units;
CREATE POLICY "Staff all on units" ON public.units
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select units" ON public.units;
CREATE POLICY "Owners select units" ON public.units
FOR SELECT USING (public.is_owner_of_property(property_id));

-- Tenants: Staff full access; Owners read tenants of units in their properties
DROP POLICY IF EXISTS "Staff all on tenants" ON public.tenants;
CREATE POLICY "Staff all on tenants" ON public.tenants
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select tenants" ON public.tenants;
CREATE POLICY "Owners select tenants" ON public.tenants
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.leases l
        JOIN public.units u ON l.unit_id = u.id
        WHERE l.tenant_id = public.tenants.id
        AND public.is_owner_of_property(u.property_id)
    )
);

-- Leases: Staff full access; Owners read leases of units in their properties
DROP POLICY IF EXISTS "Staff all on leases" ON public.leases;
CREATE POLICY "Staff all on leases" ON public.leases
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select leases" ON public.leases;
CREATE POLICY "Owners select leases" ON public.leases
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.units u
        WHERE u.id = unit_id
        AND public.is_owner_of_property(u.property_id)
    )
);

-- Transactions: Staff full access; Owners read transactions for their properties
DROP POLICY IF EXISTS "Staff all on transactions" ON public.transactions;
CREATE POLICY "Staff all on transactions" ON public.transactions
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select transactions" ON public.transactions;
CREATE POLICY "Owners select transactions" ON public.transactions
FOR SELECT USING (public.is_owner_of_property(property_id));

-- Maintenance Requests: Staff full access; Owners read maintenance for their properties
DROP POLICY IF EXISTS "Staff all on maintenance_requests" ON public.maintenance_requests;
CREATE POLICY "Staff all on maintenance_requests" ON public.maintenance_requests
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select maintenance_requests" ON public.maintenance_requests;
CREATE POLICY "Owners select maintenance_requests" ON public.maintenance_requests
FOR SELECT USING (public.is_owner_of_property(property_id));

-- Inspections: Staff full access; Owners read inspections for their properties
DROP POLICY IF EXISTS "Staff all on inspections" ON public.inspections;
CREATE POLICY "Staff all on inspections" ON public.inspections
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select inspections" ON public.inspections;
CREATE POLICY "Owners select inspections" ON public.inspections
FOR SELECT USING (public.is_owner_of_property(property_id));

-- Documents: Staff full access; Owners read documents for their properties
DROP POLICY IF EXISTS "Staff all on documents" ON public.documents;
CREATE POLICY "Staff all on documents" ON public.documents
FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Owners select documents" ON public.documents;
CREATE POLICY "Owners select documents" ON public.documents
FOR SELECT USING (public.is_owner_of_property(property_id));

-- Audit Logs: Staff read only
DROP POLICY IF EXISTS "Staff read audit_logs" ON public.audit_logs;
CREATE POLICY "Staff read audit_logs" ON public.audit_logs
FOR SELECT USING (public.is_staff());

-- -------------------------------------------------------------------
-- 16. AUTO-CREATE PROFILE ON AUTH USER SIGNUP
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'property_owner')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
