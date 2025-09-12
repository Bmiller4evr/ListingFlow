import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileText, Calendar, Banknote, ChevronRight, ChevronDown, Clock, Building, HeadphonesIcon, DollarSign, University, Home } from "lucide-react";
import { ReviewOfferModal } from "./listing-detail/ReviewOfferModal";
import { AIContractReviewModal } from "./listing-detail/AIContractReviewModal";
import { CounterOfferModal } from "./listing-detail/CounterOfferModal";
import { DeclineOfferModal } from "./listing-detail/DeclineOfferModal";
import { AcceptOfferModal } from "./listing-detail/AcceptOfferModal";
import { RealtorHelpOfferModal } from "./listing-detail/RealtorHelpOfferModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Mock data for offers across all properties
const mockOffersData = [
  {
    propertyId: "listing-1",
    propertyAddress: "123 Oak Street, San Francisco, CA",
    listPrice: 875000,
    plan: "full-service",
    offers: [
      {
        id: "offer-1",
        amount: 890000,
        cashAmount: 178000,
        financedAmount: 712000,
        earnestMoney: 17800,
        inspectionPeriod: 10,
        closingDate: "2025-02-28",
        contingencies: ["Financing", "Inspection", "Appraisal"],
        buyerName: "Emily Johnson",
        agentName: "Mark Wilson",
        agentPhone: "(555) 234-5678",
        date: "2025-01-14",
        status: "Pending",
        paymentType: "Financed",
        lenderName: "First National Bank",
        titleCompany: "Secure Title Co."
      },
      {
        id: "offer-2",
        amount: 875000,
        cashAmount: 875000,
        earnestMoney: 26250,
        inspectionPeriod: 7,
        closingDate: "2025-02-20",
        contingencies: ["Inspection"],
        buyerName: "David Chen",
        agentName: "Lisa Rodriguez",
        agentPhone: "(555) 345-6789",
        date: "2025-01-13",
        status: "Countered",
        paymentType: "Cash",
        titleCompany: "Premier Title Services"
      }
    ]
  },
  {
    propertyId: "listing-2", 
    propertyAddress: "456 Pine Avenue, San Francisco, CA",
    listPrice: 1200000,
    plan: "self-service",
    offers: [
      {
        id: "offer-3",
        amount: 1250000,
        cashAmount: 250000,
        financedAmount: 1000000,
        earnestMoney: 25000,
        inspectionPeriod: 14,
        closingDate: "2025-03-15",
        contingencies: ["Financing", "Inspection"],
        buyerName: "Robert Martinez",
        agentName: "Jennifer White",
        agentPhone: "(555) 456-7890",
        date: "2025-01-15",
        status: "Pending",
        paymentType: "Financed",
        lenderName: "Bay Area Credit Union",
        titleCompany: "Golden Gate Title"
      }
    ]
  }
];

interface Offer {
  id: string;
  amount: number;
  cashAmount: number;
  financedAmount?: number;
  earnestMoney: number;
  inspectionPeriod: number;
  closingDate: string;
  contingencies: string[];
  buyerName: string;
  agentName: string;
  agentPhone: string;
  date: string;
  status: string;
  paymentType: "Cash" | "Financed";
  lenderName?: string;
  titleCompany: string;
}

interface PropertyOffers {
  propertyId: string;
  propertyAddress: string;
  listPrice: number;
  plan: string;
  offers: Offer[];
}

