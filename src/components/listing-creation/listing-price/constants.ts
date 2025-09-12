export const LISTING_PRICE_STEPS = {
  VIDEO: 'video',
  PRICE_SUBMISSION: 'price-submission',
  UNREPRESENTED_BUYERS: 'unrepresented-buyers',
  BUYER_COMMISSION: 'buyer-commission'
} as const;

export const COMMISSION_RANGES = {
  MIN: 0,
  MAX: 3,
  STEP: 0.25,
  DEFAULT: 2.5
} as const;

export const COMMISSION_GUIDELINES = [
  { range: '2.5-3%', description: 'Market standard, attracts most buyer\'s agents' },
  { range: '2-2.25%', description: 'Lower rate, may reduce agent interest' },
  { range: '0-1.5%', description: 'Very low rate, significantly limits buyer agent participation' }
];

export const VIDEO_CONFIG = {
  DURATION_MINUTES: 4,
  COMPLETION_DELAY_MS: 4000,
  TITLE: 'Pricing is Paramount',
  DESCRIPTION: 'Learn how strategic pricing affects your home\'s time on market, final sale price, and overall success. Understand market dynamics and pricing psychology.'
};