import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { 
  Banknote, CalendarCheck, DollarSign, HandCoins, 
  FileText, CheckSquare, X, Plus, Pen, Calendar,
  HelpCircle, CircleDollarSign
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { format, addDays, parseISO } from "date-fns";
import { Offer } from "../../data/listingDetailMock";
import { toast } from "sonner@2.0.3";

interface CounterOfferModalProps {
  open: boolean;
  onClose: () => void;
  offer: Offer;
  propertyAddress: string;
  listPrice: number;
}

export function CounterOfferModal({ open, onClose, offer, propertyAddress, listPrice }: CounterOfferModalProps) {
  const [activeTab, setActiveTab] = useState<string>("price");
  const [price, setPrice] = useState<number>(listPrice);
  const [earnestMoney, setEarnestMoney] = useState<number>(offer.earnestMoney);
  const [closingDate, setClosingDate] = useState<string>(offer.closingDate);
  const [additionalTerms, setAdditionalTerms] = useState<string[]>(offer.additionalTerms || []);
  const [newTerm, setNewTerm] = useState<string>("");
  const [selectedContingencies, setSelectedContingencies] = useState<string[]>(offer.contingencies);
  const [counterofferNotes, setCounterofferNotes] = useState<string>("");
  
  // Format the current date for the calendar input
  const formatDateForInput = (date: string) => {
    try {
      return format(parseISO(date), "yyyy-MM-dd");
    } catch (error) {
      return format(new Date(), "yyyy-MM-dd");
    }
  };

  const handleAddTerm = () => {
    if (newTerm.trim() !== "") {
      setAdditionalTerms([...additionalTerms, newTerm]);
      setNewTerm("");
    }
  };

  const handleRemoveTerm = (index: number) => {
    const newTerms = [...additionalTerms];
    newTerms.splice(index, 1);
    setAdditionalTerms(newTerms);
  };

  const handleToggleContingency = (contingency: string) => {
    if (selectedContingencies.includes(contingency)) {
      setSelectedContingencies(selectedContingencies.filter(c => c !== contingency));
    } else {
      setSelectedContingencies([...selectedContingencies, contingency]);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would submit the counter offer to the backend
    toast.success("Counter offer created successfully");
    onClose();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPrice(value ? parseInt(value, 10) : 0);
  };

  const handleEarnestMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setEarnestMoney(value ? parseInt(value, 10) : 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0" aria-describedby="counter-offer-description">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl flex items-center">
            <Pen className="h-5 w-5 mr-2" />
            Create Counter Offer
          </DialogTitle>
          <DialogDescription id="counter-offer-description">
            Counter the offer from {offer.buyerName} for {propertyAddress}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Banknote className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Original Offer</p>
                <p className="text-xl font-medium">{formatCurrency(offer.amount)}</p>
                <p className="text-xs text-muted-foreground">
                  {offer.amount < listPrice ? 
                    <span className="text-red-500">{formatCurrency(offer.amount - listPrice)} below list</span> : 
                    offer.amount > listPrice ? 
                    <span className="text-green-500">{formatCurrency(offer.amount - listPrice)} above list</span> : 
                    "At list price"
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <CircleDollarSign className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Your Counter</p>
                <p className="text-xl font-medium">{formatCurrency(price)}</p>
                <p className="text-xs text-muted-foreground">
                  {price < listPrice ? 
                    <span className="text-red-500">{formatCurrency(price - listPrice)} below list</span> : 
                    price > listPrice ? 
                    <span className="text-green-500">{formatCurrency(price - listPrice)} above list</span> : 
                    "At list price"
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <HandCoins className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Difference</p>
                <p className="text-xl font-medium">{formatCurrency(price - offer.amount)}</p>
                <p className="text-xs text-muted-foreground">
                  {price > offer.amount ? 
                    <span className="text-green-500">{((price - offer.amount) / offer.amount * 100).toFixed(1)}% increase</span> : 
                    price < offer.amount ? 
                    <span className="text-red-500">{((offer.amount - price) / offer.amount * 100).toFixed(1)}% decrease</span> : 
                    "No change"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price & Terms
              </TabsTrigger>
              <TabsTrigger value="contingencies" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Contingencies
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="price" className="space-y-4 mt-2">
              <div>
                <Label htmlFor="counter-price">Price</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="counter-price"
                    className="pl-8"
                    value={price.toString()}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="earnest-money">Earnest Money</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="earnest-money"
                    className="pl-8"
                    value={earnestMoney.toString()}
                    onChange={handleEarnestMoneyChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((earnestMoney / price) * 100).toFixed(1)}% of counter offer price
                </p>
              </div>
              
              <div>
                <Label htmlFor="closing-date">Closing Date</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="closing-date"
                    type="date"
                    className="pl-8"
                    value={formatDateForInput(closingDate)}
                    onChange={(e) => setClosingDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Label className="mb-2 block">Additional Terms</Label>
                <div className="space-y-2 mb-4">
                  {additionalTerms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
                      <p className="flex-1 text-sm">{term}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleRemoveTerm(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Add a term (e.g., Seller to provide home warranty)"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleAddTerm}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contingencies" className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground mb-3">Select which contingencies to include in your counter offer:</p>
              
              <div className="space-y-3">
                {["Financing", "Inspection", "Appraisal", "Home Sale", "Insurance", "HOA Document Review"].map((contingency) => (
                  <div key={contingency} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`contingency-${contingency}`} 
                      checked={selectedContingencies.includes(contingency)}
                      onCheckedChange={() => handleToggleContingency(contingency)}
                    />
                    <Label htmlFor={`contingency-${contingency}`} className="cursor-pointer">
                      {contingency}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Label>Selected Contingencies</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedContingencies.length > 0 ? (
                    selectedContingencies.map((contingency, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {contingency}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleToggleContingency(contingency)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No contingencies selected</p>
                  )}
                </div>
              </div>
              
              <div className="pt-2">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Important Note About Contingencies</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Removing contingencies makes your counter offer stronger, but may expose you to additional risk. 
                      Consider consulting with your real estate professional before removing key contingencies.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-2">
              <div>
                <Label htmlFor="counter-notes">Notes for Buyer's Agent</Label>
                <Textarea
                  id="counter-notes"
                  placeholder="Explain your rationale for the counter offer to the buyer's agent..."
                  className="min-h-32 mt-1"
                  value={counterofferNotes}
                  onChange={(e) => setCounterofferNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  These notes will be shared with the buyer's agent but will not appear in the formal counter offer document.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />

        <DialogFooter className="p-6">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.info("Draft saved")}>
                Save Draft
              </Button>
              <Button onClick={handleSubmit}>
                Submit Counter Offer
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}