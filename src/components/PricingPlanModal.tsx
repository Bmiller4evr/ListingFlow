import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, CircleDollarSign, LucidePackage2, ShieldCheck, HeartHandshake, X } from "lucide-react";
import { Tabs, TabsContent } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { cn } from "./ui/utils";

interface PricingPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (planId: string) => void;
}

interface Feature {
  name: string;
  selfServiceValue: string | boolean;
  fullServiceValue: string | boolean;
  important?: boolean;
}

const features: Feature[] = [
  { name: "Pricing Strategy", selfServiceValue: "Self Guided", fullServiceValue: "Professional", important: true },
  { name: "Marketing Strategy", selfServiceValue: true, fullServiceValue: true, important: true },
  { name: "Listing and Photo Descriptions", selfServiceValue: "Self Written", fullServiceValue: "Professional", important: true },
  { name: "Professional Photography", selfServiceValue: true, fullServiceValue: true, important: true },
  { name: "Virtual Walk Through (matterport)", selfServiceValue: "$99", fullServiceValue: true },
  { name: "Virtual Staging", selfServiceValue: "$99", fullServiceValue: "If needed" },
  { name: "Floor Plan", selfServiceValue: "$49", fullServiceValue: true },
  { name: "Amenities Photography", selfServiceValue: "$40", fullServiceValue: "If needed" },
  { name: "Aerial Photography", selfServiceValue: "$99", fullServiceValue: true },
  { name: "Digital Document Signing", selfServiceValue: true, fullServiceValue: true, important: true },
  { name: "Lockbox and Yard Sign", selfServiceValue: true, fullServiceValue: true, important: true },
  { name: "Showings by ShowingTime", selfServiceValue: true, fullServiceValue: true, important: true },
  { name: "Showing Feedback Requests", selfServiceValue: true, fullServiceValue: true, important: true },
  { name: "Pre Listing Property Evaluation", selfServiceValue: "$299", fullServiceValue: "On-Site" },
  { name: "Market Analysis", selfServiceValue: "Weekly", fullServiceValue: "Weekly", important: true },
  { name: "Syndication Traffic Reporting", selfServiceValue: false, fullServiceValue: true },
  { name: "Open Houses", selfServiceValue: "$99", fullServiceValue: "2 Included" },
  { name: "On Market Consultation", selfServiceValue: "$99", fullServiceValue: true },
  { name: "Contract Negotiation Services", selfServiceValue: "$199", fullServiceValue: true, important: true },
  { name: "Post Inspection Negotiation", selfServiceValue: "$199", fullServiceValue: true, important: true },
  { name: "Access to Preferred Vendors", selfServiceValue: true, fullServiceValue: true },
  { name: "Amendment Repairs Management", selfServiceValue: "Self Managed", fullServiceValue: true },
  { name: "Transaction Coordination", selfServiceValue: "Self Guided", fullServiceValue: "Full Service", important: true },
];

