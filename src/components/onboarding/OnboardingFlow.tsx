import { useState } from "react";
import { SSOSelectionForm } from "./SSOSelectionForm";
import { AccountConfirmationForm, UserAccountData } from "./AccountConfirmationForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X, CheckCircle, Circle } from "lucide-react";

type OnboardingStep = 'sso-selection' | 'account-confirmation' | 'complete';

export interface PropertyListingData {
  account?: UserAccountData;
  selectedAuthMethod?: 'google' | 'apple' | 'facebook' | 'email';
  ssoData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onExit: () => void;
  initialStep?: OnboardingStep;
  initialData?: PropertyListingData;
}

export function OnboardingFlow({ onComplete, onExit, initialStep = 'sso-selection', initialData = {} }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep || 'sso-selection');
  const [listingData, setListingData] = useState<PropertyListingData>(initialData || {});
  
  const updateStep = (step: OnboardingStep) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleSSOSelectionComplete = (method: 'google' | 'apple' | 'facebook' | 'email') => {
    // Simulate SSO data for demo - in real app this would come from SSO provider
    const mockSSOData = method !== 'email' ? {
      email: `user@${method}.com`,
      firstName: 'John',
      lastName: 'Doe'
    } : undefined;

    setListingData(prev => ({ 
      ...prev, 
      selectedAuthMethod: method,
      ssoData: mockSSOData
    }));
    updateStep('account-confirmation');
  };

  const handleAccountConfirmationComplete = (accountData: UserAccountData) => {
    setListingData(prev => ({ ...prev, account: accountData }));
    updateStep('complete');
  };

  const handleSSOSelectionBack = () => {
    // Exit the onboarding flow when going back from SSO selection
    onExit();
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'account-confirmation':
        updateStep('sso-selection');
        break;
      default:
        break;
    }
  };

  const getCurrentStepIndex = () => {
    const steps: OnboardingStep[] = [
      'sso-selection',
      'account-confirmation',
      'complete'
    ];
    return steps.indexOf(currentStep) + 1;
  };

  const totalSteps = 2;
  const progress = (getCurrentStepIndex() / totalSteps) * 100;



  return (
    <div className="relative container max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 -mt-12" 
        onClick={onExit}
      >
        <X className="h-4 w-4" />
      </Button>

      {currentStep !== 'complete' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-medium">Step {getCurrentStepIndex()} of {totalSteps}</h2>
            <span className="text-sm text-muted-foreground">
              {currentStep === 'sso-selection' && 'Account Setup'}
              {currentStep === 'account-confirmation' && 'Confirm Details'}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <Card className="shadow-md p-6 sm:p-8">
        {currentStep === 'sso-selection' && (
          <SSOSelectionForm
            onNext={handleSSOSelectionComplete}
            onBack={handleSSOSelectionBack}
          />
        )}

        {currentStep === 'account-confirmation' && (
          <AccountConfirmationForm
            onNext={handleAccountConfirmationComplete}
            onBack={handlePreviousStep}
            authMethod={listingData.selectedAuthMethod || 'email'}
            initialData={listingData.account}
            ssoData={listingData.ssoData}
          />
        )}

        {currentStep === 'complete' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1>Welcome to Access Realty!</h1>
                <p className="text-muted-foreground mt-2">
                  Your account has been created successfully. Let's start creating your listing!
                </p>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-muted/50 p-6 rounded-lg">
              <h4 className="mb-4">What's Next</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Circle className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" />
                  <span>Tell us about your Property</span>
                </div>
                <div className="flex items-center gap-3">
                  <Circle className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" />
                  <span>Order a Lockbox</span>
                </div>
                <div className="flex items-center gap-3">
                  <Circle className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" />
                  <span>Schedule Photography</span>
                </div>
                <div className="flex items-center gap-3">
                  <Circle className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" />
                  <span>Set a Listing Price</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button onClick={onComplete} className="w-full" size="lg">
              Start Creating My Listing
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}