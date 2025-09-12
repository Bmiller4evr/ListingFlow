import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DetailedPropertyListing } from "../../data/listingDetailMock";
import { TrendingUp, DollarSign, Percent, Calculator } from "lucide-react";

interface NetProceedsSectionProps {
  listing: DetailedPropertyListing;
}

export function NetProceedsSection({ listing }: NetProceedsSectionProps) {
  // Calculate estimated net proceeds
  const listPrice = listing.price;
  const buyerAgentCommission = listPrice * 0.025; // 2.5%
  const listingAgentCommission = listing.plan === 'self-service' ? 2995 : listPrice * 0.025; // Flat fee or 2.5%
  const closingCosts = listPrice * 0.02; // Estimated 2%
  const titleInsurance = listPrice * 0.005; // Estimated 0.5%
  const transferTaxes = listPrice * 0.002; // Estimated 0.2%
  
  // Calculate total mortgage payoffs
  const totalMortgagePayoffs = listing.mortgages?.reduce((total, mortgage) => total + mortgage.payoffAmount, 0) || 0;
  
  const totalCosts = buyerAgentCommission + listingAgentCommission + closingCosts + titleInsurance + transferTaxes + totalMortgagePayoffs;
  const estimatedNetProceeds = listPrice - totalCosts;

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
          <TrendingUp className="h-5 w-5 text-green-600" />
          Estimated Net Proceeds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-foreground">Estimated Net to You</span>
            <span className="text-2xl font-medium text-foreground">
              {formatCurrency(estimatedNetProceeds)}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              List Price
            </span>
            <span>{formatCurrency(listPrice)}</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Buyer Agent Commission (2.5%)</span>
              <span>-{formatCurrency(buyerAgentCommission)}</span>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <span>
                {listing.plan === 'self-service' ? 'Access Realty Fee' : 'Listing Commission (2.5%)'}
              </span>
              <span>-{formatCurrency(listingAgentCommission)}</span>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <span>Closing Costs (~2%)</span>
              <span>-{formatCurrency(closingCosts)}</span>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <span>Title Insurance (~0.5%)</span>
              <span>-{formatCurrency(titleInsurance)}</span>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <span>Transfer Taxes (~0.2%)</span>
              <span>-{formatCurrency(transferTaxes)}</span>
            </div>
            
            {/* Mortgage Payoffs */}
            {listing.mortgages && listing.mortgages.length > 0 && (
              <>
                {listing.mortgages.map((mortgage) => (
                  <div key={mortgage.id} className="flex justify-between text-muted-foreground">
                    <span>{mortgage.type} Mortgage Payoff ({mortgage.lenderName})</span>
                    <span>-{formatCurrency(mortgage.payoffAmount)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          *This is an estimate. Actual costs may vary based on negotiations, local fees, and market conditions.
        </div>
      </CardContent>
    </Card>
  );
}