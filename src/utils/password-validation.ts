export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates password according to Access Realty requirements:
 * - Minimum 6 characters
 * - At least 1 alphabetic character
 * - At least 1 numeric character
 * - No special symbol requirement
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Simple check if password meets all requirements (for form validation)
 */
export function isPasswordValid(password: string): boolean {
  return validatePassword(password).isValid;
}