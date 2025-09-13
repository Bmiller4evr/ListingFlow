-- =============================================================================
-- 002_form_schemas.sql
-- Complete form schemas for all remaining listing creation forms
-- =============================================================================

-- 6. Listing Price (1-to-1 with property)
CREATE TABLE listing_price (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    video_watched BOOLEAN DEFAULT FALSE,
    price_submitted BOOLEAN DEFAULT FALSE,
    desired_price DECIMAL(12,2),
    price_justification TEXT,
    marketing_strategy TEXT CHECK (marketing_strategy IN ('aggressive', 'competitive', 'conservative')),
    flexibility_level TEXT CHECK (flexibility_level IN ('firm', 'somewhat-flexible', 'very-flexible')),
    timeframe_motivation TEXT,
    additional_notes TEXT,
    accept_unrepresented_buyers TEXT CHECK (accept_unrepresented_buyers IN ('yes', 'no')),
    buyer_agent_commission DECIMAL(5,3)
);

-- 7. Listing Service (1-to-1 with property)
CREATE TABLE listing_service (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    service_type TEXT CHECK (service_type IN ('self-service', 'full-service')),
    terms_accepted BOOLEAN DEFAULT FALSE,
    stripe_payment_method_id TEXT,
    cardholder_name TEXT,
    billing_street TEXT,
    billing_city TEXT,
    billing_state TEXT,
    billing_zip_code TEXT
);

-- 8. Property Media (1-to-1 with property)
CREATE TABLE property_media (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    video_watched BOOLEAN DEFAULT FALSE,
    media_choice TEXT CHECK (media_choice IN ('schedule', 'own')),
    photography_scheduled BOOLEAN DEFAULT FALSE,
    scheduled_date DATE,
    time_slot TEXT,
    trip_charge_acknowledgment BOOLEAN DEFAULT FALSE,
    virtual_tour BOOLEAN DEFAULT FALSE,
    drone_photos BOOLEAN DEFAULT FALSE,
    twilight_photos BOOLEAN DEFAULT FALSE,
    floor_plan BOOLEAN DEFAULT FALSE,
    media_pending BOOLEAN DEFAULT FALSE
);

-- 9. Additional Information (1-to-1 with property)
CREATE TABLE additional_information (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    
    -- MUD (Municipal Utility District) Information
    is_in_mud TEXT CHECK (is_in_mud IN ('yes', 'no')),
    mud_information_method TEXT CHECK (mud_information_method IN ('statement', 'questions')),
    mud_district_name TEXT,
    mud_district_address TEXT,
    mud_district_phone TEXT,
    mud_tax_rate TEXT,
    mud_bonded_debt TEXT,
    mud_assessed_valuation TEXT,
    mud_file_url TEXT,
    
    -- PID (Public Improvement District) Information  
    is_in_pid TEXT CHECK (is_in_pid IN ('yes', 'no')),
    pid_information_method TEXT CHECK (pid_information_method IN ('statement', 'questions')),
    pid_district_name TEXT,
    pid_district_address TEXT,
    pid_district_phone TEXT,
    pid_tax_rate TEXT,
    pid_bonded_debt TEXT,
    pid_assessed_valuation TEXT,
    pid_file_url TEXT,
    
    -- HOA Information
    is_in_hoa TEXT CHECK (is_in_hoa IN ('yes', 'no')),
    
    -- Other Property Information
    fixture_leases TEXT[], -- Array of selected fixture lease items
    mineral_rights TEXT CHECK (mineral_rights IN ('severed', 'ongoing-lease', 'none')),
    insurance_claims TEXT CHECK (insurance_claims IN ('yes', 'no')),
    insurance_proceeds TEXT CHECK (insurance_proceeds IN ('yes', 'no')),
    insurance_proceeds_details TEXT,
    relocation_company TEXT CHECK (relocation_company IN ('yes', 'no'))
);

