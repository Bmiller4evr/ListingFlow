import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Home } from "lucide-react";
import { UnifiedAuthForm } from "./auth/UnifiedAuthForm";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: (email: string) => void;
}

export function SignInModal({ open, onOpenChange, onSignIn }: SignInModalProps) {
  const handleAuthSuccess = () => {
    onSignIn('user@example.com'); // This will be replaced by real user data
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