export function Offers() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyOffers | null>(null);
  const [reviewOfferModalOpen, setReviewOfferModalOpen] = useState(false);
  const [aiContractReviewModalOpen, setAiContractReviewModalOpen] = useState(false);
  const [counterOfferModalOpen, setCounterOfferModalOpen] = useState(false);
  const [declineOfferModalOpen, setDeclineOfferModalOpen] = useState(false);
  const [acceptOfferModalOpen, setAcceptOfferModalOpen] = useState(false);
  const [realtorHelpModalOpen, setRealtorHelpModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "Accepted": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "Rejected": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "Countered": return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
      default: return "";
    }
  };

  const handleReviewOffer = (offer: Offer, property: PropertyOffers) => {
    setSelectedOffer(offer);
    setSelectedProperty(property);
    setReviewOfferModalOpen(true);
  };

  const handleAIContractReview = (offer: Offer, property: PropertyOffers) => {
    setSelectedOffer(offer);
    setSelectedProperty(property);
    setAiContractReviewModalOpen(true);
  };

  const handleCounterOffer = (offer: Offer, property: PropertyOffers) => {
    setSelectedOffer(offer);
    setSelectedProperty(property);
    setCounterOfferModalOpen(true);
  };

  const handleDeclineOffer = (offer: Offer, property: PropertyOffers) => {
    setSelectedOffer(offer);
    setSelectedProperty(property);
    setDeclineOfferModalOpen(true);
  };

  const handleAcceptOffer = (offer: Offer, property: PropertyOffers) => {
    setSelectedOffer(offer);
    setSelectedProperty(property);
    setAcceptOfferModalOpen(true);
  };

  const handleRealtorHelp = (offer: Offer, property: PropertyOffers) => {
    setSelectedOffer(offer);
    setSelectedProperty(property);
    setRealtorHelpModalOpen(true);
  };

  const toggleOfferExpansion = (offerId: string) => {
    const newExpanded = new Set(expandedOffers);
    if (newExpanded.has(offerId)) {
      newExpanded.delete(offerId);
    } else {
      newExpanded.add(offerId);
    }
    setExpandedOffers(newExpanded);
  };

  // Filter offers based on selected filters
  const filteredData = mockOffersData
    .filter(property => propertyFilter === "all" || property.propertyId === propertyFilter)
    .map(property => ({
      ...property,
      offers: property.offers.filter(offer => statusFilter === "all" || offer.status === statusFilter)
    }))
    .filter(property => property.offers.length > 0);



  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {mockOffersData.map(property => (
              <SelectItem key={property.propertyId} value={property.propertyId}>
                {property.propertyAddress}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Countered">Countered</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Offers List */}
      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No offers found</h3>
            <p className="text-muted-foreground">
              {statusFilter === "all" && propertyFilter === "all" 
                ? "You haven't received any offers yet."
                : "No offers match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredData.map(property => (
            <Card key={property.propertyId}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{property.propertyAddress}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Listed at ${property.listPrice.toLocaleString()} • {property.offers.length} offer{property.offers.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {property.offers.map(offer => {
                  const isExpanded = expandedOffers.has(offer.id);
                  return (
                    <Card key={offer.id} className="overflow-hidden">
                      <div>
                        {/* Collapsible Header - Always Visible */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleOfferExpansion(offer.id)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(offer.status)}>
                                {offer.status}
                              </Badge>
                              <Badge variant={offer.paymentType === 'Cash' ? 'default' : 'secondary'}>
                                {offer.paymentType === 'Cash' ? '💰 Cash Sale' : '🏦 Financed'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                Received {new Date(offer.date).toLocaleDateString()}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>

                          {/* Summary View - Always Visible */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Purchase Price</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-medium">${offer.amount.toLocaleString()}</span>
                                <span className="text-muted-foreground text-sm">
                                  {offer.amount > property.listPrice ? (
                                    <span className="text-muted-foreground">+${(offer.amount - property.listPrice).toLocaleString()}</span>
                                  ) : offer.amount < property.listPrice ? (
                                    <span className="text-muted-foreground">-${(property.listPrice - offer.amount).toLocaleString()}</span>
                                  ) : (
                                    "List price"
                                  )}
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Closing Date</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(offer.closingDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details - Only Visible When Expanded */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Cash Amount</p>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span>${offer.cashAmount.toLocaleString()}</span>
                                </div>
                              </div>

                              {offer.financedAmount && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Financed Amount</p>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>${offer.financedAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              )}

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Earnest Money</p>
                                <span>${offer.earnestMoney.toLocaleString()}</span>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Inspection Period</p>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{offer.inspectionPeriod} days</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Closing Date</p>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{new Date(offer.closingDate).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {offer.lenderName && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Lender</p>
                                  <div className="flex items-center gap-2">
                                    <University className="h-4 w-4 text-muted-foreground" />
                                    <span>{offer.lenderName}</span>
                                  </div>
                                </div>
                              )}

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Title Company</p>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span>{offer.titleCompany || "Not specified"}</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">From</p>
                                <p className="mb-0.5">{offer.buyerName}</p>
                                <p className="text-sm text-muted-foreground">Agent: {offer.agentName}</p>
                              </div>

                              <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground mb-1">Contingencies</p>
                                <div className="flex flex-wrap gap-1">
                                  {offer.contingencies.map((contingency, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{contingency}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button onClick={() => handleReviewOffer(offer, property)}>View Contract</Button>
                              <Button variant="outline" onClick={() => handleAIContractReview(offer, property)}>View AI Contract Review</Button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {offer.status !== "Rejected" && offer.status !== "Accepted" && (
                                <Button 
                                  onClick={() => handleAcceptOffer(offer, property)}
                                  className="btn-accept"
                                >
                                  Accept
                                </Button>
                              )}
                              <Button variant="outline" onClick={() => handleCounterOffer(offer, property)}>Counter</Button>
                              <Button className="btn-decline" onClick={() => handleDeclineOffer(offer, property)}>Decline</Button>
                              <Button 
                                variant="outline"
                                className="gap-1"
                                onClick={() => handleRealtorHelp(offer, property)}
                              >
                                <HeadphonesIcon className="h-4 w-4" />
                                Get Help with Offer
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedOffer && selectedProperty && (
        <>
          <ReviewOfferModal 
            open={reviewOfferModalOpen} 
            onClose={() => setReviewOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={selectedProperty.propertyAddress}
          />

          <AIContractReviewModal 
            open={aiContractReviewModalOpen} 
            onClose={() => setAiContractReviewModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={selectedProperty.propertyAddress}
            listPrice={selectedProperty.listPrice}
          />
          
          <CounterOfferModal 
            open={counterOfferModalOpen} 
            onClose={() => setCounterOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={selectedProperty.propertyAddress}
            listPrice={selectedProperty.listPrice}
          />
          
          <DeclineOfferModal 
            open={declineOfferModalOpen} 
            onClose={() => setDeclineOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={selectedProperty.propertyAddress}
          />

          <AcceptOfferModal 
            open={acceptOfferModalOpen} 
            onClose={() => setAcceptOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={selectedProperty.propertyAddress}
            listPrice={selectedProperty.listPrice}
          />

          <RealtorHelpOfferModal 
            open={realtorHelpModalOpen} 
            onClose={() => setRealtorHelpModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={selectedProperty.propertyAddress}
            isSelfService={selectedProperty.plan === 'self-service'}
          />
        </>
      )}
    </div>
  );
}