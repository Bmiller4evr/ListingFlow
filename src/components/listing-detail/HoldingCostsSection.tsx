import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DetailedPropertyListing } from "../../data/listingDetailMock";
import { Clock, Home, DollarSign, Calendar, CreditCard } from "lucide-react";

interface HoldingCostsSectionProps {
  listing: DetailedPropertyListing;
}

export function HoldingCostsSection({ listing }: HoldingCostsSectionProps) {
  // Calculate estimated monthly holding costs
  const propertyTaxes = (listing.price * 0.015) / 12; // Estimated 1.5% annually
  const insurance = (listing.price * 0.003) / 12; // Estimated 0.3% annually  
  const utilities = 200; // Estimated monthly utilities
  const maintenance = listing.price * 0.001 / 12; // Estimated 0.1% annually
  const hoa = 0; // Assume no HOA for now
  
  // Calculate total mortgage payments
  const totalMortgagePayments = listing.mortgages?.reduce((total, mortgage) => total + mortgage.monthlyPayment, 0) || 0;
  
  const totalMonthly = propertyTaxes + insurance + utilities + maintenance + hoa + totalMortgagePayments;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Monthly Holding Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-foreground">Total Monthly Cost</span>
            <span className="text-2xl font-medium text-foreground">
              {formatCurrency(totalMonthly)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {/* Mortgage Payments */}
          {listing.mortgages && listing.mortgages.length > 0 && (
            <>
              {listing.mortgages.map((mortgage) => (
                <div key={mortgage.id} className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    {mortgage.type} Mortgage P&I ({mortgage.lenderName})
                  </span>
                  <span>{formatCurrency(mortgage.monthlyPayment)}</span>
                </div>
              ))}
            </>
          )}
          
          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4" />
              Property Taxes
            </span>
            <span>{formatCurrency(propertyTaxes)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Insurance
            </span>
            <span>{formatCurrency(insurance)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Utilities
            </span>
            <span>{formatCurrency(utilities)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4" />
              Maintenance
            </span>
            <span>{formatCurrency(maintenance)}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          *Estimates based on property value and local averages. Actual costs may vary.
        </div>
      </CardContent>
    </Card>
  );
}