-- =============================================================================
-- 001_initial_schema.sql
-- Initial database schema for ListingFlow real estate platform
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USER MANAGEMENT (SSO-Aware)
-- =============================================================================

-- Enhanced profiles (extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    company TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'agent', 'admin')),
    
    -- Address information
    street_address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    
    -- Preferences and settings
    notification_method TEXT DEFAULT 'email' CHECK (notification_method IN ('email', 'sms', 'both', 'none')),
    timezone TEXT DEFAULT 'America/Chicago',
    locale TEXT DEFAULT 'en-US',
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- SSO and metadata
    auth_provider_data JSONB,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track linked authentication providers
CREATE TABLE auth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'apple', 'facebook', 'email')),
    provider_user_id TEXT,
    provider_email TEXT,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(user_id, provider)
);

-- User activity tracking
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CORE LISTING TABLES
-- =============================================================================

-- Main properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete', 'published', 'sold', 'withdrawn')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    last_saved_step TEXT,
    listing_id TEXT, -- MLS listing ID when published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- Track form completion progress
CREATE TABLE form_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    form_name TEXT NOT NULL,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, form_name)
);

-- =============================================================================
-- FORM DATA TABLES
-- =============================================================================

-- 1. Basic Information (1-to-1 with property)
CREATE TABLE basic_information (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    
    -- Address fields
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    full_address TEXT,
    
    -- Property specs (individual fields for Zoho CRM mapping)
    property_type TEXT CHECK (property_type IN ('residential', 'condo', 'townhome', 'halfDuplex', 'land')),
    bedrooms INTEGER,
    bathrooms_full INTEGER,
    bathrooms_half INTEGER,
    square_feet INTEGER,
    square_footage_source TEXT,
    square_footage_source_other TEXT,
    lot_size INTEGER,
    year_built INTEGER,
    garage TEXT CHECK (garage IN ('none', '1', '2', '3', '4', '5+')),
    covered_parking TEXT,
    covered_parking_other_description TEXT,
    covered_parking_electricity TEXT CHECK (covered_parking_electricity IN ('none', '120v', '220v', 'unknown')),
    pool TEXT CHECK (pool IN ('none', 'community', 'in-ground', 'above-ground', 'spa-only')),
    has_existing_survey BOOLEAN,
    occupancy_status TEXT CHECK (occupancy_status IN ('owner-occupied', 'non-owner-occupied', 'vacant')),
    occupancy_vacate_plans TEXT,
    occupancy_vacant_duration TEXT
);

-- 2. Title Holder Info (form-level data, 1-to-1 with property)
CREATE TABLE title_holder_info (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    owned_less_than_two_years TEXT CHECK (owned_less_than_two_years IN ('yes', 'no')),
    has_homestead_exemption TEXT CHECK (has_homestead_exemption IN ('yes', 'no', 'dont-know')),
    is_property_insured TEXT CHECK (is_property_insured IN ('yes', 'no')),
    number_of_owners TEXT CHECK (number_of_owners IN ('1', '2', '3', '4'))
);

-- 3. Title Holders (1 property → MANY owners)
CREATE TABLE title_holders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    has_capacity TEXT CHECK (has_capacity IN ('yes', 'no')),
    involved_in_divorce TEXT CHECK (involved_in_divorce IN ('yes', 'no')),
    is_non_us_citizen TEXT CHECK (is_non_us_citizen IN ('yes', 'no')),
    display_order INTEGER
);

-- 4. Financial Info (form-level data, 1-to-1 with property)
CREATE TABLE financial_info (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    has_current_mortgage TEXT CHECK (has_current_mortgage IN ('yes', 'no')),
    number_of_mortgages TEXT CHECK (number_of_mortgages IN ('1', '2', '3', '4')),
    property_taxes_current TEXT CHECK (property_taxes_current IN ('yes', 'no')),
    needs_leaseback TEXT CHECK (needs_leaseback IN ('yes', 'no')),
    net_proceeds_more_important TEXT CHECK (net_proceeds_more_important IN ('yes', 'no')),
    has_open_insurance_claims TEXT CHECK (has_open_insurance_claims IN ('yes', 'no')),
    paid_for_roof_not_replaced TEXT CHECK (paid_for_roof_not_replaced IN ('yes', 'no')),
    has_lis_pendens TEXT CHECK (has_lis_pendens IN ('yes', 'no')),
    lis_pendens_sale_date DATE,
    has_non_mortgage_liens TEXT CHECK (has_non_mortgage_liens IN ('yes', 'no')),
    lien_details TEXT
);

-- 5. Mortgages (1 property → MANY mortgages)
CREATE TABLE mortgages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    mortgage_position INTEGER CHECK (mortgage_position IN (1, 2, 3, 4)),
    prefer_mortgage_statement TEXT CHECK (prefer_mortgage_statement IN ('statement', 'questions')),
    mortgage_statement_file_url TEXT,
    lender_name TEXT,
    mortgage_balance DECIMAL(12,2),
    monthly_payment DECIMAL(8,2),
    interest_rate DECIMAL(5,3),
    taxes_insurance_escrowed TEXT CHECK (taxes_insurance_escrowed IN ('yes', 'no')),
    loan_modified_last_12_months TEXT CHECK (loan_modified_last_12_months IN ('yes', 'no')),
    UNIQUE(property_id, mortgage_position)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User and property indexes
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_form_progress_property_id ON form_progress(property_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);

-- Form data indexes
CREATE INDEX idx_title_holders_property_id ON title_holders(property_id);
CREATE INDEX idx_mortgages_property_id ON mortgages(property_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE basic_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_holder_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Properties: Users can only access their own properties
CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties" ON properties
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties" ON properties
    FOR DELETE USING (auth.uid() = user_id);

-- Form Progress: Users can only access their own property forms
CREATE POLICY "Users can view own form progress" ON form_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = form_progress.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own form progress" ON form_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = form_progress.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Basic Information: Users can only access their own property data
CREATE POLICY "Users can view own basic information" ON basic_information
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = basic_information.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own basic information" ON basic_information
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = basic_information.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Apply similar RLS policies to all form tables
-- Title Holder Info
CREATE POLICY "Users can view own title holder info" ON title_holder_info
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = title_holder_info.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own title holder info" ON title_holder_info
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = title_holder_info.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Title Holders
CREATE POLICY "Users can view own title holders" ON title_holders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = title_holders.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own title holders" ON title_holders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = title_holders.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Financial Info
CREATE POLICY "Users can view own financial info" ON financial_info
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = financial_info.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own financial info" ON financial_info
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = financial_info.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Mortgages
CREATE POLICY "Users can view own mortgages" ON mortgages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = mortgages.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own mortgages" ON mortgages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = mortgages.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Auth Providers and User Activity
CREATE POLICY "Users can view own auth providers" ON auth_providers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own auth providers" ON auth_providers
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user activity" ON user_activity
    FOR INSERT WITH CHECK (true); -- Allow system to log activity

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTIONS FOR USER PROFILE MANAGEMENT
-- =============================================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, email_verified, created_at)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.email_confirmed_at IS NOT NULL,
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to sync email updates from auth.users to profiles
CREATE OR REPLACE FUNCTION sync_user_email() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET 
        email = NEW.email,
        email_verified = NEW.email_confirmed_at IS NOT NULL,
        updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync email changes
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION sync_user_email();