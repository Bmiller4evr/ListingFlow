# API Integration Notes for Access Realty

## Property Details API Integration

### Overview
When users enter an address in the Basic Information form (either manually or from the landing page), the system should fetch property details from an external API to pre-populate property specifications.

### Implementation Location
**File**: `/components/listing-creation/BasicInformationForm.tsx`  
**Function**: `handleAddressChange`

### Current Implementation
Currently contains placeholder code with TODO comments. When an address is entered:
1. The address change handler is called
2. TODO: Make API call to fetch property details
3. Auto-advance to next question after address entry

### Required API Integration
```typescript
// Example implementation needed:
const fetchPropertyDetails = async (address: string) => {
  try {
    // API call to property data service (Zillow, MLS, etc.)
    const response = await fetch(`/api/property-details?address=${encodeURIComponent(address)}`);
    const details = await response.json();
    
    return {
      bedrooms: details.bedrooms,
      bathrooms: details.bathrooms, 
      squareFeet: details.squareFeet,
      yearBuilt: details.yearBuilt,
      propertyType: details.propertyType,
      lotSize: details.lotSize
    };
  } catch (error) {
    console.error('Failed to fetch property details:', error);
    return null;
  }
};
```

### User Journey with API Integration
1. **Landing Page**: User enters address → stored in localStorage as 'verifiedAddress'
2. **Onboarding**: User creates account
3. **Basic Information Form**: 
   - Address pre-filled from onboarding
   - API automatically called to fetch property details
   - Form auto-advances to question 2 (property type)
   - Subsequent questions have pre-populated values from API response

### Manual Address Entry
When users manually enter addresses in the Basic Information form:
1. Address change triggers API call
2. Property specs are pre-populated
3. Form auto-advances to next question

### Error Handling
- If API call fails, allow user to continue manually
- Log errors for debugging
- Graceful degradation - don't block user progress

### Security Considerations
- Validate address input before API calls
- Rate limit API requests
- Handle API key securely on backend
- Don't expose sensitive property data unnecessarily

## Backend Requirements
- Property details API endpoint: `/api/property-details`
- Address validation/geocoding
- Integration with MLS, Zillow, or similar property data providers
- Caching for frequently requested addresses