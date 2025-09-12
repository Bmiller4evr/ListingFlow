import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Progress } from "../ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, FileText, X } from "lucide-react";

// Import extracted modules
import { 
  defaultFeatures, 
  repairItemsList, 
  knownConditionsList, 
  additionalAwarenessList, 
  TOTAL_CARDS 
} from "./seller-disclosure/constants";
import { 
  SellerDisclosureData, 
  SellerDisclosureFormProps, 
  PropertyFeature, 
  YNU 
} from "./seller-disclosure/types";
import { YNUButton, DefinitionBox } from "./seller-disclosure/components";
import { triggerConfetti, getCardTitle, getButtonText, getButtonStyling } from "./seller-disclosure/utils";

export function SellerDisclosureForm({ onNext, onExit, initialData }: SellerDisclosureFormProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [exemptionStatus, setExemptionStatus] = useState<string>(initialData?.exemptionStatus || '');
  const totalCards = TOTAL_CARDS;
  
  const [formData, setFormData] = useState<SellerDisclosureData>({
    exemptionStatus: initialData?.exemptionStatus || '',
    features: initialData?.features || defaultFeatures,
    garageType: initialData?.garageType || '',
    waterHeaterType: initialData?.waterHeaterType || '',
    waterSupply: initialData?.waterSupply || '',
    roofType: initialData?.roofType || '',
    roofAge: initialData?.roofAge || '',
    smokeDetectors: initialData?.smokeDetectors || '',
    repairItems: initialData?.repairItems || [],
    defectDescriptions: initialData?.defectDescriptions || '',
    knownConditions: initialData?.knownConditions || [],
    conditionExplanations: initialData?.conditionExplanations || '',
    repairNeeds: initialData?.repairNeeds || '',
    repairNeedsExplanation: initialData?.repairNeedsExplanation || '',
    femaFloodZone: initialData?.femaFloodZone || '',
    femaFloodDescription: initialData?.femaFloodDescription || '',
    femaBaseFloodElevation: initialData?.femaBaseFloodElevation || '',
    floodInsurance: initialData?.floodInsurance || '',
    previousReservoirFlooding: initialData?.previousReservoirFlooding || '',
    previousNaturalFlooding: initialData?.previousNaturalFlooding || '',
    in100YearFloodplain: initialData?.in100YearFloodplain || '',
    in100YearFloodplainExtent: initialData?.in100YearFloodplainExtent || '',
    in500YearFloodplain: initialData?.in500YearFloodplain || '',
    in500YearFloodplainExtent: initialData?.in500YearFloodplainExtent || '',
    inFloodway: initialData?.inFloodway || '',
    inFloodwayExtent: initialData?.inFloodwayExtent || '',
    inFloodPool: initialData?.inFloodPool || '',
    inFloodPoolExtent: initialData?.inFloodPoolExtent || '',
    inReservoir: initialData?.inReservoir || '',
    inReservoirExtent: initialData?.inReservoirExtent || '',
    floodExplanation: initialData?.floodExplanation || '',
    floodClaim: initialData?.floodClaim || '',
    floodClaimExplanation: initialData?.floodClaimExplanation || '',
    femaAssistance: initialData?.femaAssistance || '',
    femaAssistanceExplanation: initialData?.femaAssistanceExplanation || '',
    additionalAwareness: initialData?.additionalAwareness || [],
    additionalAwarenessExplanation: initialData?.additionalAwarenessExplanation || '',
  });

  const updateFormData = (updates: Partial<SellerDisclosureData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateFeature = (featureId: string, value: YNU) => {
    const updatedFeatures = formData.features.map(feature =>
      feature.id === featureId ? { ...feature, value } : feature
    );
    updateFormData({ features: updatedFeatures });
  };

  const toggleRepairItem = (item: string) => {
    const items = formData.repairItems.includes(item)
      ? formData.repairItems.filter(i => i !== item)
      : [...formData.repairItems, item];
    updateFormData({ repairItems: items });
  };

  const toggleKnownCondition = (condition: string) => {
    const conditions = formData.knownConditions.includes(condition)
      ? formData.knownConditions.filter(c => c !== condition)
      : [...formData.knownConditions, condition];
    updateFormData({ knownConditions: conditions });
  };

  const toggleAdditionalAwareness = (item: string) => {
    const items = formData.additionalAwareness.includes(item)
      ? formData.additionalAwareness.filter(i => i !== item)
      : [...formData.additionalAwareness, item];
    updateFormData({ additionalAwareness: items });
  };

  const handleNext = () => {
    // Handle exemption step
    if (currentCard === 0) {
      if (exemptionStatus && exemptionStatus !== 'none') {
        // User is exempt, skip to the end
        triggerConfetti();
        onNext({ ...formData, exemptionStatus });
        return;
      } else {
        // Not exempt, proceed to disclosure forms
        setCurrentCard(1);
        return;
      }
    }
    
    // Skip card 6 (defect descriptions) if no repair items are selected
    if (currentCard === 5 && formData.repairItems.length === 0) {
      setCurrentCard(7); // Skip to known conditions
    }
    // Skip card 8 (condition explanations) if no known conditions are selected
    else if (currentCard === 7 && formData.knownConditions.length === 0) {
      setCurrentCard(9); // Skip to summary (which will handle the flow)
    }
    // Skip card 21 (additional awareness explanations) if no additional awareness items are selected
    else if (currentCard === 21 && formData.additionalAwareness.length === 0) {
      // This is the final step, trigger confetti and complete
      triggerConfetti();
      onNext({ ...formData, exemptionStatus });
    } else if (currentCard < totalCards) {
      setCurrentCard(currentCard + 1);
    } else {
      // Final completion with confetti
      triggerConfetti();
      onNext({ ...formData, exemptionStatus });
    }
  };

  const handlePrevious = () => {
    // Skip card 6 when going back if no repair items are selected
    if (currentCard === 7 && formData.repairItems.length === 0) {
      setCurrentCard(5); // Go back to repair items
    }
    // Skip card 8 when going back if no known conditions are selected
    else if (currentCard === 10 && formData.knownConditions.length === 0) {
      setCurrentCard(7); // Go back to known conditions
    }
    // Skip the summary when going back if coming from repair needs
    else if (currentCard === 10 && formData.knownConditions.length === 0) {
      setCurrentCard(7); // Go back to known conditions
    }
    // Skip card 21 when going back if no additional awareness items are selected
    else if (currentCard === 22 && formData.additionalAwareness.length === 0) {
      setCurrentCard(21); // This shouldn't happen, but just in case
    } else if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const isCardValid = () => {
    // Exemption step requires a selection
    if (currentCard === 0) {
      return exemptionStatus !== '';
    }
    // All other cards are valid by default
    return true;
  };

  const renderCard = () => {
    switch (currentCard) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Are you exempt from providing a Seller's Disclosure Notice under Texas Property Code?</h3>
              
              <p className="text-sm text-muted-foreground">
                If none of these exemptions apply to you, you will need to complete the full Seller's Disclosure Notice.
              </p>

              <RadioGroup
                value={exemptionStatus}
                onValueChange={setExemptionStatus}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <RadioGroupItem value="new-construction" className="peer sr-only" />
                  <Label 
                    htmlFor="new-construction"
                    className="flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    onClick={() => setExemptionStatus('new-construction')}
                  >
                    <div className="font-medium">New Construction</div>
                    <div className="text-sm text-muted-foreground">
                      Property is newly constructed and has never been occupied for residential purposes, with the seller being the original builder or developer.
                    </div>
                  </Label>
                </div>

                <div className="space-y-2">
                  <RadioGroupItem value="court-ordered" className="peer sr-only" />
                  <Label 
                    htmlFor="court-ordered"
                    className="flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    onClick={() => setExemptionStatus('court-ordered')}
                  >
                    <div className="font-medium">Court Ordered Sale</div>
                    <div className="text-sm text-muted-foreground">
                      Sale mandated by court order including divorce proceedings, partition actions, probate court orders, or other judicial sales where the seller lacks personal knowledge of the property's condition.
                    </div>
                  </Label>
                </div>

                <div className="space-y-2">
                  <RadioGroupItem value="inherited" className="peer sr-only" />
                  <Label 
                    htmlFor="inherited"
                    className="flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    onClick={() => setExemptionStatus('inherited')}
                  >
                    <div className="font-medium">Inherited</div>
                    <div className="text-sm text-muted-foreground">
                      Sale by estate executor, administrator, or heir who never resided in the property and lacks actual knowledge of defects or conditions requiring disclosure.
                    </div>
                  </Label>
                </div>

                <div className="space-y-2">
                  <RadioGroupItem value="investment-property" className="peer sr-only" />
                  <Label 
                    htmlFor="investment-property"
                    className="flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    onClick={() => setExemptionStatus('investment-property')}
                  >
                    <div className="font-medium">Investment Property Sale</div>
                    <div className="text-sm text-muted-foreground">
                      Seller has never occupied the property as a residence and has no actual knowledge of material defects, typically applicable to investment properties with absentee ownership.
                    </div>
                  </Label>
                </div>

                <div className="space-y-2">
                  <RadioGroupItem value="foreclosure" className="peer sr-only" />
                  <Label 
                    htmlFor="foreclosure"
                    className="flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    onClick={() => setExemptionStatus('foreclosure')}
                  >
                    <div className="font-medium">Foreclosure or Lender Sale</div>
                    <div className="text-sm text-muted-foreground">
                      Property acquired through foreclosure, deed in lieu of foreclosure, or other distressed sale process where the seller is a financial institution, government agency, or entity that never occupied the property as a residence.
                    </div>
                  </Label>
                </div>

                <div className="space-y-2">
                  <RadioGroupItem value="none" className="peer sr-only" />
                  <Label 
                    htmlFor="none"
                    className="flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    onClick={() => setExemptionStatus('none')}
                  >
                    <div className="font-medium">None of these apply to me</div>
                    <div className="text-sm text-muted-foreground">
                      I need to complete the full Seller's Disclosure Notice.
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              For each item, select: <strong>Y</strong> (Yes, have it), <strong>N</strong> (No, don't have it), or <strong>U</strong> (Unknown/Unsure)
            </p>

            <div className="space-y-4">
              {formData.features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <span>{feature.name}</span>
                  <div className="flex gap-2">
                    <YNUButton
                      value={feature.value}
                      currentValue={feature.value}
                      onChange={(value) => updateFeature(feature.id, value)}
                      type="Y"
                    />
                    <YNUButton
                      value={feature.value}
                      currentValue={feature.value}
                      onChange={(value) => updateFeature(feature.id, value)}
                      type="N"
                    />
                    <YNUButton
                      value={feature.value}
                      currentValue={feature.value}
                      onChange={(value) => updateFeature(feature.id, value)}
                      type="U"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Garage Type</Label>
              <RadioGroup
                value={formData.garageType}
                onValueChange={(value) => updateFormData({ garageType: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="attached">
                  Attached
                </RadioGroupItem>
                <RadioGroupItem value="detached">
                  Detached
                </RadioGroupItem>
                <RadioGroupItem value="carport">
                  Carport
                </RadioGroupItem>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Water Heater Type</Label>
              <RadioGroup
                value={formData.waterHeaterType}
                onValueChange={(value) => updateFormData({ waterHeaterType: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="gas">
                  Gas
                </RadioGroupItem>
                <RadioGroupItem value="electric">
                  Electric
                </RadioGroupItem>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Water Supply</Label>
              <RadioGroup
                value={formData.waterSupply}
                onValueChange={(value) => updateFormData({ waterSupply: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="city">
                  City Water
                </RadioGroupItem>
                <RadioGroupItem value="well">
                  Well Water
                </RadioGroupItem>
                <RadioGroupItem value="mud">
                  MUD
                </RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roofType">Roof Type</Label>
                <Input
                  id="roofType"
                  value={formData.roofType}
                  onChange={(e) => updateFormData({ roofType: e.target.value })}
                  placeholder="e.g., Asphalt Shingle, Metal, Tile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roofAge">Roof Age (approximate years)</Label>
                <Input
                  id="roofAge"
                  type="number"
                  value={formData.roofAge}
                  onChange={(e) => updateFormData({ roofAge: e.target.value })}
                  placeholder="Years"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Does the property have working smoke detectors as required by law?</Label>
              <RadioGroup
                value={formData.smokeDetectors}
                onValueChange={(value) => updateFormData({ smokeDetectors: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">
                  Yes
                </RadioGroupItem>
                <RadioGroupItem value="no">
                  No
                </RadioGroupItem>
                <RadioGroupItem value="unknown">
                  Unknown
                </RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Are you aware of any known defects/malfunctions in any of the following? (Check all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {repairItemsList.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`repair-${item}`}
                      checked={formData.repairItems.includes(item)}
                      onCheckedChange={() => toggleRepairItem(item)}
                    />
                    <Label
                      htmlFor={`repair-${item}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        // This card should only show if repair items were selected in the previous step
        if (formData.repairItems.length === 0) {
          return null; // This should not be reached due to navigation logic
        }
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="defectDescriptions">
                Please describe the defects/malfunctions you selected in the previous step:
              </Label>
              <Textarea
                id="defectDescriptions"
                value={formData.defectDescriptions}
                onChange={(e) => updateFormData({ defectDescriptions: e.target.value })}
                placeholder="Provide detailed descriptions for each defect or malfunction..."
                rows={6}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Are you aware of any of the following conditions? (Check all that apply)</Label>
              <div className="space-y-3">
                {knownConditionsList.map((condition, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${index}`}
                      checked={formData.knownConditions.includes(condition)}
                      onCheckedChange={() => toggleKnownCondition(condition)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`condition-${index}`}
                      className="text-sm font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 8:
        // This card should only show if known conditions were selected in the previous step
        if (formData.knownConditions.length === 0) {
          return null; // This should not be reached due to navigation logic
        }
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="conditionExplanations">
                Please explain the conditions you selected in the previous step:
              </Label>
              <Textarea
                id="conditionExplanations"
                value={formData.conditionExplanations}
                onChange={(e) => updateFormData({ conditionExplanations: e.target.value })}
                placeholder="Provide detailed explanations for each condition..."
                rows={6}
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Summary of Disclosed Items</h3>
              <p className="text-sm text-muted-foreground">
                Review the items you've disclosed. This summary will be included in your disclosure statement.
              </p>
              
              {/* Repair Items Summary */}
              {formData.repairItems.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Known Defects/Malfunctions</h4>
                  <ul className="space-y-1">
                    {formData.repairItems.map((item, index) => (
                      <li key={index} className="text-sm text-amber-700 flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {formData.defectDescriptions && (
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-sm font-medium text-amber-800">Details:</p>
                      <p className="text-sm text-amber-700 mt-1">{formData.defectDescriptions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Known Conditions Summary */}
              {formData.knownConditions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Known Conditions</h4>
                  <ul className="space-y-1">
                    {formData.knownConditions.map((condition, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                  {formData.conditionExplanations && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Explanations:</p>
                      <p className="text-sm text-blue-700 mt-1">{formData.conditionExplanations}</p>
                    </div>
                  )}
                </div>
              )}

              {/* No Items Disclosed */}
              {formData.repairItems.length === 0 && formData.knownConditions.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <p className="text-sm text-green-700 font-medium">
                      No defects, malfunctions, or known conditions have been disclosed at this time.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This summary reflects the information you've provided so far in the disclosure process. 
                  You'll continue to provide additional information in the following steps.
                </p>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Are you aware of any repairs that are needed for the property?</Label>
              <RadioGroup
                value={formData.repairNeeds}
                onValueChange={(value) => updateFormData({ repairNeeds: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">
                  Yes
                </RadioGroupItem>
                <RadioGroupItem value="no">
                  No
                </RadioGroupItem>
              </RadioGroup>
              
              {formData.repairNeeds === 'yes' && (
                <div className="space-y-2">
                  <Label htmlFor="repairNeedsExplanation">
                    Please explain what repairs are needed:
                  </Label>
                  <Textarea
                    id="repairNeedsExplanation"
                    value={formData.repairNeedsExplanation}
                    onChange={(e) => updateFormData({ repairNeedsExplanation: e.target.value })}
                    placeholder="Describe the repairs that are needed..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This FEMA flood map shows whether your property is located in a designated flood area. The map is automatically generated based on your property address.
                </p>
                
                {/* Static FEMA Flood Map */}
                <div className="w-full rounded-lg border overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1707179894060-be73b0c0e29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxmZW1hJTIwZmxvb2QlMjBtYXAlMjB6b25lfGVufDF8fHx8MTc1NTc4NDEyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="FEMA Flood Zone Map" 
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
                
                {/* Example API Response Data */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Flood Zone</Label>
                      <p className="text-base">AE</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="text-base">High Risk - Special Flood Hazard Area</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Base Flood Elevation</Label>
                      <p className="text-base">472.0 feet</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p><strong>Note:</strong> Properties in flood zones AE, AH, AO, AR, A1-A30, V1-V30, VE, and V are considered high-risk areas and typically require flood insurance if you have a federally backed mortgage.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Is flood insurance available for the Property?</Label>
                  <RadioGroup
                    value={formData.floodInsurance}
                    onValueChange={(value) => updateFormData({ floodInsurance: value as any })}
                    className="space-y-2 mt-2"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Has the Property been damaged by previous reservoir flooding?</Label>
                  <RadioGroup
                    value={formData.previousReservoirFlooding}
                    onValueChange={(value) => updateFormData({ previousReservoirFlooding: value as any })}
                    className="space-y-2 mt-2"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Has the Property been damaged by previous natural flooding?</Label>
                  <RadioGroup
                    value={formData.previousNaturalFlooding}
                    onValueChange={(value) => updateFormData({ previousNaturalFlooding: value as any })}
                    className="space-y-2 mt-2"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <DefinitionBox title="100-Year Floodplain Definition">
              A 100-year floodplain is an area that has a 1% chance of being flooded in any given year. Properties in this area typically require flood insurance.
            </DefinitionBox>
            
            <div className="space-y-4">
              <Label>Is any part of the Property located in a 100-year floodplain?</Label>
              <RadioGroup
                value={formData.in100YearFloodplain}
                onValueChange={(value) => updateFormData({ in100YearFloodplain: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.in100YearFloodplain === 'yes' && (
                <div className="space-y-2">
                  <Label>How much of the Property is in the 100-year floodplain?</Label>
                  <RadioGroup
                    value={formData.in100YearFloodplainExtent}
                    onValueChange={(value) => updateFormData({ in100YearFloodplainExtent: value as any })}
                    className="space-y-2"
                  >
                    <RadioGroupItem value="wholly">Wholly (entirely)</RadioGroupItem>
                    <RadioGroupItem value="partly">Partly</RadioGroupItem>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        );

      case 13:
        return (
          <div className="space-y-6">
            <DefinitionBox title="500-Year Floodplain Definition">
              A 500-year floodplain is an area that has a 0.2% chance of being flooded in any given year. While less frequent than 100-year floods, properties in this area may still be at risk and could benefit from flood insurance.
            </DefinitionBox>
            
            <div className="space-y-4">
              <Label>Is any part of the Property located in a 500-year floodplain?</Label>
              <RadioGroup
                value={formData.in500YearFloodplain}
                onValueChange={(value) => updateFormData({ in500YearFloodplain: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.in500YearFloodplain === 'yes' && (
                <div className="space-y-2">
                  <Label>How much of the Property is in the 500-year floodplain?</Label>
                  <RadioGroup
                    value={formData.in500YearFloodplainExtent}
                    onValueChange={(value) => updateFormData({ in500YearFloodplainExtent: value as any })}
                    className="space-y-2"
                  >
                    <RadioGroupItem value="wholly">Wholly (entirely)</RadioGroupItem>
                    <RadioGroupItem value="partly">Partly</RadioGroupItem>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        );

      case 14:
        return (
          <div className="space-y-6">
            <DefinitionBox title="Floodway Definition">
              A floodway is the channel of a river or other watercourse and the adjacent land areas that must be reserved in order to discharge the base flood without cumulatively increasing the water surface elevation more than a designated height.
            </DefinitionBox>
            
            <div className="space-y-4">
              <Label>Is any part of the Property located in a floodway?</Label>
              <RadioGroup
                value={formData.inFloodway}
                onValueChange={(value) => updateFormData({ inFloodway: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.inFloodway === 'yes' && (
                <div className="space-y-2">
                  <Label>How much of the Property is in the floodway?</Label>
                  <RadioGroup
                    value={formData.inFloodwayExtent}
                    onValueChange={(value) => updateFormData({ inFloodwayExtent: value as any })}
                    className="space-y-2"
                  >
                    <RadioGroupItem value="wholly">Wholly (entirely)</RadioGroupItem>
                    <RadioGroupItem value="partly">Partly</RadioGroupItem>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        );

      case 15:
        return (
          <div className="space-y-6">
            <DefinitionBox title="Flood Pool Definition">
              A flood pool is the storage space in a reservoir between the spillway crest and the maximum water surface elevation.
            </DefinitionBox>
            
            <div className="space-y-4">
              <Label>Is any part of the Property located in a flood pool?</Label>
              <RadioGroup
                value={formData.inFloodPool}
                onValueChange={(value) => updateFormData({ inFloodPool: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.inFloodPool === 'yes' && (
                <div className="space-y-2">
                  <Label>How much of the Property is in the flood pool?</Label>
                  <RadioGroup
                    value={formData.inFloodPoolExtent}
                    onValueChange={(value) => updateFormData({ inFloodPoolExtent: value as any })}
                    className="space-y-2"
                  >
                    <RadioGroupItem value="wholly">Wholly (entirely)</RadioGroupItem>
                    <RadioGroupItem value="partly">Partly</RadioGroupItem>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        );

      case 16:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Is any part of the Property located in a reservoir?</Label>
              <RadioGroup
                value={formData.inReservoir}
                onValueChange={(value) => updateFormData({ inReservoir: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.inReservoir === 'yes' && (
                <div className="space-y-2">
                  <Label>How much of the Property is in the reservoir?</Label>
                  <RadioGroup
                    value={formData.inReservoirExtent}
                    onValueChange={(value) => updateFormData({ inReservoirExtent: value as any })}
                    className="space-y-2"
                  >
                    <RadioGroupItem value="wholly">Wholly (entirely)</RadioGroupItem>
                    <RadioGroupItem value="partly">Partly</RadioGroupItem>
                  </RadioGroup>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="floodExplanation">
                If you answered "Yes" to any flood-related questions above, please provide additional explanation:
              </Label>
              <Textarea
                id="floodExplanation"
                value={formData.floodExplanation}
                onChange={(e) => updateFormData({ floodExplanation: e.target.value })}
                placeholder="Provide details about the flood risks or history..."
                rows={4}
              />
            </div>
          </div>
        );

      case 17:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Have you made a claim for damages to the Property with an insurance company based on flooding?</Label>
              <RadioGroup
                value={formData.floodClaim}
                onValueChange={(value) => updateFormData({ floodClaim: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.floodClaim === 'yes' && (
                <div className="space-y-2">
                  <Label htmlFor="floodClaimExplanation">
                    Please explain the flood damage claim:
                  </Label>
                  <Textarea
                    id="floodClaimExplanation"
                    value={formData.floodClaimExplanation}
                    onChange={(e) => updateFormData({ floodClaimExplanation: e.target.value })}
                    placeholder="Describe the flood damage and insurance claim..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 18:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Have you received assistance from FEMA or the SBA for flood damage to the Property?</Label>
              <RadioGroup
                value={formData.femaAssistance}
                onValueChange={(value) => updateFormData({ femaAssistance: value as any })}
                className="space-y-2"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              {formData.femaAssistance === 'yes' && (
                <div className="space-y-2">
                  <Label htmlFor="femaAssistanceExplanation">
                    Please explain the FEMA or SBA assistance received:
                  </Label>
                  <Textarea
                    id="femaAssistanceExplanation"
                    value={formData.femaAssistanceExplanation}
                    onChange={(e) => updateFormData({ femaAssistanceExplanation: e.target.value })}
                    placeholder="Describe the assistance received from FEMA or SBA..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 19:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Are you aware of any of the following? (Check all that apply)</Label>
              <div className="space-y-3">
                {additionalAwarenessList.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Checkbox
                      id={`awareness-${index}`}
                      checked={formData.additionalAwareness.includes(item)}
                      onCheckedChange={() => toggleAdditionalAwareness(item)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`awareness-${index}`}
                      className="text-sm font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 20:
        // This card should only show if additional awareness items were selected in the previous step
        if (formData.additionalAwareness.length === 0) {
          return null; // This should not be reached due to navigation logic
        }
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="additionalAwarenessExplanation">
                Please explain the items you selected in the previous step:
              </Label>
              <Textarea
                id="additionalAwarenessExplanation"
                value={formData.additionalAwarenessExplanation}
                onChange={(e) => updateFormData({ additionalAwarenessExplanation: e.target.value })}
                placeholder="Provide detailed explanations for each item you selected..."
                rows={6}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <p>Invalid card number</p>
          </div>
        );
    }
  };

  const progress = ((currentCard + 1) / totalCards) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-center text-2xl">Sellers Disclosure</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExitDialog(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {currentCard + 1} of {totalCards}
              </span>
            </div>
            <CardDescription>
              {getCardTitle(currentCard)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderCard()}
          </CardContent>

          <div className="flex items-center justify-between p-6 pt-4 border-t">
            {currentCard > 0 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            <Button
              onClick={handleNext}
              disabled={!isCardValid()}
              className={`flex items-center gap-2 ${getButtonStyling(currentCard, exemptionStatus, formData, totalCards - 1)}`}
            >
              {getButtonText(currentCard, exemptionStatus, formData, totalCards - 1)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Seller's Disclosure?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress will be saved and you can return to complete this form later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Form</AlertDialogCancel>
              <AlertDialogAction onClick={onExit}>
                Save & Exit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}