export function PricingPlanModal({ open, onOpenChange, onSelectPlan }: PricingPlanModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>("plans");
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setCurrentPlan(planId);
    setSelectedTab("payment");
  };

  const handleProceedToPayment = () => {
    if (currentPlan) {
      onSelectPlan(currentPlan);
    }
  };

  const getPlanName = (planId: string) => {
    switch (planId) {
      case "self-service": return "Self Service";
      case "full-service": return "Full Service";
      default: return "";
    }
  };

  const getPlanCost = (planId: string) => {
    switch (planId) {
      case "self-service": return "$2,995";
      case "full-service": return "2.5% of sale price (min. $5,000)";
      default: return "";
    }
  };

  const renderFeatureValue = (value: string | boolean) => {
    if (value === true) {
      return <Check className="h-4 w-4 text-primary mx-auto" />;
    } else if (value === false) {
      return <X className="h-4 w-4 text-muted-foreground mx-auto" />;
    } else if (typeof value === 'string' && value.startsWith('$')) {
      return <span className="text-xs text-muted-foreground">{value}</span>;
    } else {
      return <span className="text-xs">{value}</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto" aria-describedby="pricing-plan-description">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <DialogHeader className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 border-b">
            <DialogTitle>Select a Listing Package</DialogTitle>
            <DialogDescription id="pricing-plan-description">
              Choose the service level that best fits your needs and budget
            </DialogDescription>
          </DialogHeader>
          
          <TabsContent value="plans" className="mt-0 p-6">
            {/* Plan Headers */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div></div> {/* Empty space for feature names column */}
              
              {/* Self Service Plan Header */}
              <Card className={cn(
                "border overflow-hidden cursor-pointer transition-colors",
                currentPlan === "self-service" && "border-primary bg-primary/5"
              )} onClick={() => setCurrentPlan("self-service")}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Self Service</CardTitle>
                      <p className="text-2xl font-medium mt-2">$2,995</p>
                      <p className="text-sm text-muted-foreground">$399 up front</p>
                    </div>
                    <LucidePackage2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
              
              {/* Full Service Plan Header */}
              <Card className={cn(
                "border overflow-hidden cursor-pointer transition-colors relative",
                currentPlan === "full-service" && "border-primary bg-primary/5",
                "border-primary" // popular flag
              )} onClick={() => setCurrentPlan("full-service")}>
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium">
                  Popular
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Full Service</CardTitle>
                      <p className="text-2xl font-medium mt-2">2.5%</p>
                      <p className="text-sm text-muted-foreground">No up front payment</p>
                    </div>
                    <HeartHandshake className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Features Comparison Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-muted/30">
                <div className="p-3 font-medium">Features</div>
                <div className="p-3 text-center font-medium border-l">Self Service</div>
                <div className="p-3 text-center font-medium border-l">Full Service</div>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className={cn(
                  "grid grid-cols-3 border-t",
                  index % 2 === 0 && "bg-muted/10"
                )}>
                  <div className={cn(
                    "p-3",
                    feature.important && "font-medium"
                  )}>
                    {feature.name}
                  </div>
                  <div className="p-3 text-center border-l">
                    {renderFeatureValue(feature.selfServiceValue)}
                  </div>
                  <div className="p-3 text-center border-l">
                    {renderFeatureValue(feature.fullServiceValue)}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div></div> {/* Empty space for feature names column */}
              <Button 
                onClick={() => handleSelectPlan("self-service")} 
                variant={currentPlan === "self-service" ? "default" : "outline"}
              >
                Select Self Service
              </Button>
              <Button 
                onClick={() => handleSelectPlan("full-service")} 
                variant={currentPlan === "full-service" ? "default" : "outline"}
              >
                Select Full Service
              </Button>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-center text-muted-foreground">
                All plans include access to our platform tools and support. <br />
                Questions? <span className="text-primary cursor-pointer">Contact our team</span> for more information.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="mt-0">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium">Payment Summary</h3>
              
              <div className="border rounded-lg p-4 mb-6 bg-muted/30">
                <div className="flex justify-between mb-2">
                  <p className="text-muted-foreground">Selected Plan</p>
                  <p className="font-medium">{getPlanName(currentPlan || "")}</p>
                </div>
                
                <div className="flex justify-between mb-2">
                  <p className="text-muted-foreground">Total Cost</p>
                  <p className="font-medium">{getPlanCost(currentPlan || "")}</p>
                </div>
                
                <div className="flex justify-between mb-2">
                  <p className="text-muted-foreground">Initial Payment</p>
                  <p className="font-medium">{currentPlan === "self-service" ? "$399" : "$0"}</p>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between">
                  <p className="font-medium">Due Today</p>
                  <p className="font-medium">{currentPlan === "self-service" ? "$399" : "$0"}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  <p className="text-sm">
                    {currentPlan === "self-service"
                      ? "You'll be charged $399 today, with the remaining $2,596 collected at closing."
                      : "You'll be charged $0 today, with the full 2.5% collected at closing."}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-sm">Payment information is secure and encrypted.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 border-t gap-4">
              <Button variant="ghost" onClick={() => setSelectedTab("plans")}>
                Back to Plans
              </Button>
              <Button onClick={handleProceedToPayment}>
                {currentPlan === "full-service"
                  ? "Confirm Selection"
                  : "Proceed to Payment"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}