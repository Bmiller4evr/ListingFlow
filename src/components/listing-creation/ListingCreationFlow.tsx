import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { BasicInformationForm, BasicInformationData } from "./BasicInformationForm";
import { ListingServiceForm, ListingServiceData } from "./ListingServiceForm";
import { TitleHolderInfoForm } from "./TitleHolderInfoForm";
import { SellerDisclosureForm } from "./SellerDisclosureForm";
import { FinancialInfoForm } from "./FinancialInfoForm";
import { AdditionalInformationForm, AdditionalInformationData } from "./AdditionalInformationForm";
import { SecureAccessForm } from "./SecureAccessForm";
import { PropertyMediaForm } from "./PropertyMediaForm";
import { ListingPriceForm } from "./ListingPriceForm";


import { ReviewSignPaperworkForm } from "./ReviewSignPaperworkForm";
import { ListingCreationSuccess } from "./ListingCreationSuccess";
import { UserAccountData } from "../onboarding/AccountConfirmationForm";
import { ListingCreationStep } from "../../types/app";
import { saveDraftListingData } from "../../utils/draftStorage";

export interface ListingCreationData {
  basicInfo?: BasicInformationData;
  listingService?: ListingServiceData;
  titleHolder?: any;
  sellerDisclosure?: any;
  financialInfo?: any;
  additionalInfo?: AdditionalInformationData;
  secureAccess?: any;
  propertyMedia?: any;
  listingPrice?: any;
  signPaperwork?: any;
}

interface ListingCreationFlowProps {
  onComplete: () => void;
  onExit: () => void;
  initialStep?: ListingCreationStep;
  initialData?: ListingCreationData;
  userAccount?: UserAccountData;
}

const STEP_ORDER: ListingCreationStep[] = [
  'basic-info',
  'listing-service',
  'titleholder-information',
  'mortgages-taxes-liens',
  'sellers-disclosure', 
  'additional-information',
  'showing-access',
  'property-media',
  'listing-price',
  'sign-paperwork',
  'success'
];

