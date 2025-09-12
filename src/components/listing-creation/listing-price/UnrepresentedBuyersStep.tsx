import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Users } from "lucide-react";

interface UnrepresentedBuyersStepProps {
  acceptUnrepresentedBuyers: 'yes' | 'no' | '';
  onValueChange: (value: 'yes' | 'no') => void;
}

export function UnrepresentedBuyersStep({
  acceptUnrepresentedBuyers,
  onValueChange
}: UnrepresentedBuyersStepProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Are you open to receiving offers from unrepresented buyers? *</Label>
      <p className="text-muted-foreground">
        Some buyers may not have their own real estate agent. Choose whether you're open to working with them directly.
      </p>
      <RadioGroup
        value={acceptUnrepresentedBuyers}
        onValueChange={(value) => onValueChange(value as 'yes' | 'no')}
        className="space-y-2"
      >
        <RadioGroupItem value="yes">Yes</RadioGroupItem>
        <RadioGroupItem value="no">No</RadioGroupItem>
      </RadioGroup>
      
      {acceptUnrepresentedBuyers === 'yes' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Working with Unrepresented Buyers</p>
              <p>When working with unrepresented buyers, you won't need to pay a buyer's agent commission, which can increase your net proceeds. However, the buyer may expect you to help them with parts of the transaction process.</p>
            </div>
          </div>
        </div>
      )}
      
      {acceptUnrepresentedBuyers === 'no' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Represented Buyers Only</p>
              <p>You'll only receive offers from buyers who have their own agent. This typically means a smoother transaction process but you'll pay the full buyer's agent commission.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}