import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Home } from "lucide-react";
import { UnifiedAuthForm } from "./auth/UnifiedAuthForm";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: (email: string) => void;
}

export function SignInModal({ open, onOpenChange, onSignIn }: SignInModalProps) {
  const handleAuthSuccess = (userData?: any) => {
    // If userData is provided, it means this was a signup (account creation)
    if (userData) {
      console.log('New account created via SignInModal - userData:', userData);
      // For new account creation, we'll let the auth state monitor handle the redirect
      onSignIn(userData.email || 'user@example.com');
    } else {
      // Regular sign in
      onSignIn('user@example.com'); // This will be replaced by real user data
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-lg mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center">Access Realty</DialogTitle>
        </DialogHeader>
        
        <UnifiedAuthForm 
          mode="signin"
          onSuccess={handleAuthSuccess}
          showExitButton={false}
          allowModeSwitch={false}
        />
      </DialogContent>
    </Dialog>
  );
}