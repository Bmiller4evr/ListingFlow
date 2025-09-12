import { ShowingTimeAppointment } from "../services/showingTimeAPI";

export interface PropertyImage {
  id: string;
  url: string;
  caption: string;
  order: number;
  isPrimary: boolean;
}

export interface TrafficMetric {
  source: 'Zillow' | 'Homes.com' | 'HAR.com';
  views: number;
  saves: number;
  saveRate: number;
  inquiries: number;
  date: string;
}

export interface Offer {
  id: string;
  date: string;
  buyerName: string;
  agentName: string;
  amount: number;
  earnestMoney: number;
  closingDate: string;
  contingencies: string[];
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  inspectionPeriod: number; // in days
  paymentType: 'Cash' | 'Financed';
  cashAmount: number; // Amount to be paid in cash (down payment for financed, full amount for cash)
  financedAmount?: number; // Amount to be financed (null for cash offers)
  lenderName?: string; // Name of the lending institution
  documents?: string[];
  titleCompany?: string;
  loanOfficer?: string;
  loanOfficerContact?: string;
  preapproved?: boolean;
  downPayment?: number;
  loanType?: string;
  additionalTerms?: string[];
}



export interface Mortgage {
  id: string;
  lenderName: string;
  currentBalance: number;
  monthlyPayment: number;
  interestRate: number;
  payoffAmount: number; // Amount needed to pay off the mortgage at closing
  type: 'Primary' | 'HELOC' | 'Second Mortgage';
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  category: 'Contract' | 'Disclosures' | 'Inspections' | 'Legal' | 'Listing Agreement' | 'Other';
  dateCreated: string;
  dateModified: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'JPG' | 'PNG';
  status: 'Complete' | 'Pending' | 'Needs Review' | 'Requires Signature';
  url: string;
  sharedWith?: string[];
}

export interface DetailedPropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: string;
  yearBuilt: number;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Land';
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  description: string;
  listedDate: string;
  mlsNumber: string;
  images: PropertyImage[];
  traffic: TrafficMetric[];
  showings: ShowingTimeAppointment[];  // Updated to use ShowingTime API structure
  offers: Offer[];
  documents: Document[];
  plan?: 'self-service' | 'full-service';
  mortgages?: Mortgage[];
}

// Import mock data from ShowingTime API
import { mockShowingTimeData } from "../services/showingTimeAPI";

