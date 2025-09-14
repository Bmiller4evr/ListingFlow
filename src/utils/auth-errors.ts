export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred';
  
  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  
  // Email already exists
  if (message.includes('user already registered') || 
      message.includes('email already registered') ||
      message.includes('already been registered') ||
      code.includes('email_already_exists') ||
      code.includes('user_already_exists')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  
  // Invalid email format
  if (message.includes('invalid email') || 
      message.includes('email format') ||
      code.includes('invalid_email')) {
    return 'Please enter a valid email address.';
  }
  
  // Password validation errors
  if (message.includes('password') && 
      (message.includes('weak') || message.includes('short') || message.includes('invalid'))) {
    return 'Password must be at least 6 characters with 1 letter and 1 number.';
  }
  
  // Rate limiting
  if (message.includes('rate limit') || 
      message.includes('too many') ||
      code.includes('rate_limit') ||
      error.status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  
  // Network/connection errors
  if (message.includes('network') || 
      message.includes('connection') ||
      message.includes('fetch') ||
      error.status === 0 ||
      error.status >= 500) {
    return 'Connection error. Please check your internet and try again.';
  }
  
  // Database errors
  if (message.includes('database') || 
      message.includes('server error') ||
      message.includes('internal error') ||
      code.includes('database_error')) {
    return 'Server error. Please try again in a moment.';
  }
  
  // Invalid credentials (for sign in)
  if (message.includes('invalid credentials') ||
      message.includes('invalid login') ||
      code.includes('invalid_credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  // Account not found (for sign in)
  if (message.includes('user not found') ||
      message.includes('account not found') ||
      code.includes('user_not_found')) {
    return 'No account found with this email. Please check the email or create a new account.';
  }
  
  // Email confirmation required
  if (message.includes('email not confirmed') ||
      message.includes('confirmation required') ||
      code.includes('email_not_confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }
  
  // Account locked/disabled
  if (message.includes('account locked') ||
      message.includes('account disabled') ||
      code.includes('account_locked')) {
    return 'Your account has been temporarily locked. Please contact support.';
  }
  
  // Fallback: return the original message if it's user-friendly, otherwise generic message
  if (error.message && error.message.length < 100 && !error.message.includes('ERROR')) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

export function isRetryableError(error: any): boolean {
  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  
  // These errors can be retried
  return message.includes('network') ||
         message.includes('connection') ||
         message.includes('timeout') ||
         message.includes('server error') ||
         code.includes('network_error') ||
         code.includes('timeout') ||
         error.status === 0 ||
         error.status >= 500;
}