export function ListingCreationFlow({
  onComplete,
  onExit,
  initialStep = 'basic-info',
  initialData = {},
  userAccount
}: ListingCreationFlowProps) {
  const [currentStep, setCurrentStep] = useState<ListingCreationStep>(initialStep);
  const [listingData, setListingData] = useState<ListingCreationData>(initialData);

  const updateStep = (step: ListingCreationStep) => {
    setCurrentStep(step);

    // Save progress to draft (cast step to any to bypass type mismatch)
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, step as any, listingData as any);
  };

  const getNextStep = (currentStep: ListingCreationStep): ListingCreationStep | null => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === STEP_ORDER.length - 1) {
      return null;
    }
    return STEP_ORDER[currentIndex + 1];
  };

  const getPreviousStep = (currentStep: ListingCreationStep): ListingCreationStep | null => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === 0) {
      return null;
    }
    return STEP_ORDER[currentIndex - 1];
  };

  const handleBack = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      updateStep(previousStep);
    }
  };

  const handleExit = () => {
    // Save current progress before exiting
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, currentStep as any, listingData as any);
    onExit();
  };

  const handleBasicInfoComplete = (basicInfoData: BasicInformationData) => {
    const updatedData = { ...listingData, basicInfo: basicInfoData };
    setListingData(updatedData);

    // Save progress and return to listings page (dashboard)
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'basic-info' as any, updatedData as any);
    onComplete();
  };

  const handleListingServiceComplete = (listingServiceData: ListingServiceData) => {
    const updatedData = { ...listingData, listingService: listingServiceData };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'listing-service' as any, updatedData as any);
    onComplete();
  };

  const handleTitleHolderComplete = (titleHolder: any) => {
    const updatedData = { ...listingData, titleHolder };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'titleholder-information' as any, updatedData as any);
    onComplete();
  };

  const handleSellerDisclosureComplete = (sellerDisclosure: any) => {
    const updatedData = { ...listingData, sellerDisclosure };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'sellers-disclosure' as any, updatedData as any);
    onComplete();
  };

  const handleAdditionalInformationComplete = (additionalInfo: AdditionalInformationData) => {
    const updatedData = { ...listingData, additionalInfo };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'additional-information' as any, updatedData as any);
    onComplete();
  };


  const handleFinancialInfoComplete = (financialInfo: any) => {
    const updatedData = { ...listingData, financialInfo };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'mortgages-taxes-liens' as any, updatedData as any);
    onComplete();
  };

  const handleSecureAccessComplete = (secureAccess: any) => {
    const updatedData = { ...listingData, secureAccess };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'showing-access' as any, updatedData as any);
    onComplete();
  };

  const handlePropertyMediaComplete = (propertyMedia: any) => {
    const updatedData = { ...listingData, propertyMedia };
    setListingData(updatedData);
    
    const nextStep = getNextStep('property-media');
    if (nextStep) {
      updateStep(nextStep);
    }
  };

  const handleListingPriceComplete = (listingPrice: any) => {
    const updatedData = { ...listingData, listingPrice };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'listing-price' as any, updatedData as any);
    onComplete();
  };





  const handleSignPaperworkComplete = (signPaperwork: any) => {
    const updatedData = { ...listingData, signPaperwork };
    setListingData(updatedData);
    
    // Save progress and return to listings page
    const draftId = `listing-${Date.now()}`;
    saveDraftListingData(draftId, 'sign-paperwork' as any, updatedData as any);
    onComplete();
  };



  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md p-6 sm:p-8">
        {currentStep === 'basic-info' && (
          <BasicInformationForm
            onNext={handleBasicInfoComplete}
            onExit={handleExit}
            initialData={listingData.basicInfo}
            isNewUser={listingData.basicInfo?._fromOnboardingWithAddress || false}
          />
        )}

        {currentStep === 'listing-service' && (
          <ListingServiceForm
            onNext={handleListingServiceComplete}
            onExit={handleExit}
            initialData={listingData.listingService}
            userAccount={userAccount}
          />
        )}

        {currentStep === 'titleholder-information' && (
          <TitleHolderInfoForm
            onNext={handleTitleHolderComplete}
            onExit={handleExit}
            initialData={listingData.titleHolder}
            userAccount={userAccount}
          />
        )}

        {currentStep === 'sellers-disclosure' && (
          <SellerDisclosureForm
            onNext={handleSellerDisclosureComplete}
            onExit={handleExit}
            initialData={listingData.sellerDisclosure}
          />
        )}

        {currentStep === 'additional-information' && (
          <AdditionalInformationForm
            onNext={handleAdditionalInformationComplete}
            onExit={handleExit}
            initialData={listingData.additionalInfo}
          />
        )}


        {currentStep === 'mortgages-taxes-liens' && (
          <FinancialInfoForm
            onNext={handleFinancialInfoComplete}
            onExit={handleExit}
            initialData={listingData.financialInfo}
            homeFacts={listingData.basicInfo}
          />
        )}

        {currentStep === 'showing-access' && (
          <SecureAccessForm
            onNext={handleSecureAccessComplete}
            onExit={handleExit}
            initialData={listingData.secureAccess}
          />
        )}

        {currentStep === 'property-media' && (
          <PropertyMediaForm
            onNext={handlePropertyMediaComplete}
            onExit={handleExit}
            initialData={listingData.propertyMedia}
          />
        )}

        {currentStep === 'listing-price' && (
          <ListingPriceForm
            onNext={handleListingPriceComplete}
            onExit={handleExit}
            initialData={listingData.listingPrice}
            homeFacts={listingData.basicInfo}
            financialInfo={listingData.financialInfo}
          />
        )}





        {currentStep === 'sign-paperwork' && (
          <ReviewSignPaperworkForm
            onNext={handleSignPaperworkComplete}
            onExit={handleExit}
            initialData={listingData.signPaperwork}
          />
        )}

        {currentStep === 'success' && (
          <ListingCreationSuccess
            onComplete={onComplete}
            listingData={listingData}
            propertySpecs={listingData.basicInfo?.propertySpecs}
            userAccount={userAccount}
            address={listingData.basicInfo?.address}
          />
        )}
      </Card>
    </div>
  );
}