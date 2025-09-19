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

    // Check if we should start listing flow
    const shouldStartListing = localStorage.getItem('startListingFlow');
    if (shouldStartListing === 'true') {
      localStorage.removeItem('startListingFlow');
      setSavedListingCreationData({ basicInfo: {} });
      setSavedListingCreationStep('basic-info');
      setCurrentView('listing-creation');
    }
  }, []);

  const handleSignIn = () => {
    // Skip sign in modal - go directly to dashboard for testing
    setCurrentView('listings');
  };

  const handleSignInSuccess = (userEmail?: string) => {
    console.log('handleSignInSuccess called with email:', userEmail);
    setShowSignInModal(false);

    // Check if this might be a new user (we can't easily distinguish here)
    // So let's set the flag to be safe - the auth monitor will handle it
    setNewUserJustSignedUp(true);

    setCurrentView('listings');
  };

  // Add a flag to track if user just signed up
  const [newUserJustSignedUp, setNewUserJustSignedUp] = useState(false);

  // Monitor authentication state changes for new signups
  useEffect(() => {
    if (user && newUserJustSignedUp) {
      // Force redirect new users to dashboard regardless of any other navigation
      console.log('New user detected - forcing redirect to dashboard');
      setCurrentView('listings');
      setNewUserJustSignedUp(false);
    }
  }, [user, newUserJustSignedUp]);

  // Also monitor for ANY new user authentication
  useEffect(() => {
    if (user) {
      console.log('User authenticated:', user.email);
      // Check if this user was created recently (within last 30 seconds)
      const userCreatedAt = new Date(user.created_at);
      const now = new Date();
      const timeDiff = now.getTime() - userCreatedAt.getTime();
      const thirtySeconds = 30 * 1000;

      if (timeDiff < thirtySeconds) {
        console.log('Detected newly created user - forcing redirect to dashboard');
        setCurrentView('listings');
      }
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    console.log('handleOnboardingComplete called - new user just signed up');

    // Mark that a new user just signed up
    setNewUserJustSignedUp(true);

    // Clear onboarding data first
    setSavedOnboardingData(undefined);
    setSavedOnboardingStep(undefined);

    // Clean up any stored address since onboarding is complete
    try {
      window.localStorage.removeItem('verifiedAddress');
    } catch (error) {
      console.error('Error cleaning up stored address:', error);
    }

    // Use setTimeout to ensure state updates happen in the correct order
    setTimeout(() => {
      // Send new users directly to dashboard instead of listing creation
      console.log('Setting current view to: listings (dashboard)');
      setCurrentView('listings');
    }, 0);
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
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, step as any, data);
    setSavedListingCreationData(data);
    setSavedListingCreationStep(step);
  };

  const handleOnboardingExit = () => {
    setSavedOnboardingData(undefined);
    setSavedOnboardingStep(undefined);
    setCurrentView('landing');
  };

  const handleStartListingFlow = () => {
    // Start listing creation flow directly
    setSavedListingCreationData({ basicInfo: {} });
    setSavedListingCreationStep('basic-info');
    setCurrentView('listing-creation');
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

  // Listing creation flow (no authentication required for testing)
  if (currentView === 'listing-creation' && savedListingCreationStep) {
    console.log('Rendering ListingCreationFlow with step:', savedListingCreationStep, 'and data:', savedListingCreationData);
    return (
      <>
        <ListingCreationFlow
          onComplete={handleListingCreationComplete}
          onExit={handleListingCreationExit}
          initialStep={savedListingCreationStep}
          initialData={savedListingCreationData}
        />
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  // Debug: Log when listing creation view is requested but step is missing
  if (currentView === 'listing-creation' && !savedListingCreationStep) {
    console.log('ERROR: listing-creation view requested but no step set. Falling back to listings view.');
    console.log('Current state - View:', currentView, 'Step:', savedListingCreationStep, 'Data:', savedListingCreationData);
    // Auto-redirect to listings view instead of showing empty content
    setTimeout(() => setCurrentView('listings'), 0);
  }

  // Landing page (not authenticated)
  if (currentView === 'landing' && !user) {
    return (
      <>
        <LandingPage 
          onStartFlow={() => setCurrentView('onboarding')}
          onSignIn={handleSignIn}
        />
{/* SignInModal removed for testing */}
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  // Main app content (requires authentication for most views)
  const requiresAuth = currentView !== 'landing' && currentView !== 'test-auth';

  return (
    <>
      {/* Remove all authentication requirements for testing */}
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          <Sidebar
            activeView={currentView}
            onMenuClick={handleViewChange}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            userEmail={user?.email}
            onSignOut={() => {
              // Add logout functionality here
              console.log('Logout clicked');
            }}
            isMobile={isMobile}
          />

          <main className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}>
            <AppContent
              currentView={currentView}
              listingHistory={listingHistory}
              handleBackToListing={() => {
                if (listingHistory.length > 0) {
                  const previousListing = listingHistory[0];
                  handleListingSelect(previousListing);
                  setCurrentView('listing-detail');
                }
              }}
              handleBackToHome={() => setCurrentView('listings')}
              handleMenuClick={handleViewChange}
              setShowSignInModal={setShowSignInModal}
              handleLandingFlow={() => setCurrentView('onboarding')}
              handleStartListingFlow={handleStartListingFlow}
              handleCompleteOnboarding={handleOnboardingComplete}
              handleExitOnboarding={handleOnboardingExit}
              savedOnboardingStep={savedOnboardingStep}
              savedOnboardingData={savedOnboardingData}
              handleCompleteListingCreation={handleListingCreationComplete}
              handleExitListingCreation={handleListingCreationExit}
              savedListingCreationStep={savedListingCreationStep}
              savedListingCreationData={savedListingCreationData}
              handleViewListing={(id) => {
                handleListingSelect(id);
                setCurrentView('listing-detail');
              }}
              handleResumeDraft={(listingId, lastStep, draftData) => {
                setSavedListingCreationData(draftData);
                setSavedListingCreationStep(lastStep as ListingCreationStep);
                setCurrentView('listing-creation');
              }}
              currentListing={currentListing}
              isCurrentListingOwned={USER_OWNED_PROPERTY_IDS.includes(selectedListingId || '')}
              handleViewShowingsForListing={(listingId) => {
                setShowingsFilterListingId(listingId);
                setCurrentView('showings');
              }}
              showingsFilterListingId={showingsFilterListingId}
            />
          </main>
        </div>
      </div>

      <Toaster richColors position="bottom-right" />
    </>
  );
}