import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, Shield, Play, Check, Clock, Video, Key, Truck, X, Camera } from "lucide-react";

interface SecureAccessData {
  videoWatched: boolean;
  accessMethodSelected: boolean;
  shipSupraToProperty: boolean;
  attachSupraForMe: boolean;
  rekeyServices: {
    frontDoor: boolean;
    additionalDoors: number;
  };
  onSiteSurveillance: boolean | null;
}

interface SecureAccessFormProps {
  onNext: (data: SecureAccessData) => void;
  onExit?: () => void;
  initialData?: Partial<SecureAccessData>;
}

export function SecureAccessForm({ onNext, onExit, initialData }: SecureAccessFormProps) {
  const [formData, setFormData] = useState<SecureAccessData>({
    videoWatched: initialData?.videoWatched || false,
    accessMethodSelected: initialData?.accessMethodSelected || false,
    shipSupraToProperty: initialData?.shipSupraToProperty || false,
    attachSupraForMe: initialData?.attachSupraForMe || false,
    rekeyServices: {
      frontDoor: initialData?.rekeyServices?.frontDoor || false,
      additionalDoors: initialData?.rekeyServices?.additionalDoors || 0,
    },
    onSiteSurveillance: initialData?.onSiteSurveillance || null
  });

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<'video' | 'access-method' | 'surveillance'>(
    formData.onSiteSurveillance !== null ? 'surveillance' : 
    formData.videoWatched && formData.accessMethodSelected ? 'surveillance' :
    formData.videoWatched ? 'access-method' : 'video'
  );

  const handleVideoComplete = () => {
    setFormData(prev => ({ ...prev, videoWatched: true }));
    setVideoPlaying(false);
    setCurrentStep('access-method');
  };

  const handleAccessMethodComplete = () => {
    setCurrentStep('surveillance');
  };

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    setTimeout(() => {
      handleVideoComplete();
    }, 3000);
  };

  const handleAccessMethodChange = () => {
    setFormData(prev => ({ ...prev, accessMethodSelected: true }));
  };

  const handleSurveillanceChange = (value: boolean) => {
    setFormData(prev => ({ ...prev, onSiteSurveillance: value }));
  };

  const handleSupraOptionChange = (option: 'ship' | 'attach', checked: boolean) => {
    if (option === 'ship') {
      setFormData(prev => ({ 
        ...prev, 
        shipSupraToProperty: checked as boolean,
        attachSupraForMe: checked ? false : prev.attachSupraForMe
      }));
    } else if (option === 'attach') {
      setFormData(prev => ({ 
        ...prev, 
        attachSupraForMe: checked as boolean,
        shipSupraToProperty: checked ? false : prev.shipSupraToProperty
      }));
    }
    
    if (checked) {
      handleAccessMethodChange();
    } else {
      // Check if any access method is still selected
      const stillHasSelection = (option === 'ship' && formData.attachSupraForMe) || 
                               (option === 'attach' && formData.shipSupraToProperty);
      if (!stillHasSelection) {
        setFormData(prev => ({ ...prev, accessMethodSelected: false }));
      }
    }
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  const isFormComplete = formData.videoWatched && 
                        (formData.shipSupraToProperty || formData.attachSupraForMe) && 
                        formData.onSiteSurveillance !== null;

  // Calculate rekey total cost
  const calculateRekeyCost = () => {
    let total = 0;
    if (formData.rekeyServices.frontDoor) {
      total += 175; // Front door cost
      total += formData.rekeyServices.additionalDoors * 75; // Additional doors at $75 each
    }
    return total;
  };

  const rekeyTotal = calculateRekeyCost();

  return (
    <div className="space-y-6">
      {/* Main Form Header */}
      <div className="relative text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-5 w-5" />
          <h1>Showing Access</h1>
        </div>
        <p className="text-muted-foreground">
          Set up secure property access for showings and photography sessions.
        </p>
        
        {/* Exit X Button - Top Right */}
        {onExit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExitDialog(true)}
            className="absolute top-0 right-0 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Step 1: Video Guide Card */}
      {currentStep === 'video' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.videoWatched ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.videoWatched ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <h3>Watch Secure Access Guide</h3>
              {formData.videoWatched && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Complete
                </Badge>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <Video className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h4>Secure Property Access Options</h4>
                <p className="text-muted-foreground mt-2">
                  Learn about secure access methods for showings, photography, and inspections to keep your property safe.
                </p>
                <div className="text-muted-foreground mt-2">
                  Duration: 3 minutes
                </div>
              </div>
              
              {!videoPlaying ? (
                <Button onClick={handlePlayVideo} className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Secure Access Guide
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-pulse">
                        <Play className="h-12 w-12 mx-auto mb-2" />
                        <p>Playing secure access guide...</p>
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

      {/* Step 2: Access Method Selection Card */}
      {currentStep === 'access-method' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.accessMethodSelected ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.accessMethodSelected ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <h3>Select Access Method</h3>
            </div>

            <div className="space-y-6">
              {/* Primary Access Method */}
              <div className="space-y-3">
                <h4>Primary Access Method</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white dark:bg-gray-950">
                    <Checkbox
                      id="shipSupra"
                      checked={formData.shipSupraToProperty}
                      onCheckedChange={(checked) => handleSupraOptionChange('ship', checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Label htmlFor="shipSupra">
                            Ship Supra to Subject Property
                          </Label>
                          <p className="text-muted-foreground mt-1">
                            Professional electronic lockbox system for secure agent access. 
                            Recommended for maximum security and showing convenience.
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <span className="text-green-600">Included</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                          Recommended
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white dark:bg-gray-950">
                    <Checkbox
                      id="attachSupra"
                      checked={formData.attachSupraForMe}
                      onCheckedChange={(checked) => handleSupraOptionChange('attach', checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Label htmlFor="attachSupra">
                            Attach Supra for me
                          </Label>
                          <p className="text-muted-foreground mt-1">
                            Request a FedEx label to ship us a key. We will affix the lockbox to the property for you.
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <span>$75</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Security Services */}
              <div className="space-y-3">
                <h4>Additional Security Services</h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
                    <div className="flex items-start space-x-3 mb-3">
                      <Checkbox
                        id="rekeyFrontDoor"
                        checked={formData.rekeyServices.frontDoor}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({
                            ...prev,
                            rekeyServices: { 
                              ...prev.rekeyServices, 
                              frontDoor: checked as boolean,
                              additionalDoors: checked ? prev.rekeyServices.additionalDoors : 0
                            }
                          }))
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor="rekeyFrontDoor" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Rekey Property
                        </Label>
                        <p className="text-muted-foreground mt-1">
                          Professional rekeying service for enhanced security during the selling process. 
                          Additional identification verification may be required by the service provider.
                        </p>
                      </div>
                    </div>
                    
                    {formData.rekeyServices.frontDoor && (
                      <div className="ml-6 space-y-3 border-l-2 border-muted pl-4">
                        <div className="flex items-center justify-between">
                          <span>Front Door</span>
                          <span>$175</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Additional Doors</Label>
                          <Select 
                            value={formData.rekeyServices.additionalDoors.toString()} 
                            onValueChange={(value) => 
                              setFormData(prev => ({
                                ...prev,
                                rekeyServices: { 
                                  ...prev.rekeyServices, 
                                  additionalDoors: parseInt(value) 
                                }
                              }))
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'door' : 'doors'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formData.rekeyServices.additionalDoors > 0 && (
                            <div className="flex items-center justify-between">
                              <span>{formData.rekeyServices.additionalDoors} additional door{formData.rekeyServices.additionalDoors !== 1 ? 's' : ''} × $75</span>
                              <span>${formData.rekeyServices.additionalDoors * 75}</span>
                            </div>
                          )}
                        </div>
                        
                        {rekeyTotal > 0 && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span>Rekey Service Total</span>
                            <span>${rekeyTotal}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: On Site Surveillance Card */}
      {currentStep === 'surveillance' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.onSiteSurveillance !== null ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.onSiteSurveillance !== null ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <h3>On Site Surveillance</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Do you have security cameras or surveillance systems installed at the property?</Label>
                
                <RadioGroup
                  value={formData.onSiteSurveillance === null ? "" : formData.onSiteSurveillance.toString()}
                  onValueChange={(value) => handleSurveillanceChange(value === "true")}
                  className="space-y-2"
                >
                  <RadioGroupItem value="true">Yes</RadioGroupItem>
                  <RadioGroupItem value="false">No</RadioGroupItem>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-end items-center pt-6 border-t">
        {currentStep === 'access-method' && formData.accessMethodSelected && (
          <Button
            onClick={handleAccessMethodComplete}
            className="flex items-center gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        
        {currentStep === 'surveillance' && (
          <Button
            onClick={handleSubmit}
            disabled={formData.onSiteSurveillance === null}
            className="flex items-center gap-2 bg-success hover:bg-success-hover text-success-foreground"
          >
            Complete
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {onExit && (
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Showing Access?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will be saved as a draft and you can return to complete your listing later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Working</AlertDialogCancel>
              <AlertDialogAction onClick={onExit}>
                Exit to Dashboard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}