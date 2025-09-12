import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SSOButtons } from "./SSOButtons";

interface SSOSelectionFormProps {
  onNext: (method: 'google' | 'apple' | 'facebook' | 'email') => void;
  onBack: () => void;
}

export function SSOSelectionForm({ onNext, onBack }: SSOSelectionFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<'google' | 'apple' | 'facebook' | 'email' | null>(null);

  const handleSSOClick = (provider: 'google' | 'apple' | 'facebook') => {
    setSelectedMethod(provider);
    // In a real app, this would initiate the SSO flow
    // For now, we'll simulate it by going to the account confirmation
    onNext(provider);
  };

  const handleCreateAccount = () => {
    setSelectedMethod('email');
    onNext('email');
  };

  return (
    <Card className="border-none shadow-none max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <p className="text-muted-foreground mt-2">
          Choose how you'd like to sign up for Access Realty
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SSO Options */}
        <div className="space-y-4">
          <SSOButtons onSSOSignup={handleSSOClick} ssoLoading={null} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleCreateAccount}
            className="w-full h-12 text-base"
          >
            Create New Account with Email
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
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
        </div>
      </CardContent>
    </Card>
  );
}