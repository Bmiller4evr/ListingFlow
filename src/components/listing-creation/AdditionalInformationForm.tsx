import { useState, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, FileText, X, Upload, FileUp } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import confetti from "canvas-confetti";

export interface MUDDetails {
  informationMethod: 'upload' | 'questions' | '';
  statementFile?: File;
  districtName?: string;
  districtAddress?: string;
  districtPhone?: string;
  taxRate?: string;
  bondedDebt?: string;
  assessedValuation?: string;
  standbyFee?: string;
  standbyFeeFrequency?: string;
  informationDate?: string;
  informationSource?: string;
}

export interface PIDDetails {
  informationMethod: 'upload' | 'questions' | '';
  statementFile?: File;
  propertyAddress?: string;
  pidName?: string;
  cityMunicipality?: string;
  annualAssessment?: string;
  paymentSchedule?: string;
  remainingBalance?: string;
  assessmentTerm?: string;
  informationDate?: string;
  isCurrentPaidUp?: 'yes' | 'no' | '';
  hasDelinquentAssessments?: 'yes' | 'no' | '';
  hasOwnDisclosureForm?: 'yes' | 'no' | '';
}

export interface AdditionalInformationData {
  isInMUD: 'yes' | 'no' | '';
  mudDetails?: MUDDetails;
  isInPID: 'yes' | 'no' | '';
  pidDetails?: PIDDetails;
  isInHOA: 'yes' | 'no' | '';
  fixtureLeases?: string[];
  mineralRights?: 'severed' | 'ongoing-lease' | 'none' | '';
  insuranceClaims?: 'yes' | 'no' | '';
  insuranceProceeds?: 'yes' | 'no' | '';
  insuranceProceedsDetails?: string;
  relocationCompany?: 'yes' | 'no' | '';
}

interface Question {
  id: string;
  title: string;
  type: 'radio';
  options: { value: string; label: string }[];
}

interface AdditionalInformationFormProps {
  onNext: (data: AdditionalInformationData) => void;
  onBack?: () => void;
  onExit?: () => void;
  initialData?: Partial<AdditionalInformationData>;
}

