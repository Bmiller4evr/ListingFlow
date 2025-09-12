import { OnboardingStep } from "../types/app";
import { PropertyListingData } from "../components/onboarding/OnboardingFlow";

// Function to save draft data to localStorage
export const saveDraftListingData = (listingId: string, step: OnboardingStep, data: PropertyListingData) => {
  const storedData = {
    listingId,
    lastStep: step,
    lastUpdated: new Date().toISOString(),
    data
  };
  
  try {
    localStorage.setItem(`draftListing_${listingId}`, JSON.stringify(storedData));
    console.log(`Draft data saved for listing ${listingId}`);
    return true;
  } catch (error) {
    console.error('Error saving draft data:', error);
    return false;
  }
};

// Function to load draft data from localStorage
export const loadDraftListingData = (listingId: string) => {
  try {
    const storedData = localStorage.getItem(`draftListing_${listingId}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error('Error loading draft data:', error);
    return null;
  }
};