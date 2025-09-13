import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { mockListings as mockData, PropertyListing } from "../data/mockData";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { isDevMode } from "../lib/devMode";
import { Badge } from "./ui/badge";
import { DraftListingProgressTracker } from "./DraftListingProgressTracker";
import { useIsMobile } from "./ui/use-mobile";

interface PropertyListingsProps {
  onViewListing?: (listingId: string) => void;
  onStartListingFlow?: () => void;
  onResumeDraft?: (listingId: string, lastStep?: string, draftData?: any) => void;
}

export function PropertyListings({ 
  onViewListing, 
  onStartListingFlow, 
  onResumeDraft 
}: PropertyListingsProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadListings();
  }, []);
  
  const loadListings = async () => {
    try {
      const user = await getCurrentUser();
      setUserEmail(user?.email || null);
      
      // Only show mock data if in dev mode
      if (isDevMode(user?.email || null)) {
        setListings(mockData);
      } else {
        // For real users, start with empty listings
        // Later this will load from Supabase
        setListings([]);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getFilteredListings = () => {
    if (activeTab === "all") return listings;
    return listings.filter(listing => 
      listing.status.toLowerCase() === activeTab.toLowerCase()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-success-background text-success-text hover:bg-success-background/80";
      case "pending": return "bg-warning-background text-warning-text hover:bg-warning-background/80";
      case "sold": return "bg-info-background text-info-text hover:bg-info-background/80";
      case "draft": return ""; // We'll use DraftListingBadge instead
      default: return "";
    }
  };

  const handleViewListing = (listingId: string) => {
    if (onViewListing) {
      onViewListing(listingId);
    }
  };
  
  const handleStartListingFlow = () => {
    if (onStartListingFlow) {
      onStartListingFlow();
    }
  };

  const handleResumeDraft = (listingId: string, targetStep?: string) => {
    const listing = mockListings.find(l => l.id === listingId);
    if (onResumeDraft && listing?.draftData) {
      // Use the target step if provided, otherwise use the last step from draft data
      const stepToUse = targetStep || listing.draftData.lastStep;
      onResumeDraft(
        listingId, 
        stepToUse, 
        listing.draftData.data
      );
    }
  };

  const handleDraftRowClick = (listingId: string) => {
    // Toggle selection for draft listings
    if (selectedDraftId === listingId) {
      setSelectedDraftId(null);
    } else {
      setSelectedDraftId(listingId);
    }
  };



  return (
    <Card>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile Layout: Stack vertically */}
        {isMobile ? (
          <div className="space-y-3 px-4 pt-4">
            <Button 
              onClick={handleStartListingFlow}
              className="flex items-center gap-1 w-full h-12 bg-brand-primary hover:bg-primary-hover text-white border-0"
            >
              <Plus className="h-4 w-4" /> List Your Home
            </Button>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
              <TabsTrigger value="sold" className="flex-1">Sold</TabsTrigger>
              <TabsTrigger value="draft" className="flex-1">Draft</TabsTrigger>
            </TabsList>
          </div>
        ) : (
          /* Desktop Layout: Horizontal */
          <div className="flex items-center justify-between px-4 pt-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={handleStartListingFlow}
              className="flex items-center gap-1 bg-brand-primary hover:bg-primary-hover text-white border-0"
            >
              <Plus className="h-4 w-4" /> List Your Home
            </Button>
          </div>
        )}
        
        <TabsContent value={activeTab} className="m-0">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading listings...</div>
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-2xl mb-2">🏠</div>
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Ready to list your property? Get started with just a few simple steps.
                </p>
                <Button 
                  onClick={handleStartListingFlow}
                  className="flex items-center gap-1 bg-brand-primary hover:bg-primary-hover text-white border-0"
                >
                  <Plus className="h-4 w-4" /> List Your First Home
                </Button>
              </div>
            ) : (
            <div className="overflow-hidden">
                {/* Desktop: Table view */}
                {!isMobile ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left align-middle text-xs w-[300px]">Home</th>
                        <th className="h-10 px-4 text-left align-middle text-xs whitespace-nowrap">Price</th>
                        <th className="h-10 px-4 text-left align-middle text-xs">Details</th>
                        <th className="h-10 px-4 text-left align-middle text-xs">Status</th>
                        <th className="h-10 px-4 text-left align-middle text-xs">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredListings().length > 0 ? (
                        getFilteredListings().map((listing) => (
                          <React.Fragment key={listing.id}>
                            <tr 
                              className={`border-b transition-colors hover:bg-muted/50 cursor-pointer ${
                                selectedDraftId === listing.id ? 'bg-muted/30' : ''
                              }`}
                              onClick={() => {
                                // For draft listings, toggle selection instead of immediate action
                                if (listing.status.toLowerCase() === 'draft') {
                                  handleDraftRowClick(listing.id);
                                } else {
                                  handleViewListing(listing.id);
                                }
                              }}
                            >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <ImageWithFallback 
                                  src={listing.image} 
                                  alt={listing.address}
                                  width={80}
                                  height={60}
                                  className="rounded-md object-cover aspect-[4/3]"
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{listing.address.split(',')[0]}</span>
                                  <span className="text-xs text-muted-foreground">{listing.address.split(',').slice(1).join(',').trim()}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle font-medium">
                              {listing.status.toLowerCase() === 'draft' 
                                ? <span className="text-muted-foreground">TBD</span>
                                : `${listing.price.toLocaleString()}`
                              }
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex flex-col">
                                <span className="text-xs">{listing.bedrooms} beds · {listing.bathrooms} baths</span>
                                <span className="text-xs">{listing.squareFeet.toLocaleString()} sq ft · {listing.propertyType}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {listing.status.toLowerCase() === 'draft' ? (
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20">
                                    Draft
                                  </Badge>
                                  {selectedDraftId === listing.id ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              ) : (
                                <Badge className={`${getStatusColor(listing.status)}`}>{listing.status}</Badge>
                              )}
                            </td>
                            <td className="p-4 align-middle">{listing.views.toLocaleString()}</td>
                            </tr>
                            
                            {/* Expanded Progress Tracker for selected draft */}
                            {listing.status.toLowerCase() === 'draft' && selectedDraftId === listing.id && (
                              <tr>
                                <td colSpan={5} className="p-0 border-0">
                                  <div className="bg-muted/20 border-t">
                                    <div className="p-6">
                                      <DraftListingProgressTracker 
                                        onClick={(stepId) => handleResumeDraft(listing.id, stepId)}
                                        lastUpdated={listing.draftData?.lastUpdated}
                                        lastStep={listing.draftData?.lastStep}
                                        draftData={listing.draftData?.data}
                                        className="max-w-4xl mx-auto"
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="text-muted-foreground">No listings in this category</div>
                              <Button 
                                onClick={handleStartListingFlow}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4" /> List Your Home
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  /* Mobile: Card view */
                  <div className="space-y-3 p-4">
                    {getFilteredListings().length > 0 ? (
                      getFilteredListings().map((listing) => (
                        <React.Fragment key={listing.id}>
                          <div 
                            className={`border rounded-lg p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                              selectedDraftId === listing.id ? 'bg-muted/30' : ''
                            }`}
                            onClick={() => {
                              if (listing.status.toLowerCase() === 'draft') {
                                handleDraftRowClick(listing.id);
                              } else {
                                handleViewListing(listing.id);
                              }
                            }}
                          >
                            <div className="space-y-3">
                              {/* Image and Address */}
                              <div className="flex gap-3">
                                <ImageWithFallback 
                                  src={listing.image} 
                                  alt={listing.address}
                                  width={80}
                                  height={60}
                                  className="rounded-md object-cover aspect-[4/3] flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{listing.address.split(',')[0]}</div>
                                  <div className="text-sm text-muted-foreground truncate">
                                    {listing.address.split(',').slice(1).join(',').trim()}
                                  </div>
                                </div>
                                {listing.status.toLowerCase() === 'draft' && (
                                  <div className="flex-shrink-0">
                                    {selectedDraftId === listing.id ? (
                                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Price and Details */}
                              <div className="flex justify-between items-center">
                                <div className="font-medium">
                                  {listing.status.toLowerCase() === 'draft' 
                                    ? <span className="text-muted-foreground">Price TBD</span>
                                    : `${listing.price.toLocaleString()}`
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {listing.views.toLocaleString()} views
                                </div>
                              </div>
                              
                              {/* Specs and Status */}
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                  {listing.bedrooms} beds · {listing.bathrooms} baths · {listing.squareFeet.toLocaleString()} sq ft
                                </div>
                                <div>
                                  {listing.status.toLowerCase() === 'draft' ? (
                                    <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20">
                                      Draft
                                    </Badge>
                                  ) : (
                                    <Badge className={`${getStatusColor(listing.status)}`}>{listing.status}</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded Progress Tracker for selected draft */}
                          {listing.status.toLowerCase() === 'draft' && selectedDraftId === listing.id && (
                            <div className="bg-muted/20 border rounded-lg p-4">
                              <DraftListingProgressTracker 
                                onClick={(stepId) => handleResumeDraft(listing.id, stepId)}
                                lastUpdated={listing.draftData?.lastUpdated}
                                lastStep={listing.draftData?.lastStep}
                                draftData={listing.draftData?.data}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="p-8 text-center border rounded-lg">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="text-muted-foreground">No listings in this category</div>
                          <Button 
                            onClick={handleStartListingFlow}
                            variant="outline"
                            className="flex items-center gap-1 w-full h-12"
                          >
                            <Plus className="h-4 w-4" /> List Your Home
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}