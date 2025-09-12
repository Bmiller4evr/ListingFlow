export interface PropertyListing {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Land';
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  listedDate: string;
  views: number;
  image: string;
  draftData?: {
    lastStep?: string;
    lastUpdated?: string;
    data?: any;
  };
}

export const mockListings: PropertyListing[] = [
  {
    id: "prop-1",
    address: "123 Main St, Austin, TX 78701",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    propertyType: "Single Family",
    status: "Active",
    listedDate: "2025-05-01",
    views: 243,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "prop-2",
    address: "456 Oak Ave, Austin, TX 78704",
    price: 375000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: "Condo",
    status: "Pending",
    listedDate: "2025-04-15",
    views: 187,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "prop-3",
    address: "789 Pine Blvd, Austin, TX 78745",
    price: 650000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2400,
    propertyType: "Single Family",
    status: "Sold",
    listedDate: "2025-05-12",
    views: 156,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "prop-4",
    address: "101 Cedar Ln, Austin, TX 78702",
    price: 325000,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 950,
    propertyType: "Townhouse",
    status: "Sold",
    listedDate: "2025-03-20",
    views: 320,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "prop-5",
    address: "202 Maple Dr, Austin, TX 78723",
    price: 525000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2100,
    propertyType: "Single Family",
    status: "Active",
    listedDate: "2025-05-08",
    views: 98,
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "prop-6",
    address: "303 Birch St, Austin, TX 78731",
    price: 899000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3200,
    propertyType: "Single Family",
    status: "Active",
    listedDate: "2025-05-20",
    views: 76,
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "prop-7",
    address: "404 Walnut Way, Austin, TX 78746",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1700,
    propertyType: "Townhouse",
    status: "Draft",
    listedDate: "2025-05-25",
    views: 0,
    image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    draftData: {
      lastStep: "seller-disclosure",
      lastUpdated: "2025-05-30T14:30:00",
      data: {
        address: {
          street: "404 Walnut Way",
          city: "Austin",
          state: "TX",
          zipCode: "78746"
        },
        ownership: {
          ownershipType: "individual",
          ownerNames: ["Jane Smith"]
        },
        payment: {
          servicePlan: "self-service",
          paymentMethod: "card"
        },
        photos: {
          professionalPhotography: true,
          photoUrls: ["https://images.unsplash.com/photo-1571055107559-3e67626fa8be"]
        },
        homeFacts: {
          propertyType: "Townhouse",
          bedrooms: 3,
          fullBathrooms: 2,
          halfBathrooms: 0,
          squareFootage: 1700,
          lotSize: 0.18,
          yearBuilt: 2010,
          garageSpaces: 2,
          hasExistingSurvey: true,
          occupancyStatus: "owner-occupied"
        },
        titleHolder: {
          ownerType: "individual",
          ownerNames: ["Jane Smith"],
          titleCompany: "Austin Title Company",
          mortgageInfo: {
            hasMortgage: true,
            lenderName: "First National Bank",
            approximateBalance: 185000,
            monthlyPayment: 1420
          },
          powerOfAttorney: false
        },
        sellerDisclosure: {
          selectedOption: "pdf",
          completed: true
        }
      }
    }
  },
  {
    id: "prop-8",
    address: "505 Elm Court, Austin, TX 78758",
    price: 375000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    propertyType: "Condo",
    status: "Draft",
    listedDate: "2025-05-28",
    views: 0,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    draftData: {
      lastStep: "titleholder",
      lastUpdated: "2025-05-29T09:45:00",
      data: {
        address: {
          street: "505 Elm Court",
          city: "Austin",
          state: "TX",
          zipCode: "78758"
        },
        ownership: {
          ownershipType: "joint",
          ownerNames: ["Michael Johnson", "Sarah Johnson"]
        },
        payment: {
          servicePlan: "full-service",
          paymentMethod: "card"
        },
        homeFacts: {
          propertyType: "Condo",
          bedrooms: 2,
          fullBathrooms: 2,
          halfBathrooms: 0,
          squareFootage: 1100,
          lotSize: 0,
          yearBuilt: 2015,
          garageSpaces: 1,
          hasExistingSurvey: false,
          occupancyStatus: "non-owner-occupied"
        },
        titleHolder: {
          ownedLessThanTwoYears: "no",
          hasHomesteadExemption: "yes",
          isPropertyInsured: "yes",
          numberOfOwners: "2",
          owners: [
            {
              firstName: "Michael",
              lastName: "Johnson",
              hasCapacity: "yes",
              phone: "(512) 555-0123",
              email: "michael.johnson@email.com",
              involvedInDivorce: "no",
              isNonUSCitizen: "no"
            },
            {
              firstName: "Sarah",
              lastName: "Johnson",
              hasCapacity: "yes", 
              phone: "(512) 555-0124",
              email: "sarah.johnson@email.com",
              involvedInDivorce: "no",
              isNonUSCitizen: "no"
            }
          ]
        }
      }
    }
  },
  {
    id: "prop-9",
    address: "606 Maple Lane, Austin, TX 78746",
    price: 410000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    propertyType: "Townhouse",
    status: "Draft",
    listedDate: "2025-05-29",
    views: 0,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    draftData: {
      lastStep: "financial-info",
      lastUpdated: "2025-05-30T14:30:00",
      data: {
        address: {
          street: "606 Maple Lane",
          city: "Austin",
          state: "TX",
          zipCode: "78746"
        },
        ownership: {
          ownershipType: "individual",
          ownerNames: ["Jane Smith"]
        },
        payment: {
          servicePlan: "self-service",
          paymentMethod: "card"
        },
        photos: {
          professionalPhotography: true,
          photoUrls: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"]
        },
        homeFacts: {
          propertyType: "Townhouse",
          bedrooms: 3,
          fullBathrooms: 2,
          halfBathrooms: 0,
          squareFootage: 1500,
          lotSize: 0.12,
          yearBuilt: 2008,
          garageSpaces: 2,
          hasExistingSurvey: true,
          occupancyStatus: "vacant"
        },
        titleHolder: {
          ownerType: "individual",
          ownerNames: ["Jane Smith"],
          titleCompany: "Landmark Title Services",
          mortgageInfo: {
            hasMortgage: false
          },
          powerOfAttorney: false
        },
        sellerDisclosure: {
          selectedOption: "online",
          completed: true
        }
      }
    }
  },
  {
    id: "prop-10",
    address: "707 Oak Street, Austin, TX 78749",
    price: 495000,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 1800,
    propertyType: "Single Family",
    status: "Draft",
    listedDate: "2025-05-30",
    views: 0,
    image: "https://images.unsplash.com/photo-1593604340846-4fbe9763a8f3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    draftData: {
      lastStep: "quick-home-facts",
      lastUpdated: "2025-05-31T10:15:00",
      data: {
        address: {
          street: "707 Oak Street",
          city: "Austin",
          state: "TX",
          zipCode: "78749"
        },
        ownership: {
          ownershipType: "individual",
          ownerNames: ["Robert Brown"]
        },
        homeFacts: {
          propertyType: "Single Family",
          bedrooms: 4,
          fullBathrooms: 2,
          halfBathrooms: 1,
          squareFootage: 1800,
          lotSize: 0.25,
          yearBuilt: 2005,
          garageSpaces: 2,
          hasExistingSurvey: false,
          occupancyStatus: "owner-occupied"
        }
      }
    }
  }
];

export const propertyStats = {
  totalListings: 10,
  activeListings: 3,
  pendingListings: 1,
  soldListings: 2,
  draftListings: 4,
  totalViews: 1080,
  averagePrice: 500444
};