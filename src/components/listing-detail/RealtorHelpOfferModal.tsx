import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Check, CreditCard, Clock, HeadphonesIcon, MessageSquare, CalendarCheck, CircleDollarSign, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Offer } from "../../data/listingDetailMock";
import { toast } from "sonner@2.0.3";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface RealtorHelpOfferModalProps {
  open: boolean;
  onClose: () => void;
  offer: Offer;
  propertyAddress: string;
  isSelfService?: boolean;
}

export function RealtorHelpOfferModal({ open, onClose, offer, propertyAddress, isSelfService = true }: RealtorHelpOfferModalProps) {
  const [paymentStep, setPaymentStep] = useState<"info" | "payment" | "processing" | "success">("info");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("pm_1");
  
  // Mock saved payment methods from the account
  const savedPaymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      type: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2027,
      isDefault: true
    }
  ];
  
  const handleProceedToPayment = () => {
    if (isSelfService) {
      setPaymentStep("payment");
    } else {
      // If not self-service, skip payment and go straight to success
      handleConfirmPayment();
    }
  };
  
  const handleConfirmPayment = () => {
    setPaymentStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep("success");
    }, 1500);
  };
  
  const handleClose = () => {
    if (paymentStep === "success") {
      // Reset state before closing
      setPaymentStep("info");
      onClose();
      
      // Show toast notification
      toast.success("Consultation scheduled successfully");
    } else {
      onClose();
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    return (
      <div className={`h-6 w-8 rounded flex items-center justify-center ${type === 'visa' ? 'bg-blue-600' : type === 'mastercard' ? 'bg-red-600' : 'bg-gray-600'}`}>
        <span className="text-white text-xs font-semibold">
          {type === 'visa' ? 'VISA' : type === 'mastercard' ? 'MC' : type.toUpperCase().substring(0, 2)}
        </span>
      </div>
    );
  };

  const renderInfoStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <HeadphonesIcon className="h-5 w-5" />
          Get Expert Help with Your Offer
        </DialogTitle>
        <DialogDescription id="realtor-help-description-info">
          Schedule a consultation with a licensed real estate agent to help you evaluate and respond to this offer
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-6">
        <div className="flex gap-4 items-start">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h4>Professional Offer Review & Consultation</h4>
            <p className="text-muted-foreground text-sm">
              Get professional guidance from a licensed real estate agent to help you evaluate this offer, negotiate effectively, and maximize your sale price.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-3/5 p-5">
              <h3 className="font-medium mb-4">What's included:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Detailed review of all offer terms and contingencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Personalized consultation with a licensed agent</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Guidance on negotiation strategy and counter offers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Market analysis to help you evaluate the offer price</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Assistance with formal response documentation</span>
                </li>
              </ul>

              <div className="mt-6">
                <div className="flex gap-2 items-center">
                  <Badge className="bg-primary text-white">One-time fee</Badge>
                  {isSelfService && <p className="font-medium text-xl">$175</p>}
                  {!isSelfService && <p className="font-medium text-xl">Included in your plan</p>}
                </div>
                {isSelfService && <p className="text-sm text-muted-foreground mt-1">Pay once, no recurring charges</p>}
              </div>
            </div>

            <div className="md:w-2/5 bg-muted relative overflow-hidden">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                  alt="Real estate consultation"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative p-5 text-center flex flex-col items-center justify-center h-full">
                <HeadphonesIcon className="h-12 w-12 text-primary mb-3" />
                <h3 className="font-medium mb-2">Expert Guidance</h3>
                <p className="text-sm">Our licensed real estate professionals are ready to help you navigate this important decision.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Available within 24 hours</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span className="text-sm">30 minute consultation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          <p>This service is designed for Self-Service plan users who need expert guidance with specific transactions.</p>
          <p>Full-Service plan users receive unlimited offer consultation at no additional cost.</p>
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleProceedToPayment} className="gap-2">
          {isSelfService ? (
            <>
              <span>Continue to Payment</span>
              <CircleDollarSign className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              <span>Schedule Consultation</span>
              <CalendarCheck className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Payment Information</DialogTitle>
        <DialogDescription id="realtor-help-description-payment">
          Complete your payment to schedule your offer consultation
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex justify-between">
            <p>Offer Review & Consultation</p>
            <p className="font-medium">$175.00</p>
          </div>
          <Separator />
          <div className="flex justify-between">
            <p className="font-medium">Total</p>
            <p className="font-medium">$175.00</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <RadioGroup defaultValue={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            {savedPaymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer py-2">
                  {getPaymentMethodIcon(method.type)}
                  <span>
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Expires {method.expMonth}/{method.expYear}
                  </span>
                  {method.isDefault && (
                    <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Default
                    </span>
                  )}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2 mt-1">
              <Button variant="outline" className="w-full flex items-center gap-2 mt-1" onClick={() => toast.info("Add payment method feature would open here")}>
                <CreditCard className="h-4 w-4" />
                Add New Payment Method
              </Button>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm">Payment information is secure and encrypted.</p>
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
        <Button variant="ghost" onClick={() => setPaymentStep("info")}>
          Back
        </Button>
        <Button onClick={handleConfirmPayment} className="gap-2">
          <span>Pay $175.00</span>
        </Button>
      </DialogFooter>
    </>
  );

  const renderProcessingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Processing Payment</DialogTitle>
        <DialogDescription id="realtor-help-description-processing">Please wait while we process your payment</DialogDescription>
      </DialogHeader>
      <div className="py-10 text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Consultation Scheduled</DialogTitle>
        <DialogDescription id="realtor-help-description-success">
          {isSelfService
            ? "Your payment of $175.00 has been processed successfully. We'll be in touch within 24 hours to schedule your consultation."
            : "Your consultation request has been received. We'll be in touch within 24 hours to schedule your consultation."}
        </DialogDescription>
      </DialogHeader>
      <div className="py-10 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="p-4 bg-muted/30 rounded-lg mb-6 max-w-sm mx-auto space-y-2">
        <div>
          <p className="font-medium">What happens next:</p>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-muted-foreground">
            <li>A licensed agent will contact you within 24 hours</li>
            <li>Your consultation will be scheduled at your convenience</li>
            <li>You'll receive personalized guidance on this offer</li>
            <li>We'll help you prepare a response to the buyer</li>
          </ul>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleClose} className="w-full">Done</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={`realtor-help-description-${paymentStep}`}>
        {paymentStep === "info" && renderInfoStep()}
        {paymentStep === "payment" && renderPaymentStep()}
        {paymentStep === "processing" && renderProcessingStep()}
        {paymentStep === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
}