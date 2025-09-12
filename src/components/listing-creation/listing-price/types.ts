export interface ListingPriceData {
  videoWatched: boolean;
  priceSubmitted: boolean;
  desiredPrice: string;
  priceJustification: string;
  marketingStrategy: 'aggressive' | 'competitive' | 'conservative';
  flexibilityLevel: 'firm' | 'somewhat-flexible' | 'very-flexible';
  timeFrameMotivation: string;
  additionalNotes: string;
  acceptUnrepresentedBuyers: 'yes' | 'no' | '';
  buyerAgentCommission: number;
}

export interface ListingPriceFormProps {
  onNext: (data: ListingPriceData) => void;
  onBack?: () => void;
  onExit?: () => void;
  initialData?: Partial<ListingPriceData>;
  homeFacts?: any;
  financialInfo?: any;
}

export interface SuggestedPriceRange {
  low: number;
  high: number;
}