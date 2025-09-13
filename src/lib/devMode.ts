// Developer mode configuration
// This allows certain accounts to see mock data for testing

const DEV_MODE_EMAILS = [
  // Add your email here to enable dev mode for your account
  'your-email@example.com', // Replace with your actual email
  // You can add multiple developer emails here
];

export function isDevMode(userEmail: string | null): boolean {
  if (!userEmail) return false;
  
  // Check if user email is in dev list
  if (DEV_MODE_EMAILS.includes(userEmail.toLowerCase())) {
    return true;
  }
  
  // Also check localStorage for dev mode toggle (for your account only)
  if (DEV_MODE_EMAILS.includes(userEmail.toLowerCase())) {
    const devModeEnabled = localStorage.getItem('devMode') === 'true';
    return devModeEnabled;
  }
  
  return false;
}

export function toggleDevMode(userEmail: string | null): boolean {
  if (!userEmail || !DEV_MODE_EMAILS.includes(userEmail.toLowerCase())) {
    console.warn('Dev mode not available for this user');
    return false;
  }
  
  const currentState = localStorage.getItem('devMode') === 'true';
  const newState = !currentState;
  localStorage.setItem('devMode', newState.toString());
  
  // Reload to apply changes
  window.location.reload();
  return newState;
}

// Make toggle function available in console for debugging
if (typeof window !== 'undefined') {
  (window as any).toggleDevMode = () => {
    const userEmail = localStorage.getItem('userEmail');
    return toggleDevMode(userEmail);
  };
}