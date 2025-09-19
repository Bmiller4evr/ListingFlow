import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Documents } from "./Documents";
import { Showings } from "./Showings";
import { TodoList } from "./TodoList";

import { Account } from "./Account";
import { RepairsHelp } from "./RepairsHelp";
import { Messages } from "./Messages";
import { Offers } from "./Offers";



import { FindNextHome } from "./tools/FindNextHome";

import { LandingPage } from "./LandingPage";
import { TestAuth } from "./TestAuth";


import { OnboardingFlow, PropertyListingData } from "./onboarding/OnboardingFlow";
import { ListingCreationFlow } from "./listing-creation/ListingCreationFlow";
import { DashboardHeader } from "./DashboardHeader";
import { PropertyListings } from "./PropertyListings";
import { ListingDetail } from "./listing-detail/ListingDetail";
import { View, OnboardingStep, ListingCreationStep } from "../types/app";

interface AppContentProps {
  currentView: View;
  listingHistory: string[];
  handleBackToListing: () => void;
  handleBackToHome: () => void;
  handleMenuClick: (view: View) => void;
  setShowSignInModal: (show: boolean) => void;
  handleLandingFlow: () => void;
  handleStartListingFlow: () => void;
  handleCompleteOnboarding: () => void;
  handleExitOnboarding: () => void;
  savedOnboardingStep?: OnboardingStep;
  savedOnboardingData?: PropertyListingData;
  handleCompleteListingCreation: () => void;
  handleExitListingCreation: () => void;
  savedListingCreationStep?: ListingCreationStep;
  savedListingCreationData?: any;
  handleViewListing: (id: string) => void;
  handleResumeDraft: (listingId: string, lastStep?: string, draftData?: any) => void;
  currentListing: any;
  isCurrentListingOwned: boolean;
  handleViewShowingsForListing: (listingId: string) => void;
  showingsFilterListingId: string | null;
}

export function AppContent({
  currentView,
  listingHistory,
  handleBackToListing,
  handleBackToHome,
  handleMenuClick,
  setShowSignInModal,
  handleLandingFlow,
  handleStartListingFlow,
  handleCompleteOnboarding,
  handleExitOnboarding,
  savedOnboardingStep,
  savedOnboardingData,
  handleCompleteListingCreation,
  handleExitListingCreation,
  savedListingCreationStep,
  savedListingCreationData,
  handleViewListing,
  handleResumeDraft,
  currentListing,
  isCurrentListingOwned,
  handleViewShowingsForListing,
  showingsFilterListingId,
}: AppContentProps) {
  return (
    <>
      {currentView === 'listing-detail' && (
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 flex items-center"
          onClick={listingHistory.length > 0 ? handleBackToListing : handleBackToHome}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {listingHistory.length > 0 ? "Back to Previous Listing" : "Back to Home"}
        </Button>
      )}
      
      {currentView === 'documents' && (
        <>
          <DashboardHeader currentView={currentView} />
          <Documents />
        </>
      )}
      {currentView === 'showings' && (
        <>
          <DashboardHeader currentView={currentView} />
          <Showings filterListingId={showingsFilterListingId} />
        </>
      )}
      {currentView === 'todo' && (
        <>
          <DashboardHeader currentView={currentView} />
          <TodoList />
        </>
      )}
      {currentView === 'offers' && (
        <>
          <DashboardHeader currentView={currentView} />
          <Offers />
        </>
      )}
      {currentView === 'account' && (
        <>
          <DashboardHeader currentView={currentView} />
          <Account />
        </>
      )}
      {currentView === 'repairs' && (
        <>
          <DashboardHeader currentView={currentView} />
          <RepairsHelp />
        </>
      )}
      {currentView === 'messages' && (
        <>
          <DashboardHeader currentView={currentView} />
          <Messages />
        </>
      )}
      
      {/* Tool pages */}
      {currentView === 'find-home' && (
        <>
          <DashboardHeader currentView={currentView} />
          <FindNextHome onBack={handleBackToHome} />
        </>
      )}
      
      {currentView === 'landing' && (
        <LandingPage 
          onStartFlow={handleLandingFlow}
          onSignIn={() => setShowSignInModal(true)}
        />
      )}

      {currentView === 'test-auth' && (
        <TestAuth />
      )}

      
      {currentView === 'onboarding' && (
        <OnboardingFlow 
          onComplete={handleCompleteOnboarding}
          onExit={handleExitOnboarding}
          initialStep={savedOnboardingStep}
          initialData={savedOnboardingData}
        />
      )}

      {currentView === 'listing-creation' && savedListingCreationStep && (
        <ListingCreationFlow
          onComplete={handleCompleteListingCreation}
          onExit={handleExitListingCreation}
          initialStep={savedListingCreationStep}
          initialData={savedListingCreationData}
          userAccount={savedOnboardingData?.account}
        />
      )}

      {currentView === 'listing-creation' && !savedListingCreationStep && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Setting up your listing creation...</p>
          </div>
        </div>
      )}
      
      {currentView === 'listings' && (
        <>
          <DashboardHeader currentView={currentView} />
          <PropertyListings
            onViewListing={handleViewListing}
            onStartListingFlow={handleStartListingFlow}
            onResumeDraft={handleResumeDraft}
          />
        </>
      )}
      
      {currentView === 'listing-detail' && (
        <ListingDetail 
          listing={currentListing} 
          isOwner={isCurrentListingOwned}
          onNavigateToShowings={() => handleViewShowingsForListing(currentListing.id)}
          onNavigateToOffers={() => handleMenuClick('offers')}
        />
      )}


    </>
  );
}