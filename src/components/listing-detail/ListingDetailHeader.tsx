import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DetailedPropertyListing } from "../../data/listingDetailMock";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Camera, MapPin, Calendar, Home } from "lucide-react";

interface ListingDetailHeaderProps {
  listing: DetailedPropertyListing;
  onOpenPhotoModal: () => void;
}

export function ListingDetailHeader({ listing, onOpenPhotoModal }: ListingDetailHeaderProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Property Information */}
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-medium">{formatPrice(listing.price)}</h1>
            <Badge variant="secondary" className="px-3 py-1">
              {listing.status}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{listing.address}</span>
            </div>
            <div className="text-foreground ml-6">
              {listing.city}, {listing.state} {listing.zip}
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>{listing.bedrooms} bed • {listing.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{listing.squareFeet.toLocaleString()} sq ft</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Listed {formatDate(listing.listedDate)}</span>
          </div>
        </div>
        

      </div>
      
      {/* Property Image */}
      <div className="w-full max-w-sm mx-auto lg:w-64 lg:mx-0 flex-shrink-0">
        <div className="relative rounded-lg overflow-hidden bg-muted/20 border border-border/50">
          <div className="aspect-[4/3]">
            <ImageWithFallback
              src={primaryImage?.url || ''}
              alt={primaryImage?.caption || 'Property image'}
              width={256}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-3 right-3">
            <Button
              onClick={onOpenPhotoModal}
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-black shadow-sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              View Photos ({listing.images.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}