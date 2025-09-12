import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, ArrowRight, CreditCard, DollarSign, X, Check, Loader2 } from "lucide-react";
import { UserAccountData } from "../onboarding/AccountConfirmationForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export interface PaymentData {
  stripePaymentMethodId?: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface ListingServiceData {
  serviceType: 'self-service' | 'full-service' | '';
  termsAccepted: boolean;
  paymentData?: PaymentData;
}

// Initialize Stripe - handle different environment variable access methods
const getStripePublishableKey = () => {
  // Try different environment variable access methods
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  }
  // Fallback to a placeholder key for development
  return 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE';
};

const stripePromise = loadStripe(getStripePublishableKey());

interface ListingServiceFormProps {
  onNext: (data: ListingServiceData) => void;
  onExit?: () => void;
  initialData?: Partial<ListingServiceData>;
  userAccount?: UserAccountData;
}

export function ListingServiceForm({ onNext, onExit, initialData, userAccount }: ListingServiceFormProps) {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<'service-selection' | 'terms' | 'payment'>('service-selection');
  const [formData, setFormData] = useState<ListingServiceData>({
    serviceType: initialData?.serviceType || '',
    termsAccepted: initialData?.termsAccepted || false,
    paymentData: initialData?.paymentData || {
      stripePaymentMethodId: '',
      cardholderName: userAccount?.firstName && userAccount?.lastName 
        ? `${userAccount.firstName} ${userAccount.lastName}` 
        : '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    }
  });

  const handleServiceSelection = (serviceType: 'self-service' | 'full-service') => {
    setFormData(prev => ({ ...prev, serviceType }));
    setCurrentStep('terms');
  };

  const handleTermsAccept = () => {
    setFormData(prev => ({ ...prev, termsAccepted: true }));
    setCurrentStep('payment');
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('terms');
    } else if (currentStep === 'terms') {
      setCurrentStep('service-selection');
    }
  };

  const updatePaymentData = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.replace('billingAddress.', '');
      setFormData(prev => ({
        ...prev,
        paymentData: {
          ...prev.paymentData!,
          billingAddress: {
            ...prev.paymentData!.billingAddress,
            [addressField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        paymentData: {
          ...prev.paymentData!,
          [field]: value
        }
      }));
    }
  };

  // Stripe Elements component for secure card input
  const StripePaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const handlePaymentSubmit = async () => {
      if (!stripe || !elements) {
        return;
      }

      setIsProcessing(true);
      setPaymentError(null);

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setPaymentError('Card information is required');
        setIsProcessing(false);
        return;
      }

      try {
        // Create payment method with Stripe
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: formData.paymentData?.cardholderName || '',
            address: {
              line1: formData.paymentData?.billingAddress.street || '',
              city: formData.paymentData?.billingAddress.city || '',
              state: formData.paymentData?.billingAddress.state || '',
              postal_code: formData.paymentData?.billingAddress.zipCode || '',
              country: 'US',
            },
          },
        });

        if (error) {
          setPaymentError(error.message || 'An error occurred while processing your payment');
          setIsProcessing(false);
          return;
        }

        if (paymentMethod) {
          // Store the payment method ID
          setFormData(prev => ({
            ...prev,
            paymentData: {
              ...prev.paymentData!,
              stripePaymentMethodId: paymentMethod.id
            }
          }));

          // For Self Service, process the $399 payment immediately
          if (formData.serviceType === 'self-service') {
            // In a real implementation, you would call your backend API here
            // to create a payment intent and confirm the payment
            console.log('Processing $399 payment for Self Service...');
            
            // Simulate payment processing
            setTimeout(() => {
              setIsProcessing(false);
              handlePaymentComplete();
            }, 2000);
          } else {
            // For Full Service, just save the payment method
            setIsProcessing(false);
            handlePaymentComplete();
          }
        }
      } catch (err) {
        console.error('Payment processing error:', err);
        setPaymentError('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Card Information</Label>
          <div className="border border-border rounded-md p-3 bg-background">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true, // We'll collect this separately
              }}
            />
          </div>
          {paymentError && (
            <div className="text-sm text-destructive">{paymentError}</div>
          )}
        </div>

        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            placeholder="Full name as it appears on card"
            value={formData.paymentData?.cardholderName || ''}
            onChange={(e) => updatePaymentData('cardholderName', e.target.value)}
          />
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <Label className="text-lg">Billing Address</Label>
          
          <div>
            <Label htmlFor="billingStreet">Street Address</Label>
            <Input
              id="billingStreet"
              placeholder="123 Main Street"
              value={formData.paymentData?.billingAddress.street || ''}
              onChange={(e) => updatePaymentData('billingAddress.street', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                placeholder="Austin"
                value={formData.paymentData?.billingAddress.city || ''}
                onChange={(e) => updatePaymentData('billingAddress.city', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="billingState">State</Label>
              <Input
                id="billingState"
                placeholder="TX"
                value={formData.paymentData?.billingAddress.state || ''}
                onChange={(e) => updatePaymentData('billingAddress.state', e.target.value)}
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="billingZip">ZIP Code</Label>
              <Input
                id="billingZip"
                placeholder="78745"
                value={formData.paymentData?.billingAddress.zipCode || ''}
                onChange={(e) => updatePaymentData('billingAddress.zipCode', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button 
            onClick={handleBack}
            variant="outline"
            className="flex items-center"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button 
            onClick={handlePaymentSubmit}
            disabled={isProcessing || !stripe}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {formData.serviceType === 'self-service' ? 'Pay $399' : 'Save Payment Method'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const handlePaymentComplete = () => {
    // TODO: Store payment information to user account for future use
    // This would typically involve:
    // 1. Call backend API to save Stripe payment method ID to user account
    // 2. For self-service: payment has already been processed
    // 3. For full-service: payment method is saved for future commission processing
    // 4. Update user account with preferred payment method
    onNext(formData);
  };

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium">Choose Your Listing Service</h2>
        <p className="text-muted-foreground">
          Select the service level that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Self Service Option */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
            formData.serviceType === 'self-service' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-muted-foreground'
          }`}
          onClick={() => handleServiceSelection('self-service')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Self Service</CardTitle>
            <div className="text-3xl font-bold text-primary">$2,995</div>
            <div className="text-sm text-muted-foreground">$399 upfront</div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Full MLS listing access
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Professional photography
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Online listing management
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Basic contract support
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Full Service Option */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
            formData.serviceType === 'full-service' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-muted-foreground'
          }`}
          onClick={() => handleServiceSelection('full-service')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Full Service</CardTitle>
            <div className="text-3xl font-bold text-primary">2.5%</div>
            <div className="text-sm text-muted-foreground">Commission at closing</div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Everything in Self Service
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Dedicated agent support
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Showing coordination
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Full transaction management
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTermsAcceptance = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium">Terms of Service</h2>
        <p className="text-muted-foreground">
          Please review and accept our terms to continue
        </p>
      </div>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-medium">
              {formData.serviceType === 'self-service' ? 'Self Service' : 'Full Service'} Agreement
            </h3>
            
            <div className="h-48 overflow-y-auto border rounded-lg p-4 bg-muted/20 text-sm space-y-3">
              <p>
                <strong>1. Service Description:</strong> Access Realty will provide 
                {formData.serviceType === 'self-service' 
                  ? ' self-service real estate listing services including MLS access, professional photography, and basic contract support for a total fee of $2,995 with $399 due upfront.'
                  : ' full-service real estate brokerage services including dedicated agent support, showing coordination, and complete transaction management for a commission of 2.5% of the final sale price.'
                }
              </p>
              
              <p>
                <strong>2. Payment Terms:</strong> 
                {formData.serviceType === 'self-service' 
                  ? ' The upfront payment of $399 is due immediately upon agreement. The remaining balance of $2,596 is due at closing.'
                  : ' No upfront payment required. The full 2.5% commission is due and payable at closing from the sale proceeds.'
                }
              </p>

              <p>
                <strong>3. Cancellation:</strong> You may cancel this agreement within 72 hours of signing without penalty. After 72 hours, cancellation terms will apply as outlined in your service agreement.
              </p>

              <p>
                <strong>4. Liability:</strong> Access Realty's liability is limited to the amount of fees paid. We are not responsible for market conditions, buyer behavior, or factors outside our control.
              </p>

              <p>
                <strong>5. Duration:</strong> This agreement remains in effect until your property is sold or the listing expires (typically 6 months), whichever comes first.
              </p>
            </div>

            <div className="flex items-start space-x-3 pt-4">
              <Checkbox 
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I have read, understood, and agree to the terms of service outlined above. I understand the payment structure and service commitments for my selected service level.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button 
          onClick={handleBack}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button 
          onClick={handleTermsAccept}
          disabled={!formData.termsAccepted}
          className="flex items-center"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium">Payment Information</h2>
        <p className="text-muted-foreground">
          {formData.serviceType === 'self-service' 
            ? 'Enter payment details for your $399 upfront payment'
            : 'Save payment method for future transactions (no charge today)'
          }
        </p>
      </div>

      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <Label>Payment Method</Label>
          <Card className="p-4 border-2 border-primary bg-primary/5">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium">Credit/Debit Card</span>
            </div>
          </Card>
        </div>

        {/* Stripe Payment Form */}
        <StripePaymentForm />
      </div>
    </div>
  );

  return (
    <Elements stripe={stripePromise}>
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
            Listing Service
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentStep === 'service-selection' && renderServiceSelection()}
          {currentStep === 'terms' && renderTermsAcceptance()}
          {currentStep === 'payment' && renderPaymentForm()}
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
    </Elements>
  );
}