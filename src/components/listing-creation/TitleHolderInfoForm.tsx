import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, FileText, Users, X } from "lucide-react";
import { UserAccountData } from "../onboarding/AccountCreationForm";

interface OwnerInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  hasCapacity: 'yes' | 'no' | '';
  phone: string;
  email: string;
  involvedInDivorce: 'yes' | 'no' | '';
  isNonUSCitizen: 'yes' | 'no' | '';
}

interface TitleHolderInfoData {
  ownedLessThanTwoYears: 'yes' | 'no' | '';
  hasHomesteadExemption: 'yes' | 'no' | 'dont-know' | '';
  isPropertyInsured: 'yes' | 'no' | '';
  numberOfOwners: '1' | '2' | '3' | '4' | '';
  owners: OwnerInfo[];
}

interface TitleHolderInfoFormProps {
  onNext: (data: TitleHolderInfoData) => void;
  onExit?: () => void;
  initialData?: Partial<TitleHolderInfoData>;
  userAccount?: UserAccountData;
}

export function TitleHolderInfoForm({ onNext, onExit, initialData, userAccount }: TitleHolderInfoFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [formData, setFormData] = useState<TitleHolderInfoData>(() => {
    const defaultOwner: OwnerInfo = {
      firstName: userAccount?.firstName || '',
      middleName: '',
      lastName: userAccount?.lastName || '',
      hasCapacity: '',
      phone: userAccount?.phone || '',
      email: userAccount?.email || '',
      involvedInDivorce: '',
      isNonUSCitizen: ''
    };

    return {
      ownedLessThanTwoYears: initialData?.ownedLessThanTwoYears || '',
      hasHomesteadExemption: initialData?.hasHomesteadExemption || '',
      isPropertyInsured: initialData?.isPropertyInsured || '',
      numberOfOwners: initialData?.numberOfOwners || '',
      owners: initialData?.owners || [defaultOwner]
    };
  });

  // Update owners array when number of owners changes
  const handleNumberOfOwnersChange = (value: string) => {
    const numOwners = parseInt(value);
    const currentOwners = [...formData.owners];
    
    // If reducing owners, trim the array
    if (numOwners < currentOwners.length) {
      currentOwners.splice(numOwners);
    }
    
    // If adding owners, add empty owner objects
    while (currentOwners.length < numOwners) {
      currentOwners.push({
        firstName: '',
        middleName: '',
        lastName: '',
        hasCapacity: '',
        phone: '',
        email: '',
        involvedInDivorce: '',
        isNonUSCitizen: ''
      });
    }

    console.log('Number of owners changed to:', numOwners);
    console.log('Updated owners array:', currentOwners);

    setFormData(prev => ({
      ...prev,
      numberOfOwners: value as '1' | '2' | '3' | '4',
      owners: currentOwners
    }));
  };

  const updateOwner = (index: number, field: keyof OwnerInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.map((owner, i) => 
        i === index ? { ...owner, [field]: value } : owner
      )
    }));
  };

  // Helper function to get owner name for display
  const getOwnerDisplayName = (owner: OwnerInfo) => {
    const firstName = owner.firstName.trim();
    const middleName = owner.middleName.trim();
    const lastName = owner.lastName.trim();
    
    let fullName = '';
    
    if (firstName) fullName += firstName;
    if (middleName) fullName += fullName ? ` ${middleName}` : middleName;
    if (lastName) fullName += fullName ? ` ${lastName}` : lastName;
    
    return fullName;
  };

  // Helper function to validate phone number
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
  };

  // Helper function to validate email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== '' && emailRegex.test(email.trim());
  };

  // Phone and email fields are now optional, so no auto-advance based on validation

  const handleSubmit = () => {
    onNext(formData);
  };

  const isFormValid = () => {
    // Basic required fields
    if (!formData.ownedLessThanTwoYears || 
        !formData.hasHomesteadExemption || 
        !formData.isPropertyInsured || 
        !formData.numberOfOwners) {
      return false;
    }

    // Check that all owners have required information
    const requiredOwners = parseInt(formData.numberOfOwners);
    if (formData.owners.length !== requiredOwners) {
      return false;
    }

    return formData.owners.every(owner => 
      owner.firstName.trim() !== '' &&
      owner.lastName.trim() !== '' &&
      owner.hasCapacity !== '' &&
      // phone and email are now optional
      owner.involvedInDivorce !== '' &&
      owner.isNonUSCitizen !== ''
    );
  };

  // Determine total number of questions based on number of owners
  const getTotalQuestions = () => {
    const baseQuestions = 4; // ownership duration, homestead, insurance, number of owners
    const numberOfOwners = formData.numberOfOwners ? parseInt(formData.numberOfOwners) : 0;
    const questionsPerOwner = 6; // name, phone, email, capacity, divorce, citizenship
    return baseQuestions + (numberOfOwners * questionsPerOwner);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    switch (currentQuestion) {
      case 0:
        return formData.ownedLessThanTwoYears !== '';
      case 1:
        return formData.hasHomesteadExemption !== '';
      case 2:
        return formData.isPropertyInsured !== '';
      case 3:
        return formData.numberOfOwners !== '';
      default:
        // Owner questions (4 onwards)
        const ownerQuestionIndex = currentQuestion - 4;
        const ownerIndex = Math.floor(ownerQuestionIndex / 6);
        const questionType = ownerQuestionIndex % 6;
        const owner = formData.owners[ownerIndex];
        if (!owner) return false;
        
        switch (questionType) {
          case 0: // Name
            return owner.firstName.trim() !== '' && owner.lastName.trim() !== '';
          case 1: // Phone (now optional)
            return true;
          case 2: // Email (now optional)
            return true;
          case 3: // Capacity
            return owner.hasCapacity !== '';
          case 4: // Divorce
            return owner.involvedInDivorce !== '';
          case 5: // Citizenship
            return owner.isNonUSCitizen !== '';
          default:
            return false;
        }
    }
  };

  const handleNext = () => {
    const totalQuestions = getTotalQuestions();
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Final submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Auto-advance for single-question cards
  const handleAutoAdvance = () => {
    // Don't auto-advance on the final question
    const totalQuestions = getTotalQuestions();
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        handleNext();
      }, 400);
    }
  };

  const renderCurrentQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Have you owned this property for less than 2 years?</Label>
              <RadioGroup
                value={formData.ownedLessThanTwoYears}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, ownedLessThanTwoYears: value as 'yes' | 'no' }));
                  handleAutoAdvance();
                }}
                className="grid grid-cols-2 gap-3"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Proceeds from the sale of a Homestead Property that has been owned for less than 2 years may be subject to Capital Gains taxes. You may need to consult with a CPA or tax professional.
                </p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Does this property currently have a homestead exemption filed with the county appraisal district?</Label>
              <RadioGroup
                value={formData.hasHomesteadExemption}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, hasHomesteadExemption: value as 'yes' | 'no' | 'dont-know' }));
                  handleAutoAdvance();
                }}
                className="grid grid-cols-1 gap-3"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
                <RadioGroupItem value="dont-know">I don't know</RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Is the property currently insured?</Label>
              <RadioGroup
                value={formData.isPropertyInsured}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, isPropertyInsured: value as 'yes' | 'no' }));
                  handleAutoAdvance();
                }}
                className="grid grid-cols-2 gap-3"
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">How many owners to the property are there?</Label>
              <RadioGroup
                value={formData.numberOfOwners}
                onValueChange={handleNumberOfOwnersChange}
                className="grid grid-cols-4 gap-3"
              >
                {['1', '2', '3', '4'].map((num) => (
                  <RadioGroupItem key={num} value={num}>{num}</RadioGroupItem>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      default:
        // Owner information questions (4 onwards)
        const ownerQuestionIndex = currentQuestion - 4;
        const ownerIndex = Math.floor(ownerQuestionIndex / 6);
        const questionType = ownerQuestionIndex % 6;
        const owner = formData.owners[ownerIndex];
        
        if (!owner) {
          return (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Please wait while we set up the form.</p>
            </div>
          );
        }

        switch (questionType) {
          case 0: // Name
            return (
              <div className="space-y-6">
                <Label className="text-lg">Owner {ownerIndex + 1} - Full Legal Name</Label>
                <p className="text-sm text-muted-foreground">Enter the full legal name exactly as it appears on the deed or title documents</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`owner-${ownerIndex}-first-name`}>First Name</Label>
                    <Input
                      id={`owner-${ownerIndex}-first-name`}
                      value={owner.firstName}
                      onChange={(e) => updateOwner(ownerIndex, 'firstName', e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`owner-${ownerIndex}-middle-name`}>Middle Name</Label>
                    <Input
                      id={`owner-${ownerIndex}-middle-name`}
                      value={owner.middleName}
                      onChange={(e) => updateOwner(ownerIndex, 'middleName', e.target.value)}
                      placeholder="Middle name (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`owner-${ownerIndex}-last-name`}>Last Name</Label>
                    <Input
                      id={`owner-${ownerIndex}-last-name`}
                      value={owner.lastName}
                      onChange={(e) => updateOwner(ownerIndex, 'lastName', e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>
            );

          case 1: // Phone
            return (
              <div className="space-y-6">
                <Label className="text-lg">
                  {getOwnerDisplayName(owner) ? `What is ${getOwnerDisplayName(owner)}'s Phone Number?` : `What is Owner ${ownerIndex + 1}'s Phone Number?`}
                </Label>

                <div className="space-y-2">
                  <Label htmlFor={`owner-${ownerIndex}-phone`}>Phone Number</Label>
                  <Input
                    id={`owner-${ownerIndex}-phone`}
                    value={owner.phone}
                    onChange={(e) => updateOwner(ownerIndex, 'phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    type="tel"
                  />
                </div>
              </div>
            );

          case 2: // Email
            return (
              <div className="space-y-6">
                <Label className="text-lg">
                  {getOwnerDisplayName(owner) ? `What is ${getOwnerDisplayName(owner)}'s Email Address?` : `What is Owner ${ownerIndex + 1}'s Email Address?`}
                </Label>

                <div className="space-y-2">
                  <Label htmlFor={`owner-${ownerIndex}-email`}>Email Address</Label>
                  <Input
                    id={`owner-${ownerIndex}-email`}
                    value={owner.email}
                    onChange={(e) => updateOwner(ownerIndex, 'email', e.target.value)}
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
              </div>
            );

          case 3: // Capacity
            return (
              <div className="space-y-6">
                <Label className="text-lg">
                  {getOwnerDisplayName(owner) ? `${getOwnerDisplayName(owner)} - Legal Capacity` : `Owner ${ownerIndex + 1} - Legal Capacity`}
                </Label>
                <div className="space-y-4">
                  <Label>Does this person have the legal capacity to sign real estate documents?</Label>
                  <p className="text-sm text-muted-foreground">This includes being of sound mind, not under guardianship or conservatorship, and legally able to enter into contracts.</p>
                  <RadioGroup
                    value={owner.hasCapacity}
                    onValueChange={(value) => {
                      updateOwner(ownerIndex, 'hasCapacity', value);
                      handleAutoAdvance();
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                </div>
              </div>
            );

          case 4: // Divorce
            return (
              <div className="space-y-6">
                <Label className="text-lg">
                  {getOwnerDisplayName(owner) ? `${getOwnerDisplayName(owner)} - Divorce History` : `Owner ${ownerIndex + 1} - Divorce History`}
                </Label>
                <div className="space-y-4">
                  <Label>Has this person been involved in any divorce or separation proceedings since acquiring this property?</Label>
                  <p className="text-sm text-muted-foreground">This includes pending, current, or completed divorce proceedings that may affect property ownership rights.</p>
                  <RadioGroup
                    value={owner.involvedInDivorce}
                    onValueChange={(value) => {
                      updateOwner(ownerIndex, 'involvedInDivorce', value);
                      handleAutoAdvance();
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                </div>
              </div>
            );

          case 5: // Citizenship
            return (
              <div className="space-y-6">
                <Label className="text-lg">
                  {getOwnerDisplayName(owner) ? `${getOwnerDisplayName(owner)} - Citizenship Status` : `Owner ${ownerIndex + 1} - Citizenship Status`}
                </Label>
                <div className="space-y-4">
                  <Label>Is this person a Non-US Citizen or resident alien?</Label>
                  <p className="text-sm text-muted-foreground">This information is required for FIRPTA (Foreign Investment in Real Property Tax Act) compliance and may affect closing procedures.</p>
                  <RadioGroup
                    value={owner.isNonUSCitizen}
                    onValueChange={(value) => {
                      updateOwner(ownerIndex, 'isNonUSCitizen', value);
                      handleAutoAdvance();
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                </div>
              </div>
            );

          default:
            return null;
        }
    }
  };

  const totalQuestions = getTotalQuestions();
  const shouldShowBackButton = currentQuestion > 0;

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

        <CardTitle className="text-center text-2xl flex items-center justify-center">
          <Users className="h-6 w-6 mr-2" />
          Title Holder Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>

          {/* Current question */}
          <div className="pt-2">
            {renderCurrentQuestion()}
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
                tabIndex={2}
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
              tabIndex={1}
            >
              {currentQuestion === totalQuestions - 1 ? 'Complete' : 'Next'}
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