-- 10. Seller Disclosure (1-to-1 with property) - Massive Texas-specific form
CREATE TABLE seller_disclosure (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    exemption_status TEXT,
    
    -- Property Features (Y/N/U - Yes/No/Unknown)
    air_conditioning TEXT CHECK (air_conditioning IN ('Y', 'N', 'U')),
    security_system TEXT CHECK (security_system IN ('Y', 'N', 'U')),
    fire_detection TEXT CHECK (fire_detection IN ('Y', 'N', 'U')),
    intercom_system TEXT CHECK (intercom_system IN ('Y', 'N', 'U')),
    tv_antenna TEXT CHECK (tv_antenna IN ('Y', 'N', 'U')),
    cable_tv_wiring TEXT CHECK (cable_tv_wiring IN ('Y', 'N', 'U')),
    satellite_dish TEXT CHECK (satellite_dish IN ('Y', 'N', 'U')),
    ceiling_fans TEXT CHECK (ceiling_fans IN ('Y', 'N', 'U')),
    attic_fan TEXT CHECK (attic_fan IN ('Y', 'N', 'U')),
    exhaust_fan TEXT CHECK (exhaust_fan IN ('Y', 'N', 'U')),
    appliances TEXT CHECK (appliances IN ('Y', 'N', 'U')),
    window_screens TEXT CHECK (window_screens IN ('Y', 'N', 'U')),
    automatic_lawn_sprinkler TEXT CHECK (automatic_lawn_sprinkler IN ('Y', 'N', 'U')),
    automatic_garage_door_opener TEXT CHECK (automatic_garage_door_opener IN ('Y', 'N', 'U')),
    garage_door_controls TEXT CHECK (garage_door_controls IN ('Y', 'N', 'U')),
    
    -- Property Systems
    garage_type TEXT CHECK (garage_type IN ('attached', 'detached', 'carport')),
    water_heater_type TEXT CHECK (water_heater_type IN ('gas', 'electric')),
    water_supply TEXT CHECK (water_supply IN ('city', 'well', 'mud')),
    roof_type TEXT,
    roof_age TEXT,
    smoke_detectors TEXT CHECK (smoke_detectors IN ('yes', 'no', 'unknown')),
    
    -- Defects and Conditions
    repair_items TEXT[], -- Array of selected repair items
    defect_descriptions TEXT,
    known_conditions TEXT[], -- Array of known conditions
    condition_explanations TEXT,
    repair_needs TEXT CHECK (repair_needs IN ('yes', 'no')),
    repair_needs_explanation TEXT,
    
    -- FEMA Flood Information (Texas-specific requirements)
    fema_flood_zone TEXT,
    fema_flood_description TEXT,
    fema_base_flood_elevation TEXT,
    flood_insurance TEXT CHECK (flood_insurance IN ('yes', 'no')),
    previous_reservoir_flooding TEXT CHECK (previous_reservoir_flooding IN ('yes', 'no')),
    previous_natural_flooding TEXT CHECK (previous_natural_flooding IN ('yes', 'no')),
    in_100_year_floodplain TEXT CHECK (in_100_year_floodplain IN ('yes', 'no')),
    in_100_year_floodplain_extent TEXT CHECK (in_100_year_floodplain_extent IN ('wholly', 'partly')),
    in_500_year_floodplain TEXT CHECK (in_500_year_floodplain IN ('yes', 'no')),
    in_500_year_floodplain_extent TEXT CHECK (in_500_year_floodplain_extent IN ('wholly', 'partly')),
    in_floodway TEXT CHECK (in_floodway IN ('yes', 'no')),
    in_floodway_extent TEXT CHECK (in_floodway_extent IN ('wholly', 'partly')),
    in_flood_pool TEXT CHECK (in_flood_pool IN ('yes', 'no')),
    in_flood_pool_extent TEXT CHECK (in_flood_pool_extent IN ('wholly', 'partly')),
    in_reservoir TEXT CHECK (in_reservoir IN ('yes', 'no')),
    in_reservoir_extent TEXT CHECK (in_reservoir_extent IN ('wholly', 'partly')),
    flood_explanation TEXT,
    flood_claim TEXT CHECK (flood_claim IN ('yes', 'no')),
    flood_claim_explanation TEXT,
    fema_assistance TEXT CHECK (fema_assistance IN ('yes', 'no')),
    fema_assistance_explanation TEXT,
    additional_awareness TEXT[], -- Array of additional awareness items
    additional_awareness_explanation TEXT
);

