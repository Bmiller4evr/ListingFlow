import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, Home, CheckCircle, X } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import { AddressInput } from "../AddressInput";

export interface PropertyAddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress?: string;
}

export interface PropertySpecs {
  propertyType: 'residential' | 'condo' | 'townhome' | 'halfDuplex' | 'land' | '';
  bedrooms: string;
  fullBathrooms: string;
  halfBathrooms: string;
  squareFeet: string;
  squareFootageSource: string;
  squareFootageSourceOther: string;
  lotSize: string;
  yearBuilt: string;
  garage: string;
  coveredParking: string;
  coveredParkingOtherDescription: string;
  coveredParkingElectricity: string;
  pool: string;
  occupancyVacatePlans: string;
  occupancyVacantDuration: string;
}

export interface BasicInformationData {
  address: PropertyAddressData;
  propertySpecs: PropertySpecs;
  hasExistingSurvey: boolean | null;
  occupancyStatus: 'owner-occupied' | 'non-owner-occupied' | 'vacant' | '';
  _fromOnboardingWithAddress?: boolean; // Flag to indicate this came from onboarding with pre-filled address
}

interface Question {
  id: string;
  title: string;
  description?: string;
  type: 'address' | 'select' | 'radio' | 'input';
  options?: { value: string; label: string; description?: string }[];
  placeholder?: string;
  inputType?: string;
  required?: boolean;
}

interface BasicInformationFormProps {
  onNext: (data: BasicInformationData) => void;
  onBack?: () => void;
  onExit?: () => void;
  initialData?: Partial<BasicInformationData>;
}

