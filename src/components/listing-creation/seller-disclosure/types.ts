export type YNU = 'Y' | 'N' | 'U' | null;

export interface PropertyFeature {
  id: string;
  name: string;
  value: YNU;
}

export interface SellerDisclosureData {
  // Card 0: Exemption Status
  exemptionStatus?: string;
  
  // Card 1: Property Features & Appliances
  features: PropertyFeature[];
  
  // Card 2: Property Systems
  garageType: 'attached' | 'detached' | 'carport' | '';
  waterHeaterType: 'gas' | 'electric' | '';
  waterSupply: 'city' | 'well' | 'mud' | '';
  
  // Card 3: Roof Information
  roofType: string;
  roofAge: string;
  
  // Card 4: Smoke Detectors
  smokeDetectors: 'yes' | 'no' | 'unknown' | '';
  
  // Card 5: Known Defects
  repairItems: string[];
  
  // Card 6: Defect Descriptions
  defectDescriptions: string;
  
  // Card 7: Known Conditions
  knownConditions: string[];
  
  // Card 8: Condition Explanations
  conditionExplanations: string;
  
  // Card 9: Repair Needs
  repairNeeds: 'yes' | 'no' | '';
  repairNeedsExplanation: string;
  
  // Card 10: FEMA Flood Map
  femaFloodZone: string;
  femaFloodDescription: string;
  femaBaseFloodElevation: string;
  
  // Card 11: Flood Insurance & Previous Flooding
  floodInsurance: 'yes' | 'no' | '';
  previousReservoirFlooding: 'yes' | 'no' | '';
  previousNaturalFlooding: 'yes' | 'no' | '';
  
  // Card 12: 100-Year Floodplain
  in100YearFloodplain: 'yes' | 'no' | '';
  in100YearFloodplainExtent: 'wholly' | 'partly' | '';
  
  // Card 13: 500-Year Floodplain
  in500YearFloodplain: 'yes' | 'no' | '';
  in500YearFloodplainExtent: 'wholly' | 'partly' | '';
  
  // Card 14: Floodway
  inFloodway: 'yes' | 'no' | '';
  inFloodwayExtent: 'wholly' | 'partly' | '';
  
  // Card 15: Flood Pool
  inFloodPool: 'yes' | 'no' | '';
  inFloodPoolExtent: 'wholly' | 'partly' | '';
  
  // Card 16: Reservoir and Explanation
  inReservoir: 'yes' | 'no' | '';
  inReservoirExtent: 'wholly' | 'partly' | '';
  floodExplanation: string;
  
  // Card 17: Insurance Claims
  floodClaim: 'yes' | 'no' | '';
  floodClaimExplanation: string;
  
  // Card 18: FEMA/SBA Assistance
  femaAssistance: 'yes' | 'no' | '';
  femaAssistanceExplanation: string;
  
  // Card 19: Additional Seller Awareness
  additionalAwareness: string[];
  
  // Card 20: Additional Awareness Explanations
  additionalAwarenessExplanation: string;
}

export interface SellerDisclosureFormProps {
  onNext: (data: SellerDisclosureData) => void;
  onExit?: () => void;
  initialData?: Partial<SellerDisclosureData>;
}

export interface YNUButtonProps {
  value: YNU;
  currentValue: YNU;
  onChange: (value: YNU) => void;
  type: 'Y' | 'N' | 'U';
}

export interface DefinitionBoxProps {
  title: string;
  children: React.ReactNode;
}