export function AdditionalInformationForm({ onNext, onBack, onExit, initialData }: AdditionalInformationFormProps) {
  const isMobile = useIsMobile();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<'hoa' | 'pid' | 'pid-method' | 'pid-upload' | 'pid-questions' | 'mud' | 'mud-method' | 'mud-upload' | 'mud-questions' | 'fixture-lease' | 'mineral-rights' | 'insurance-claims' | 'insurance-proceeds' | 'insurance-proceeds-details' | 'relocation-company'>('hoa');
  const [formData, setFormData] = useState<AdditionalInformationData>({
    isInMUD: initialData?.isInMUD || '',
    mudDetails: initialData?.mudDetails || {
      informationMethod: '',
      districtName: '',
      districtAddress: '',
      districtPhone: '',
      taxRate: '',
      bondedDebt: '',
      assessedValuation: '',
      standbyFee: '',
      standbyFeeFrequency: '',
      informationDate: '',
      informationSource: ''
    },
    isInPID: initialData?.isInPID || '',
    pidDetails: initialData?.pidDetails || {
      informationMethod: '',
      propertyAddress: '',
      pidName: '',
      cityMunicipality: '',
      annualAssessment: '',
      paymentSchedule: '',
      remainingBalance: '',
      assessmentTerm: '',
      informationDate: '',
      isCurrentPaidUp: '',
      hasDelinquentAssessments: '',
      hasOwnDisclosureForm: ''
    },
    isInHOA: initialData?.isInHOA || '',
    fixtureLeases: initialData?.fixtureLeases || [],
    mineralRights: initialData?.mineralRights || '',
    insuranceClaims: initialData?.insuranceClaims || '',
    insuranceProceeds: initialData?.insuranceProceeds || '',
    insuranceProceedsDetails: initialData?.insuranceProceedsDetails || '',
    relocationCompany: initialData?.relocationCompany || ''
  });

  // Calculate total steps for progress indicator - keep stable during navigation
  const getTotalSteps = () => {
    let steps = 8; // Base steps: hoa, pid, mud, fixture-lease, mineral-rights, insurance-claims, insurance-proceeds, relocation-company
    
    // Add conditional steps based on yes/no answers only (not method selection)
    if (formData.isInPID === 'yes') {
      steps += 2; // pid-method + (pid-upload OR pid-questions)
    }
    if (formData.isInMUD === 'yes') {
      steps += 2; // mud-method + (mud-upload OR mud-questions)  
    }
    if (formData.insuranceProceeds === 'yes') {
      steps += 1; // insurance-proceeds-details
    }
    
    return steps;
  };

  const getCurrentStepNumber = () => {
    let stepNumber = 1;
    
    // Base steps
    if (currentStep === 'hoa') return stepNumber;
    stepNumber++;
    
    if (currentStep === 'pid') return stepNumber;
    stepNumber++;
    
    // PID conditional steps
    if (formData.isInPID === 'yes') {
      if (currentStep === 'pid-method') return stepNumber;
      stepNumber++;
      
      if (currentStep === 'pid-upload' || currentStep === 'pid-questions') return stepNumber;
      stepNumber++;
    }
    
    if (currentStep === 'mud') return stepNumber;
    stepNumber++;
    
    // MUD conditional steps
    if (formData.isInMUD === 'yes') {
      if (currentStep === 'mud-method') return stepNumber;
      stepNumber++;
      
      if (currentStep === 'mud-upload' || currentStep === 'mud-questions') return stepNumber;
      stepNumber++;
    }
    
    // Remaining base steps
    if (currentStep === 'fixture-lease') return stepNumber;
    stepNumber++;
    
    if (currentStep === 'mineral-rights') return stepNumber;
    stepNumber++;
    
    if (currentStep === 'insurance-claims') return stepNumber;
    stepNumber++;
    
    if (currentStep === 'insurance-proceeds') return stepNumber;
    stepNumber++;
    
    // Insurance proceeds details gets its own step number
    if (currentStep === 'insurance-proceeds-details') return stepNumber;
    // Only increment if insurance-proceeds-details was actually shown
    if (formData.insuranceProceeds === 'yes') {
      stepNumber++;
    }
    
    if (currentStep === 'relocation-company') return stepNumber;
    
    return stepNumber;
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'hoa':
        setCurrentStep('pid');
        break;
      case 'pid':
        if (formData.isInPID === 'yes') {
          setCurrentStep('pid-method');
        } else {
          setCurrentStep('mud');
        }
        break;
      case 'pid-method':
        if (formData.pidDetails?.informationMethod === 'upload') {
          setCurrentStep('pid-upload');
        } else if (formData.pidDetails?.informationMethod === 'questions') {
          setCurrentStep('pid-questions');
        }
        // If no method selected, don't navigate (isStepComplete will prevent this)
        break;
      case 'pid-upload':
      case 'pid-questions':
        setCurrentStep('mud');
        break;
      case 'mud':
        if (formData.isInMUD === 'yes') {
          setCurrentStep('mud-method');
        } else {
          setCurrentStep('fixture-lease');
        }
        break;
      case 'mud-method':
        if (formData.mudDetails?.informationMethod === 'upload') {
          setCurrentStep('mud-upload');
        } else if (formData.mudDetails?.informationMethod === 'questions') {
          setCurrentStep('mud-questions');
        }
        // If no method selected, don't navigate (isStepComplete will prevent this)
        break;
      case 'mud-upload':
      case 'mud-questions':
        setCurrentStep('fixture-lease');
        break;
      case 'fixture-lease':
        setCurrentStep('mineral-rights');
        break;
      case 'mineral-rights':
        setCurrentStep('insurance-claims');
        break;
      case 'insurance-claims':
        setCurrentStep('insurance-proceeds');
        break;
      case 'insurance-proceeds':
        if (formData.insuranceProceeds === 'yes') {
          setCurrentStep('insurance-proceeds-details');
        } else {
          setCurrentStep('relocation-company');
        }
        break;
      case 'insurance-proceeds-details':
        setCurrentStep('relocation-company');
        break;
      case 'relocation-company':
        // Trigger confetti on completion
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onNext(formData);
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'pid':
        setCurrentStep('hoa');
        break;
      case 'pid-method':
        setCurrentStep('pid');
        break;
      case 'pid-upload':
      case 'pid-questions':
        setCurrentStep('pid-method');
        break;
      case 'mud':
        if (formData.isInPID === 'yes') {
          // Go back to the last PID step based on method selected
          const pidMethod = formData.pidDetails?.informationMethod;
          if (pidMethod === 'upload') {
            setCurrentStep('pid-upload');
          } else if (pidMethod === 'questions') {
            setCurrentStep('pid-questions');
          } else {
            setCurrentStep('pid-method');
          }
        } else {
          setCurrentStep('pid');
        }
        break;
      case 'mud-method':
        setCurrentStep('mud');
        break;
      case 'mud-upload':
      case 'mud-questions':
        setCurrentStep('mud-method');
        break;
      case 'fixture-lease':
        if (formData.isInMUD === 'yes') {
          // Go back to the last MUD step based on method selected
          const mudMethod = formData.mudDetails?.informationMethod;
          if (mudMethod === 'upload') {
            setCurrentStep('mud-upload');
          } else if (mudMethod === 'questions') {
            setCurrentStep('mud-questions');
          } else {
            setCurrentStep('mud-method');
          }
        } else {
          setCurrentStep('mud');
        }
        break;
      case 'mineral-rights':
        setCurrentStep('fixture-lease');
        break;
      case 'insurance-claims':
        setCurrentStep('mineral-rights');
        break;
      case 'insurance-proceeds':
        setCurrentStep('insurance-claims');
        break;
      case 'insurance-proceeds-details':
        setCurrentStep('insurance-proceeds');
        break;
      case 'relocation-company':
        if (formData.insuranceProceeds === 'yes') {
          setCurrentStep('insurance-proceeds-details');
        } else {
          setCurrentStep('insurance-proceeds');
        }
        break;
      default:
        if (onBack) onBack();
        break;
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMUDDetails = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      mudDetails: {
        ...prev.mudDetails,
        [field]: value
      }
    }));
  };

  const updatePIDDetails = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pidDetails: {
        ...prev.pidDetails,
        [field]: value
      }
    }));
  };

  const handleRadioValue = (field: string, value: string) => {
    updateFormData(field, value);
    
    // Auto-advance for radio questions - but not on the final step
    const totalSteps = getTotalSteps();
    const currentStepNumber = getCurrentStepNumber();
    
    if (currentStepNumber < totalSteps) {
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 'hoa':
        return formData.isInHOA !== '';
      case 'pid':
        return formData.isInPID !== '';
      case 'pid-method':
        return formData.pidDetails?.informationMethod !== '';
      case 'pid-upload':
        return !!formData.pidDetails?.statementFile;
      case 'pid-questions':
        return !!(formData.pidDetails?.propertyAddress && 
                 formData.pidDetails?.pidName && 
                 formData.pidDetails?.cityMunicipality && 
                 formData.pidDetails?.annualAssessment &&
                 formData.pidDetails?.paymentSchedule &&
                 formData.pidDetails?.assessmentTerm &&
                 formData.pidDetails?.informationDate &&
                 formData.pidDetails?.isCurrentPaidUp &&
                 formData.pidDetails?.hasDelinquentAssessments &&
                 formData.pidDetails?.hasOwnDisclosureForm);
      case 'mud':
        return formData.isInMUD !== '';
      case 'mud-method':
        return formData.mudDetails?.informationMethod !== '';
      case 'mud-upload':
        return !!formData.mudDetails?.statementFile;
      case 'mud-questions':
        return !!(formData.mudDetails?.districtName && 
                 formData.mudDetails?.districtAddress && 
                 formData.mudDetails?.districtPhone && 
                 formData.mudDetails?.taxRate &&
                 formData.mudDetails?.bondedDebt &&
                 formData.mudDetails?.assessedValuation &&
                 formData.mudDetails?.informationDate &&
                 formData.mudDetails?.informationSource);
      case 'fixture-lease':
        return formData.fixtureLeases && formData.fixtureLeases.length > 0;
      case 'mineral-rights':
        return formData.mineralRights !== '';
      case 'insurance-claims':
        return formData.insuranceClaims !== '';
      case 'insurance-proceeds':
        return formData.insuranceProceeds !== '';
      case 'insurance-proceeds-details':
        return formData.insuranceProceedsDetails !== '';
      case 'relocation-company':
        return formData.relocationCompany !== '';
      default:
        return false;
    }
  };

  // Custom Button Radio Group Component
  const ButtonRadioGroup = ({ options, value, onValueChange }: {
    options: { value: string; label: string }[];
    value: string;
    onValueChange: (value: string) => void;
  }) => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? "default" : "outline"}
            className={`h-12 justify-center relative ${
              value === option.value 
                ? "bg-primary text-primary-foreground" 
                : "bg-white text-foreground border-border hover:bg-muted"
            }`}
            onClick={() => onValueChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  // File Upload Component
  const FileUploadBox = ({ type = 'mud' }: { type?: 'mud' | 'pid' }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (file: File | null) => {
      if (type === 'mud') {
        updateMUDDetails('statementFile', file);
      } else {
        updatePIDDetails('statementFile', file);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileChange(files[0]);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };

    return (
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {(type === 'mud' ? formData.mudDetails?.statementFile : formData.pidDetails?.statementFile) ? (
          <div className="space-y-2">
            <FileUp className="h-8 w-8 mx-auto text-green-600" />
            <p className="font-medium">{(type === 'mud' ? formData.mudDetails?.statementFile?.name : formData.pidDetails?.statementFile?.name)}</p>
            <p className="text-sm text-muted-foreground">
              {((type === 'mud' ? formData.mudDetails?.statementFile?.size : formData.pidDetails?.statementFile?.size) || 0 / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleFileChange(null)}
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">Upload your {type.toUpperCase()} statement</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your file here, or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="hidden"
              id={`${type}-file-upload`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(`${type}-file-upload`)?.click()}
            >
              Choose File
            </Button>
          </div>
        )}
      </div>
    );
  };

  const shouldShowBackButton = currentStep !== 'hoa' || onBack;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'hoa':
        return 'Is the Property subject to membership in a Homeowners\' Association?';
      case 'pid':
        return 'Is your property located within a Public Improvement District (PID)?';
      case 'pid-method':
        return 'Do you want to upload a copy of a recent PID statement, or answer questions?';
      case 'pid-upload':
        return '';
      case 'pid-questions':
        return 'PID Assessment Information';
      case 'mud':
        return 'Is your property located within a Municipal Utility District (MUD)?';
      case 'mud-method':
        return 'Do you want to upload a copy of a recent MUD statement, or answer questions?';
      case 'mud-upload':
        return '';
      case 'mud-questions':
        return 'MUD District Information';
      case 'fixture-lease':
        return 'Does the Property have a Fixture Lease for any of the following:';
      case 'mineral-rights':
        return 'Are there any existing mineral leases or mineral rights that have been severed from this Property?';
      case 'insurance-claims':
        return 'Are there any Open Insurance Claims related to the Property?';
      case 'insurance-proceeds':
        return 'Have you received proceeds from an insurance claim and then not restore the damages?';
      case 'insurance-proceeds-details':
        return 'When was the claim and what was it for?';
      case 'relocation-company':
        return 'Are you selling through a relocation company or employer buyout program?';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'hoa':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={formData.isInHOA}
            onValueChange={(value) => handleRadioValue('isInHOA', value)}
          />
        );

      case 'pid':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={formData.isInPID}
            onValueChange={(value) => handleRadioValue('isInPID', value)}
          />
        );

      case 'pid-method':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'upload', label: 'Upload Statement' },
              { value: 'questions', label: 'Answer Questions' }
            ]}
            value={formData.pidDetails?.informationMethod || ''}
            onValueChange={(value) => {
              // Update the method and clear conflicting data in a single state update
              setFormData(prev => ({
                ...prev,
                pidDetails: {
                  ...prev.pidDetails,
                  informationMethod: value as 'upload' | 'questions',
                  // Clear fields from the other method to prevent conflicts
                  ...(value === 'upload' ? {
                    // Clear question fields if switching to upload
                    propertyAddress: '',
                    pidName: '',
                    cityMunicipality: '',
                    annualAssessment: '',
                    paymentSchedule: '',
                    remainingBalance: '',
                    assessmentTerm: '',
                    informationDate: '',
                    isCurrentPaidUp: '',
                    hasDelinquentAssessments: '',
                    hasOwnDisclosureForm: ''
                  } : {
                    // Clear upload field if switching to questions
                    statementFile: undefined
                  })
                }
              }));
            }}
          />
        );

      case 'pid-upload':
        return (
          <Card className="border-none shadow-none bg-card">
            <CardHeader>
              <CardTitle>Upload your PID Document</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadBox type="pid" />
            </CardContent>
          </Card>
        );

      case 'pid-questions':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pidPropertyAddress">Property address (the specific property being sold)</Label>
              <Input
                id="pidPropertyAddress"
                value={formData.pidDetails?.propertyAddress || ''}
                onChange={(e) => updatePIDDetails('propertyAddress', e.target.value)}
                placeholder="Enter the property address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pidName">PID name/identification (exact legal name)</Label>
                <Input
                  id="pidName"
                  value={formData.pidDetails?.pidName || ''}
                  onChange={(e) => updatePIDDetails('pidName', e.target.value)}
                  placeholder="Enter the exact legal name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cityMunicipality">City/Municipality where the PID is located</Label>
                <Input
                  id="cityMunicipality"
                  value={formData.pidDetails?.cityMunicipality || ''}
                  onChange={(e) => updatePIDDetails('cityMunicipality', e.target.value)}
                  placeholder="Enter city/municipality"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualAssessment">Annual assessment amount (current year)</Label>
                <Input
                  id="annualAssessment"
                  value={formData.pidDetails?.annualAssessment || ''}
                  onChange={(e) => updatePIDDetails('annualAssessment', e.target.value)}
                  placeholder="e.g., $2,500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentSchedule">Assessment payment schedule</Label>
                <Input
                  id="paymentSchedule"
                  value={formData.pidDetails?.paymentSchedule || ''}
                  onChange={(e) => updatePIDDetails('paymentSchedule', e.target.value)}
                  placeholder="e.g., Monthly, Annually"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="remainingBalance">Total remaining assessment balance (if known)</Label>
                <Input
                  id="remainingBalance"
                  value={formData.pidDetails?.remainingBalance || ''}
                  onChange={(e) => updatePIDDetails('remainingBalance', e.target.value)}
                  placeholder="e.g., $25,000 or Unknown"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessmentTerm">Assessment term (how many years remaining)</Label>
                <Input
                  id="assessmentTerm"
                  value={formData.pidDetails?.assessmentTerm || ''}
                  onChange={(e) => updatePIDDetails('assessmentTerm', e.target.value)}
                  placeholder="e.g., 15 years"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pidInformationDate">Date this information was obtained</Label>
              <Input
                id="pidInformationDate"
                type="date"
                value={formData.pidDetails?.informationDate || ''}
                onChange={(e) => updatePIDDetails('informationDate', e.target.value)}
              />
            </div>

            {/* Yes/No Questions */}
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label className="text-base">Is the annual assessment current/paid up to date?</Label>
                <ButtonRadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={formData.pidDetails?.isCurrentPaidUp || ''}
                  onValueChange={(value) => updatePIDDetails('isCurrentPaidUp', value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Are there any delinquent assessments on this property?</Label>
                <ButtonRadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={formData.pidDetails?.hasDelinquentAssessments || ''}
                  onValueChange={(value) => updatePIDDetails('hasDelinquentAssessments', value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Does the PID have their own disclosure form available?</Label>
                <ButtonRadioGroup
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  value={formData.pidDetails?.hasOwnDisclosureForm || ''}
                  onValueChange={(value) => updatePIDDetails('hasOwnDisclosureForm', value)}
                />
              </div>
            </div>
          </div>
        );

      case 'mud':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={formData.isInMUD}
            onValueChange={(value) => handleRadioValue('isInMUD', value)}
          />
        );

      case 'mud-method':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'upload', label: 'Upload Statement' },
              { value: 'questions', label: 'Answer Questions' }
            ]}
            value={formData.mudDetails?.informationMethod || ''}
            onValueChange={(value) => {
              // Update the method and clear conflicting data in a single state update
              setFormData(prev => ({
                ...prev,
                mudDetails: {
                  ...prev.mudDetails,
                  informationMethod: value as 'upload' | 'questions',
                  // Clear fields from the other method to prevent conflicts
                  ...(value === 'upload' ? {
                    // Clear question fields if switching to upload
                    districtName: '',
                    districtAddress: '',
                    districtPhone: '',
                    taxRate: '',
                    bondedDebt: '',
                    assessedValuation: '',
                    standbyFee: '',
                    standbyFeeFrequency: '',
                    informationDate: '',
                    informationSource: ''
                  } : {
                    // Clear upload field if switching to questions
                    statementFile: undefined
                  })
                }
              }));
            }}
          />
        );

      case 'mud-upload':
        return (
          <Card className="border-none shadow-none bg-card">
            <CardHeader>
              <CardTitle>Upload your MUD Document</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadBox type="mud" />
            </CardContent>
          </Card>
        );

      case 'mud-questions':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="districtName">District name (exact legal name)</Label>
                <Input
                  id="districtName"
                  value={formData.mudDetails?.districtName || ''}
                  onChange={(e) => updateMUDDetails('districtName', e.target.value)}
                  placeholder="Enter the exact legal name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="districtPhone">District phone number</Label>
                <Input
                  id="districtPhone"
                  value={formData.mudDetails?.districtPhone || ''}
                  onChange={(e) => updateMUDDetails('districtPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="districtAddress">District address (mailing address)</Label>
              <Textarea
                id="districtAddress"
                value={formData.mudDetails?.districtAddress || ''}
                onChange={(e) => updateMUDDetails('districtAddress', e.target.value)}
                placeholder="Enter the complete mailing address"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Current tax rate (per $100 of assessed valuation)</Label>
                <Input
                  id="taxRate"
                  value={formData.mudDetails?.taxRate || ''}
                  onChange={(e) => updateMUDDetails('taxRate', e.target.value)}
                  placeholder="e.g., $1.25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bondedDebt">Total bonded debt amount</Label>
                <Input
                  id="bondedDebt"
                  value={formData.mudDetails?.bondedDebt || ''}
                  onChange={(e) => updateMUDDetails('bondedDebt', e.target.value)}
                  placeholder="e.g., $25,000,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessedValuation">Assessed valuation of all property in the district</Label>
              <Input
                id="assessedValuation"
                value={formData.mudDetails?.assessedValuation || ''}
                onChange={(e) => updateMUDDetails('assessedValuation', e.target.value)}
                placeholder="e.g., $500,000,000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standbyFee">Standby fee amount (if any)</Label>
                <Input
                  id="standbyFee"
                  value={formData.mudDetails?.standbyFee || ''}
                  onChange={(e) => updateMUDDetails('standbyFee', e.target.value)}
                  placeholder="e.g., $150 or N/A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standbyFeeFrequency">Frequency</Label>
                <Input
                  id="standbyFeeFrequency"
                  value={formData.mudDetails?.standbyFeeFrequency || ''}
                  onChange={(e) => updateMUDDetails('standbyFeeFrequency', e.target.value)}
                  placeholder="e.g., Annual, Monthly"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="informationDate">Date this information was obtained</Label>
                <Input
                  id="informationDate"
                  type="date"
                  value={formData.mudDetails?.informationDate || ''}
                  onChange={(e) => updateMUDDetails('informationDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="informationSource">Source of the information</Label>
                <Input
                  id="informationSource"
                  value={formData.mudDetails?.informationSource || ''}
                  onChange={(e) => updateMUDDetails('informationSource', e.target.value)}
                  placeholder="e.g., MUD office, district website"
                />
              </div>
            </div>
          </div>
        );

      case 'fixture-lease':
        const fixtureOptions = [
          { value: 'solar-panels', label: 'Solar Panels' },
          { value: 'propane-tanks', label: 'Propane Tanks' },
          { value: 'water-softener', label: 'Water Softener' },
          { value: 'security-system', label: 'Security System' },
          { value: 'none', label: 'None' }
        ];

        return (
          <div className="space-y-3">
            {fixtureOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={formData.fixtureLeases?.includes(option.value) ? "default" : "outline"}
                className={`w-full h-12 justify-start relative ${
                  formData.fixtureLeases?.includes(option.value)
                    ? "bg-primary text-primary-foreground" 
                    : "bg-white text-foreground border-border hover:bg-muted"
                }`}
                onClick={() => {
                  const currentSelections = formData.fixtureLeases || [];
                  let newSelections;
                  
                  if (option.value === 'none') {
                    // If "None" is clicked, clear all other selections and select only "None"
                    newSelections = currentSelections.includes('none') ? [] : ['none'];
                  } else {
                    // If any other option is clicked
                    if (currentSelections.includes('none')) {
                      // If "None" was selected, remove it and add the new selection
                      newSelections = [option.value];
                    } else {
                      // Toggle the selection
                      if (currentSelections.includes(option.value)) {
                        newSelections = currentSelections.filter(item => item !== option.value);
                      } else {
                        newSelections = [...currentSelections, option.value];
                      }
                    }
                  }
                  
                  updateFormData('fixtureLeases', newSelections);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        );

      case 'mineral-rights':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'severed', label: 'Severed Mineral Rights' },
              { value: 'ongoing-lease', label: 'Ongoing Mineral Lease' },
              { value: 'none', label: 'None of the These' }
            ]}
            value={formData.mineralRights || ''}
            onValueChange={(value) => handleRadioValue('mineralRights', value)}
          />
        );

      case 'insurance-claims':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={formData.insuranceClaims || ''}
            onValueChange={(value) => handleRadioValue('insuranceClaims', value)}
          />
        );

      case 'insurance-proceeds':
        return (
          <ButtonRadioGroup
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={formData.insuranceProceeds || ''}
            onValueChange={(value) => handleRadioValue('insuranceProceeds', value)}
          />
        );

      case 'insurance-proceeds-details':
        return (
          <div className="space-y-2">
            <Textarea
              value={formData.insuranceProceedsDetails || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  insuranceProceedsDetails: e.target.value
                }));
              }}
              placeholder="Please provide details about when the claim occurred and what it was for..."
              rows={4}
              className="resize-none"
            />
          </div>
        );

      case 'relocation-company':
        return (
          <div className="space-y-4">
            <ButtonRadioGroup
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              value={formData.relocationCompany || ''}
              onValueChange={(value) => updateFormData('relocationCompany', value)}
            />
            
            <div className="border border-gray-300 bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">
                Relocation company (such as Cartus, SIRVA, or an employer-sponsored program) transactions often involve unique processes and requirements that can affect your listing strategy and timeline.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="relative">
        {/* Exit Button */}
        {onExit && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={() => setShowExitDialog(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <CardTitle className="text-center text-2xl">
          Additional Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              Question {getCurrentStepNumber()} of {getTotalSteps()}
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg">{getStepTitle()}</Label>
            </div>
            
            <div className="pt-2">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            {/* Back Button (Left) */}
            {shouldShowBackButton ? (
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 'hoa' && onBack ? onBack : handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {/* Next/Continue Button (Right) */}
            <Button 
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`flex items-center ${currentStep === 'relocation-company' ? 'bg-success hover:bg-success-hover text-success-foreground' : ''}`}
            >
              {currentStep === 'relocation-company' ? "Complete" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Exit Confirmation Dialog */}
      {onExit && (
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Listing Creation?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will be saved as a draft and you can return to complete your listing later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Working</AlertDialogCancel>
              <AlertDialogAction onClick={onExit}>
                Exit to Dashboard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}