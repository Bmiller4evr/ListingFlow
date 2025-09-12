import { Button } from "../ui/button";
import { Chrome } from "lucide-react";
import { SSO_PROVIDERS, SSOProvider } from "./sso-config";

interface SSOButtonsProps {
  onSSOSignup: (provider: SSOProvider) => void;
  ssoLoading: string | null;
}

export function SSOButtons({ onSSOSignup, ssoLoading }: SSOButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Sign up with</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => onSSOSignup('google')}
          disabled={ssoLoading !== null}
          className="h-12"
        >
          {ssoLoading === 'google' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <Chrome className="h-4 w-4 mr-2" />
              {SSO_PROVIDERS.google.name}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onSSOSignup('apple')}
          disabled={ssoLoading !== null}
          className="h-12"
        >
          {ssoLoading === 'apple' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <span className="mr-2">{SSO_PROVIDERS.apple.icon}</span>
              {SSO_PROVIDERS.apple.name}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onSSOSignup('facebook')}
          disabled={ssoLoading !== null}
          className="h-12"
        >
          {ssoLoading === 'facebook' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <span className="mr-2">{SSO_PROVIDERS.facebook.icon}</span>
              {SSO_PROVIDERS.facebook.name}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}