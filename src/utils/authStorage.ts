// Save authentication state to localStorage
export const saveAuthState = (email: string) => {
  try {
    window.localStorage.setItem('userAuth', JSON.stringify({ email, timestamp: Date.now() }));
    return true;
  } catch (error) {
    console.error('Error saving auth state:', error);
    return false;
  }
};

// Clear authentication state from localStorage
export const clearAuthState = () => {
  try {
    window.localStorage.removeItem('userAuth');
    return true;
  } catch (error) {
    console.error('Error clearing auth state:', error);
    return false;
  }
};

// Load authentication state from localStorage
export const loadAuthState = () => {
  try {
    const savedAuth = window.localStorage.getItem('userAuth');
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
    return null;
  } catch (error) {
    console.error('Error loading auth state:', error);
    return null;
  }
};

// Get verified address from localStorage
export const getVerifiedAddress = () => {
  try {
    const verifiedAddressJson = localStorage.getItem('verifiedAddress');
    if (verifiedAddressJson) {
      return JSON.parse(verifiedAddressJson);
    }
    return null;
  } catch (error) {
    console.error('Error parsing verified address:', error);
    return null;
  }
};