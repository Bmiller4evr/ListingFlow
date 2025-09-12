import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Check, CreditCard, Camera, PhoneCall } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner@2.0.3";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface PhotographyServiceModalProps {
  open: boolean;
  onClose: () => void;
  address: string;
}

export function PhotographyServiceModal({ open, onClose, address }: PhotographyServiceModalProps) {
  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "success">("confirm");
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
      setPaymentStep("confirm");
      onClose();
      
      // Show a toast notification
      toast.success("Photography service purchased successfully");
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

  const renderConfirmStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Professional Photography Service</DialogTitle>
        <DialogDescription id="photography-service-description">
          Hire a professional photographer for high-quality listing photos
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-6">
        <div className="flex gap-4 items-start">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h4>Professional Photography Session</h4>
            <p className="text-muted-foreground text-sm">
              A professional photographer will visit your property to take high-quality photos for your listing. The session includes interior and exterior shots, photo editing, and delivery within 48 hours.
            </p>
          </div>
        </div>

        <Card className="p-4 bg-muted/30">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Property Address</p>
              <p>{address}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="font-medium">Service Fee</p>
              <p className="font-medium">$300.00</p>
            </div>
            
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <PhoneCall className="h-4 w-4" /> 
                Our team will contact you within 1 business day to schedule your photography session
              </p>
            </div>
          </div>
        </Card>
        
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
      </div>

      <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirmPayment} className="gap-2">
          <span>Pay $300.00</span>
        </Button>
      </DialogFooter>
    </>
  );

  const renderProcessingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Processing Payment</DialogTitle>
        <DialogDescription id="photography-processing-description">Please wait while we process your payment</DialogDescription>
      </DialogHeader>
      <div className="py-10 text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Photography Service Purchased</DialogTitle>
        <DialogDescription id="photography-success-description" className="mx-auto max-w-sm">
          Your payment of $300.00 has been processed successfully. Our team will contact you shortly to schedule your session.
        </DialogDescription>
      </DialogHeader>
      <div className="py-10 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="p-4 bg-muted/30 rounded-lg mb-6 max-w-sm mx-auto">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Professional Photography</p>
            <p className="text-sm text-muted-foreground">Interior & exterior shots, editing, and digital delivery</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleClose} className="w-full">Done</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]" aria-describedby={
        paymentStep === "confirm" ? "photography-service-description" :
        paymentStep === "processing" ? "photography-processing-description" :
        "photography-success-description"
      }>
        {paymentStep === "confirm" && renderConfirmStep()}
        {paymentStep === "processing" && renderProcessingStep()}
        {paymentStep === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
}