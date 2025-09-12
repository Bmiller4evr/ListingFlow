import { mockListings } from "./mockData";

export interface DocumentItem {
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
  propertyId: string;
  propertyAddress: string;
  sharedWith?: string[];
}

// Create documents for each property in the mockListings array
export const mockDocuments: DocumentItem[] = [
  // Property 1 - 123 Main St
  {
    id: "doc-prop1-1",
    name: "Listing Agreement",
    description: "Exclusive right to sell agreement",
    category: "Listing Agreement",
    dateCreated: "2025-04-29",
    dateModified: "2025-04-29",
    fileSize: "1.2 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX 78701",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop1-2",
    name: "Seller's Disclosure",
    description: "Property condition disclosure statement",
    category: "Disclosures",
    dateCreated: "2025-04-30",
    dateModified: "2025-04-30",
    fileSize: "3.4 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX 78701",
    sharedWith: ["Seller", "Listing Agent", "Buyer's Agent"]
  },
  {
    id: "doc-prop1-3",
    name: "Property Photos",
    description: "Professional photographs of the property",
    category: "Other",
    dateCreated: "2025-05-01",
    dateModified: "2025-05-01",
    fileSize: "24.7 MB",
    fileType: "JPG",
    status: "Complete",
    url: "#",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX 78701"
  },
  {
    id: "doc-prop1-4",
    name: "Home Inspection Report",
    description: "Comprehensive inspection of property condition",
    category: "Inspections",
    dateCreated: "2025-05-12",
    dateModified: "2025-05-12",
    fileSize: "8.9 MB",
    fileType: "PDF",
    status: "Needs Review",
    url: "#",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX 78701"
  },
  {
    id: "doc-prop1-5",
    name: "Purchase Agreement",
    description: "Contract between buyer and seller",
    category: "Contract",
    dateCreated: "2025-05-15",
    dateModified: "2025-05-15",
    fileSize: "2.5 MB",
    fileType: "PDF",
    status: "Requires Signature",
    url: "#",
    propertyId: "prop-1",
    propertyAddress: "123 Main St, Austin, TX 78701",
    sharedWith: ["Seller", "Buyer", "Listing Agent", "Buyer's Agent"]
  },

  // Property 2 - 456 Oak Ave
  {
    id: "doc-prop2-1",
    name: "Listing Agreement",
    description: "Exclusive right to sell agreement",
    category: "Listing Agreement",
    dateCreated: "2025-04-13",
    dateModified: "2025-04-13",
    fileSize: "1.4 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX 78704",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop2-2",
    name: "Condo Association Rules",
    description: "HOA documents and bylaws",
    category: "Legal",
    dateCreated: "2025-04-13",
    dateModified: "2025-04-13",
    fileSize: "5.8 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX 78704"
  },
  {
    id: "doc-prop2-3",
    name: "Purchase Offer",
    description: "Initial offer from buyer",
    category: "Contract",
    dateCreated: "2025-05-01",
    dateModified: "2025-05-01",
    fileSize: "2.2 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX 78704",
    sharedWith: ["Seller", "Buyer", "Listing Agent", "Buyer's Agent"]
  },
  {
    id: "doc-prop2-4",
    name: "Counteroffers",
    description: "Negotiation documents",
    category: "Contract",
    dateCreated: "2025-05-03",
    dateModified: "2025-05-05",
    fileSize: "3.1 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX 78704",
    sharedWith: ["Seller", "Buyer", "Listing Agent", "Buyer's Agent"]
  },
  {
    id: "doc-prop2-5",
    name: "Final Purchase Agreement",
    description: "Executed contract",
    category: "Contract",
    dateCreated: "2025-05-07",
    dateModified: "2025-05-07",
    fileSize: "3.6 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-2",
    propertyAddress: "456 Oak Ave, Austin, TX 78704",
    sharedWith: ["Seller", "Buyer", "Listing Agent", "Buyer's Agent"]
  },

  // Property 3 - 789 Pine Blvd
  {
    id: "doc-prop3-1",
    name: "Listing Agreement",
    description: "Exclusive right to sell agreement between seller and Access Realty",
    category: "Listing Agreement",
    dateCreated: "2025-05-10",
    dateModified: "2025-05-10",
    fileSize: "1.2 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Blvd, Austin, TX 78745",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop3-2",
    name: "Seller's Disclosure",
    description: "Property condition disclosure statement",
    category: "Disclosures",
    dateCreated: "2025-05-11",
    dateModified: "2025-05-11",
    fileSize: "3.4 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Blvd, Austin, TX 78745",
    sharedWith: ["Seller", "Listing Agent", "Buyer's Agent"]
  },
  {
    id: "doc-prop3-3",
    name: "Property Survey",
    description: "Boundary survey showing property lines",
    category: "Legal",
    dateCreated: "2025-01-15",
    dateModified: "2025-05-11",
    fileSize: "8.7 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Blvd, Austin, TX 78745"
  },
  {
    id: "doc-prop3-4",
    name: "Home Inspection Report",
    description: "Comprehensive inspection of property condition",
    category: "Inspections",
    dateCreated: "2025-05-29",
    dateModified: "2025-05-29",
    fileSize: "12.3 MB",
    fileType: "PDF",
    status: "Needs Review",
    url: "#",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Blvd, Austin, TX 78745"
  },
  {
    id: "doc-prop3-5",
    name: "Purchase Offer - Thompson Family",
    description: "Initial offer from the Thompson family",
    category: "Contract",
    dateCreated: "2025-05-28",
    dateModified: "2025-05-28",
    fileSize: "2.7 MB",
    fileType: "PDF",
    status: "Requires Signature",
    url: "#",
    propertyId: "prop-3",
    propertyAddress: "789 Pine Blvd, Austin, TX 78745",
    sharedWith: ["Seller", "Listing Agent", "Buyer", "Buyer's Agent"]
  },

  // Property 4 - 101 Cedar Ln
  {
    id: "doc-prop4-1",
    name: "Listing Agreement",
    description: "Exclusive right to sell agreement",
    category: "Listing Agreement",
    dateCreated: "2025-03-18",
    dateModified: "2025-03-18",
    fileSize: "1.3 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-4",
    propertyAddress: "101 Cedar Ln, Austin, TX 78702",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop4-2",
    name: "Seller's Disclosure",
    description: "Property condition disclosure statement",
    category: "Disclosures",
    dateCreated: "2025-03-19",
    dateModified: "2025-03-19",
    fileSize: "2.8 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-4",
    propertyAddress: "101 Cedar Ln, Austin, TX 78702"
  },
  {
    id: "doc-prop4-3",
    name: "Closing Documents",
    description: "Final closing papers",
    category: "Legal",
    dateCreated: "2025-04-15",
    dateModified: "2025-04-15",
    fileSize: "6.2 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-4",
    propertyAddress: "101 Cedar Ln, Austin, TX 78702",
    sharedWith: ["Seller", "Buyer", "Listing Agent", "Buyer's Agent", "Title Company"]
  },

  // Property 5 - 202 Maple Dr
  {
    id: "doc-prop5-1",
    name: "Listing Agreement",
    description: "Exclusive right to sell agreement",
    category: "Listing Agreement",
    dateCreated: "2025-05-06",
    dateModified: "2025-05-06",
    fileSize: "1.1 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-5",
    propertyAddress: "202 Maple Dr, Austin, TX 78723",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop5-2",
    name: "Seller's Disclosure",
    description: "Property condition disclosure statement",
    category: "Disclosures",
    dateCreated: "2025-05-07",
    dateModified: "2025-05-07",
    fileSize: "3.2 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-5",
    propertyAddress: "202 Maple Dr, Austin, TX 78723"
  },
  {
    id: "doc-prop5-3",
    name: "Floor Plans",
    description: "Detailed floor plans of the property",
    category: "Other",
    dateCreated: "2025-05-08",
    dateModified: "2025-05-08",
    fileSize: "5.4 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-5",
    propertyAddress: "202 Maple Dr, Austin, TX 78723"
  },

  // Property 6 - 303 Birch St
  {
    id: "doc-prop6-1",
    name: "Listing Agreement",
    description: "Exclusive right to sell agreement",
    category: "Listing Agreement",
    dateCreated: "2025-05-18",
    dateModified: "2025-05-18",
    fileSize: "1.4 MB",
    fileType: "PDF",
    status: "Complete",
    url: "#",
    propertyId: "prop-6",
    propertyAddress: "303 Birch St, Austin, TX 78731",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop6-2",
    name: "Seller's Disclosure",
    description: "Property condition disclosure statement",
    category: "Disclosures",
    dateCreated: "2025-05-19",
    dateModified: "2025-05-19",
    fileSize: "4.1 MB",
    fileType: "PDF",
    status: "Pending",
    url: "#",
    propertyId: "prop-6",
    propertyAddress: "303 Birch St, Austin, TX 78731"
  },
  {
    id: "doc-prop6-3",
    name: "Property Photos",
    description: "Professional photographs of the property",
    category: "Other",
    dateCreated: "2025-05-20",
    dateModified: "2025-05-20",
    fileSize: "32.6 MB",
    fileType: "JPG",
    status: "Complete",
    url: "#",
    propertyId: "prop-6",
    propertyAddress: "303 Birch St, Austin, TX 78731"
  },
  {
    id: "doc-prop6-4",
    name: "Virtual Tour",
    description: "3D virtual tour of the property",
    category: "Other",
    dateCreated: "2025-05-21",
    dateModified: "2025-05-21",
    fileSize: "145.2 MB",
    fileType: "PNG",
    status: "Complete",
    url: "#",
    propertyId: "prop-6",
    propertyAddress: "303 Birch St, Austin, TX 78731"
  },

  // Property 7 - 404 Walnut Way (Draft)
  {
    id: "doc-prop7-1",
    name: "Listing Agreement Draft",
    description: "Draft exclusive right to sell agreement",
    category: "Listing Agreement",
    dateCreated: "2025-05-24",
    dateModified: "2025-05-24",
    fileSize: "1.1 MB",
    fileType: "DOCX",
    status: "Pending",
    url: "#",
    propertyId: "prop-7",
    propertyAddress: "404 Walnut Way, Austin, TX 78746",
    sharedWith: ["Seller", "Listing Agent"]
  },
  {
    id: "doc-prop7-2",
    name: "Property Information Sheet",
    description: "Property details for listing preparation",
    category: "Other",
    dateCreated: "2025-05-24",
    dateModified: "2025-05-24",
    fileSize: "0.8 MB",
    fileType: "DOCX",
    status: "Pending",
    url: "#",
    propertyId: "prop-7",
    propertyAddress: "404 Walnut Way, Austin, TX 78746"
  }
];

