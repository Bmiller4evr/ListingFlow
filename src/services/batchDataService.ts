/**
 * BatchData API service for Access Realty
 * Handles property data verification and details retrieval
 */

// Property detail types
export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  unitNumber?: string;
}

export interface PropertyDetails {
  address: PropertyAddress;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  lotSize: number;
  taxAssessedValue: number;
  lastSaleDate?: string;
  lastSaleAmount?: number;
  parcelId?: string;
  county?: string;
  subdivision?: string;
  zoning?: string;
  floodZone?: string;
  ownership?: {
    owner: string;
    ownerType: 'individual' | 'business' | 'trust' | 'other';
    ownerOccupied: boolean;
  };
  verified: boolean;
}

// API response types
interface BatchDataApiResponse {
  success: boolean;
  property?: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
    };
    attributes: {
      propertyType: string;
      bedrooms: number;
      bathrooms: number;
      squareFeet: number;
      yearBuilt: number;
      lotSize: number;
      taxAssessment?: {
        value: number;
        year: number;
      };
      saleHistory?: Array<{
        date: string;
        amount: number;
      }>;
    };
    parcelInfo?: {
      apn: string;
      county: string;
      subdivision: string;
      zoning: string;
      floodZone: string;
    };
    ownership?: {
      ownerName: string;
      ownerType: string;
      ownerOccupied: boolean;
    };
  };
  error?: string;
}

// Error types
export class PropertyNotFoundError extends Error {
  constructor(message: string = "Property not found") {
    super(message);
    this.name = "PropertyNotFoundError";
  }
}

export class BatchDataApiError extends Error {
  constructor(message: string = "API error occurred") {
    super(message);
    this.name = "BatchDataApiError";
  }
}

