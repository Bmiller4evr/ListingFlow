import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { ArrowLeft, ArrowRight, User, Mail, Lock, X } from "lucide-react";
import { validatePassword } from "../../utils/password-validation";
import { useAuth } from "../../contexts/AuthContext";

export interface UnifiedAuthFormProps {
  mode?: 'signin' | 'signup';
  onSuccess?: (userData?: any) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showExitButton?: boolean;
  onExit?: () => void;
  title?: string;
  description?: string;
  allowModeSwitch?: boolean; // Control whether users can switch between signin/signup
}

export function UnifiedAuthForm({ 
  mode = 'signin',
  onSuccess,
  onBack,
  showBackButton = false,
  showExitButton = false,
  onExit,
  title,
  description,
  allowModeSwitch = true
}: UnifiedAuthFormProps) {
  const { signIn, signUp } = useAuth();
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(mode);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (field === 'password') {
      setPasswordErrors([]);
    }
    setError(null);
    setSuccess(null);
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.email?.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.password?.trim()) {
      setError('Password is required');
      return false;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      return false;
    }

    // Name validation for signup
    if (currentMode === 'signup') {
      if (!formData.firstName?.trim()) {
        setError('First name is required');
        return false;
      }
      if (!formData.lastName?.trim()) {
        setError('Last name is required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (currentMode === 'signup') {
      const result = await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      );
      
      if (result.success) {
        setSuccess('Account created! Please check your email to verify your account.');
        if (onSuccess) onSuccess(result.user);
      } else {
        setError(result.error?.message || 'Failed to create account');
      }
    } else {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Signed in successfully!');
        if (onSuccess) onSuccess();
      } else {
        let errorMessage = result.error?.message || 'Failed to sign in';
        
        // Add helpful hint if account doesn't exist and mode switching is disabled
        if (!allowModeSwitch && errorMessage.toLowerCase().includes('user not found')) {
          errorMessage += ' If you need to create an account, please use the "Get Started" button.';
        }
        
        setError(errorMessage);
      }
    }

    setLoading(false);
  };

  const getTitle = () => {
    if (title) return title;
    return currentMode === 'signup' ? 'Create Your Account' : 'Welcome Back';
  };

  const getDescription = () => {
    if (description) return description;
    return currentMode === 'signup' 
      ? 'Enter your information to create your Access Realty account.'
      : 'Sign in to your Access Realty account.';
  };

  const switchMode = () => {
    setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSuccess(null);
    setPasswordErrors([]);
  };

  return (
    <Card className="border-none shadow-none max-w-md mx-auto">
      {showExitButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="absolute right-4 top-4"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{getTitle()}</CardTitle>
        <p className="text-muted-foreground mt-2">{getDescription()}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Name Fields - Only for signup */}
          {currentMode === 'signup' && (
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>
          )}

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
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              <Lock className="h-4 w-4 inline mr-1" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={currentMode === 'signup' ? 'Create a secure password' : 'Enter your password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={passwordErrors.length > 0 ? 'border-destructive' : ''}
            />
            {passwordErrors.length > 0 && (
              <div className="space-y-1">
                {passwordErrors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">{error}</p>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 6 characters with 1 letter and 1 number
            </p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Mode Switch - Only show if allowed */}
        {allowModeSwitch && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {currentMode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        )}

        {/* Terms Notice - Only for signup */}
        {currentMode === 'signup' && (
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
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {showBackButton ? (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div /> // Spacer
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? 'Loading...' : currentMode === 'signup' ? 'Create Account' : 'Sign In'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}