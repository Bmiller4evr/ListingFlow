import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { FileUpload } from "../ui/file-upload";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, DollarSign, X } from "lucide-react";
import confetti from "canvas-confetti";

interface MortgageInfo {
  preferMortgageStatement: 'statement' | 'questions' | '';
  mortgageStatementFile?: File | null;
  mortgageBalance: string;
  monthlyPayment: string;
  interestRate: string;
  lender: string;
  taxesInsuranceEscrowed: 'yes' | 'no' | '';
  loanModifiedLast12Months: 'yes' | 'no' | '';
}

interface FinancialInfoData {
  // Mortgage information
  hasCurrentMortgage: 'yes' | 'no' | '';
  numberOfMortgages: '1' | '2' | '3' | '4' | '';
  mortgages: MortgageInfo[];
  
  // Property taxes (applies to all mortgages)
  propertyTaxesCurrent: 'yes' | 'no' | '';
  
  // Leaseback
  needsLeaseback: 'yes' | 'no' | '';
  netProceedsMoreImportant: 'yes' | 'no' | '';
  
  // Insurance claims
  hasOpenInsuranceClaims: 'yes' | 'no' | '';
  paidForRoofNotReplaced: 'yes' | 'no' | '';
  
  // Foreclosure
  hasLisPendens: 'yes' | 'no' | '';
  lisPendensSaleDate: string;
  
  // Liens
  hasNonMortgageLiens: 'yes' | 'no' | '';
  lienDetails: string;
}

interface FinancialInfoFormProps {
  onNext: (data: FinancialInfoData) => void;
  onBack?: () => void;
  onExit?: () => void;
  initialData?: Partial<FinancialInfoData>;
  homeFacts?: any; // Property specs from basic info
}