export const detailedListing: DetailedPropertyListing = {
  id: "prop-3",
  address: "789 Pine Blvd",
  city: "Austin",
  state: "TX",
  zip: "78745",
  price: 650000,
  bedrooms: 4,
  bathrooms: 3,
  squareFeet: 2400,
  lotSize: "0.25 acres",
  yearBuilt: 2015,
  propertyType: "Single Family",
  status: "Sold",
  description: "Beautiful single-family home in desirable South Austin neighborhood. This spacious home features an open floor plan, gourmet kitchen with granite countertops, stainless steel appliances, and hardwood floors throughout. The primary bedroom has a luxurious en-suite bathroom with a soaking tub and separate shower. The large backyard has a covered patio perfect for outdoor entertaining.",
  listedDate: "2025-05-12",
  mlsNumber: "AUS78745123",
  plan: "self-service",
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      caption: "Front view of the house",
      order: 1,
      isPrimary: true
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c349279?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      caption: "Living room with hardwood floors",
      order: 2,
      isPrimary: false
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      caption: "Modern kitchen with granite countertops",
      order: 3,
      isPrimary: false
    },
    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      caption: "Primary bedroom with ensuite bathroom",
      order: 4,
      isPrimary: false
    },
    {
      id: "img-5",
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      caption: "Luxurious bathroom with soaking tub",
      order: 5,
      isPrimary: false
    },
    {
      id: "img-6",
      url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      caption: "Backyard with covered patio",
      order: 6,
      isPrimary: false
    }
  ],

  traffic: [
    {
      source: "Zillow",
      views: 342,
      saves: 28,
      saveRate: 8.2,
      inquiries: 5,
      date: "2025-05-30"
    },
    {
      source: "Homes.com",
      views: 186,
      saves: 15,
      saveRate: 8.1,
      inquiries: 2,
      date: "2025-05-30"
    },
    {
      source: "HAR.com",
      views: 127,
      saves: 9,
      saveRate: 7.1,
      inquiries: 1,
      date: "2025-05-30"
    }
  ],
  // Use ShowingTime API mock data for showings
  showings: mockShowingTimeData.filter(showing => showing.propertyId === "prop-3"),
  offers: [
    {
      id: "offer-1",
      date: "2025-05-28",
      buyerName: "The Thompson Family",
      agentName: "Michael Rodriguez",
      amount: 635000,
      earnestMoney: 12700,
      closingDate: "2025-07-15",
      contingencies: ["Financing", "Inspection", "Appraisal"],
      titleCompany: "Capital Title of Texas",
      status: "Pending",
      inspectionPeriod: 10,
      paymentType: "Financed",
      cashAmount: 127000,
      financedAmount: 508000,
      lenderName: "Wells Fargo Bank",
      loanOfficer: "James Wilson",
      loanOfficerContact: "512-555-7890",
      preapproved: true,
      downPayment: 127000,
      loanType: "Conventional 30-year fixed",
      additionalTerms: [
        "Seller to leave refrigerator",
        "Buyer requests home warranty",
        "Closing costs split equally"
      ]
    },
    {
      id: "offer-2",
      date: "2025-05-30",
      buyerName: "Alex and Jamie Martinez",
      agentName: "Patricia Chang",
      amount: 642000,
      earnestMoney: 12840,
      closingDate: "2025-07-20",
      contingencies: ["Financing", "Inspection", "Appraisal", "Home Sale"],
      titleCompany: "Austin Heritage Title",
      status: "Pending",
      inspectionPeriod: 7,
      paymentType: "Financed",
      cashAmount: 128400,
      financedAmount: 513600,
      lenderName: "Bank of America",
      loanOfficer: "Rebecca Flores",
      loanOfficerContact: "512-555-2345",
      preapproved: true,
      downPayment: 128400,
      loanType: "FHA 30-year fixed",
      additionalTerms: [
        "Home warranty provided by seller",
        "Repair allowance of $5,000",
        "Flexible closing date"
      ]
    },
    {
      id: "offer-3",
      date: "2025-05-25",
      buyerName: "Robert and Lisa Chen",
      agentName: "David Kim",
      amount: 615000,
      earnestMoney: 10000,
      closingDate: "2025-07-01",
      contingencies: ["Inspection", "Appraisal"],
      titleCompany: "First American Title",
      status: "Rejected",
      inspectionPeriod: 14,
      paymentType: "Cash",
      cashAmount: 615000,
      loanOfficer: "Sarah Johnson",
      loanOfficerContact: "512-555-4567",
      preapproved: true,
      downPayment: 123000,
      loanType: "Conventional 30-year fixed",
      additionalTerms: [
        "Buyer to pay all closing costs",
        "As-is condition",
        "Quick closing preferred"
      ]
    }
  ],

  mortgages: [
    {
      id: "mortgage-1",
      lenderName: "Chase Bank",
      currentBalance: 420000,
      monthlyPayment: 2845,
      interestRate: 4.25,
      payoffAmount: 422500,
      type: "Primary"
    },
    {
      id: "mortgage-2", 
      lenderName: "Wells Fargo HELOC",
      currentBalance: 45000,
      monthlyPayment: 225,
      interestRate: 6.75,
      payoffAmount: 45800,
      type: "HELOC"
    }
  ],

  documents: [
    {
      id: "doc-1",
      name: "Listing Agreement",
      description: "Exclusive right to sell agreement between seller and Access Realty",
      category: "Listing Agreement",
      dateCreated: "2025-05-10",
      dateModified: "2025-05-10",
      fileSize: "1.2 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#",
      sharedWith: ["Seller", "Listing Agent"]
    },
    {
      id: "doc-2",
      name: "Seller's Disclosure",
      description: "Property condition disclosure statement",
      category: "Disclosures",
      dateCreated: "2025-05-11",
      dateModified: "2025-05-11",
      fileSize: "3.4 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#",
      sharedWith: ["Seller", "Listing Agent", "Buyer's Agent"]
    },
    {
      id: "doc-3",
      name: "Property Survey",
      description: "Boundary survey showing property lines",
      category: "Legal",
      dateCreated: "2025-01-15",
      dateModified: "2025-05-11",
      fileSize: "8.7 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#"
    },
    {
      id: "doc-4",
      name: "Home Inspection Report",
      description: "Comprehensive inspection of property condition",
      category: "Inspections",
      dateCreated: "2025-05-29",
      dateModified: "2025-05-29",
      fileSize: "12.3 MB",
      fileType: "PDF",
      status: "Needs Review",
      url: "#"
    },
    {
      id: "doc-5",
      name: "Purchase Offer - Thompson Family",
      description: "Initial offer from the Thompson family",
      category: "Contract",
      dateCreated: "2025-05-28",
      dateModified: "2025-05-28",
      fileSize: "2.7 MB",
      fileType: "PDF",
      status: "Requires Signature",
      url: "#",
      sharedWith: ["Seller", "Listing Agent", "Buyer", "Buyer's Agent"]
    },
    {
      id: "doc-6",
      name: "HOA Rules and Regulations",
      description: "Community guidelines and restrictions",
      category: "Legal",
      dateCreated: "2025-01-01",
      dateModified: "2025-01-01",
      fileSize: "5.1 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#"
    },
    {
      id: "doc-7",
      name: "Roof Certification",
      description: "Professional assessment of roof condition",
      category: "Inspections",
      dateCreated: "2025-05-15",
      dateModified: "2025-05-15",
      fileSize: "1.8 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#"
    },
    {
      id: "doc-8",
      name: "HVAC Service Records",
      description: "Maintenance history for HVAC system",
      category: "Other",
      dateCreated: "2025-04-20",
      dateModified: "2025-04-20",
      fileSize: "0.9 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#"
    },
    {
      id: "doc-9",
      name: "Lead-Based Paint Disclosure",
      description: "Required disclosure for properties built before 1978",
      category: "Disclosures",
      dateCreated: "2025-05-11",
      dateModified: "2025-05-11",
      fileSize: "0.8 MB",
      fileType: "PDF",
      status: "Complete",
      url: "#"
    }
  ]
};