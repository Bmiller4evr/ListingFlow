import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PropertyAddressForm } from "./onboarding/PropertyAddressForm";
import { PropertyDetails } from "../services/batchDataService";
import { toast } from "sonner@2.0.3";

interface AddressVerificationProps {
  onVerifiedAddress?: (address: VerifiedAddressResult) => void;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerClassName?: string;
  // New props for controlled dialog behavior
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface VerifiedAddressResult {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyDetails?: PropertyDetails;
  verified: boolean;
  formattedAddress: string;
}

export function AddressVerification({ 
  onVerifiedAddress, 
  buttonText = "Verify Address", 
  buttonVariant = "default",
  triggerClassName,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: AddressVerificationProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? setControlledOpen : setInternalOpen;
  
  const handleAddressComplete = (addressData: any) => {
    if (!addressData.verified) {
      toast.error("Address verification failed. Please try again.");
      return;
    }
    
    // Format the address for display
    const formattedAddress = [
      addressData.street,
      addressData.unit,
      `${addressData.city}, ${addressData.state} ${addressData.zipCode}`
    ]
      .filter(Boolean)
      .join(", ");
    
    // Call the callback with the verified address
    if (onVerifiedAddress) {
      onVerifiedAddress({
        ...addressData,
        formattedAddress
      });
    }
    
    // Close the dialog
    setIsOpen(false);
    
    // Show a success toast
    toast.success("Address verified successfully!");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render the trigger if we're in uncontrolled mode */}
      {!isControlled && (
        <DialogTrigger asChild>
          <Button 
            variant={buttonVariant} 
            className={triggerClassName}
          >
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[550px]" aria-describedby="address-verification-description">
        <DialogHeader>
          <DialogTitle>Verify Property Address</DialogTitle>
          <DialogDescription id="address-verification-description">
            Enter an address to verify property details with our database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <PropertyAddressForm onComplete={handleAddressComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
}