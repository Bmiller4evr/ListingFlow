import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { detailedListing } from "./data/listingDetailMock";
import { mockListings } from "./data/mockData";
import { OnboardingFlow, PropertyListingData } from "./components/onboarding/OnboardingFlow";
import { Toaster } from "sonner";
import { SignInModal } from "./components/SignInModal";
import { AppContent } from "./components/AppContent";
import { View, OnboardingStep, ListingCreationStep } from "./types/app";
import { USER_OWNED_PROPERTY_IDS } from "./utils/constants";
import { saveDraftListingData, loadDraftListingData } from "./utils/draftStorage";
import { isView } from "./utils/navigation";
import { useIsMobile } from "./components/ui/use-mobile";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ListingCreationFlow } from "./components/listing-creation/ListingCreationFlow";
import { LandingPage } from "./components/LandingPage";

export function AppWithAuth() {
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [currentListing, setCurrentListing] = useState(detailedListing);
  const [listingHistory, setListingHistory] = useState<string[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [showingsFilterListingId, setShowingsFilterListingId] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  // State for onboarding flow (Property Specs + Account Creation)
  const [savedOnboardingData, setSavedOnboardingData] = useState<PropertyListingData | undefined>();
  const [savedOnboardingStep, setSavedOnboardingStep] = useState<OnboardingStep | undefined>();
  
  // State for listing creation flow
  const [savedListingCreationData, setSavedListingCreationData] = useState<any>();
  const [savedListingCreationStep, setSavedListingCreationStep] = useState<ListingCreationStep | undefined>();

  // Update view based on authentication state
  useEffect(() => {
    if (!authLoading) {
      if (user && currentView === 'landing') {
        setCurrentView('listings');
      }
    }
  }, [user, authLoading, currentView]);

  // Initialize app navigation
  useEffect(() => {
    // Make navigation function available globally for components to use
    window.navigateToView = (view: string) => {
      if (isView(view)) {
        setCurrentView(view);
      }
    };
    
    // Add event listener for navigation events
    const handleNavigate = (event: CustomEvent) => {
      const { view } = event.detail;
      if (isView(view)) {
        setCurrentView(view);
      }
    };
    
    window.addEventListener('navigate' as any, handleNavigate as any);
    
    return () => {
      window.removeEventListener('navigate' as any, handleNavigate as any);
    };
  }, []);

  // Check for saved listing creation data on initial load
  useEffect(() => {
    const savedData = loadDraftListingData();
    if (savedData) {
      setSavedListingCreationData(savedData.data);
      setSavedListingCreationStep(savedData.step);
    }
  }, []);

  const handleSignIn = () => {
    setShowSignInModal(true);
  };

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    setCurrentView('listings');
  };

  const handleOnboardingComplete = () => {
    // Get the stored address from landing page
    let initialListingData = {};
    try {
      const storedAddress = window.localStorage.getItem('verifiedAddress');
      console.log('Stored address from localStorage:', storedAddress);
      
      if (storedAddress) {
        const addressData = JSON.parse(storedAddress);
        console.log('Parsed address data:', addressData);
        
        // Convert the stored address format to ListingCreationData format
        initialListingData = {
          basicInfo: {
            address: {
              street: addressData.street || addressData.formatted_address || '',
              city: addressData.city || '',
              state: addressData.state || 'TX',
              zip: addressData.zip || '',
              formatted_address: addressData.formatted_address || addressData.street || ''
            },
            _fromOnboardingWithAddress: true
          }
        };
        
        console.log('Initial listing data created:', initialListingData);
        
        // Clean up the stored address since we're using it now
        window.localStorage.removeItem('verifiedAddress');
      } else {
        console.log('No stored address found - user may have skipped address entry');
      }
    } catch (error) {
      console.error('Error retrieving stored address:', error);
    }
    
    setSavedOnboardingData(undefined);
    setSavedOnboardingStep(undefined);
    
    // Start listing creation with pre-filled address data
    console.log('Setting listing creation data:', initialListingData);
    console.log('Setting listing creation step: basic-info');
    setSavedListingCreationData(initialListingData);
    setSavedListingCreationStep('basic-info');
    console.log('Setting current view to: listing-creation');
    setCurrentView('listing-creation');
  };

  const handleListingCreationComplete = () => {
    setSavedListingCreationData(undefined);
    setSavedListingCreationStep(undefined);
    setCurrentView('listings');
  };

  const handleListingCreationExit = () => {
    const confirmExit = window.confirm('Are you sure you want to exit? Your progress will be saved as a draft.');
    if (confirmExit) {
      setSavedListingCreationData(undefined);
      setSavedListingCreationStep(undefined);
      setCurrentView('listings');
    }
  };

  const handleListingCreationSaveDraft = (data: any, step: ListingCreationStep) => {
    saveDraftListingData(data, step);
    setSavedListingCreationData(data);
    setSavedListingCreationStep(step);
  };

  const handleOnboardingExit = () => {
    setSavedOnboardingData(undefined);
    setSavedOnboardingStep(undefined);
    setCurrentView('landing');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleListingSelect = (listingId: string | null) => {
    setSelectedListingId(listingId);
    if (listingId) {
      const listing = mockListings.find(l => l.id === listingId);
      if (listing) {
        setCurrentListing(listing as any);
        setListingHistory(prev => {
          const filtered = prev.filter(id => id !== listingId);
          return [listingId, ...filtered].slice(0, 5);
        });
      }
    }
  };

  const handleShowingsFilter = (listingId: string | null) => {
    setShowingsFilterListingId(listingId);
  };

  // Don't render app content until auth is loaded
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Onboarding flow (not authenticated yet)
  if (currentView === 'onboarding') {
    return (
      <>
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onExit={handleOnboardingExit}
          initialStep={savedOnboardingStep}
          initialData={savedOnboardingData}
        />
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  // Listing creation flow (requires authentication)
  if (currentView === 'listing-creation' && savedListingCreationStep) {
    return (
      <ProtectedRoute>
        <ListingCreationFlow
          onComplete={handleListingCreationComplete}
          onExit={handleListingCreationExit}
          onSaveDraft={handleListingCreationSaveDraft}
          initialStep={savedListingCreationStep}
          initialData={savedListingCreationData}
        />
        <Toaster richColors position="bottom-right" />
      </ProtectedRoute>
    );
  }

  // Landing page (not authenticated)
  if (currentView === 'landing' && !user) {
    return (
      <>
        <LandingPage 
          onStartFlow={() => setCurrentView('onboarding')}
          onSignIn={handleSignIn}
        />
        <SignInModal
          open={showSignInModal}
          onOpenChange={setShowSignInModal}
          onSignIn={handleSignInSuccess}
        />
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  // Main app content (requires authentication for most views)
  const requiresAuth = currentView !== 'landing' && currentView !== 'test-auth';

  return (
    <>
      {requiresAuth ? (
        <ProtectedRoute>
          <div className="min-h-screen bg-background">
            <div className="flex h-screen">
              <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
                selectedListingId={selectedListingId}
                onListingSelect={handleListingSelect}
                listingHistory={listingHistory}
                userProperties={USER_OWNED_PROPERTY_IDS}
                activeDraftId={activeDraftId}
                onDraftSelect={(draftId) => setActiveDraftId(draftId)}
              />
              
              <main className={`flex-1 overflow-auto transition-all duration-300 ${
                sidebarCollapsed ? 'ml-16' : 'ml-64'
              }`}>
                <AppContent
                  currentView={currentView}
                  selectedListingId={selectedListingId}
                  currentListing={currentListing}
                  showingsFilterListingId={showingsFilterListingId}
                  onShowingsFilter={handleShowingsFilter}
                  onListingSelect={handleListingSelect}
                  onViewChange={handleViewChange}
                  activeDraftId={activeDraftId}
                  savedListingCreationData={savedListingCreationData}
                  savedListingCreationStep={savedListingCreationStep}
                />
              </main>
            </div>
          </div>
        </ProtectedRoute>
      ) : (
        <AppContent
          currentView={currentView}
          selectedListingId={selectedListingId}
          currentListing={currentListing}
          showingsFilterListingId={showingsFilterListingId}
          onShowingsFilter={handleShowingsFilter}
          onListingSelect={handleListingSelect}
          onViewChange={handleViewChange}
          activeDraftId={activeDraftId}
          savedListingCreationData={savedListingCreationData}
          savedListingCreationStep={savedListingCreationStep}
        />
      )}
      
      <Toaster richColors position="bottom-right" />
    </>
  );
}