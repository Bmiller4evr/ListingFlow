import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, Camera, Play, Check, Clock, Video, Calendar, X } from "lucide-react";

interface PropertyMediaData {
  videoWatched: boolean;
  mediaChoice: 'schedule' | 'own' | null;
  photographyScheduled: boolean;
  scheduledDate?: string;
  timeSlot?: string;
  tripChargeAcknowledgment: boolean;
  additionalServices: {
    virtualTour: boolean;
    dronePhotos: boolean;
    twilightPhotos: boolean;
    floorPlan: boolean;
  };
  mediaPending: boolean;
}

interface PropertyMediaFormProps {
  onNext: (data: PropertyMediaData) => void;
  onExit?: () => void;
  initialData?: Partial<PropertyMediaData>;
}

export function PropertyMediaForm({ onNext, onExit, initialData }: PropertyMediaFormProps) {
  const [formData, setFormData] = useState<PropertyMediaData>({
    videoWatched: initialData?.videoWatched || false,
    mediaChoice: initialData?.mediaChoice || null,
    photographyScheduled: initialData?.photographyScheduled || false,
    scheduledDate: initialData?.scheduledDate || '',
    timeSlot: initialData?.timeSlot || '',
    tripChargeAcknowledgment: initialData?.tripChargeAcknowledgment || false,
    additionalServices: {
      virtualTour: initialData?.additionalServices?.virtualTour || false,
      dronePhotos: initialData?.additionalServices?.dronePhotos || false,
      twilightPhotos: initialData?.additionalServices?.twilightPhotos || false,
      floorPlan: initialData?.additionalServices?.floorPlan || false,
    },
    mediaPending: initialData?.mediaPending || false
  });

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<'video' | 'media-choice' | 'schedule-photography' | 'media-pending'>(() => {
    if (!formData.videoWatched) return 'video';
    if (!formData.mediaChoice) return 'media-choice';
    if (formData.mediaChoice === 'schedule') return 'schedule-photography';
    if (formData.mediaChoice === 'own') return 'media-pending';
    return 'media-choice';
  });

  const handleVideoComplete = () => {
    setFormData(prev => ({ ...prev, videoWatched: true }));
    setVideoPlaying(false);
    setCurrentStep('media-choice');
  };

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    setTimeout(() => {
      handleVideoComplete();
    }, 3000);
  };

  const handleSchedulePhotography = () => {
    if (formData.scheduledDate && effectiveTimeSlot && formData.tripChargeAcknowledgment) {
      setFormData(prev => ({ 
        ...prev, 
        photographyScheduled: true,
        timeSlot: effectiveTimeSlot // Ensure the effective time slot is saved
      }));
    }
  };

  const handleMediaChoice = (choice: 'schedule' | 'own') => {
    setFormData(prev => ({ ...prev, mediaChoice: choice }));
    if (choice === 'schedule') {
      setCurrentStep('schedule-photography');
    } else {
      setCurrentStep('media-pending');
    }
  };

  const handleMediaPending = () => {
    setFormData(prev => ({ ...prev, mediaPending: true }));
  };

  const handleBack = () => {
    if (currentStep === 'schedule-photography' || currentStep === 'media-pending') {
      setCurrentStep('media-choice');
    } else if (currentStep === 'media-choice') {
      setCurrentStep('video');
    }
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  const isFormComplete = formData.videoWatched && (formData.photographyScheduled || formData.mediaPending);

  const timeSlots = [
    'Morning',
    'Evening'
  ];

  // Calculate minimum date (day after tomorrow)
  const getMinimumDate = () => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow.toISOString().split('T')[0];
  };

  // Check if twilight photos is selected - if so, force Evening time and disable selector
  const isTwilightSelected = formData.additionalServices.twilightPhotos;
  const effectiveTimeSlot = isTwilightSelected ? 'Evening' : formData.timeSlot;

  return (
    <div className="space-y-6">
      {/* Main Form Header */}
      <div className="relative text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          <h1>Property Media</h1>
        </div>
        {!formData.videoWatched && (
          <p className="text-muted-foreground">
            Watch our preparation guide and schedule your professional photography session.
          </p>
        )}
        
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
              <h3>Watch Photography Preparation Guide</h3>
              {formData.videoWatched && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Complete
                </Badge>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <Video className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h4>Preparing Your Home for Photography</h4>
                <p className="text-muted-foreground mt-2">
                  Learn essential tips to make your home photo-ready and maximize its appeal to potential buyers.
                </p>
                <div className="text-muted-foreground mt-2">
                  Duration: 3 minutes
                </div>
              </div>
              
              {!videoPlaying ? (
                <Button onClick={handlePlayVideo} className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Preparation Guide
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-pulse">
                        <Play className="h-12 w-12 mx-auto mb-2" />
                        <p>Playing preparation guide...</p>
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

      {/* Step 2: Media Choice Card */}
      {currentStep === 'media-choice' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted-foreground text-white text-sm">
                2
              </div>
              <h3>Choose Your Media Option</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Professional photography is included</strong> with all Access Realty listing packages at no additional cost. Do you want to schedule photography or use your own media?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleMediaChoice('schedule')}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                >
                  <Camera className="h-6 w-6" />
                  <span>Schedule Photography Appointment</span>
                </Button>
                
                <Button
                  onClick={() => handleMediaChoice('own')}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                >
                  <Play className="h-6 w-6" />
                  <span>Provide My Own Media</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3a: Media Pending Card */}
      {currentStep === 'media-pending' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">
                <Check className="h-4 w-4" />
              </div>
              <h3>Media Collection</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="space-y-3">
                  <Video className="h-12 w-12 mx-auto text-blue-600" />
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200">Media Collection Email Sent</h4>
                    <p className="text-blue-700 dark:text-blue-300 mt-2">
                      We will send you an email with instructions on how to upload your photos and videos for your listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3b: Schedule Photography Card */}
      {currentStep === 'schedule-photography' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                formData.photographyScheduled ? 'bg-green-500' : 'bg-muted-foreground'
              } text-white text-sm`}>
                {formData.photographyScheduled ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <h3>Schedule Photography</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Professional photography is included</strong> with all Access Realty listing packages at no additional cost.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Preferred Date</Label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    min={getMinimumDate()}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Preferred Time</Label>
                  <Select 
                    value={effectiveTimeSlot} 
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, timeSlot: value }))
                    }
                    disabled={isTwilightSelected}
                  >
                    <SelectTrigger className={isTwilightSelected ? "opacity-50 cursor-not-allowed" : ""}>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isTwilightSelected && (
                    <p className="text-sm text-muted-foreground">
                      Evening time automatically selected for twilight photography
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Additional Services</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="virtualTour"
                      checked={formData.additionalServices.virtualTour}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          additionalServices: { ...prev.additionalServices, virtualTour: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="virtualTour">
                      Matterport Virtual Tour (+$99)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dronePhotos"
                      checked={formData.additionalServices.dronePhotos}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          additionalServices: { ...prev.additionalServices, dronePhotos: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="dronePhotos">
                      Aerial Photos (+$99)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twilightPhotos"
                      checked={formData.additionalServices.twilightPhotos}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          additionalServices: { ...prev.additionalServices, twilightPhotos: checked as boolean },
                          timeSlot: checked ? 'Evening' : prev.timeSlot
                        }))
                      }
                    />
                    <Label htmlFor="twilightPhotos">
                      Twilight Photos (+$79)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="floorPlan"
                      checked={formData.additionalServices.floorPlan}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          additionalServices: { ...prev.additionalServices, floorPlan: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="floorPlan">
                      Floor Plan with Matterport Virtual Tour (+$99)
                    </Label>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="tripChargeAcknowledgment"
                    checked={formData.tripChargeAcknowledgment}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, tripChargeAcknowledgment: checked as boolean }))
                    }
                    className="mt-1 flex-shrink-0"
                  />
                  <Label htmlFor="tripChargeAcknowledgment" className="text-sm leading-relaxed flex-1">
                    I understand that a $79 trip charge may be applied if the property is inaccessible during the scheduled photography appointment due to incorrect access instructions or unavailable access. *
                  </Label>
                </div>
              </div>

              {formData.scheduledDate && effectiveTimeSlot && formData.tripChargeAcknowledgment && !formData.photographyScheduled && (
                <div className="flex justify-center">
                  <Button onClick={handleSchedulePhotography} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Confirm Photography Schedule
                  </Button>
                </div>
              )}

              {formData.photographyScheduled && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <h4 className="text-green-800 dark:text-green-200">
                      Photography Scheduled
                    </h4>
                  </div>
                  <div className="text-green-700 dark:text-green-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(formData.scheduledDate!).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{effectiveTimeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Professional Photography Included</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        {/* Back Button */}
        {(currentStep === 'media-choice' || currentStep === 'schedule-photography' || currentStep === 'media-pending') && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        {/* Skip back button space if not shown */}
        {currentStep === 'video' && <div />}

        {/* Next/Complete Button */}
        <div>
          {currentStep === 'schedule-photography' && (
            <Button
              onClick={handleSubmit}
              disabled={!formData.photographyScheduled}
              className="flex items-center gap-2 bg-success hover:bg-success-hover text-success-foreground"
            >
              Complete
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {currentStep === 'media-pending' && (
            <Button
              onClick={() => {
                handleMediaPending();
                handleSubmit();
              }}
              className="flex items-center gap-2 bg-success hover:bg-success-hover text-success-foreground"
            >
              Complete
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {/* No button shown for video and media-choice steps - they auto-advance */}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Listing Creation?</AlertDialogTitle>
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
    </div>
  );
}