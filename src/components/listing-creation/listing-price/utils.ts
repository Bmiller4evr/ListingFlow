import { SuggestedPriceRange } from './types';

export const formatPrice = (price: string): string => {
  if (!price) return '';
  const numericPrice = parseFloat(price);
  return isNaN(numericPrice) ? '' : numericPrice.toLocaleString();
};

export const cleanPriceInput = (value: string): string => {
  return value.replace(/[^0-9.]/g, '');
};

export const getSuggestedPriceRange = (financialInfo?: any): SuggestedPriceRange | null => {
  if (financialInfo?.desiredSalePrice) {
    const basePrice = financialInfo.desiredSalePrice;
    return {
      low: Math.round(basePrice * 0.95),
      high: Math.round(basePrice * 1.05)
    };
  }
  return null;
};

export const calculateCommissionAmount = (salePrice: string, commissionRate: number): number => {
  const price = parseFloat(salePrice);
  if (isNaN(price)) return 0;
  return price * (commissionRate / 100);
};

export const isFormComplete = (
  videoWatched: boolean, 
  priceSubmitted: boolean, 
  acceptUnrepresentedBuyers: string
): boolean => {
  return videoWatched && priceSubmitted && acceptUnrepresentedBuyers !== '';
};