-- 11. Secure Access (1-to-1 with property)
CREATE TABLE secure_access (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    video_watched BOOLEAN DEFAULT FALSE,
    access_method_selected BOOLEAN DEFAULT FALSE,
    ship_supra_to_property BOOLEAN DEFAULT FALSE,
    attach_supra_for_me BOOLEAN DEFAULT FALSE,
    rekey_front_door BOOLEAN DEFAULT FALSE,
    rekey_additional_doors INTEGER DEFAULT 0,
    on_site_surveillance BOOLEAN DEFAULT FALSE
);

-- 12. Sign Paperwork (1-to-1 with property)
CREATE TABLE sign_paperwork (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    documents_reviewed BOOLEAN DEFAULT FALSE,
    documents_uploaded TEXT[], -- Array of uploaded document URLs
    electronic_signature BOOLEAN DEFAULT FALSE,
    notary_required BOOLEAN DEFAULT FALSE,
    scheduled_signing_date DATE,
    all_required_docs_signed BOOLEAN DEFAULT FALSE
);

-- =============================================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- =============================================================================

-- Form data indexes for better query performance
CREATE INDEX idx_listing_price_property_id ON listing_price(property_id);
CREATE INDEX idx_listing_service_property_id ON listing_service(property_id);
CREATE INDEX idx_property_media_property_id ON property_media(property_id);
CREATE INDEX idx_additional_information_property_id ON additional_information(property_id);
CREATE INDEX idx_seller_disclosure_property_id ON seller_disclosure(property_id);
CREATE INDEX idx_secure_access_property_id ON secure_access(property_id);
CREATE INDEX idx_sign_paperwork_property_id ON sign_paperwork(property_id);

-- Search indexes for common queries
CREATE INDEX idx_basic_information_city ON basic_information(city);
CREATE INDEX idx_basic_information_state ON basic_information(state);
CREATE INDEX idx_basic_information_zip_code ON basic_information(zip_code);
CREATE INDEX idx_basic_information_property_type ON basic_information(property_type);
CREATE INDEX idx_basic_information_bedrooms ON basic_information(bedrooms);
CREATE INDEX idx_basic_information_square_feet ON basic_information(square_feet);
CREATE INDEX idx_listing_price_desired_price ON listing_price(desired_price);

-- =============================================================================
-- ROW LEVEL SECURITY FOR NEW TABLES
-- =============================================================================

-- Enable RLS on all new form tables
ALTER TABLE listing_price ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_service ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_disclosure ENABLE ROW LEVEL SECURITY;
ALTER TABLE secure_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_paperwork ENABLE ROW LEVEL SECURITY;

-- Apply consistent RLS policies to all form tables
-- Pattern: Users can only access data for properties they own

