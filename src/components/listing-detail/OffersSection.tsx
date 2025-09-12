import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { DetailedPropertyListing, Offer } from "../../data/listingDetailMock";
import { Button } from "../ui/button";
import { FileText, Calendar, Banknote, ChevronRight, Clock, Building, HeadphonesIcon, DollarSign, University } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ReviewOfferModal } from "./ReviewOfferModal";
import { CounterOfferModal } from "./CounterOfferModal";
import { DeclineOfferModal } from "./DeclineOfferModal";
import { AcceptOfferModal } from "./AcceptOfferModal";
import { RealtorHelpOfferModal } from "./RealtorHelpOfferModal";

interface OffersSectionProps {
  listing: DetailedPropertyListing;
}

export function OffersSection({ listing }: OffersSectionProps) {
  const { offers } = listing;
  const [viewContractModalOpen, setViewContractModalOpen] = useState<boolean>(false);
  const [viewAIReviewModalOpen, setViewAIReviewModalOpen] = useState<boolean>(false);
  const [counterOfferModalOpen, setCounterOfferModalOpen] = useState<boolean>(false);
  const [declineOfferModalOpen, setDeclineOfferModalOpen] = useState<boolean>(false);
  const [acceptOfferModalOpen, setAcceptOfferModalOpen] = useState<boolean>(false);
  const [realtorHelpModalOpen, setRealtorHelpModalOpen] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "Accepted": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "Rejected": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "Countered": return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
      default: return "";
    }
  };
  
  const handleViewContract = (offer: Offer) => {
    setSelectedOffer(offer);
    setViewContractModalOpen(true);
  };
  
  const handleViewAIReview = (offer: Offer) => {
    setSelectedOffer(offer);
    setViewAIReviewModalOpen(true);
  };
  
  const handleCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setCounterOfferModalOpen(true);
  };
  
  const handleDeclineOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setDeclineOfferModalOpen(true);
  };
  
  const handleAcceptOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setAcceptOfferModalOpen(true);
  };
  
  const handleRealtorHelp = (offer: Offer) => {
    setSelectedOffer(offer);
    setRealtorHelpModalOpen(true);
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">

          {offers.length === 0 ? (
            <div className="text-center py-6 border rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No offers received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden">
                  <div>
                    <div className="p-4">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(offer.status)}>
                            {offer.status}
                          </Badge>
                          <Badge variant={offer.paymentType === 'Cash' ? 'default' : 'secondary'}>
                            {offer.paymentType === 'Cash' ? '💰 Cash Sale' : '🏦 Financed'}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          Received {new Date(offer.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Purchase Price</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-medium">${offer.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground text-sm">
                              {offer.amount > listing.price ? (
                                <span className="text-green-600">+${(offer.amount - listing.price).toLocaleString()}</span>
                              ) : offer.amount < listing.price ? (
                                <span className="text-red-600">-${(listing.price - offer.amount).toLocaleString()}</span>
                              ) : (
                                "List price"
                              )}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cash Amount</p>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>${offer.cashAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {offer.paymentType === 'Financed' && offer.financedAmount && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Financed Amount</p>
                            <div className="flex items-center gap-2">
                              <University className="h-4 w-4 text-muted-foreground" />
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
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Contingencies</p>
                          <div className="flex flex-wrap gap-2">
                            {offer.contingencies.map((contingency, i) => (
                              <Badge key={i} variant="outline">{contingency}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* First row: View Contract and View AI Contract Review */}
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => handleViewContract(offer)}>View Contract</Button>
                          <Button variant="outline" onClick={() => handleViewAIReview(offer)}>View AI Contract Review</Button>
                        </div>
                        
                        {/* Second row: Accept, Counter, Decline */}
                        <div className="flex flex-wrap gap-2">
                          {offer.status !== "Rejected" && offer.status !== "Accepted" && (
                            <Button 
                              onClick={() => handleAcceptOffer(offer)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => handleCounterOffer(offer)}>Counter</Button>
                          <Button variant="outline" className="text-destructive" onClick={() => handleDeclineOffer(offer)}>Decline</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOffer && (
        <>
          <ReviewOfferModal 
            open={viewContractModalOpen} 
            onClose={() => setViewContractModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={listing.address}
          />
          
          <ReviewOfferModal 
            open={viewAIReviewModalOpen} 
            onClose={() => setViewAIReviewModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={listing.address}
          />
          
          <CounterOfferModal 
            open={counterOfferModalOpen} 
            onClose={() => setCounterOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={listing.address}
            listPrice={listing.price}
          />
          
          <DeclineOfferModal 
            open={declineOfferModalOpen} 
            onClose={() => setDeclineOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={listing.address}
          />
          
          <AcceptOfferModal 
            open={acceptOfferModalOpen} 
            onClose={() => setAcceptOfferModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={listing.address}
            listPrice={listing.price}
          />

          <RealtorHelpOfferModal 
            open={realtorHelpModalOpen} 
            onClose={() => setRealtorHelpModalOpen(false)} 
            offer={selectedOffer}
            propertyAddress={listing.address}
            isSelfService={listing.plan === 'self-service'}
          />
        </>
      )}
    </>
  );
}