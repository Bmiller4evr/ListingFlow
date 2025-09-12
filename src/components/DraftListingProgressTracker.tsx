import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, ChevronDown, ChevronRight, Check, Clock, Circle, Eye } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";


interface DraftListingProgressTrackerProps {
  onClick: (stepId?: string) => void;
  lastUpdated?: string;
  lastStep?: string;
  draftData?: any;
  className?: string;
}

interface ListingStep {
  id: string;
  title: string;
  estimatedTime: string;
  isCompleted: boolean;
  isCurrentStep: boolean;
}

export function DraftListingProgressTracker({ 
  onClick, 
  lastUpdated, 
  lastStep, 
  draftData,
  className 
}: DraftListingProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBasicInfoSummary, setShowBasicInfoSummary] = useState(false);
  const [showTitleholderSummary, setShowTitleholderSummary] = useState(false);
  
  // Define the 10 main listing creation steps (matching actual ListingCreationFlow)
  const getListingSteps = (): ListingStep[] => {
    // Map lastStep values to our standardized step IDs
    const stepMapping: Record<string, string> = {
      'address': 'basic-info', // Legacy mapping - address is now part of basic info
      'property-specs': 'basic-info', // Legacy mapping - property specs is now part of basic info
      'home-facts': 'basic-info', // Legacy mapping - home facts is now part of basic info
      'basic-info': 'basic-info',
      'listing-service': 'listing-service',
      'title-holder': 'titleholder',
      'titleholder': 'titleholder',
      'titleholder-information': 'titleholder',
      'mortgages-taxes-liens': 'financial',
      'financial-info': 'financial', // Legacy mapping
      'sellers-disclosure': 'disclosure',
      'seller-disclosure': 'disclosure', // Legacy mapping
      'additional-information': 'additional-info',
      'secure-access': 'showing-access',
      'access-and-showings': 'showing-access', // Legacy mapping
      'showing-access': 'showing-access',
      'property-media': 'property-media',
      'listing-price': 'listing-price',
      'sign-paperwork': 'sign-paperwork'
    };
    
    const currentStepId = stepMapping[lastStep || ''] || 'basic-info';
    
    return [
      {
        id: 'basic-info',
        title: 'Basic Information',
        estimatedTime: '3-5 minutes',
        isCompleted: draftData?.basicInfo ? true : false,
        isCurrentStep: currentStepId === 'basic-info'
      },
      {
        id: 'listing-service',
        title: 'Listing Service',
        estimatedTime: '2-3 minutes',
        isCompleted: draftData?.listingService && draftData.listingService.serviceType && draftData.listingService.termsAccepted ? true : false,
        isCurrentStep: currentStepId === 'listing-service'
      },
      {
        id: 'titleholder',
        title: 'Titleholder Information',
        estimatedTime: '3-5 minutes',
        isCompleted: draftData?.titleHolder && draftData.titleHolder.numberOfOwners && draftData.titleHolder.owners && draftData.titleHolder.owners.length > 0 ? true : false,
        isCurrentStep: currentStepId === 'titleholder'
      },
      {
        id: 'financial',
        title: 'Mortgage, Taxes and Liens',
        estimatedTime: '2-10 minutes',
        isCompleted: draftData?.financialInfo ? true : false,
        isCurrentStep: currentStepId === 'financial'
      },
      {
        id: 'disclosure',
        title: 'Sellers Disclosure',
        estimatedTime: '5-10 minutes',
        isCompleted: draftData?.sellerDisclosure ? true : false,
        isCurrentStep: currentStepId === 'disclosure'
      },
      {
        id: 'additional-info',
        title: 'Additional Information',
        estimatedTime: '3-5 minutes',
        isCompleted: draftData?.additionalInfo ? true : false,
        isCurrentStep: currentStepId === 'additional-info'
      },
      {
        id: 'showing-access',
        title: 'Showing Access',
        estimatedTime: '3-5 minutes',
        isCompleted: draftData?.secureAccess && draftData.secureAccess.videoWatched && draftData.secureAccess.accessMethodSelected ? true : false,
        isCurrentStep: currentStepId === 'showing-access'
      },
      {
        id: 'property-media',
        title: 'Property Media',
        estimatedTime: '5-7 minutes',
        isCompleted: draftData?.propertyMedia && draftData.propertyMedia.videoWatched && draftData.propertyMedia.photographyScheduled ? true : false,
        isCurrentStep: currentStepId === 'property-media'
      },
      {
        id: 'listing-price',
        title: 'Listing Price',
        estimatedTime: '3-5 minutes',
        isCompleted: draftData?.listingPrice && draftData.listingPrice.videoWatched && draftData.listingPrice.priceSubmitted ? true : false,
        isCurrentStep: currentStepId === 'listing-price'
      },


      {
        id: 'sign-paperwork',
        title: 'Sign Paperwork',
        estimatedTime: '5-10 minutes',
        isCompleted: draftData?.signPaperwork && draftData.signPaperwork.allRequiredDocsSigned ? true : false,
        isCurrentStep: currentStepId === 'sign-paperwork'
      }
    ];
  };
  
  const steps = getListingSteps();
  const completedSteps = steps.filter(step => step.isCompleted).length;
  
  const getStepIcon = (step: ListingStep) => {
    if (step.isCompleted) {
      return <Check className="h-4 w-4 text-green-600" />;
    } else if (step.isCurrentStep) {
      return <Clock className="h-4 w-4 text-blue-600" />;
    } else {
      return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStepStatus = (step: ListingStep) => {
    if (step.isCompleted) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>;
    } else if (step.isCurrentStep) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Pending</Badge>;
    }
  };

  const handleStepClick = (step: ListingStep) => {
    // Show summary modals for completed basic-info and titleholder steps
    if (step.id === 'basic-info' && step.isCompleted) {
      setShowBasicInfoSummary(true);
    } else if (step.id === 'titleholder' && step.isCompleted) {
      setShowTitleholderSummary(true);
    } else {
      // For all other steps (completed or pending), navigate to that step
      const stepMapping: Record<string, string> = {
        'basic-info': 'basic-info',
        'titleholder': 'titleholder-information',
        'financial': 'mortgages-taxes-liens',
        'disclosure': 'sellers-disclosure',
        'additional-info': 'additional-information',
        'showing-access': 'showing-access',
        'property-media': 'property-media',
        'listing-price': 'listing-price',
        'sign-paperwork': 'sign-paperwork'
      };
      
      const targetStep = stepMapping[step.id] || step.id;
      onClick(targetStep);
    }
  };

  const renderTitleholderSummary = () => {
    const titleholderData = draftData?.titleHolder;
    
    if (!titleholderData) {
      console.log('No titleholder data found:', draftData);
      return null;
    }

    // Debug logging to understand the data structure
    console.log('Titleholder data:', titleholderData);
    console.log('Owners array:', titleholderData.owners);

    return (
      <Dialog open={showTitleholderSummary} onOpenChange={setShowTitleholderSummary}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Titleholder Information - Complete Summary
            </DialogTitle>
            <DialogDescription>
              Review the titleholder and property ownership information you provided.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4>Owned Less Than 2 Years</h4>
                    <p className="text-muted-foreground">
                      {titleholderData.ownedLessThanTwoYears === 'yes' ? 'Yes' : 
                       titleholderData.ownedLessThanTwoYears === 'no' ? 'No' : 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4>Homestead Exemption</h4>
                    <p className="text-muted-foreground">
                      {titleholderData.hasHomesteadExemption === 'yes' ? 'Yes' :
                       titleholderData.hasHomesteadExemption === 'no' ? 'No' :
                       titleholderData.hasHomesteadExemption === 'dont-know' ? "I don't know" : 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4>Property Insurance</h4>
                    <p className="text-muted-foreground">
                      {titleholderData.isPropertyInsured === 'yes' ? 'Yes, property is insured' :
                       titleholderData.isPropertyInsured === 'no' ? 'No, property is not insured' : 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4>Number of Owners</h4>
                    <p className="text-muted-foreground">
                      {titleholderData.numberOfOwners && titleholderData.numberOfOwners !== '' ? 
                        `${titleholderData.numberOfOwners} owner${titleholderData.numberOfOwners !== '1' ? 's' : ''}` : 
                        <span className="text-red-600">Required field missing - this should not be completed without specifying number of owners</span>
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            {titleholderData.owners && titleholderData.owners.length > 0 ? (
              <div className="space-y-4">
                <h3>Owner Information</h3>
                {titleholderData.owners.map((owner: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>Owner {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4>Full Name</h4>
                          <p className="text-muted-foreground">
                            {owner.firstName && owner.lastName ? 
                              `${owner.firstName.trim()} ${owner.lastName.trim()}` : 
                              <span className="text-red-600">Name not provided</span>
                            }
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4>Phone Number</h4>
                          <p className="text-muted-foreground">
                            {owner.phone && owner.phone.trim() !== '' ? 
                              owner.phone : 
                              <span className="text-red-600">Phone not provided</span>
                            }
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4>Email Address</h4>
                          <p className="text-muted-foreground">
                            {owner.email && owner.email.trim() !== '' ? 
                              owner.email : 
                              <span className="text-red-600">Email not provided</span>
                            }
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4>Capacity to Sign</h4>
                          <p className="text-muted-foreground">
                            {owner.hasCapacity === 'yes' ? 'Yes, has health and capacity to sign paperwork' :
                             owner.hasCapacity === 'no' ? 'No, does not have capacity to sign paperwork' : 
                             <span className="text-red-600">Not specified</span>}
                          </p>
                        </div>
                      </div>

                      {/* Legal Information */}
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h4>Divorce History</h4>
                            <p className="text-muted-foreground">
                              {owner.involvedInDivorce === 'yes' ? 'Yes, involved in divorce since property acquisition' :
                               owner.involvedInDivorce === 'no' ? 'No divorce involvement since property acquisition' : 
                               <span className="text-red-600">Not specified</span>}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4>Citizenship Status</h4>
                            <p className="text-muted-foreground">
                              {owner.isNonUSCitizen === 'yes' ? 'Non-US Citizen' :
                               owner.isNonUSCitizen === 'no' ? 'US Citizen' : 
                               <span className="text-red-600">Not specified</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-red-600">No owner information available. This step should not be marked as completed without owner details.</p>
                </CardContent>
              </Card>
            )}

            {/* Data Debug Section - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-red-600">Debug Information (Development Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(titleholderData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setShowTitleholderSummary(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderBasicInfoSummary = () => {
    const basicInfoData = draftData?.basicInfo;
    
    if (!basicInfoData) return null;

    const { address, propertySpecs, hasExistingSurvey, occupancyStatus } = basicInfoData;

    return (
      <Dialog open={showBasicInfoSummary} onOpenChange={setShowBasicInfoSummary}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Basic Information
            </DialogTitle>
            <DialogDescription>
              Review the basic information you provided about your property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Property Address */}
            {address && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {address.street}<br />
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Property Specifications */}
            {propertySpecs && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Property Type:</span>
                      <p className="text-muted-foreground">
                        {propertySpecs.propertyType === 'residential' && 'Single Family Home'}
                        {propertySpecs.propertyType === 'halfDuplex' && 'Half Duplex'}
                        {propertySpecs.propertyType === 'condo' && 'Condominium'}
                        {propertySpecs.propertyType === 'townhome' && 'Townhome'}
                        {propertySpecs.propertyType === 'land' && 'Land/Lot'}
                        {!propertySpecs.propertyType && 'Not specified'}
                      </p>
                    </div>
                    
                    {/* Only show bedrooms for non-land properties */}
                    {propertySpecs.propertyType !== 'land' && (
                      <div>
                        <span className="font-medium">Bedrooms:</span>
                        <p className="text-muted-foreground">{propertySpecs.bedrooms || 'Not specified'}</p>
                      </div>
                    )}
                    
                    {/* Only show bathrooms for non-land properties */}
                    {propertySpecs.propertyType !== 'land' && (
                      <>
                        <div>
                          <span className="font-medium">Full Bathrooms:</span>
                          <p className="text-muted-foreground">{propertySpecs.fullBathrooms || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Half Bathrooms:</span>
                          <p className="text-muted-foreground">{propertySpecs.halfBathrooms || 'Not specified'}</p>
                        </div>
                      </>
                    )}
                    
                    {/* Only show square footage for non-land properties */}
                    {propertySpecs.propertyType !== 'land' && propertySpecs.squareFeet && (
                      <div>
                        <span className="font-medium">Square Footage:</span>
                        <p className="text-muted-foreground">{propertySpecs.squareFeet} sq ft</p>
                      </div>
                    )}
                    
                    {/* Show lot size for residential, half duplex, and land (not condo/townhome) */}
                    {(propertySpecs.propertyType === 'residential' || 
                      propertySpecs.propertyType === 'halfDuplex' || 
                      propertySpecs.propertyType === 'land') && 
                      propertySpecs.lotSize && (
                      <div>
                        <span className="font-medium">Lot Size:</span>
                        <p className="text-muted-foreground">{propertySpecs.lotSize} sq ft</p>
                      </div>
                    )}
                    
                    {/* Only show year built for non-land properties */}
                    {propertySpecs.propertyType !== 'land' && propertySpecs.yearBuilt && (
                      <div>
                        <span className="font-medium">Year Built:</span>
                        <p className="text-muted-foreground">{propertySpecs.yearBuilt}</p>
                      </div>
                    )}
                    
                    {/* Only show garage for non-land properties */}
                    {propertySpecs.propertyType !== 'land' && propertySpecs.garage && (
                      <div>
                        <span className="font-medium">Garage:</span>
                        <p className="text-muted-foreground">
                          {propertySpecs.garage === 'none' && 'No Garage'}
                          {propertySpecs.garage === '1' && '1 Car Garage'}
                          {propertySpecs.garage === '2' && '2 Car Garage'}
                          {propertySpecs.garage === '3' && '3 Car Garage'}
                          {propertySpecs.garage === '4+' && '4+ Car Garage'}
                        </p>
                      </div>
                    )}
                    
                    {/* Only show pool for non-land properties */}
                    {propertySpecs.propertyType !== 'land' && propertySpecs.pool && (
                      <div>
                        <span className="font-medium">Pool:</span>
                        <p className="text-muted-foreground">
                          {propertySpecs.pool === 'none' && 'No Pool'}
                          {propertySpecs.pool === 'in-ground' && 'In-Ground Pool'}
                          {propertySpecs.pool === 'above-ground' && 'Above-Ground Pool'}
                          {propertySpecs.pool === 'spa-only' && 'Spa/Hot Tub Only'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4>Survey Status</h4>
                    <p className="text-muted-foreground">
                      {hasExistingSurvey ? 'Yes, I have an existing survey' : 'No existing survey available'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4>Occupancy Status</h4>
                    <p className="text-muted-foreground">
                      {occupancyStatus === 'owner-occupied' ? 'Owner Occupied' :
                       occupancyStatus === 'non-owner-occupied' ? 'Non-Owner Occupied' :
                       occupancyStatus === 'vacant' ? 'Vacant' : 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setShowBasicInfoSummary(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20">
              Draft Listing
            </Badge>
            <div className="text-sm text-muted-foreground">
              Progress: {completedSteps} of {steps.length} steps completed
            </div>
          </div>
          

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step List */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-4 rounded-lg border bg-background transition-colors ${
              step.isCompleted || !step.isCompleted
                ? 'cursor-pointer hover:bg-muted/50' 
                : ''
            }`}
            onClick={() => {
              handleStepClick(step);
            }}
          >
            {getStepIcon(step)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{step.title}</span>
                {getStepStatus(step)}
              </div>
              <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleStepClick(step);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Summary Modals */}
      {renderBasicInfoSummary()}
      {renderTitleholderSummary()}
    </div>
  );
}