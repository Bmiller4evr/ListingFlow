export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (digits.length >= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  } else if (digits.length >= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length >= 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return digits;
  }
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Must be exactly 10 digits for US phone numbers
  return digits.length === 10;
};

export const PHONE_VALIDATION = {
  required: "Phone number is required",
  pattern: {
    value: /^\(\d{3}\) \d{3}-\d{4}$/,
    message: "Please enter a valid phone number"
  }
};

export const EMAIL_VALIDATION = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address"
  }
};

export const NAME_VALIDATION = {
  required: (field: string) => `${field} is required`,
  minLength: {
    value: 2,
    message: (field: string) => `${field} must be at least 2 characters`
  }
};