// User class types for Access Realty
export type UserClass = 'standard' | 'legacy';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_class: UserClass;
  referral_source?: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
}

// User class configuration
export const UserClassConfig = {
  standard: {
    label: 'Standard Client',
    showServiceSelection: true,
    requirePayment: true,
    defaultService: 'self-service',
    features: {
      selfService: true,
      fullService: true,
      pricing: true,
      payments: true
    }
  },
  legacy: {
    label: 'Legacy Client',
    showServiceSelection: false,
    requirePayment: false,
    defaultService: 'full-service',
    features: {
      selfService: false,
      fullService: true,
      pricing: false,
      payments: false
    }
  }
} as const;

// Helper functions
export function getUserClassFromURL(): UserClass {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const path = window.location.pathname;
  
  // Check for legacy indicators
  if (ref?.startsWith('agent-') || path.includes('/legacy/')) {
    return 'legacy';
  }
  
  return 'standard'; // Default to standard
}

export function shouldShowServiceSelection(userClass: UserClass): boolean {
  return UserClassConfig[userClass].showServiceSelection;
}

export function shouldRequirePayment(userClass: UserClass): boolean {
  return UserClassConfig[userClass].requirePayment;
}