export function FinancialInfoForm({ onNext, onBack, onExit, initialData, homeFacts }: FinancialInfoFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [formData, setFormData] = useState<FinancialInfoData>(() => {
    const defaultMortgage: MortgageInfo = {
      preferMortgageStatement: '',
      mortgageStatementFile: null,
      mortgageBalance: '',
      monthlyPayment: '',
      interestRate: '',
      lender: '',
      taxesInsuranceEscrowed: '',
      loanModifiedLast12Months: ''
    };

    return {
      hasCurrentMortgage: initialData?.hasCurrentMortgage || '',
      numberOfMortgages: initialData?.numberOfMortgages || '',
      mortgages: initialData?.mortgages || [defaultMortgage],
      propertyTaxesCurrent: initialData?.propertyTaxesCurrent || '',
      needsLeaseback: initialData?.needsLeaseback || '',
      netProceedsMoreImportant: initialData?.netProceedsMoreImportant || '',
      hasOpenInsuranceClaims: initialData?.hasOpenInsuranceClaims || '',
      paidForRoofNotReplaced: initialData?.paidForRoofNotReplaced || '',
      hasLisPendens: initialData?.hasLisPendens || '',
      lisPendensSaleDate: initialData?.lisPendensSaleDate || '',
      hasNonMortgageLiens: initialData?.hasNonMortgageLiens || '',
      lienDetails: initialData?.lienDetails || ''
    };
  });

  // Update mortgages array when number of mortgages changes
  const handleNumberOfMortgagesChange = (value: string) => {
    const numMortgages = parseInt(value);
    const currentMortgages = [...formData.mortgages];
    
    // If reducing mortgages, trim the array
    if (numMortgages < currentMortgages.length) {
      currentMortgages.splice(numMortgages);
    }
    
    // If adding mortgages, add empty mortgage objects
    while (currentMortgages.length < numMortgages) {
      currentMortgages.push({
        preferMortgageStatement: '',
        mortgageStatementFile: null,
        mortgageBalance: '',
        monthlyPayment: '',
        interestRate: '',
        lender: '',
        taxesInsuranceEscrowed: '',
        loanModifiedLast12Months: ''
      });
    }

    setFormData(prev => ({
      ...prev,
      numberOfMortgages: value as '1' | '2' | '3' | '4',
      mortgages: currentMortgages
    }));
  };

  const updateMortgage = (index: number, field: keyof MortgageInfo, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      mortgages: prev.mortgages.map((mortgage, i) => 
        i === index ? { ...mortgage, [field]: value } : mortgage
      )
    }));
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  // Determine total number of questions based on answers - keep stable during navigation
  const getTotalQuestions = () => {
    let total = 1; // hasCurrentMortgage
    
    if (formData.hasCurrentMortgage === 'yes') {
      total += 1; // numberOfMortgages
      
      const numberOfMortgages = formData.numberOfMortgages ? parseInt(formData.numberOfMortgages) : 0;
      
      // For each mortgage - estimate maximum questions to keep total stable
      for (let i = 0; i < numberOfMortgages; i++) {
        total += 1; // preferMortgageStatement
        const mortgage = formData.mortgages[i];
        if (mortgage?.preferMortgageStatement === 'statement') {
          total += 1; // mortgage statement upload
        } else if (mortgage?.preferMortgageStatement === 'questions') {
          total += 6; // all mortgage question details (lender, balance, payment, rate, escrowed, modified)
        } else {
          // If method not selected yet, assume worst case (questions) to keep total stable
          total += 6;
        }
      }
    }
    
    // Base questions that always appear
    total += 3; // property taxes current, open insurance claims, non-mortgage liens
    
    // Conditional questions - add if answered yes
    if (formData.hasOpenInsuranceClaims === 'yes') {
      total += 1; // paid for roof not replaced
    }
    
    if (formData.hasLisPendens === 'yes') {
      total += 1; // sale date
    }
    
    if (formData.hasNonMortgageLiens === 'yes') {
      total += 1; // lien details
    }
    
    // Add lis pendens question
    total += 1;
    
    return total;
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const questionInfo = getCurrentQuestionIndex();
    
    switch (questionInfo.type) {
      case 'hasCurrentMortgage':
        return formData.hasCurrentMortgage !== '';
      case 'numberOfMortgages':
        return formData.numberOfMortgages !== '';
      case 'preferMortgageStatement':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.preferMortgageStatement !== '';
        }
        return false;
      case 'mortgageStatementUpload':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.mortgageStatementFile !== null;
        }
        return false;
      case 'mortgageBalance':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.mortgageBalance.trim() !== '';
        }
        return false;
      case 'monthlyPayment':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.monthlyPayment.trim() !== '';
        }
        return false;
      case 'interestRate':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.interestRate.trim() !== '';
        }
        return false;
      case 'lender':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.lender.trim() !== '';
        }
        return false;
      case 'taxesInsuranceEscrowed':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.taxesInsuranceEscrowed !== '';
        }
        return false;
      case 'loanModifiedLast12Months':
        if (questionInfo.mortgageIndex !== undefined) {
          return formData.mortgages[questionInfo.mortgageIndex]?.loanModifiedLast12Months !== '';
        }
        return false;
      case 'propertyTaxesCurrent':
        return formData.propertyTaxesCurrent !== '';
      case 'hasOpenInsuranceClaims':
        return formData.hasOpenInsuranceClaims !== '';
      case 'paidForRoofNotReplaced':
        return formData.paidForRoofNotReplaced !== '';
      case 'hasLisPendens':
        return formData.hasLisPendens !== '';
      case 'lisPendensSaleDate':
        return formData.lisPendensSaleDate.trim() !== '';
      case 'hasNonMortgageLiens':
        return formData.hasNonMortgageLiens !== '';
      case 'lienDetails':
        return formData.lienDetails.trim() !== '';
      case 'unknown':
        return false;
      default:
        return false;
    }
  };

  // Get current question info based on flow logic - more robust navigation
  const getCurrentQuestionIndex = () => {
    let currentIndex = 0;

    // hasCurrentMortgage
    if (currentQuestion === currentIndex++) {
      return { type: 'hasCurrentMortgage' };
    }

    if (formData.hasCurrentMortgage === 'yes') {
      // numberOfMortgages
      if (currentQuestion === currentIndex++) {
        return { type: 'numberOfMortgages' };
      }

      const numberOfMortgages = formData.numberOfMortgages ? parseInt(formData.numberOfMortgages) : 0;
      
      // For each mortgage, ask the mortgage-specific questions
      for (let mortgageIndex = 0; mortgageIndex < numberOfMortgages; mortgageIndex++) {
        const mortgage = formData.mortgages[mortgageIndex];
        
        // preferMortgageStatement for this mortgage
        if (currentQuestion === currentIndex++) {
          return { type: 'preferMortgageStatement', mortgageIndex };
        }

        if (mortgage?.preferMortgageStatement === 'statement') {
          // mortgage statement upload for this mortgage
          if (currentQuestion === currentIndex++) {
            return { type: 'mortgageStatementUpload', mortgageIndex };
          }
        } else if (mortgage?.preferMortgageStatement === 'questions') {
          // mortgage details for this mortgage - ORDER: Lender, Balance, Payment, Interest Rate
          if (currentQuestion === currentIndex++) {
            return { type: 'lender', mortgageIndex };
          }
          if (currentQuestion === currentIndex++) {
            return { type: 'mortgageBalance', mortgageIndex };
          }
          if (currentQuestion === currentIndex++) {
            return { type: 'monthlyPayment', mortgageIndex };
          }
          if (currentQuestion === currentIndex++) {
            return { type: 'interestRate', mortgageIndex };
          }
          
          // taxes and insurance questions for this mortgage
          if (currentQuestion === currentIndex++) {
            return { type: 'taxesInsuranceEscrowed', mortgageIndex };
          }
          if (currentQuestion === currentIndex++) {
            return { type: 'loanModifiedLast12Months', mortgageIndex };
          }
        }
      }
    }

    // propertyTaxesCurrent
    if (currentQuestion === currentIndex++) {
      return { type: 'propertyTaxesCurrent' };
    }

    // hasOpenInsuranceClaims
    if (currentQuestion === currentIndex++) {
      return { type: 'hasOpenInsuranceClaims' };
    }

    if (formData.hasOpenInsuranceClaims === 'yes') {
      // paidForRoofNotReplaced
      if (currentQuestion === currentIndex++) {
        return { type: 'paidForRoofNotReplaced' };
      }
    }

    // hasLisPendens
    if (currentQuestion === currentIndex++) {
      return { type: 'hasLisPendens' };
    }

    if (formData.hasLisPendens === 'yes') {
      // lisPendensSaleDate
      if (currentQuestion === currentIndex++) {
        return { type: 'lisPendensSaleDate' };
      }
    }

    // hasNonMortgageLiens
    if (currentQuestion === currentIndex++) {
      return { type: 'hasNonMortgageLiens' };
    }

    if (formData.hasNonMortgageLiens === 'yes') {
      // lienDetails
      if (currentQuestion === currentIndex++) {
        return { type: 'lienDetails' };
      }
    }

    return { type: 'unknown' };
  };

  const handleNext = () => {
    const totalQuestions = getTotalQuestions();
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Trigger confetti on completion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Auto-advance for single-question cards
  const handleAutoAdvance = () => {
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const renderCurrentQuestion = () => {
    const questionInfo = getCurrentQuestionIndex();

    switch (questionInfo.type) {
      case 'hasCurrentMortgage':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Does the property have any outstanding mortgages?</Label>
            <RadioGroup
              value={formData.hasCurrentMortgage}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, hasCurrentMortgage: value as 'yes' | 'no' }));
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'numberOfMortgages':
        return (
          <div className="space-y-4">
            <Label className="text-lg">How many mortgages?</Label>
            <RadioGroup
              value={formData.numberOfMortgages}
              onValueChange={(value) => {
                handleNumberOfMortgagesChange(value);
                handleAutoAdvance();
              }}
              className="grid grid-cols-4 gap-3"
            >
              {['1', '2', '3', '4'].map((num) => (
                <RadioGroupItem key={num} value={num}>{num}</RadioGroupItem>
              ))}
            </RadioGroup>
          </div>
        );

      case 'preferMortgageStatement':
        const mortgageIndex = questionInfo.mortgageIndex!;
        const mortgageNumber = mortgageIndex + 1;
        const mortgage = formData.mortgages[mortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">
              Mortgage {mortgageNumber} - Would you prefer to send us a recent mortgage statement, or answer questions about this mortgage?
            </Label>
            <RadioGroup
              value={mortgage?.preferMortgageStatement || ''}
              onValueChange={(value) => {
                // Clear conflicting data when switching methods
                setFormData(prev => ({
                  ...prev,
                  mortgages: prev.mortgages.map((mtg, i) => 
                    i === mortgageIndex ? {
                      ...mtg,
                      preferMortgageStatement: value as 'statement' | 'questions',
                      // Clear fields from the other method to prevent conflicts
                      ...(value === 'statement' ? {
                        // Clear question fields if switching to statement
                        mortgageBalance: '',
                        monthlyPayment: '',
                        interestRate: '',
                        lender: '',
                        taxesInsuranceEscrowed: '',
                        loanModifiedLast12Months: ''
                      } : {
                        // Clear statement field if switching to questions
                        mortgageStatementFile: null
                      })
                    } : mtg
                  )
                }));
              }}
              className="grid grid-cols-1 gap-3"
            >
              <RadioGroupItem value="statement">Send mortgage statement</RadioGroupItem>
              <RadioGroupItem value="questions">Answer questions about the mortgage</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'mortgageStatementUpload':
        const uploadMortgageIndex = questionInfo.mortgageIndex!;
        const uploadMortgageNumber = uploadMortgageIndex + 1;
        const uploadMortgage = formData.mortgages[uploadMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">
              Mortgage {uploadMortgageNumber} - Please upload your recent mortgage statement
            </Label>
            <div className="space-y-2">
              <Label htmlFor={`mortgageStatement-${uploadMortgageIndex}`}>
                Recent Mortgage Statement (PDF or Image)
              </Label>
              <FileUpload
                id={`mortgageStatement-${uploadMortgageIndex}`}
                onFileChange={(file) => updateMortgage(uploadMortgageIndex, 'mortgageStatementFile', file)}
                currentFile={uploadMortgage?.mortgageStatementFile || null}
                acceptedFileTypes="application/pdf,image/*"
                buttonLabel="Upload Mortgage Statement"
                description="PDF or image files up to 10MB"
                maxSizeMB={10}
              />
              <p className="text-sm text-muted-foreground">
                Please upload your most recent mortgage statement. This will help us automatically fill in your mortgage details.
              </p>
            </div>
          </div>
        );

      case 'mortgageBalance':
        const balanceMortgageIndex = questionInfo.mortgageIndex!;
        const balanceMortgageNumber = balanceMortgageIndex + 1;
        const balanceMortgage = formData.mortgages[balanceMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">Mortgage {balanceMortgageNumber} - What is the current mortgage balance?</Label>
            <div className="space-y-2">
              <Label htmlFor={`mortgageBalance-${balanceMortgageIndex}`}>Current Mortgage Balance ($)</Label>
              <Input
                id={`mortgageBalance-${balanceMortgageIndex}`}
                value={balanceMortgage?.mortgageBalance || ''}
                onChange={(e) => updateMortgage(balanceMortgageIndex, 'mortgageBalance', e.target.value)}
                placeholder="250000"
                type="number"
              />
            </div>
          </div>
        );

      case 'monthlyPayment':
        const paymentMortgageIndex = questionInfo.mortgageIndex!;
        const paymentMortgageNumber = paymentMortgageIndex + 1;
        const paymentMortgage = formData.mortgages[paymentMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">Mortgage {paymentMortgageNumber} - What is your monthly mortgage payment?</Label>
            <div className="space-y-2">
              <Label htmlFor={`monthlyPayment-${paymentMortgageIndex}`}>Monthly Mortgage Payment ($)</Label>
              <Input
                id={`monthlyPayment-${paymentMortgageIndex}`}
                value={paymentMortgage?.monthlyPayment || ''}
                onChange={(e) => updateMortgage(paymentMortgageIndex, 'monthlyPayment', e.target.value)}
                placeholder="1850"
                type="number"
              />
            </div>
          </div>
        );

      case 'interestRate':
        const rateMortgageIndex = questionInfo.mortgageIndex!;
        const rateMortgageNumber = rateMortgageIndex + 1;
        const rateMortgage = formData.mortgages[rateMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">Mortgage {rateMortgageNumber} - What is the interest rate on this mortgage?</Label>
            <div className="space-y-2">
              <Label htmlFor={`interestRate-${rateMortgageIndex}`}>Interest Rate (%)</Label>
              <Input
                id={`interestRate-${rateMortgageIndex}`}
                value={rateMortgage?.interestRate || ''}
                onChange={(e) => updateMortgage(rateMortgageIndex, 'interestRate', e.target.value)}
                placeholder="3.75"
                type="number"
                step="0.01"
              />
            </div>
          </div>
        );

      case 'lender':
        const lenderMortgageIndex = questionInfo.mortgageIndex!;
        const lenderMortgageNumber = lenderMortgageIndex + 1;
        const lenderMortgage = formData.mortgages[lenderMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">Mortgage {lenderMortgageNumber} - Who is your mortgage lender?</Label>
            <div className="space-y-2">
              <Label htmlFor={`lender-${lenderMortgageIndex}`}>Lender Name</Label>
              <Input
                id={`lender-${lenderMortgageIndex}`}
                value={lenderMortgage?.lender || ''}
                onChange={(e) => updateMortgage(lenderMortgageIndex, 'lender', e.target.value)}
                placeholder="Wells Fargo, Chase, etc."
              />
            </div>
          </div>
        );

      case 'taxesInsuranceEscrowed':
        const escrowMortgageIndex = questionInfo.mortgageIndex!;
        const escrowMortgageNumber = escrowMortgageIndex + 1;
        const escrowMortgage = formData.mortgages[escrowMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">Mortgage {escrowMortgageNumber} - Are the taxes and insurance escrowed with this mortgage company?</Label>
            <RadioGroup
              value={escrowMortgage?.taxesInsuranceEscrowed || ''}
              onValueChange={(value) => {
                updateMortgage(escrowMortgageIndex, 'taxesInsuranceEscrowed', value);
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'loanModifiedLast12Months':
        const modifiedMortgageIndex = questionInfo.mortgageIndex!;
        const modifiedMortgageNumber = modifiedMortgageIndex + 1;
        const modifiedMortgage = formData.mortgages[modifiedMortgageIndex];
        
        return (
          <div className="space-y-4">
            <Label className="text-lg">Mortgage {modifiedMortgageNumber} - Has this loan been modified in the last 12 months?</Label>
            <RadioGroup
              value={modifiedMortgage?.loanModifiedLast12Months || ''}
              onValueChange={(value) => {
                updateMortgage(modifiedMortgageIndex, 'loanModifiedLast12Months', value);
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'propertyTaxesCurrent':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Are you aware of an unpaid property taxes due for the Property?</Label>
            <RadioGroup
              value={formData.propertyTaxesCurrent}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, propertyTaxesCurrent: value as 'yes' | 'no' }));
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'hasOpenInsuranceClaims':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Are there any open Insurance Claims involved with the property?</Label>
            <RadioGroup
              value={formData.hasOpenInsuranceClaims}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, hasOpenInsuranceClaims: value as 'yes' | 'no' }));
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'paidForRoofNotReplaced':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Did you get paid for a roof, and then not replace it?</Label>
            <RadioGroup
              value={formData.paidForRoofNotReplaced}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, paidForRoofNotReplaced: value as 'yes' | 'no' }));
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'hasLisPendens':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Is there a Lis Pendens on the property?</Label>
            <RadioGroup
              value={formData.hasLisPendens}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, hasLisPendens: value as 'yes' | 'no' }));
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'lisPendensSaleDate':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Is there a sale date? If so, when?</Label>
            <div className="space-y-2">
              <Label htmlFor="lisPendensSaleDate">Sale Date</Label>
              <Input
                id="lisPendensSaleDate"
                value={formData.lisPendensSaleDate}
                onChange={(e) => setFormData(prev => ({ ...prev, lisPendensSaleDate: e.target.value }))}
                placeholder="MM/DD/YYYY or 'No date set'"
              />
            </div>
          </div>
        );

      case 'hasNonMortgageLiens':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Excluding mortgages, are you aware of any liens against this property?</Label>
            <p className="text-sm text-muted-foreground">This includes tax liens, mechanic's liens, HOA liens, or court judgments.</p>
            <RadioGroup
              value={formData.hasNonMortgageLiens}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, hasNonMortgageLiens: value as 'yes' | 'no' }));
                handleAutoAdvance();
              }}
              className="grid grid-cols-2 gap-3"
            >
              <RadioGroupItem value="yes">Yes</RadioGroupItem>
              <RadioGroupItem value="no">No</RadioGroupItem>
            </RadioGroup>
          </div>
        );

      case 'lienDetails':
        return (
          <div className="space-y-4">
            <Label className="text-lg">Please list the liens and their details</Label>
            <div className="space-y-2">
              <Label htmlFor="lienDetails">Lien Details</Label>
              <Textarea
                id="lienDetails"
                value={formData.lienDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, lienDetails: e.target.value }))}
                placeholder="Describe the type of lien, amount, and creditor..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Please wait while we set up the form.</p>
          </div>
        );
    }
  };

  const totalQuestions = getTotalQuestions();
  const shouldShowBackButton = currentQuestion > 0 || onBack;

  return (
    <>
      {/* Header */}
      <div className="relative">
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

        <h1 className="flex items-center justify-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Mortgages, Taxes and Liens
        </h1>
      </div>

      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
        </div>

        {/* Current Question */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="pt-2">
              {renderCurrentQuestion()}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          {/* Back Button (Left) */}
          {shouldShowBackButton ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {/* Next Button (Right) */}
          <Button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
            className={`flex items-center ${currentQuestion === totalQuestions - 1 ? 'bg-success hover:bg-success-hover text-success-foreground' : ''}`}
          >
            {currentQuestion === totalQuestions - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

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
    </>
  );
}