export function BasicInformationForm({ onNext, onBack, onExit, initialData }: BasicInformationFormProps) {
  const isMobile = useIsMobile();
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Determine starting question index - if address is pre-filled from onboarding, start at question 2
  const getInitialQuestionIndex = () => {
    if (initialData?._fromOnboardingWithAddress && initialData?.address?.fullAddress) {
      return 1; // Start at question 2 (property type) since address is already filled
    }
    return 0; // Start at question 1 (address)
  };
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getInitialQuestionIndex());
  const [formData, setFormData] = useState<BasicInformationData>({
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || '',
      zipCode: initialData?.address?.zipCode || '',
      fullAddress: initialData?.address?.fullAddress || ''
    },
    propertySpecs: {
      propertyType: initialData?.propertySpecs?.propertyType || '',
      bedrooms: initialData?.propertySpecs?.bedrooms || '',
      fullBathrooms: initialData?.propertySpecs?.fullBathrooms || '',
      halfBathrooms: initialData?.propertySpecs?.halfBathrooms || '',
      squareFeet: initialData?.propertySpecs?.squareFeet || '',
      squareFootageSource: initialData?.propertySpecs?.squareFootageSource || '',
      squareFootageSourceOther: initialData?.propertySpecs?.squareFootageSourceOther || '',
      lotSize: initialData?.propertySpecs?.lotSize || '',
      yearBuilt: initialData?.propertySpecs?.yearBuilt || '',
      garage: initialData?.propertySpecs?.garage || '',
      coveredParking: initialData?.propertySpecs?.coveredParking || '',
      coveredParkingOtherDescription: initialData?.propertySpecs?.coveredParkingOtherDescription || '',
      coveredParkingElectricity: initialData?.propertySpecs?.coveredParkingElectricity || '',
      pool: initialData?.propertySpecs?.pool || '',
      occupancyVacatePlans: initialData?.propertySpecs?.occupancyVacatePlans || '',
      occupancyVacantDuration: initialData?.propertySpecs?.occupancyVacantDuration || ''
    },
    hasExistingSurvey: initialData?.hasExistingSurvey ?? null,
    occupancyStatus: initialData?.occupancyStatus || ''
  });

  // Define all questions in order
  const allQuestions: Question[] = [
    {
      id: 'address',
      title: 'What is the Address of the Property?',
      description: 'Enter the complete address of the property you want to list',
      type: 'address',
      required: true
    },
    {
      id: 'propertyType',
      title: 'What type of property is this?',
      type: 'select',
      options: [
        { value: 'residential', label: 'Single Family Home', description: 'Standalone house on its own lot' },
        { value: 'halfDuplex', label: 'Half Duplex', description: 'One half of a 2-family housing structure sharing one common wall' },
        { value: 'condo', label: 'Condominium', description: 'Unit in a multi-unit building with shared ownership' },
        { value: 'townhome', label: 'Townhome', description: 'Multi-story home sharing walls with adjacent units' },
        { value: 'land', label: 'Land/Lot', description: 'Raw land or vacant lot' }
      ],
      required: true
    },
    {
      id: 'bedrooms',
      title: 'How many Bedrooms does the Property have?',
      description: 'A bedroom must have a window and a closet',
      type: 'radio',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' }
      ],
      required: true
    },
    {
      id: 'fullBathrooms',
      title: 'How many Full Bathrooms does the Property have?',
      description: 'Full bathrooms include a toilet, sink, and bathtub/shower',
      type: 'radio',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' }
      ],
      required: true
    },
    {
      id: 'halfBathrooms',
      title: 'How many Half Bathrooms does the Property have?',
      description: 'Half bathrooms include a toilet and sink (no bathtub/shower)',
      type: 'radio',
      options: [
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' }
      ],
      required: true
    },
    {
      id: 'squareFeet',
      title: 'What is the Square Footage of the Property?',
      description: 'Interior living space in square feet',
      type: 'input',
      placeholder: 'e.g., 2,400',
      inputType: 'text',
      required: true
    },
    {
      id: 'squareFootageSource',
      title: 'What is the source of the Square Footage?',
      type: 'radio',
      options: [
        { value: 'tax-assessor', label: 'Tax Assessor Records' },
        { value: 'appraisal', label: 'Licensed Appraisal Report' },
        { value: 'blueprints', label: 'Architectural Blueprints' },
        { value: 'building-permit', label: 'Building Permit' },
        { value: 'survey', label: 'Survey' },
        { value: 'prior-mls', label: 'Prior MLS Listing' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'squareFootageSourceOther',
      title: 'Please describe the Other source of information for the Square Footage',
      type: 'input',
      placeholder: 'e.g., Real estate listing, Homeowner records, etc.',
      inputType: 'text'
    },
    {
      id: 'lotSize',
      title: 'What is the Lot Size of the Property?',
      description: 'Total property size in square feet',
      type: 'input',
      placeholder: 'e.g., 8,000',
      inputType: 'number'
    },
    {
      id: 'yearBuilt',
      title: 'What year was the Property built?',
      type: 'input',
      placeholder: 'e.g., 1995',
      inputType: 'number'
    },
    {
      id: 'garage',
      title: 'How many Garage Spaces does the Property have?',
      type: 'radio',
      options: [
        { value: 'none', label: 'No Garage' },
        { value: '1', label: '1 Car' },
        { value: '2', label: '2 Car' },
        { value: '3', label: '3 Car' },
        { value: '4', label: '4 Car' },
        { value: '5+', label: '5+ Car' }
      ]
    },
    {
      id: 'coveredParking',
      title: 'Does the Property have any additional Covered Parking?',
      type: 'radio',
      options: [
        { value: 'none', label: 'None' },
        { value: 'other', label: 'Other' },
        { value: '1-vehicle-carport', label: '1 Vehicle Carport' },
        { value: '2-vehicle-carport', label: '2 Vehicle Carport' },
        { value: '1-vehicle-detached', label: '1 Vehicle Detached Garage' },
        { value: '2-vehicle-detached', label: '2 Vehicle Detached Garage' }
      ]
    },
    {
      id: 'coveredParkingOtherDescription',
      title: 'Please describe the Other Covered Parking Structure:',
      type: 'input',
      placeholder: 'e.g., Metal carport, Lean-to structure, etc.',
      inputType: 'text'
    },
    {
      id: 'coveredParkingElectricity',
      title: 'Does the Covered Parking have electricity for vehicle charging such as RV?',
      type: 'radio',
      options: [
        { value: 'none', label: 'None' },
        { value: '120v', label: '120V' },
        { value: '220v', label: '220V' },
        { value: 'unknown', label: 'Unknown' }
      ]
    },
    {
      id: 'pool',
      title: 'Does the Property have a Pool?',
      type: 'radio',
      options: [
        { value: 'none', label: 'No Pool' },
        { value: 'community', label: 'Community Pool' },
        { value: 'in-ground', label: 'In-Ground Pool' },
        { value: 'above-ground', label: 'Above-Ground Pool' },
        { value: 'spa-only', label: 'Spa/Hot Tub Only' }
      ]
    },
    {
      id: 'survey',
      title: 'Do you have a Survey for the Property?',
      description: 'A property survey shows exact boundaries, structures, and features of your property',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'occupancy',
      title: 'What is the Current Occupancy of the Property?',
      description: 'This information helps buyers understand the current status of the property',
      type: 'select',
      options: [
        { value: 'owner-occupied', label: 'Owner Occupied' },
        { value: 'non-owner-occupied', label: 'Non-Owner Occupied' },
        { value: 'vacant', label: 'Vacant' }
      ]
    },
    {
      id: 'occupancyVacatePlans',
      title: 'Do you presently have plans to vacate the property prior to going under contract?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'occupancyVacantDuration',
      title: 'How long has it been Vacant?',
      type: 'input',
      placeholder: 'e.g., 3 months, 1 year',
      inputType: 'text'
    }
  ];

  // Filter questions based on property type and other conditions
  const questions = useMemo(() => {
    const propertyType = formData.propertySpecs.propertyType;
    const coveredParking = formData.propertySpecs.coveredParking;
    const occupancyStatus = formData.occupancyStatus;
    
    let filteredQuestions = allQuestions;
    
    if (propertyType === 'land') {
      // For land: address, property type, lot size, survey, occupancy
      filteredQuestions = allQuestions.filter(q => 
        q.id === 'address' || 
        q.id === 'propertyType' || 
        q.id === 'lotSize' || 
        q.id === 'survey' || 
        q.id === 'occupancy'
      );
    } else if (propertyType === 'condo' || propertyType === 'townhome') {
      // For condo/townhome: all except lot size
      filteredQuestions = allQuestions.filter(q => q.id !== 'lotSize');
    }
    
    // Filter out covered parking related questions based on selection
    if (!coveredParking || coveredParking === 'none') {
      filteredQuestions = filteredQuestions.filter(q => q.id !== 'coveredParkingElectricity');
    }
    
    // Filter out "Other" description question if "Other" is not selected
    if (coveredParking !== 'other') {
      filteredQuestions = filteredQuestions.filter(q => q.id !== 'coveredParkingOtherDescription');
    }
    
    // Filter out square footage source "Other" description question if "Other" is not selected
    if (formData.propertySpecs.squareFootageSource !== 'other') {
      filteredQuestions = filteredQuestions.filter(q => q.id !== 'squareFootageSourceOther');
    }
    
    // Filter occupancy follow-up questions based on occupancy status
    if (occupancyStatus !== 'owner-occupied') {
      filteredQuestions = filteredQuestions.filter(q => q.id !== 'occupancyVacatePlans');
    }
    if (occupancyStatus !== 'vacant') {
      filteredQuestions = filteredQuestions.filter(q => q.id !== 'occupancyVacantDuration');
    }
    
    return filteredQuestions;
  }, [formData.propertySpecs.propertyType, formData.propertySpecs.coveredParking, formData.propertySpecs.squareFootageSource, formData.occupancyStatus]);

  // Reset question index when property type changes and filters questions
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(Math.max(0, questions.length - 1));
    }
  }, [questions.length, currentQuestionIndex]);

  // Handle pre-filled address from onboarding flow
  useEffect(() => {
    if (initialData?._fromOnboardingWithAddress && initialData?.address?.fullAddress) {
      console.log('=== STREAMLINED USER JOURNEY ACTIVE ===');
      console.log('✅ Address pre-filled from landing page:', initialData.address.fullAddress);
      console.log('✅ Starting at question 2 (Property Type) - skipping address entry');
      console.log('🔄 Simulating API fetch for property details...');
      
      // Simulate API call to fetch property details for the pre-filled address
      // TODO: Replace with actual API call
      // In a real implementation, this would:
      // 1. Make API call to property data service (like Zillow, MLS, etc.)
      // 2. Pre-populate beds, baths, sqft, year built, property type
      // 3. Handle any errors gracefully
      
      // For now, just log that this is where the API call would happen
      console.log('📡 API Integration Point: Would fetch property details for:', initialData.address.fullAddress);
      console.log('📋 Would pre-populate: bedrooms, bathrooms, sqft, year built, property type');
    } else if (initialData?.address?.fullAddress) {
      console.log('Address provided but not from onboarding flow - normal entry');
    } else {
      console.log('No pre-filled address - user will start with address entry');
    }
  }, [initialData]);

  // Safely get current question with bounds checking
  const currentQuestion = useMemo(() => {
    const safeIndex = Math.min(currentQuestionIndex, questions.length - 1);
    return questions[safeIndex];
  }, [currentQuestionIndex, questions]);

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Confetti celebration function
  const triggerConfetti = () => {
    // Create confetti effect using canvas-confetti-like implementation
    const createConfettiPiece = () => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'][Math.floor(Math.random() * 7)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      
      const rotation = Math.random() * 360;
      const scale = Math.random() * 0.8 + 0.6;
      
      confetti.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s linear forwards`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 4000);
    };

    // Create multiple confetti pieces
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        createConfettiPiece();
      }, i * 20);
    }
  };

  // Add confetti CSS animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(${window.innerHeight + 100}px) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Trigger confetti celebration
      triggerConfetti();
      
      // Small delay before proceeding to let user see the celebration
      setTimeout(() => {
        onNext(formData);
      }, 500);
    } else {
      setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
    }
  }, [isLastQuestion, onNext, formData, questions.length]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleBackToForm = () => {
    if (onBack) {
      onBack();
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field === 'address') {
      setFormData(prev => ({
        ...prev,
        address: value
      }));
    } else if (field === 'survey') {
      setFormData(prev => ({
        ...prev,
        hasExistingSurvey: value === 'yes'
      }));
    } else if (field === 'occupancy') {
      setFormData(prev => ({
        ...prev,
        occupancyStatus: value,
        propertySpecs: {
          ...prev.propertySpecs,
          // Clear follow-up answers when occupancy changes
          occupancyVacatePlans: '',
          occupancyVacantDuration: ''
        }
      }));
    } else {
      setFormData(prev => {
        const newPropertySpecs = {
          ...prev.propertySpecs,
          [field]: value
        };
        
        // If covered parking is set to 'none', clear the electricity field
        if (field === 'coveredParking' && value === 'none') {
          newPropertySpecs.coveredParkingElectricity = '';
        }
        
        // If covered parking changes away from 'other', clear the other description
        if (field === 'coveredParking' && value !== 'other') {
          newPropertySpecs.coveredParkingOtherDescription = '';
        }
        
        // If square footage source changes away from 'other', clear the other description
        if (field === 'squareFootageSource' && value !== 'other') {
          newPropertySpecs.squareFootageSourceOther = '';
        }
        
        return {
          ...prev,
          propertySpecs: newPropertySpecs
        };
      });
    }
  };

  const handleAddressChange = (addressData: PropertyAddressData) => {
    updateFormData('address', addressData);
    
    // Simulate API call to fetch property details when address is entered
    // In a real app, this would make an actual API call to get property specs
    if (addressData.fullAddress) {
      console.log('Address entered, would fetch property details from API:', addressData);
      
      // TODO: Implement actual API call to fetch property details
      // This would typically look like:
      // fetchPropertyDetails(addressData.fullAddress).then(details => {
      //   // Pre-populate beds, baths, sqft, etc. from the API response
      //   setFormData(prev => ({
      //     ...prev,
      //     propertySpecs: {
      //       ...prev.propertySpecs,
      //       bedrooms: details.bedrooms || '',
      //       fullBathrooms: details.bathrooms || '',
      //       squareFeet: details.squareFeet || '',
      //       yearBuilt: details.yearBuilt || '',
      //       propertyType: details.propertyType || ''
      //     }
      //   }));
      // });
      
      // Auto-advance to next question after address is entered
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  const handleSelectValue = (value: string) => {
    updateFormData(currentQuestion.id, value);
    
    // Auto-advance for most select questions, but not property type to avoid glitches
    if (currentQuestion.id !== 'propertyType') {
      setTimeout(() => {
        handleNext();
      }, 200);
    }
  };

  const handleRadioValue = (value: string) => {
    updateFormData(currentQuestion.id, value);
    
    // Auto-advance for radio questions
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleInputValue = (value: string) => {
    updateFormData(currentQuestion.id, value);
  };

  // Always allow advancing - no validation
  const isCurrentAnswerValid = () => {
    return true;
  };

  // Helper function to determine which questions should show descriptions
  const shouldShowDescription = (questionId: string) => {
    const questionsWithUsefulDescriptions = [
      'squareFeet',         // "Interior living space in square feet"
      'lotSize',            // "Total property size in square feet"
      'survey',             // "A property survey shows exact boundaries, structures, and features of your property"
      'occupancy'           // "This information helps buyers understand the current status of the property"
    ];
    return questionsWithUsefulDescriptions.includes(questionId);
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

  // Get the selected option label for display
  const getSelectedOptionLabel = (value: string, options?: { value: string; label: string }[]) => {
    if (!options) return value;
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : value;
  };

  const getCurrentValue = () => {
    if (currentQuestion.id === 'address') {
      return formData.address;
    } else if (currentQuestion.id === 'survey') {
      return formData.hasExistingSurvey === null ? '' : formData.hasExistingSurvey ? 'yes' : 'no';
    } else if (currentQuestion.id === 'occupancy') {
      return formData.occupancyStatus;
    } else {
      return formData.propertySpecs[currentQuestion.id as keyof PropertySpecs];
    }
  };

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    const currentValue = getCurrentValue();

    switch (currentQuestion.type) {
      case 'address':
        return (
          <AddressInput
            value={formData.address}
            onChange={handleAddressChange}
            placeholder="Enter property address..."
          />
        );

      case 'select':
        return (
          <Select 
            value={currentValue as string} 
            onValueChange={handleSelectValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option...">
                {currentValue ? getSelectedOptionLabel(currentValue as string, currentQuestion.options) : "Select an option..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {currentQuestion.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div>{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <div className="space-y-4">
            <ButtonRadioGroup
              options={currentQuestion.options || []}
              value={currentValue as string}
              onValueChange={handleRadioValue}
            />
            {/* Detailed explainer boxes for specific questions */}
            {currentQuestion.id === 'bedrooms' && (
              <div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-800">
                  A bedroom must have at least 70 square feet of floor space, a closet, and at least one window or door for emergency egress. The room must be accessible from common areas without passing through another bedroom and have heating/cooling like the rest of the home.
                </p>
              </div>
            )}
            {currentQuestion.id === 'fullBathrooms' && (
              <div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-800">
                  A full bathroom contains all four fixtures: a toilet, sink, bathtub, and shower (or tub/shower combination). Some areas consider three fixtures sufficient if they include toilet, sink, and either shower or tub.
                </p>
              </div>
            )}
            {currentQuestion.id === 'halfBathrooms' && (
              <div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-800">
                  A half bathroom contains only two fixtures: a toilet and a sink. Also called a powder room or guest bathroom, it has no bathtub or shower.
                </p>
              </div>
            )}
            {currentQuestion.id === 'garage' && (
              <div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-800">
                  Garage spaces are typically counted by the number of standard-sized vehicles they can accommodate. A one-car garage accommodates one vehicle, two-car garage fits two vehicles, etc. The space must be enclosed and designed specifically for vehicle storage.
                </p>
              </div>
            )}
          </div>
        );

      case 'input':
        return (
          <div className="space-y-4">
            <Input
              type={currentQuestion.inputType || 'text'}
              placeholder={currentQuestion.placeholder}
              value={currentValue as string}
              onChange={(e) => handleInputValue(e.target.value)}
              className="w-full"
            />
            {/* Special detailed explanation for Square Footage */}
            {currentQuestion.id === 'squareFeet' && (
              <div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">What IS Included in Square Footage:</h4>
                  <ul className="text-sm text-gray-800 space-y-1 list-disc pl-4">
                    <li>Finished rooms above ground level with main house heating/cooling</li>
                    <li>Bedrooms, bathrooms, kitchens, living rooms, dining rooms</li>
                    <li>Hallways and closets - with finished floors, walls, ceilings</li>
                    <li>Areas connected directly to main house - through finished spaces only</li>
                    <li>Rooms built for people to live in - normal ceiling height required</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">What IS NOT Included in Square Footage:</h4>
                  <ul className="text-sm text-gray-800 space-y-1 list-disc pl-4">
                    <li>Garages, basements, attics, storage rooms - even with air vents</li>
                    <li>Porches, patios, decks, screened areas - unless fully enclosed with HVAC</li>
                    <li>Separate buildings - guest houses, workshops, detached apartments</li>
                    <li>Rooms requiring unfinished access - through garages or basements to reach</li>
                    <li>Bonus rooms over garages, three-season rooms - or areas with only window AC units</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };



  // Ensure safe rendering with bounds checking
  if (!currentQuestion) {
    return null;
  }

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
          Basic Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg">{currentQuestion.title}</Label>
            </div>
            
            <div className="pt-2">
              {renderQuestionContent()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            {/* Back Button (Left) - Only visible when not on first question */}
            {currentQuestionIndex > 0 ? (
              <Button 
                onClick={handlePrevious}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div /> 
            )}

            {/* Next/Continue Button (Right) - Always enabled */}
            <Button 
              onClick={handleNext}
              className={`flex items-center ${isLastQuestion ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
            >
              {isLastQuestion ? "Complete" : "Next"}
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