class BatchDataService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = "YOUR_BATCHDATA_API_KEY") {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.batchdata.com/v1";
  }

  /**
   * Verify a property address and get its details
   * @param address Property address to verify
   * @returns Promise<PropertyDetails> Verified property details
   */
  async verifyProperty(address: PropertyAddress): Promise<PropertyDetails> {
    try {
      // In a real implementation, this would call the BatchData API
      // For this demo, we're simulating the API call
      return await this.mockApiCall(address);
    } catch (error) {
      if (error instanceof PropertyNotFoundError) {
        // Log the error but re-throw it to be handled by the calling component
        console.log("Property verification: Address not found in database");
        throw error;
      }
      
      console.error("BatchData API error:", error);
      throw new BatchDataApiError(error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Search for properties matching a partial address
   * @param query Partial address query
   * @returns Promise<PropertyAddress[]> List of matching property addresses
   */
  async searchProperties(query: string): Promise<PropertyAddress[]> {
    try {
      // In a real implementation, this would call the BatchData API
      // For this demo, we're simulating the API call
      return await this.mockSearchCall(query);
    } catch (error) {
      console.error("BatchData search API error:", error);
      throw new BatchDataApiError(error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Mock API call to simulate BatchData property verification
   * @param address Property address to verify
   * @returns Promise<PropertyDetails> Simulated property details
   */
  private async mockApiCall(address: PropertyAddress): Promise<PropertyDetails> {
    return new Promise((resolve, reject) => {
      // Simulate API response time
      setTimeout(() => {
        // Check if the address exists in our mock data
        const normalizedStreet = address.street.toLowerCase();
        const normalizedZip = address.zip;
        
        // Match with mock data
        let mockResponse: BatchDataApiResponse;
        
        if (
          (normalizedStreet.includes("pine") && normalizedZip === "78701") || 
          (normalizedStreet.includes("oak") && normalizedZip === "78704") || 
          (normalizedStreet.includes("maple") && normalizedZip === "78702")
        ) {
          // Match found, return mock property data
          mockResponse = this.getMockResponse(address);
        } else if (
          (normalizedStreet.includes("error") || address.city.toLowerCase().includes("error"))
        ) {
          // Simulate API error
          reject(new BatchDataApiError("BatchData API connection failed"));
          return;
        } else {
          // Address not found
          reject(new PropertyNotFoundError(`Property at ${address.street}, ${address.city}, ${address.state} ${address.zip} could not be verified`));
          return;
        }
        
        // Transform the mock API response to our PropertyDetails interface
        const propertyDetails = this.transformApiResponse(mockResponse);
        resolve(propertyDetails);
      }, 800); // Simulate some network delay
    });
  }

  /**
   * Mock search API call to simulate BatchData property search
   * @param query Partial address query
   * @returns Promise<PropertyAddress[]> Simulated property addresses
   */
  private async mockSearchCall(query: string): Promise<PropertyAddress[]> {
    return new Promise((resolve, reject) => {
      // Simulate API response time
      setTimeout(() => {
        const normalizedQuery = query.toLowerCase();
        
        if (normalizedQuery.includes("error")) {
          reject(new BatchDataApiError("BatchData search API connection failed"));
          return;
        }
        
        // Return mock address suggestions based on query
        const results: PropertyAddress[] = [];
        
        if (normalizedQuery.includes("pine")) {
          results.push(
            {
              street: "789 Pine Blvd",
              city: "Austin",
              state: "TX",
              zip: "78701",
            },
            {
              street: "456 Pine Street",
              city: "Austin",
              state: "TX", 
              zip: "78701",
              unitNumber: "Apt 302"
            }
          );
        }
        
        if (normalizedQuery.includes("oak")) {
          results.push(
            {
              street: "123 Oak Lane",
              city: "Austin",
              state: "TX",
              zip: "78704",
            },
            {
              street: "567 Oak Ridge Dr",
              city: "Austin",
              state: "TX",
              zip: "78704",
            }
          );
        }
        
        if (normalizedQuery.includes("maple")) {
          results.push(
            {
              street: "321 Maple Avenue",
              city: "Austin",
              state: "TX",
              zip: "78702",
            }
          );
        }
        
        // If no specific matches, return some generic results
        if (results.length === 0 && normalizedQuery.length > 3) {
          results.push(
            {
              street: "789 Pine Blvd",
              city: "Austin",
              state: "TX",
              zip: "78701",
            },
            {
              street: "123 Oak Lane",
              city: "Austin",
              state: "TX",
              zip: "78704",
            },
            {
              street: "321 Maple Avenue",
              city: "Austin",
              state: "TX",
              zip: "78702",
            }
          );
        }
        
        resolve(results);
      }, 300); // Faster response for search suggestions
    });
  }

  /**
   * Get a mock API response for a given address
   * @param address Property address
   * @returns BatchDataApiResponse Mock API response
   */
  private getMockResponse(address: PropertyAddress): BatchDataApiResponse {
    const normalizedStreet = address.street.toLowerCase();
    
    if (normalizedStreet.includes("pine")) {
      return {
        success: true,
        property: {
          address: {
            line1: "789 Pine Blvd",
            city: "Austin",
            state: "TX",
            zip: "78701",
          },
          attributes: {
            propertyType: "Single Family Residential",
            bedrooms: 4,
            bathrooms: 3,
            squareFeet: 2800,
            yearBuilt: 2005,
            lotSize: 0.25,
            taxAssessment: {
              value: 725000,
              year: 2024,
            },
            saleHistory: [
              {
                date: "2018-05-15",
                amount: 650000,
              },
            ],
          },
          parcelInfo: {
            apn: "123-456-789",
            county: "Travis",
            subdivision: "Downtown Heights",
            zoning: "R-1",
            floodZone: "X",
          },
          ownership: {
            ownerName: "Smith Family Trust",
            ownerType: "trust",
            ownerOccupied: true,
          },
        },
      };
    } else if (normalizedStreet.includes("oak")) {
      return {
        success: true,
        property: {
          address: {
            line1: "123 Oak Lane",
            city: "Austin",
            state: "TX",
            zip: "78704",
          },
          attributes: {
            propertyType: "Townhouse",
            bedrooms: 3,
            bathrooms: 2.5,
            squareFeet: 1950,
            yearBuilt: 2012,
            lotSize: 0.1,
            taxAssessment: {
              value: 550000,
              year: 2024,
            },
            saleHistory: [
              {
                date: "2020-09-22",
                amount: 490000,
              },
            ],
          },
          parcelInfo: {
            apn: "789-012-345",
            county: "Travis",
            subdivision: "South Austin Commons",
            zoning: "R-2",
            floodZone: "X",
          },
          ownership: {
            ownerName: "Johnson, Robert & Maria",
            ownerType: "individual",
            ownerOccupied: true,
          },
        },
      };
    } else if (normalizedStreet.includes("maple")) {
      return {
        success: true,
        property: {
          address: {
            line1: "321 Maple Avenue",
            city: "Austin",
            state: "TX",
            zip: "78702",
          },
          attributes: {
            propertyType: "Condominium",
            bedrooms: 2,
            bathrooms: 2,
            squareFeet: 1250,
            yearBuilt: 2018,
            lotSize: 0.05,
            taxAssessment: {
              value: 425000,
              year: 2024,
            },
            saleHistory: [
              {
                date: "2021-03-14",
                amount: 390000,
              },
            ],
          },
          parcelInfo: {
            apn: "456-789-012",
            county: "Travis",
            subdivision: "East Austin Lofts",
            zoning: "MF-2",
            floodZone: "X",
          },
          ownership: {
            ownerName: "Rodriguez LLC",
            ownerType: "business",
            ownerOccupied: false,
          },
        },
      };
    } else {
      // Default response for testing
      return {
        success: true,
        property: {
          address: {
            line1: address.street,
            line2: address.unitNumber,
            city: address.city,
            state: address.state,
            zip: address.zip,
          },
          attributes: {
            propertyType: "Single Family Residential",
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 1800,
            yearBuilt: 2000,
            lotSize: 0.2,
            taxAssessment: {
              value: 450000,
              year: 2024,
            },
          },
          parcelInfo: {
            apn: "000-000-000",
            county: "Travis",
            subdivision: "Test Subdivision",
            zoning: "R-1",
            floodZone: "X",
          },
          ownership: {
            ownerName: "Test Owner",
            ownerType: "individual",
            ownerOccupied: true,
          },
        },
      };
    }
  }

  /**
   * Transform the BatchData API response to our PropertyDetails interface
   * @param response BatchData API response
   * @returns PropertyDetails Transformed property details
   */
  private transformApiResponse(response: BatchDataApiResponse): PropertyDetails {
    if (!response.success || !response.property) {
      throw new PropertyNotFoundError();
    }

    const { property } = response;

    return {
      address: {
        street: property.address.line1,
        unitNumber: property.address.line2,
        city: property.address.city,
        state: property.address.state,
        zip: property.address.zip,
      },
      propertyType: property.attributes.propertyType,
      bedrooms: property.attributes.bedrooms,
      bathrooms: property.attributes.bathrooms,
      squareFootage: property.attributes.squareFeet,
      yearBuilt: property.attributes.yearBuilt,
      lotSize: property.attributes.lotSize,
      taxAssessedValue: property.attributes.taxAssessment?.value || 0,
      lastSaleDate: property.attributes.saleHistory?.[0]?.date,
      lastSaleAmount: property.attributes.saleHistory?.[0]?.amount,
      parcelId: property.parcelInfo?.apn,
      county: property.parcelInfo?.county,
      subdivision: property.parcelInfo?.subdivision,
      zoning: property.parcelInfo?.zoning,
      floodZone: property.parcelInfo?.floodZone,
      ownership: property.ownership ? {
        owner: property.ownership.ownerName,
        ownerType: property.ownership.ownerType === 'individual' || 
                   property.ownership.ownerType === 'business' || 
                   property.ownership.ownerType === 'trust' 
                   ? (property.ownership.ownerType as 'individual' | 'business' | 'trust') 
                   : 'other',
        ownerOccupied: property.ownership.ownerOccupied,
      } : undefined,
      verified: true,
    };
  }
}

export default new BatchDataService();