-- Listing Price
CREATE POLICY "Users can view own listing price" ON listing_price
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = listing_price.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own listing price" ON listing_price
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = listing_price.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Listing Service
CREATE POLICY "Users can view own listing service" ON listing_service
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = listing_service.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own listing service" ON listing_service
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = listing_service.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Property Media
CREATE POLICY "Users can view own property media" ON property_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_media.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own property media" ON property_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_media.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Additional Information
CREATE POLICY "Users can view own additional information" ON additional_information
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = additional_information.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own additional information" ON additional_information
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = additional_information.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Seller Disclosure
CREATE POLICY "Users can view own seller disclosure" ON seller_disclosure
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = seller_disclosure.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own seller disclosure" ON seller_disclosure
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = seller_disclosure.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Secure Access
CREATE POLICY "Users can view own secure access" ON secure_access
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = secure_access.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own secure access" ON secure_access
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = secure_access.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- Sign Paperwork
CREATE POLICY "Users can view own sign paperwork" ON sign_paperwork
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = sign_paperwork.property_id 
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own sign paperwork" ON sign_paperwork
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = sign_paperwork.property_id 
            AND properties.user_id = auth.uid()
        )
    );

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to get completion percentage for a property
CREATE OR REPLACE FUNCTION calculate_property_completion(property_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_forms INTEGER := 10; -- Total number of forms
    completed_forms INTEGER := 0;
BEGIN
    -- Count completed forms
    SELECT COUNT(*) INTO completed_forms
    FROM form_progress 
    WHERE property_id = property_uuid 
    AND status = 'completed';
    
    -- Return percentage
    RETURN (completed_forms * 100 / total_forms);
END;
$$ LANGUAGE plpgsql;

-- Function to update property completion percentage
CREATE OR REPLACE FUNCTION update_property_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Update completion percentage for the affected property
    UPDATE properties 
    SET 
        completion_percentage = calculate_property_completion(NEW.property_id),
        updated_at = NOW()
    WHERE id = NEW.property_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update completion percentage
CREATE TRIGGER update_completion_on_form_progress
    AFTER INSERT OR UPDATE OR DELETE ON form_progress
    FOR EACH ROW EXECUTE FUNCTION update_property_completion();

-- =============================================================================
-- DATA VALIDATION FUNCTIONS
-- =============================================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Function to validate phone number format (basic US format)
CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Allow various formats: (123) 456-7890, 123-456-7890, 1234567890
    RETURN phone ~ '^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- AUDIT TRAIL
-- =============================================================================

-- Create audit log table for important changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit log queries
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (users can view their own audit trail)
CREATE POLICY "Users can view own audit log" ON audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- System can insert audit records
CREATE POLICY "System can insert audit log" ON audit_log
    FOR INSERT WITH CHECK (true);

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for complete property information
CREATE VIEW property_details AS
SELECT 
    p.id,
    p.user_id,
    p.status,
    p.completion_percentage,
    p.created_at,
    p.updated_at,
    -- Basic information
    bi.street,
    bi.city,
    bi.state,
    bi.zip_code,
    bi.property_type,
    bi.bedrooms,
    bi.bathrooms_full,
    bi.bathrooms_half,
    bi.square_feet,
    bi.year_built,
    -- Pricing
    lp.desired_price,
    lp.marketing_strategy,
    -- User info
    pr.first_name,
    pr.last_name,
    pr.email,
    pr.phone
FROM properties p
LEFT JOIN basic_information bi ON p.id = bi.property_id
LEFT JOIN listing_price lp ON p.id = lp.property_id
LEFT JOIN profiles pr ON p.user_id = pr.id;

-- View for form completion status
CREATE VIEW property_form_status AS
SELECT 
    p.id as property_id,
    p.user_id,
    -- Form completion flags
    EXISTS(SELECT 1 FROM basic_information WHERE property_id = p.id) as basic_info_complete,
    EXISTS(SELECT 1 FROM title_holder_info WHERE property_id = p.id) as title_holder_complete,
    EXISTS(SELECT 1 FROM financial_info WHERE property_id = p.id) as financial_info_complete,
    EXISTS(SELECT 1 FROM listing_price WHERE property_id = p.id) as listing_price_complete,
    EXISTS(SELECT 1 FROM listing_service WHERE property_id = p.id) as listing_service_complete,
    EXISTS(SELECT 1 FROM property_media WHERE property_id = p.id) as property_media_complete,
    EXISTS(SELECT 1 FROM additional_information WHERE property_id = p.id) as additional_info_complete,
    EXISTS(SELECT 1 FROM seller_disclosure WHERE property_id = p.id) as seller_disclosure_complete,
    EXISTS(SELECT 1 FROM secure_access WHERE property_id = p.id) as secure_access_complete,
    EXISTS(SELECT 1 FROM sign_paperwork WHERE property_id = p.id) as sign_paperwork_complete
FROM properties p;