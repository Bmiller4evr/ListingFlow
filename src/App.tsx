import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { detailedListing } from "./data/listingDetailMock";
import { mockListings } from "./data/mockData";
import { OnboardingFlow, PropertyListingData } from "./components/onboarding/OnboardingFlow";

import { Toaster } from "sonner@2.0.3";
import { SignInModal } from "./components/SignInModal";
import { AppContent } from "./components/AppContent";
import { View, OnboardingStep, ListingCreationStep } from "./types/app";
import { USER_OWNED_PROPERTY_IDS } from "./utils/constants";
import { saveDraftListingData, loadDraftListingData } from "./utils/draftStorage";
import { saveAuthState, clearAuthState, loadAuthState } from "./utils/authStorage";
import { isView } from "./utils/navigation";
import { useIsMobile } from "./components/ui/use-mobile";

export default function App() {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [currentListing, setCurrentListing] = useState(detailedListing);
  const [listingHistory, setListingHistory] = useState<string[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [showingsFilterListingId, setShowingsFilterListingId] = useState<string | null>(null);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false); // Add flag to track if auth has been loaded
  
  // State for onboarding flow (Property Specs + Account Creation)
  const [savedOnboardingData, setSavedOnboardingData] = useState<PropertyListingData | undefined>();
  const [savedOnboardingStep, setSavedOnboardingStep] = useState<OnboardingStep | undefined>();
  
  // State for listing creation flow
  const [savedListingCreationData, setSavedListingCreationData] = useState<any>();
  const [savedListingCreationStep, setSavedListingCreationStep] = useState<ListingCreationStep | undefined>();
  
  // Initialize app navigation
  useEffect(() => {
    // Make navigation function available globally for components to use
    window.navigateToView = (view: string) => {
      if (isView(view)) {
        setCurrentView(view);
      }
    };
    
    // Add event listener for navigation events
    const appContainer = document.getElementById('app-container') || document;
    const handleNavigate = (event: any) => {
      const view = event.detail?.view;
      if (view && isView(view)) {
        setCurrentView(view);
      }
    };
    
    appContainer.addEventListener('navigate', handleNavigate);
    
    // Cleanup
    return () => {
      delete window.navigateToView;
      appContainer.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  // Authentication handlers
  const handleSignIn = (email: string) => {
    console.log('handleSignIn called with email:', email);
    setIsAuthenticated(true);
    setUserEmail(email);
    saveAuthState(email);
    setCurrentView('listings');
    console.log('Authentication state set - isAuthenticated: true, userEmail:', email);
  };

  const handleSignOut = () => {
    console.log('handleSignOut called');
    setIsAuthenticated(false);
    setUserEmail(null);
    clearAuthState();
    setCurrentView('landing');
    console.log('Authentication state cleared - isAuthenticated: false');
  };

  const handleLandingFlow = () => {
    setSavedOnboardingData({});
    setSavedOnboardingStep('sso-selection');
    setCurrentView('onboarding');
  };
  
  // Check if there's saved onboarding data and authentication state on initial load
  useEffect(() => {
    console.log('Initial load useEffect running...');
    try {
      // Check for authentication
      const authData = loadAuthState();
      console.log('Loaded auth data:', authData);
      
      if (authData) {
        console.log('Setting authenticated state from saved data');
        setIsAuthenticated(true);
        setUserEmail(authData.email);
        setCurrentView('listings');
        setAuthLoaded(true);
        
        // For authenticated users, clear any leftover onboarding data
        try {
          window.localStorage.removeItem('savedOnboardingData');
          window.localStorage.removeItem('savedOnboardingStep');
        } catch (error) {
          console.error('Error clearing onboarding data for authenticated user:', error);
        }
        
        return; // Exit early for authenticated users
      }
      
      console.log('No saved auth data found');
      setAuthLoaded(true);
      
      // Only load saved onboarding data for non-authenticated users
      const savedData = window.localStorage.getItem('savedOnboardingData');
      const savedStep = window.localStorage.getItem('savedOnboardingStep');
      
      if (savedData) {
        setSavedOnboardingData(JSON.parse(savedData));
      }
      
      if (savedStep) {
        setSavedOnboardingStep(savedStep as OnboardingStep);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setAuthLoaded(true);
    }
  }, []);
  
  // Save onboarding progress
  const saveOnboardingProgress = (data: PropertyListingData, step: OnboardingStep) => {
    if (!activeDraftId) {
      setSavedOnboardingData(data);
      setSavedOnboardingStep(step);
      
      try {
        window.localStorage.setItem('savedOnboardingData', JSON.stringify(data));
        window.localStorage.setItem('savedOnboardingStep', step);
      } catch (error) {
        console.error('Error saving onboarding data:', error);
      }
    } else {
      saveDraftListingData(activeDraftId, step, data);
    }
  };
  
  // Check if the current listing is owned by the user
  const isCurrentListingOwned = selectedListingId ? USER_OWNED_PROPERTY_IDS.includes(selectedListingId) : false;
  
  // Function to generate mock showings for a listing
  const generateMockShowings = (listingId: string, address: string) => {
    const baseShowings = [
      {
        id: `${listingId}-showing-1`,
        propertyId: listingId,
        buyerName: "Sarah & Mike Thompson",
        agentName: "Jennifer Adams",
        agentContact: "(555) 123-4567",
        date: "2025-01-20",
        time: "2:00 PM",
        duration: 30,
        status: "confirmed" as const,
        notes: "First-time homebuyers, very interested",
        contactMethod: "phone" as const,
        showingType: "in-person" as const
      },
      {
        id: `${listingId}-showing-2`,
        propertyId: listingId,
        buyerName: "Robert Chen",
        agentName: "David Kim",
        agentContact: "(555) 234-5678",
        date: "2025-01-21",
        time: "10:00 AM",
        duration: 45,
        status: "confirmed" as const,
        notes: "Cash buyer, looking to close quickly",
        contactMethod: "email" as const,
        showingType: "in-person" as const
      },
      {
        id: `${listingId}-showing-3`,
        propertyId: listingId,
        buyerName: "Lisa Martinez",
        agentName: "Patricia Chang",
        agentContact: "(555) 345-6789",
        date: "2025-01-22",
        time: "4:30 PM",
        duration: 30,
        status: "pending" as const,
        notes: "Relocating from Dallas, needs quick turnaround",
        contactMethod: "phone" as const,
        showingType: "in-person" as const
      },
      {
        id: `${listingId}-showing-4`,
        propertyId: listingId,
        buyerName: "James & Emily Wilson",
        agentName: "Michael Rodriguez",
        agentContact: "(555) 456-7890",
        date: "2025-01-23",
        time: "1:00 PM",
        duration: 60,
        status: "confirmed" as const,
        notes: "Looking for family home, have children",
        contactMethod: "email" as const,
        showingType: "in-person" as const
      }
    ];

    return baseShowings;
  };

  // Function to generate detailed listing data from basic listing info
  const generateDetailedListing = (listingId: string) => {
    const basicListing = mockListings.find(listing => listing.id === listingId);
    if (!basicListing) {
      return detailedListing; // Fallback to default detailed listing
    }

    // If this is the prop-3 listing, return the full detailed mock data
    if (listingId === "prop-3") {
      return detailedListing;
    }

    // Generate detailed data for other listings based on basic info
    const addressParts = basicListing.address.split(',');
    const streetAddress = addressParts[0].trim();
    const cityState = addressParts[1]?.trim() || "Austin, TX";
    const zip = addressParts[2]?.trim() || "78745";
    
    // Parse city and state more carefully
    const cityStateParts = cityState.trim().split(' ');
    const state = cityStateParts[cityStateParts.length - 1] || "TX"; // Last part is state
    const city = cityStateParts.slice(0, -1).join(' ') || "Austin"; // Everything before state is city

    return {
      ...detailedListing,
      id: listingId,
      address: streetAddress,
      city: city,
      state: state,
      zip: zip,
      price: basicListing.price,
      bedrooms: basicListing.bedrooms,
      bathrooms: basicListing.bathrooms,
      squareFeet: basicListing.squareFeet,
      propertyType: basicListing.propertyType,
      status: basicListing.status,
      listedDate: basicListing.listedDate,
      images: [{
        ...detailedListing.images[0],
        url: basicListing.image,
        caption: `Front view of ${streetAddress}`
      }, ...detailedListing.images.slice(1)],
      description: `Beautiful ${basicListing.propertyType.toLowerCase()} home located in ${city}. This ${basicListing.bedrooms}-bedroom, ${basicListing.bathrooms}-bathroom property offers ${basicListing.squareFeet.toLocaleString()} square feet of living space in a desirable neighborhood.`,
      mlsNumber: `AUS${zip}${listingId.replace('prop-', '')}`,

      traffic: basicListing.status === 'Draft' ? [] : detailedListing.traffic.map(traffic => ({
        ...traffic,
        views: Math.floor(basicListing.views * (traffic.source === 'Zillow' ? 0.6 : traffic.source === 'Homes.com' ? 0.3 : 0.1)),
        saves: Math.floor(basicListing.views * 0.05 * (traffic.source === 'Zillow' ? 0.6 : traffic.source === 'Homes.com' ? 0.3 : 0.1)),
        inquiries: Math.floor(basicListing.views * 0.01 * (traffic.source === 'Zillow' ? 0.6 : traffic.source === 'Homes.com' ? 0.3 : 0.1))
      })),
      offers: basicListing.status === 'Pending' ? [{
        ...detailedListing.offers[0],
        id: `offer-${listingId}-1`,
        amount: Math.round(basicListing.price * 0.97),
        earnestMoney: Math.round(basicListing.price * 0.02),
        cashAmount: Math.round(basicListing.price * 0.2),
        financedAmount: Math.round(basicListing.price * 0.8),
        status: 'Pending' as const,
        buyerName: 'Emily Johnson',
        agentName: 'Mark Wilson'
      }] : basicListing.status === 'Sold' ? detailedListing.offers : [],
      showings: basicListing.status === 'Draft' ? [] : generateMockShowings(listingId, streetAddress),
      documents: basicListing.status === 'Draft' ? [] : detailedListing.documents.map(doc => ({
        ...doc,
        id: `${doc.id}-${listingId}`
      }))
    };
  };
  
  // Mock function to handle viewing a listing detail
  const handleViewListing = (listingId: string) => {
    setSelectedListingId(listingId);
    setCurrentView('listing-detail');
    setCurrentListing(generateDetailedListing(listingId));
    setListingHistory([]);
  };

  // Function to navigate to showings with listing filter
  const handleViewShowingsForListing = (listingId: string) => {
    setShowingsFilterListingId(listingId);
    setCurrentView('showings');
  };
  

  
  // Handle going back to previous listing
  const handleBackToListing = () => {
    if (listingHistory.length > 0) {
      const newHistory = [...listingHistory];
      const previousListingId = newHistory.pop();
      setListingHistory(newHistory);
      
      if (previousListingId) {
        setCurrentListing(generateDetailedListing(previousListingId));
        setSelectedListingId(previousListingId);
      } else {
        handleBackToHome();
      }
    } else {
      handleBackToHome();
    }
  };
  
  const handleBackToHome = () => {
    setCurrentView('listings');
    setSelectedListingId(null);
    setCurrentListing(detailedListing);
    setListingHistory([]);
  };

  const handleMenuClick = (view: View) => {
    setCurrentView(view);
    if (view !== 'listing-detail') {
      setSelectedListingId(null);
      setCurrentListing(detailedListing);
      setListingHistory([]);
    }
    if (view !== 'showings') {
      setShowingsFilterListingId(null);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleStartListingFlow = () => {
    console.log('=== handleStartListingFlow called ===');
    console.log('Current state - isAuthenticated:', isAuthenticated);
    console.log('Current state - userEmail:', userEmail);
    console.log('Current state - authLoaded:', authLoaded);
    console.log('Current state - currentView:', currentView);
    
    // Double-check authentication state by loading from storage
    const authData = loadAuthState();
    console.log('Fresh auth data from storage:', authData);
    
    // If we have auth data but isAuthenticated is false, update the state
    if (authData && !isAuthenticated) {
      console.log('Found auth data but isAuthenticated was false - updating state');
      setIsAuthenticated(true);
      setUserEmail(authData.email);
    }
    
    const finalAuthState = authData ? true : isAuthenticated;
    console.log('Final authentication decision:', finalAuthState);
    
    if (!finalAuthState) {
      console.log('User not authenticated, going to onboarding');
      setActiveDraftId(null);
      
      setSavedOnboardingData({});
      setSavedOnboardingStep('sso-selection');
      
      try {
        window.localStorage.removeItem('savedOnboardingData');
        window.localStorage.removeItem('savedOnboardingStep');
      } catch (error) {
        console.error('Error removing onboarding data:', error);
      }
      
      setCurrentView('onboarding');
    } else {
      console.log('User authenticated, going to listing creation');
      // User is authenticated, clear any leftover onboarding data and go to listing creation
      setSavedOnboardingData(undefined);
      setSavedOnboardingStep(undefined);
      setActiveDraftId(null);
      
      try {
        window.localStorage.removeItem('savedOnboardingData');
        window.localStorage.removeItem('savedOnboardingStep');
      } catch (error) {
        console.error('Error clearing onboarding data:', error);
      }
      
      handleStartListingCreationFlow();
    }
  };
  
  const handleResumeDraft = (listingId: string, lastStep?: string, draftData?: any) => {
    console.log("Resuming draft", listingId, lastStep);
    
    setActiveDraftId(listingId);
    
    const storedDraftData = loadDraftListingData(listingId);
    const dataToUse = storedDraftData?.data || draftData;
    
    if (isAuthenticated) {
      // For authenticated users, use listing creation flow
      // Map the lastStep to the correct ListingCreationStep
      const stepMapping: Record<string, string> = {
        'address': 'basic-info', // Legacy mapping - address is now part of basic info
        'property-specs': 'basic-info', // Legacy mapping - property specs is now part of basic info  
        'home-facts': 'basic-info', // Legacy mapping - home facts is now part of basic info
        'basic-info': 'basic-info',
        'listing-service': 'listing-service',
        'title-holder': 'titleholder-information', // Legacy mapping
        'titleholder': 'titleholder-information', // Legacy mapping
        'titleholder-information': 'titleholder-information',
        'seller-disclosure': 'sellers-disclosure', // Legacy mapping
        'sellers-disclosure': 'sellers-disclosure',
        'financial-info': 'mortgages-taxes-liens', // Legacy mapping
        'mortgages-taxes-liens': 'mortgages-taxes-liens',
        'additional-information': 'additional-information',
        'secure-access': 'showing-access', // Legacy mapping
        'access-and-showings': 'showing-access', // Legacy mapping
        'showing-access': 'showing-access',
        'property-media': 'property-media',
        'listing-price': 'listing-price',
        'sign-paperwork': 'sign-paperwork'
      };
      
      const targetStep = stepMapping[lastStep || ''] || 'basic-info';
      
      setSavedListingCreationData(dataToUse);
      setSavedListingCreationStep(targetStep as ListingCreationStep);
      setCurrentView('listing-creation');
    } else {
      // For non-authenticated users, use onboarding flow
      // Always start from the first step ('sso-selection') but with saved data populated
      setSavedOnboardingData(dataToUse);
      setSavedOnboardingStep('sso-selection'); // Always start from first step
      setCurrentView('onboarding');
    }
  };
  
  const handleCompleteOnboarding = () => {
    console.log('=== handleCompleteOnboarding called ===');
    const userAccount = savedOnboardingData?.account;
    console.log('User account data:', userAccount);
    console.log('Auth method used:', userAccount?.authMethod);
    
    if (userAccount?.email) {
      setIsAuthenticated(true);
      setUserEmail(userAccount.email);
      saveAuthState(userAccount.email);
      console.log('Authentication completed for:', userAccount.email, 'via', userAccount.authMethod);
    }
    
    // Get the stored address from landing page
    let initialListingData = {};
    try {
      const storedAddress = window.localStorage.getItem('verifiedAddress');
      console.log('Stored address found:', storedAddress);
      
      if (storedAddress) {
        const addressData = JSON.parse(storedAddress);
        console.log('Parsed address data:', addressData);
        
        // Convert the stored address format to ListingCreationData format
        initialListingData = {
          basicInfo: {
            address: {
              street: addressData.street || addressData.formatted_address || '',
              city: '',
              state: '',
              zipCode: '',
              fullAddress: addressData.formatted_address || addressData.street || ''
            },
            propertySpecs: {
              propertyType: '',
              bedrooms: '',
              fullBathrooms: '',
              halfBathrooms: '',
              squareFeet: '',
              squareFootageSource: '',
              squareFootageSourceOther: '',
              lotSize: '',
              yearBuilt: '',
              garage: '',
              coveredParking: '',
              coveredParkingOtherDescription: '',
              coveredParkingElectricity: '',
              pool: '',
              occupancyVacatePlans: '',
              occupancyVacantDuration: ''
            },
            hasExistingSurvey: false,
            occupancyStatus: '',
            // Flag to indicate this came from onboarding with pre-filled address
            _fromOnboardingWithAddress: true
          }
        };
        
        console.log('Created initial listing data with pre-filled address:', initialListingData);
        
        // Clean up the stored address since we're using it now
        window.localStorage.removeItem('verifiedAddress');
        console.log('Cleaned up stored address from localStorage');
      } else {
        console.log('No stored address found - user will start with empty address');
      }
    } catch (error) {
      console.error('Error retrieving stored address:', error);
    }
    
    setSavedOnboardingData(undefined);
    setSavedOnboardingStep(undefined);
    
    try {
      window.localStorage.removeItem('savedOnboardingData');
      window.localStorage.removeItem('savedOnboardingStep');
    } catch (error) {
      console.error('Error removing onboarding data:', error);
    }
    
    console.log('Starting listing creation flow with initial data:', initialListingData);
    // Start listing creation with pre-filled address data
    handleStartListingCreationFlow(initialListingData);
  };

  const handleStartListingCreationFlow = (initialData?: any) => {
    console.log('=== handleStartListingCreationFlow called ===');
    console.log('Initial data:', initialData);
    setSavedListingCreationData(initialData || {});
    setSavedListingCreationStep('basic-info'); // Start from basic info instead of address
    setCurrentView('listing-creation');
    console.log('Set currentView to listing-creation, savedListingCreationStep to basic-info');
  };

  const handleCompleteListingCreation = () => {
    setSavedListingCreationData(undefined);
    setSavedListingCreationStep(undefined);
    
    try {
      window.localStorage.removeItem('savedListingCreationData');
      window.localStorage.removeItem('savedListingCreationStep');
    } catch (error) {
      console.error('Error removing listing creation data:', error);
    }
    
    setCurrentView('listings');
  };
  
  // Enhanced exit handlers that save progress
  const handleExitOnboarding = () => {
    // Save current progress before exiting
    if (savedOnboardingData && savedOnboardingStep) {
      const draftId = `onboarding-${Date.now()}`;
      try {
        window.localStorage.setItem('savedOnboardingData', JSON.stringify(savedOnboardingData));
        window.localStorage.setItem('savedOnboardingStep', savedOnboardingStep);
        console.log('Saved onboarding progress before exit');
      } catch (error) {
        console.error('Error saving onboarding progress:', error);
      }
    }
    
    if (isAuthenticated) {
      setCurrentView('listings');
    } else {
      setCurrentView('landing');
    }
  };

  const handleExitListingCreation = () => {
    // Save current progress before exiting
    if (savedListingCreationData && savedListingCreationStep) {
      const draftId = `listing-${Date.now()}`;
      saveDraftListingData(draftId, savedListingCreationStep, savedListingCreationData);
      console.log('Saved listing creation progress before exit');
    }
    
    setCurrentView('listings');
  };
  
  // Determine if we should show the sidebar
  const landingPageViews = ['landing'];
  const showSidebar = currentView !== 'onboarding' && !landingPageViews.includes(currentView);
  
  // Don't render anything until auth state is loaded
  if (!authLoaded) {
    return (
      <div className="flex h-screen bg-background text-foreground items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  return (
    <div id="app-container" className="flex h-screen bg-background text-foreground">
      {showSidebar && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onMenuClick={handleMenuClick}
          activeView={currentView}
          onToggleCollapse={handleToggleSidebar}
          userEmail={userEmail}
          onSignOut={handleSignOut}
          isMobile={isMobile}
        />
      )}
      
      <div className={`flex-1 flex flex-col overflow-hidden ${showSidebar && isMobile && !sidebarCollapsed ? 'pointer-events-none' : ''}`}>
        <div className="flex-1 overflow-y-auto">
          <main className={`min-h-full ${
            showSidebar 
              ? isMobile 
                ? 'p-4 pt-16 pb-8' // Mobile: smaller padding, account for mobile toggle button, extra bottom padding
                : 'py-6 pr-6 pl-6 pb-8' // Desktop: original padding with extra bottom padding
              : 'p-0' // No sidebar: no padding
          }`}>
            <AppContent
              currentView={currentView}
              listingHistory={listingHistory}
              handleBackToListing={handleBackToListing}
              handleBackToHome={handleBackToHome}
              handleMenuClick={handleMenuClick}
              setShowSignInModal={setShowSignInModal}
              handleLandingFlow={handleLandingFlow}
              handleStartListingFlow={handleStartListingFlow}
              handleCompleteOnboarding={handleCompleteOnboarding}
              handleExitOnboarding={handleExitOnboarding}
              savedOnboardingStep={savedOnboardingStep}
              savedOnboardingData={savedOnboardingData}
              handleCompleteListingCreation={handleCompleteListingCreation}
              handleExitListingCreation={handleExitListingCreation}
              savedListingCreationStep={savedListingCreationStep}
              savedListingCreationData={savedListingCreationData}
              handleViewListing={handleViewListing}
              handleResumeDraft={handleResumeDraft}
              currentListing={currentListing}
              isCurrentListingOwned={isCurrentListingOwned}
              handleViewShowingsForListing={handleViewShowingsForListing}
              showingsFilterListingId={showingsFilterListingId}
            />
          </main>
        </div>
      </div>
      
      {/* Mobile sidebar overlay */}
      {showSidebar && isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sign In Modal */}
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSignIn={handleSignIn}
      />
      
      <Toaster 
        position={isMobile ? "top-center" : "top-right"} 
        richColors 
        closeButton 
      />
    </div>
  );
}

// Add type definition for the global window object
declare global {
  interface Window {
    navigateToView: (view: string) => void;
  }
}