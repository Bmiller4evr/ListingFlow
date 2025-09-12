import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Offer } from "../../data/listingDetailMock";
import { toast } from "sonner@2.0.3";

interface DeclineOfferModalProps {
  open: boolean;
  onClose: () => void;
  offer: Offer;
  propertyAddress: string;
}

export function DeclineOfferModal({ open, onClose, offer, propertyAddress }: DeclineOfferModalProps) {
  const [reason, setReason] = useState<string>("");
  
  const handleDecline = () => {
    // In a real app, this would submit the decline to the backend
    toast.success("Offer declined successfully");
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="decline-offer-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Decline Offer
          </DialogTitle>
          <DialogDescription id="decline-offer-description">
            Are you sure you want to decline this offer? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium mb-1">Offer Details</p>
            <p className="text-sm">{offer.buyerName}</p>
            <p className="text-sm font-medium mt-2">${offer.amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Received on {new Date(offer.date).toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decline-reason">Reason for declining (optional)</Label>
            <Textarea
              id="decline-reason"
              placeholder="Provide a reason for declining this offer..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none h-24"
            />
            <p className="text-xs text-muted-foreground">
              This message will be shared with the buyer's agent.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDecline}>
              Decline Offer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}