// Calculate document statistics
export const documentStats = {
  totalDocuments: mockDocuments.length,
  byStatus: {
    complete: mockDocuments.filter(doc => doc.status === 'Complete').length,
    pending: mockDocuments.filter(doc => doc.status === 'Pending').length,
    needsReview: mockDocuments.filter(doc => doc.status === 'Needs Review').length,
    requiresSignature: mockDocuments.filter(doc => doc.status === 'Requires Signature').length
  },
  byCategory: {
    contract: mockDocuments.filter(doc => doc.category === 'Contract').length,
    disclosures: mockDocuments.filter(doc => doc.category === 'Disclosures').length,
    inspections: mockDocuments.filter(doc => doc.category === 'Inspections').length,
    legal: mockDocuments.filter(doc => doc.category === 'Legal').length,
    listingAgreement: mockDocuments.filter(doc => doc.category === 'Listing Agreement').length,
    other: mockDocuments.filter(doc => doc.category === 'Other').length
  },
  byFileType: {
    pdf: mockDocuments.filter(doc => doc.fileType === 'PDF').length,
    docx: mockDocuments.filter(doc => doc.fileType === 'DOCX').length,
    jpg: mockDocuments.filter(doc => doc.fileType === 'JPG').length,
    png: mockDocuments.filter(doc => doc.fileType === 'PNG').length
  }
};

// Get unique property IDs and addresses for filtering
export const uniqueProperties = Array.from(
  new Set(mockDocuments.map(doc => doc.propertyId))
).map(propId => {
  const doc = mockDocuments.find(d => d.propertyId === propId);
  return {
    id: propId,
    address: doc?.propertyAddress || ""
  };
});