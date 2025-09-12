export const triggerConfetti = async () => {
  try {
    const confetti = (await import('canvas-confetti')).default;
    
    // Trigger multiple bursts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Second burst with different settings
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);
    
    // Third burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 500);
  } catch (error) {
    console.error('Error loading confetti:', error);
  }
};

export const getCardTitle = (currentCard: number): string => {
  switch (currentCard) {
    case 0: return 'Seller Disclosure Exemption Check';
    case 1: return 'Property Features & Appliances';
    case 2: return 'Property Systems';
    case 3: return 'Roof Information';
    case 4: return 'Smoke Detectors';
    case 5: return 'Known Defects';
    case 6: return 'Defect Descriptions';
    case 7: return 'Known Conditions';
    case 8: return 'Condition Explanations';
    case 9: return 'Disclosure Summary';
    case 10: return 'Repair Needs';
    case 11: return 'FEMA Flood Map';
    case 12: return 'Flood Insurance & Previous Flooding';
    case 13: return '100-Year Floodplain';
    case 14: return '500-Year Floodplain';
    case 15: return 'Floodway';
    case 16: return 'Flood Pool';
    case 17: return 'Reservoir';
    case 18: return 'Insurance Claims';
    case 19: return 'FEMA/SBA Assistance';
    case 20: return 'Additional Seller Awareness';
    case 21: return 'Additional Awareness Explanations';
    default: return 'Seller Disclosure';
  }
};

export const getButtonText = (currentCard: number, exemptionStatus: string, formData: any, totalCards: number): string => {
  if (currentCard === 0 && exemptionStatus && exemptionStatus !== 'none') {
    return "Complete";
  } else if (currentCard === 21 && formData.additionalAwareness.length === 0) {
    return "Complete";
  } else if (currentCard === totalCards) {
    return "Complete";
  } else {
    return 'Continue';
  }
};

export const getButtonStyling = (currentCard: number, exemptionStatus: string, formData: any, totalCards: number): string => {
  if (currentCard === 0 && exemptionStatus && exemptionStatus !== 'none') {
    return "bg-success hover:bg-success-hover text-success-foreground";
  } else if (currentCard === 21 && formData.additionalAwareness.length === 0) {
    return "bg-success hover:bg-success-hover text-success-foreground";
  } else if (currentCard === totalCards) {
    return "bg-success hover:bg-success-hover text-success-foreground";
  } else {
    return '';
  }
};