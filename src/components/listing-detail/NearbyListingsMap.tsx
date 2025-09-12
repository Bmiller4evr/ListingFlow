import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { NearbyListing, DetailedPropertyListing } from "../../data/listingDetailMock";
import { ArrowLeft, Home, MapPin, List, Bed, Bath, Square, DollarSign } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface NearbyListingsMapProps {
  listing: DetailedPropertyListing;
  nearbyListings: NearbyListing[];
  onViewNearbyListing?: (nearbyListingId: string) => void;
  onBackToList: () => void;
}

export function NearbyListingsMap({ listing, nearbyListings, onViewNearbyListing, onBackToList }: NearbyListingsMapProps) {
  const [selectedListing, setSelectedListing] = useState<NearbyListing | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "sold": return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
      default: return "";
    }
  };
  
  const handleViewDetails = (nearbyListingId: string) => {
    if (onViewNearbyListing) {
      onViewNearbyListing(nearbyListingId);
    }
  };
  
  // Mock function to render map pins
  const renderMapPin = (nearbyListing: NearbyListing, index: number) => {
    const isSelected = selectedListing?.id === nearbyListing.id;
    const angle = (index / nearbyListings.length) * 2 * Math.PI;
    const radius = 130; // Controls how far pins are from center
    
    // Calculate position in a circular pattern around the center
    // Center is at 50% horizontally and 40% vertically
    const left = 50 + radius * Math.cos(angle);
    const top = 40 + radius * Math.sin(angle);
    
    const handleClickPin = () => {
      setSelectedListing(nearbyListing);
    };
    
    return (
      <div 
        key={nearbyListing.id}
        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-110'}`}
        style={{left: `${left}%`, top: `${top}%`}}
        onClick={handleClickPin}
      >
        <div className="flex flex-col items-center">
          <div className={`p-1 rounded-full border-2 ${isSelected ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-background'}`}>
            <MapPin className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            ${(nearbyListing.price / 1000).toFixed(0)}K
          </div>
        </div>
      </div>
    );
  };
  
  // Main property pin in the center
  const renderMainPropertyPin = () => {
    return (
      <div 
        className="absolute left-1/2 top-2/5 transform -translate-x-1/2 -translate-y-1/2 z-30"
      >
        <div className="flex flex-col items-center">
          <div className="p-1 rounded-full border-2 border-primary bg-primary">
            <Home className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="mt-1 px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
            Your Property
          </div>
        </div>
      </div>
    );
  };
  
  // Function to calculate straight-line distance between two coordinates
  // This is a mock function that doesn't calculate real distances
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    return "0.3 miles"; // Mock value
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onBackToList} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
            <h2>Map View of Nearby Listings</h2>
          </div>
          <Button variant="outline" onClick={onBackToList} className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div 
              ref={mapContainerRef}
              className="relative w-full h-[500px] bg-muted/30 rounded-lg border overflow-hidden"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-background/70"></div>
              
              {/* Property locations */}
              {renderMainPropertyPin()}
              {nearbyListings.map((nearbyListing, index) => renderMapPin(nearbyListing, index))}
              
              {/* Annotations */}
              <div className="absolute left-4 bottom-4 z-40 bg-background/80 p-3 rounded-lg border">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1 rounded-full bg-primary flex items-center justify-center">
                      <Home className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span>Your Property</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1 rounded-full border border-muted-foreground flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>Nearby Properties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {selectedListing ? (
              <div className="space-y-4">
                <div className="relative">
                  <ImageWithFallback 
                    src={selectedListing.image}
                    alt={selectedListing.address}
                    width={400}
                    height={250}
                    className="w-full h-[200px] object-cover rounded-lg"
                  />
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(selectedListing.status)}`}>
                    {selectedListing.status}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="mb-1">{selectedListing.address}</h3>
                  <p className="text-lg font-medium">${selectedListing.price.toLocaleString()}</p>
                  
                  <div className="grid grid-cols-3 gap-2 my-3">
                    <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                      <Bed className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{selectedListing.bedrooms}</span>
                      <span className="text-xs text-muted-foreground">Beds</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                      <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{selectedListing.bathrooms}</span>
                      <span className="text-xs text-muted-foreground">Baths</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                      <Square className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{(selectedListing.squareFeet / 1000).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">K sq ft</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 my-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedListing.distance} from your property</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <DollarSign className="h-4 w-4" />
                    <span>${Math.round(selectedListing.price / selectedListing.squareFeet)}/sq ft</span>
                    <span>•</span>
                    <span>{selectedListing.daysOnMarket} days on market</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-2" 
                    onClick={() => handleViewDetails(selectedListing.id)}
                  >
                    View Property Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-muted/30 rounded-lg border">
                <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="mb-1">Select a Property</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any property pin on the map to see details
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}