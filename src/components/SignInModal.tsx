import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Home } from "lucide-react";
import { AuthForm } from "./auth/AuthForm";

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
        
        <AuthForm onSuccess={handleAuthSuccess} />
        
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}