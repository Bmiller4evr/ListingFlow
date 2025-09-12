import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { 
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  FileText,
  Building,
  University,
  Clock,
  Users,
  Mail
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AcceptOfferModalProps {
  open: boolean;
  onClose: () => void;
  offer: any;
  propertyAddress: string;
  listPrice: number;
}

export function AcceptOfferModal({ open, onClose, offer, propertyAddress, listPrice }: AcceptOfferModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmAccept = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      
      // Show success message about contract preparation
      toast.success("Contract Being Prepared for Signing", {
        description: "Please check your email for contract documents and signing instructions.",
        duration: 5000,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="confirm-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Confirm Offer Acceptance
          </DialogTitle>
          <DialogDescription id="confirm-dialog-description">
            Are you sure you want to accept this offer from {offer.buyerName}?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Purchase Price: ${offer.amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              Closing Date: {new Date(offer.closingDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            No, Cancel
          </Button>
          <Button 
            onClick={handleConfirmAccept}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Yes, Accept Offer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}