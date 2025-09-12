import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ListingDetailHeader } from "./ListingDetailHeader";
import { ListingMetricsHUD } from "./ListingMetricsHUD";
import { MediaSection } from "./MediaSection";
import { NetProceedsSection } from "./NetProceedsSection";
import { HoldingCostsSection } from "./HoldingCostsSection";
import { OffersSection } from "./OffersSection";
import { DetailedPropertyListing } from "../../data/listingDetailMock";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Home, MapPin, Ruler } from "lucide-react";
import { useState } from "react";

interface ListingDetailProps {
  listing: DetailedPropertyListing;
  isOwner?: boolean;
  onNavigateToShowings?: () => void;
  onNavigateToOffers?: () => void;
}

export function ListingDetail({ listing, isOwner = true, onNavigateToShowings, onNavigateToOffers }: ListingDetailProps) {
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  
  return (
    <div className="space-y-6 pb-8">
      <ListingDetailHeader 
        listing={listing} 
        onOpenPhotoModal={() => setShowPhotoModal(true)}
      />
      
      <ListingMetricsHUD 
        listing={listing} 
        isOwner={isOwner} 
        onNavigateToShowings={onNavigateToShowings}
        onNavigateToOffers={onNavigateToOffers}
      />
      
      {/* Main Content */}
      <div className="space-y-6">
        {/* Property Description */}
        <Card>
          <CardHeader>
            <CardTitle>Property Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{listing.propertyType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">{listing.lotSize || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-medium">{listing.yearBuilt || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">MLS Number</p>
                    <p className="font-medium">{listing.mlsNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Listed Date</p>
                    <p className="font-medium">{new Date(listing.listedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="capitalize">
                    {listing.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information - Net Proceeds and Holding Costs */}
        {isOwner && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetProceedsSection listing={listing} />
            <HoldingCostsSection listing={listing} />
          </div>
        )}

        {/* Offers Section for Active Listings */}
        {listing.status === 'Active' && listing.offers && listing.offers.length > 0 && (
          <OffersSection listing={listing} />
        )}
      </div>

      {/* Photo Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Photos - {listing.address}</DialogTitle>
          </DialogHeader>
          <MediaSection listing={listing} />
        </DialogContent>
      </Dialog>
    </div>
  );
}