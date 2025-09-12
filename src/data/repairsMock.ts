export interface Contractor {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  website?: string;
  description: string;
  areasServed: string[];
  availability: string;
  imageUrl: string;
  verified: boolean;
  pricing?: string;
  certifications?: string[];
  insuranceCoverage?: string;
  yearsInBusiness: number;
}

export interface TradeCategory {
  name: string;
  icon: string; // Icon name from Lucide
  description: string;
  contractors: Contractor[];
}

export const tradeCategories: TradeCategory[] = [
  {
    name: "Plumbing",
    icon: "droplet",
    description: "Licensed plumbers for all your water and pipe needs",
    contractors: [
      {
        id: "plumb-1",
        name: "Quick Fix Plumbing",
        trade: "Plumbing",
        rating: 4.8,
        reviewCount: 156,
        phone: "512-555-1234",
        email: "info@quickfixplumbing.com",
        website: "https://quickfixplumbing.com",
        description: "Specializing in emergency repairs, leaks, and installations. Available 24/7 with no extra charges for nights or weekends.",
        areasServed: ["Austin", "Round Rock", "Cedar Park"],
        availability: "24/7 Emergency Service",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Free estimates, $95/hour + materials",
        certifications: ["Licensed Master Plumber", "Green Plumbing Certified"],
        insuranceCoverage: "Full liability coverage up to $2 million",
        yearsInBusiness: 12
      },
      {
        id: "plumb-2",
        name: "Austin Plumbing Pros",
        trade: "Plumbing",
        rating: 4.6,
        reviewCount: 98,
        phone: "512-555-7890",
        email: "service@austinplumbingpros.com",
        description: "Family-owned business providing quality plumbing services at affordable rates. Specializing in water heaters and re-piping.",
        areasServed: ["Austin", "Lakeway", "Bee Cave"],
        availability: "Mon-Sat, 7 AM - 6 PM",
        imageUrl: "https://images.unsplash.com/photo-1606125554532-eed5edfa6772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "$85/hour, senior discounts available",
        yearsInBusiness: 8
      },
      {
        id: "plumb-3",
        name: "Blue Water Plumbing",
        trade: "Plumbing",
        rating: 4.9,
        reviewCount: 213,
        phone: "512-555-3456",
        email: "contact@bluewaterplumbing.com",
        website: "https://bluewaterplumbing.com",
        description: "Specializing in high-end fixtures and bathroom renovations. Our expert team has worked with Austin's top home builders.",
        areasServed: ["Austin", "Westlake", "Rollingwood"],
        availability: "Mon-Fri, 8 AM - 5 PM",
        imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        certifications: ["Licensed Master Plumber", "Luxury Fixture Specialist"],
        insuranceCoverage: "Full coverage and bonded",
        yearsInBusiness: 15
      }
    ]
  },
  {
    name: "Electrical",
    icon: "zap",
    description: "Certified electricians for repairs, installations, and upgrades",
    contractors: [
      {
        id: "elec-1",
        name: "Power Up Electric",
        trade: "Electrical",
        rating: 4.9,
        reviewCount: 178,
        phone: "512-555-8765",
        email: "service@powerupelectric.com",
        website: "https://powerupelectric.com",
        description: "Master electricians providing residential and commercial services. Specializing in panel upgrades, smart home wiring, and electrical safety inspections.",
        areasServed: ["Austin", "Round Rock", "Georgetown"],
        availability: "Mon-Fri, 7 AM - 6 PM, Emergency service available",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "$95/hour, free estimates on large jobs",
        certifications: ["Master Electrician License", "OSHA Certified"],
        insuranceCoverage: "Fully insured and bonded",
        yearsInBusiness: 18
      },
      {
        id: "elec-2",
        name: "Bright Spark Electrical",
        trade: "Electrical",
        rating: 4.7,
        reviewCount: 124,
        phone: "512-555-4321",
        email: "info@brightsparkelectrical.com",
        description: "Residential electrical specialists focusing on energy-efficient solutions, lighting, and home automation systems.",
        areasServed: ["Austin", "Pflugerville", "Manor"],
        availability: "Mon-Sat, 8 AM - 7 PM",
        imageUrl: "https://images.unsplash.com/photo-1629904869392-ae2a682d4d01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Standard rate: $85/hour",
        yearsInBusiness: 7
      },
      {
        id: "elec-3",
        name: "Tesla Electrical Services",
        trade: "Electrical",
        rating: 4.8,
        reviewCount: 156,
        phone: "512-555-9012",
        email: "contact@teslaelectric.com",
        website: "https://teslaelectricalaustin.com",
        description: "Specializing in EV charger installations, solar panel connections, and whole-home surge protection.",
        areasServed: ["Austin", "Bee Cave", "Lakeway", "West Lake Hills"],
        availability: "7 days a week, by appointment",
        imageUrl: "https://images.unsplash.com/photo-1609235160139-83306af72dfd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        certifications: ["Tesla Certified Installer", "Solar PV Certified"],
        insuranceCoverage: "$2 million liability coverage",
        yearsInBusiness: 10
      }
    ]
  },
  {
    name: "HVAC",
    icon: "thermometer",
    description: "Heating, ventilation, and air conditioning specialists",
    contractors: [
      {
        id: "hvac-1",
        name: "Cool Breeze HVAC",
        trade: "HVAC",
        rating: 4.7,
        reviewCount: 189,
        phone: "512-555-6543",
        email: "service@coolbreezehvac.com",
        website: "https://coolbreezehvac.com",
        description: "Full service heating and cooling specialists. We repair, maintain, and install all brands of HVAC equipment with 24/7 emergency service.",
        areasServed: ["Austin", "Round Rock", "Cedar Park", "Leander"],
        availability: "24/7 Service",
        imageUrl: "https://images.unsplash.com/photo-1581775231124-4f70b143b85c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Service call: $89, then hourly rate applies",
        certifications: ["NATE Certified", "EPA 608 Certified"],
        insuranceCoverage: "Fully insured and bonded",
        yearsInBusiness: 14
      },
      {
        id: "hvac-2",
        name: "Comfort Zone HVAC",
        trade: "HVAC",
        rating: 4.8,
        reviewCount: 145,
        phone: "512-555-2109",
        email: "help@comfortzonehvac.com",
        description: "Specializing in energy-efficient HVAC solutions, smart thermostats, and indoor air quality improvements.",
        areasServed: ["Austin", "Kyle", "Buda", "San Marcos"],
        availability: "Mon-Sat, 7 AM - 8 PM, Emergency service available",
        imageUrl: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Free diagnostics with repair, maintenance plans available",
        yearsInBusiness: 9
      }
    ]
  },
  {
    name: "Roofing",
    icon: "home",
    description: "Professional roofers for repairs, replacements, and inspections",
    contractors: [
      {
        id: "roof-1",
        name: "Top Notch Roofing",
        trade: "Roofing",
        rating: 4.9,
        reviewCount: 213,
        phone: "512-555-8901",
        email: "info@topnotchroofing.com",
        website: "https://topnotchroofing.com",
        description: "Premium roofing services with expertise in shingle, tile, metal, and flat roofing systems. Free storm damage inspections.",
        areasServed: ["Austin", "Round Rock", "Cedar Park", "Georgetown"],
        availability: "Mon-Sat, 7 AM - 7 PM",
        imageUrl: "https://images.unsplash.com/photo-1632759145351-1d5801caa2ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Free inspections and estimates",
        certifications: ["GAF Master Elite Contractor", "Owens Corning Platinum Preferred"],
        insuranceCoverage: "Fully insured with workers' comp",
        yearsInBusiness: 22
      },
      {
        id: "roof-2",
        name: "Austin Metal Roofing",
        trade: "Roofing",
        rating: 4.8,
        reviewCount: 178,
        phone: "512-555-3456",
        email: "contact@austinmetalroofing.com",
        description: "Specializing in durable, energy-efficient metal roofing systems designed for Texas weather. Lifetime warranties available.",
        areasServed: ["Austin", "Lakeway", "Bee Cave", "Dripping Springs"],
        availability: "Mon-Fri, 8 AM - 6 PM",
        imageUrl: "https://images.unsplash.com/photo-1622883533067-7bd5dc7c03bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Premium metal roofing starting at $14/sq ft",
        yearsInBusiness: 15
      }
    ]
  },
  {
    name: "Painting",
    icon: "paintbrush",
    description: "Interior and exterior painters for homes and businesses",
    contractors: [
      {
        id: "paint-1",
        name: "Fresh Coat Painters",
        trade: "Painting",
        rating: 4.7,
        reviewCount: 142,
        phone: "512-555-7654",
        email: "schedule@freshcoatpainters.com",
        website: "https://freshcoatpainters.com",
        description: "Interior and exterior painting services for residential and commercial properties. ECO-friendly options available.",
        areasServed: ["Austin", "Round Rock", "Pflugerville", "Georgetown"],
        availability: "Mon-Sat, 8 AM - 6 PM",
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Free detailed estimates, competitive pricing",
        insuranceCoverage: "Fully insured",
        yearsInBusiness: 11
      },
      {
        id: "paint-2",
        name: "Color Theory Painting",
        trade: "Painting",
        rating: 4.9,
        reviewCount: 187,
        phone: "512-555-2345",
        email: "info@colortheorypainting.com",
        description: "High-end residential painting with professional color consulting. Specializing in custom finishes and cabinetry painting.",
        areasServed: ["Austin", "West Lake Hills", "Rollingwood", "Tarrytown"],
        availability: "By appointment only",
        imageUrl: "https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Premium services, free color consultations",
        certifications: ["Benjamin Moore Certified", "Fine Paints of Europe Certified"],
        yearsInBusiness: 14
      }
    ]
  },
  {
    name: "Flooring",
    icon: "grid-3x3",
    description: "Flooring installation, repair, and refinishing services",
    contractors: [
      {
        id: "floor-1",
        name: "Austin Floor Experts",
        trade: "Flooring",
        rating: 4.8,
        reviewCount: 173,
        phone: "512-555-9876",
        email: "sales@austinfloorexperts.com",
        website: "https://austinfloorexperts.com",
        description: "Comprehensive flooring services including hardwood, laminate, tile, vinyl, and carpet. Installation and refinishing services available.",
        areasServed: ["Austin", "Round Rock", "Cedar Park", "Leander"],
        availability: "Mon-Fri, 8 AM - 6 PM, Sat by appointment",
        imageUrl: "https://images.unsplash.com/photo-1622126807280-9b5b32b28e77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Free in-home estimates",
        certifications: ["NWFA Certified Installer"],
        insuranceCoverage: "Fully insured and bonded",
        yearsInBusiness: 18
      },
      {
        id: "floor-2",
        name: "Hardwood Revival",
        trade: "Flooring",
        rating: 4.9,
        reviewCount: 211,
        phone: "512-555-0123",
        email: "info@hardwoodrevival.com",
        description: "Specializing in hardwood floor restoration, refinishing, and installation. Historical home expertise and eco-friendly options.",
        areasServed: ["Austin", "Hyde Park", "Travis Heights", "Clarksville"],
        availability: "Mon-Fri, 9 AM - 5 PM",
        imageUrl: "https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d57?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Custom quotes based on project scope",
        yearsInBusiness: 25
      }
    ]
  },
  {
    name: "Landscaping",
    icon: "trees",
    description: "Yard maintenance, landscaping design, and outdoor improvements",
    contractors: [
      {
        id: "land-1",
        name: "Green Thumb Landscaping",
        trade: "Landscaping",
        rating: 4.7,
        reviewCount: 156,
        phone: "512-555-8765",
        email: "schedule@greenthumblandscaping.com",
        website: "https://greenthumblandscaping.com",
        description: "Full-service landscaping company offering design, installation, and maintenance. Drought-resistant and native plant specialists.",
        areasServed: ["Austin", "Bee Cave", "Lakeway", "West Lake Hills"],
        availability: "Mon-Fri, 7 AM - 6 PM",
        imageUrl: "https://images.unsplash.com/photo-1591386767153-987783380885?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Free landscape design with installation package",
        certifications: ["Texas Nursery & Landscape Association", "Irrigation License"],
        insuranceCoverage: "Fully insured",
        yearsInBusiness: 13
      },
      {
        id: "land-2",
        name: "Austin Yard Transformations",
        trade: "Landscaping",
        rating: 4.8,
        reviewCount: 132,
        phone: "512-555-4321",
        email: "info@austinyardtransformations.com",
        description: "Specializing in xeriscaping, outdoor living spaces, and water features. Creating beautiful, sustainable landscapes.",
        areasServed: ["Austin", "Round Rock", "Pflugerville", "Cedar Park"],
        availability: "Year-round service",
        imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        verified: true,
        pricing: "Custom quotes based on project scope",
        yearsInBusiness: 9
      }
    ]
  }
];