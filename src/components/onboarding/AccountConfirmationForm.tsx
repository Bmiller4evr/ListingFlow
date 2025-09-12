import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft, ArrowRight, User, Mail, Phone, Lock } from "lucide-react";
import { formatPhoneNumber, validatePhoneNumber } from "./phone-utils";

export interface UserAccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  authMethod: 'google' | 'apple' | 'facebook' | 'email';
  termsAccepted: boolean;
}

interface AccountConfirmationFormProps {
  onNext: (data: UserAccountData) => void;
  onBack: () => void;
  authMethod: 'google' | 'apple' | 'facebook' | 'email';
  initialData?: Partial<UserAccountData>;
  ssoData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

export function AccountConfirmationForm({ 
  onNext, 
  onBack, 
  authMethod, 
  initialData, 
  ssoData 
}: AccountConfirmationFormProps) {
  const [formData, setFormData] = useState<Partial<UserAccountData>>({
    firstName: ssoData?.firstName || initialData?.firstName || '',
    lastName: ssoData?.lastName || initialData?.lastName || '',
    email: ssoData?.email || initialData?.email || '',
    phone: initialData?.phone || '',
    password: initialData?.password || '',
    authMethod,
    termsAccepted: initialData?.termsAccepted || false
  });

  const [phoneError, setPhoneError] = useState<string>('');

  const handleInputChange = (field: keyof UserAccountData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear phone error when user starts typing
    if (field === 'phone') {
      setPhoneError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formatted);
  };

  // Check if form is valid without side effects (for disabled state)
  const isFormValid = (): boolean => {
    if (!formData.firstName?.trim()) return false;
    if (!formData.lastName?.trim()) return false;
    if (!formData.email?.trim()) return false;
    if (!formData.phone?.trim()) return false;
    
    // Validate phone number without setting error
    if (!validatePhoneNumber(formData.phone)) return false;
    
    // Require password for email signup
    if (authMethod === 'email' && !formData.password?.trim()) return false;
    
    return true;
  };

  const validateForm = (): boolean => {
    if (!formData.firstName?.trim()) return false;
    if (!formData.lastName?.trim()) return false;
    if (!formData.email?.trim()) return false;
    if (!formData.phone?.trim()) return false;
    
    // Validate phone number
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    
    // Require password for email signup
    if (authMethod === 'email' && !formData.password?.trim()) return false;
    
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData as UserAccountData);
    }
  };

  const getTitle = () => {
    switch (authMethod) {
      case 'google':
        return 'Confirm Your Google Account Details';
      case 'apple':
        return 'Confirm Your Apple Account Details';
      case 'facebook':
        return 'Confirm Your Facebook Account Details';
      default:
        return 'Create Your Account';
    }
  };

  const getDescription = () => {
    if (authMethod !== 'email') {
      return 'Please confirm your information and add your phone number to complete setup.';
    }
    return 'Enter your information to create your Access Realty account.';
  };

  return (
    <Card className="border-none shadow-none max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{getTitle()}</CardTitle>
        <p className="text-muted-foreground mt-2">{getDescription()}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                <User className="h-4 w-4 inline mr-1" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={authMethod !== 'email' && !!ssoData?.firstName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={authMethod !== 'email' && !!ssoData?.lastName}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={authMethod !== 'email' && !!ssoData?.email}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={phoneError ? 'border-destructive' : ''}
            />
            {phoneError && (
              <p className="text-sm text-destructive">{phoneError}</p>
            )}
          </div>

          {/* Password Field - Only for email signup */}
          {authMethod === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="h-4 w-4 inline mr-1" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Terms Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you confirm that you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="flex items-center"
          >
            Create Account
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}