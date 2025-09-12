import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, DollarSign, Play, Check, Clock, Video, X } from "lucide-react";
import { UnrepresentedBuyersStep } from "./listing-price/UnrepresentedBuyersStep";
import { BuyerCommissionStep } from "./listing-price/BuyerCommissionStep";
import { ListingPriceData, ListingPriceFormProps } from "./listing-price/types";
import { VIDEO_CONFIG, COMMISSION_RANGES } from "./listing-price/constants";
import { cleanPriceInput, getSuggestedPriceRange, isFormComplete } from "./listing-price/utils";

export function ListingPriceForm({ 
  onNext, 
  onBack, 
  onExit, 
  initialData, 
  homeFacts, 
  financialInfo 
}: ListingPriceFormProps) {
  const [formData, setFormData] = useState<ListingPriceData>({
    videoWatched: initialData?.videoWatched || false,
    priceSubmitted: initialData?.priceSubmitted || false,
    desiredPrice: initialData?.desiredPrice || '',
    priceJustification: initialData?.priceJustification || '',
    marketingStrategy: initialData?.marketingStrategy || 'competitive',
    flexibilityLevel: initialData?.flexibilityLevel || 'somewhat-flexible',
    timeFrameMotivation: initialData?.timeFrameMotivation || '',
    additionalNotes: initialData?.additionalNotes || '',
    acceptUnrepresentedBuyers: initialData?.acceptUnrepresentedBuyers || '',
    buyerAgentCommission: initialData?.buyerAgentCommission || COMMISSION_RANGES.DEFAULT
  });

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<'video' | 'price-submission' | 'buyer-options' | 'commission'>(() => {
    if (formData.buyerAgentCommission !== COMMISSION_RANGES.DEFAULT) return 'commission';
    if (formData.acceptUnrepresentedBuyers !== '') return 'buyer-options';
    if (formData.videoWatched && formData.priceSubmitted) return 'buyer-options';
    if (formData.videoWatched) return 'price-submission';
    return 'video';
  });

  const suggestedRange = getSuggestedPriceRange(financialInfo);

  const handleVideoComplete = () => {
    setFormData(prev => ({ ...prev, videoWatched: true }));
    setVideoPlaying(false);
    setCurrentStep('price-submission');
  };

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    setTimeout(() => {
      handleVideoComplete();
    }, VIDEO_CONFIG.COMPLETION_DELAY_MS);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = cleanPriceInput(value);
    setFormData(prev => ({ ...prev, desiredPrice: numericValue }));
  };

  const handlePriceSubmissionComplete = () => {
    if (formData.desiredPrice && parseFloat(formData.desiredPrice) > 0) {
      setFormData(prev => ({ ...prev, priceSubmitted: true }));
      setCurrentStep('buyer-options');
    }
  };

  const handleBuyerOptionsComplete = () => {
    setCurrentStep('commission');
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  const formComplete = isFormComplete(
    formData.videoWatched, 
    formData.priceSubmitted, 
    formData.acceptUnrepresentedBuyers
  );

  return (
    <div className="space-y-6">
      {/* Main Form Header */}
      <div className="relative text-center space-y-2">
        <div className="flex items-center justify-center">
          <h1>Listing Price</h1>
        </div>
        <p className="text-muted-foreground">
          Watch our pricing strategy guide and submit your desired listing price for agent review.
        </p>
        
        {/* Exit X Button - Top Right */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExitDialog(true)}
          className="absolute top-0 right-0 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Step 1: Video Education Card */}
      {currentStep === 'video' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.videoWatched ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.videoWatched ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </div>
              <h3>Watch: Pricing is Paramount</h3>
              {formData.videoWatched && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Complete
                </Badge>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <Video className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h4>Pricing is Paramount</h4>
                <p className="text-muted-foreground mt-2">
                  Learn how strategic pricing affects your home's time on market, final sale price, and overall success. Understand market dynamics and pricing psychology.
                </p>
                <div className="text-muted-foreground mt-2">
                  Duration: 4 minutes
                </div>
              </div>
              
              {!videoPlaying ? (
                <Button onClick={handlePlayVideo} className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Pricing Strategy Guide
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-pulse">
                        <Play className="h-12 w-12 mx-auto mb-2" />
                        <p>Playing pricing strategy guide...</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Video will complete automatically</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Submit Your Desired Listing Price Card */}
      {currentStep === 'price-submission' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.priceSubmitted ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.priceSubmitted ? <Check className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
              </div>
              <h3>Submit Your Desired Listing Price</h3>
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                Your listing agent will review your pricing request and provide market analysis and recommendations before finalizing your listing price.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="desiredPrice">Desired Listing Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="desiredPrice"
                      type="text"
                      placeholder="Enter your desired listing price"
                      value={formData.desiredPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {suggestedRange && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Suggested range: ${suggestedRange.min.toLocaleString()} - ${suggestedRange.max.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes for Your Agent</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any other information that might influence pricing decisions..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button
                onClick={handlePriceSubmissionComplete}
                disabled={!formData.desiredPrice || parseFloat(formData.desiredPrice) <= 0}
                className="flex items-center gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Unrepresented Buyers Card */}
      {currentStep === 'buyer-options' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.acceptUnrepresentedBuyers !== '' ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.acceptUnrepresentedBuyers !== '' ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </div>
              <h3>Buyer Representation Options</h3>
            </div>

            <UnrepresentedBuyersStep
              acceptUnrepresentedBuyers={formData.acceptUnrepresentedBuyers}
              onValueChange={(value) => setFormData(prev => ({ ...prev, acceptUnrepresentedBuyers: value }))}
            />

            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button
                onClick={handleBuyerOptionsComplete}
                disabled={formData.acceptUnrepresentedBuyers === ''}
                className="flex items-center gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Buyer's Agent Commission Card */}
      {currentStep === 'commission' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.buyerAgentCommission !== COMMISSION_RANGES.DEFAULT ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.buyerAgentCommission !== COMMISSION_RANGES.DEFAULT ? <Check className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
              </div>
              <h3>Buyer's Agent Commission</h3>
            </div>

            <BuyerCommissionStep
              buyerAgentCommission={formData.buyerAgentCommission}
              desiredPrice={formData.desiredPrice}
              onCommissionChange={(value) => setFormData(prev => ({ ...prev, buyerAgentCommission: value }))}
            />

            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!formComplete}
                className="flex items-center gap-2"
              >
                Complete
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved and you can return to complete this listing later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onExit}>Exit Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Re-export types for backward compatibility
export type { ListingPriceData } from "./listing-price/types";