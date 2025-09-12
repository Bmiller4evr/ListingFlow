import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { Percent } from "lucide-react";
import { COMMISSION_RANGES, COMMISSION_GUIDELINES } from './constants';
import { calculateCommissionAmount, formatPrice } from './utils';

interface BuyerCommissionStepProps {
  buyerAgentCommission: number;
  desiredPrice: string;
  onCommissionChange: (value: number) => void;
}

export function BuyerCommissionStep({
  buyerAgentCommission,
  desiredPrice,
  onCommissionChange
}: BuyerCommissionStepProps) {
  const commissionAmount = calculateCommissionAmount(desiredPrice, buyerAgentCommission);

  return (
    <div className="space-y-6">
      <div>
        <h3>Buyer's Agent Commission</h3>
        <p className="text-muted-foreground mt-2">
          Set the commission percentage you'll offer to buyer's agents. This is typically 2.5% to 3% of the sale price.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Commission Percentage</Label>
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{buyerAgentCommission}%</span>
          </div>
        </div>
        
        <Slider
          value={[buyerAgentCommission]}
          onValueChange={(value) => onCommissionChange(value[0])}
          max={COMMISSION_RANGES.MAX}
          min={COMMISSION_RANGES.MIN}
          step={COMMISSION_RANGES.STEP}
          className="w-full"
        />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{COMMISSION_RANGES.MIN}%</span>
          <span>1.5%</span>
          <span>{COMMISSION_RANGES.MAX}%</span>
        </div>
      </div>

      {/* Commission Impact Display */}
      {desiredPrice && parseFloat(desiredPrice) > 0 && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Commission Impact</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Sale Price:</span>
              <span>${formatPrice(desiredPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Buyer's Agent Commission ({buyerAgentCommission}%):</span>
              <span>${commissionAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Percent className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Commission Guidelines</p>
            <ul className="space-y-1 text-xs">
              {COMMISSION_GUIDELINES.map((guideline, index) => (
                <li key={index}>• {guideline.range}: {guideline.description}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}