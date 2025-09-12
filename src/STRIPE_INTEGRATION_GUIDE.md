# Stripe Integration Guide for Access Realty

## Overview

The ListingServiceForm now uses Stripe Elements for secure payment processing. This guide covers the setup and implementation details.

## Environment Variables

Add these environment variables to your project:

```bash
# Frontend (.env) - Choose based on your build system:

# For Vite-based projects:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# For Create React App:
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Backend (.env)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

The frontend component automatically detects which environment variable format to use.

## Frontend Implementation

### Key Components

1. **Stripe Elements Integration**
   - Uses `@stripe/stripe-js` and `@stripe/react-stripe-js`
   - Secure card input with `CardElement`
   - PCI compliance handled by Stripe

2. **Payment Flow**
   - **Self Service**: Immediate $399 payment processing
   - **Full Service**: Save payment method for future use (no immediate charge)

3. **Payment Method Storage**
   - Creates Stripe Payment Method
   - Stores Payment Method ID for future transactions
   - Billing address collection for tax compliance

## Backend API Endpoints Needed

### 1. Create Payment Intent (Self Service)
```typescript
POST /api/payments/create-intent
{
  amount: 39900, // $399.00 in cents
  currency: 'usd',
  customer_id: 'cus_...',
  payment_method_id: 'pm_...',
  metadata: {
    service_type: 'self-service',
    user_id: '...',
    listing_id: '...'
  }
}
```

### 2. Save Payment Method (Full Service)
```typescript
POST /api/payments/save-method
{
  customer_id: 'cus_...',
  payment_method_id: 'pm_...',
  set_as_default: true
}
```

### 3. Create Customer (if needed)
```typescript
POST /api/customers/create
{
  email: 'user@example.com',
  name: 'John Doe',
  metadata: {
    user_id: '...'
  }
}
```

## Payment Processing Logic

### Self Service Flow
1. User selects Self Service option
2. Accepts terms of service
3. Enters payment information via Stripe Elements
4. Creates Payment Method with Stripe
5. Backend processes $399 payment immediately
6. Payment Method saved to user account
7. User proceeds to next step

### Full Service Flow
1. User selects Full Service option
2. Accepts terms of service
3. Enters payment information via Stripe Elements
4. Creates Payment Method with Stripe
5. Payment Method saved to user account (no charge)
6. Commission (2.5%) processed at closing via saved method
7. User proceeds to next step

## Security Features

- **PCI Compliance**: Stripe handles all sensitive card data
- **Tokenization**: Only Payment Method IDs stored in database
- **Encryption**: All data encrypted in transit and at rest
- **Webhooks**: Real-time payment status updates

## Error Handling

The frontend handles various error scenarios:

- **Card Declined**: Clear error message with retry option
- **Invalid Card**: Real-time validation feedback
- **Network Issues**: Graceful retry mechanism
- **Incomplete Information**: Form validation before submission

## Webhook Implementation

Set up webhooks for payment status updates:

```typescript
// Webhook endpoint: /api/webhooks/stripe
const handleWebhook = (event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update payment status in database
      // Send confirmation email
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      // Notify user
      break;
    case 'setup_intent.succeeded':
      // Payment method successfully saved
      break;
  }
}
```

## Testing

### Test Cards (Stripe Test Mode)
- **Success**: 4242424242424242
- **Decline**: 4000000000000002
- **Insufficient Funds**: 4000000000009995
- **Require Authentication**: 4000002500003155

### Test Environment Setup
1. Use Stripe test keys for development
2. Test both payment flows (immediate charge vs save method)
3. Verify webhook delivery and processing
4. Test error scenarios

## Production Deployment

### Checklist
- [ ] Replace test keys with live Stripe keys
- [ ] Configure webhook endpoints in Stripe Dashboard
- [ ] Set up SSL/TLS certificates
- [ ] Test payment flows in production environment
- [ ] Monitor payment success rates
- [ ] Set up Stripe Dashboard alerts

## Compliance & Legal

### Requirements
- **PCI DSS**: Handled by Stripe Elements
- **Data Protection**: Payment data never touches your servers
- **Tax Compliance**: Collect billing address for tax calculations
- **Receipts**: Generate receipts for all successful payments

### Audit Trail
- Log all payment attempts (without sensitive data)
- Track payment method changes
- Monitor for unusual activity patterns

## Support & Monitoring

### Key Metrics to Monitor
- Payment success rate
- Average processing time
- Error rates by type
- Customer support inquiries

### Troubleshooting
- Check Stripe Dashboard for payment details
- Review webhook logs for processing issues
- Monitor application logs for frontend errors
- Set up alerts for failed payments

## Future Enhancements

### Potential Features
- **Apple Pay / Google Pay**: One-click payments
- **ACH Payments**: Lower fees for larger amounts
- **Subscription Management**: Recurring payments
- **Multi-party Payments**: Split commission payments
- **International Support**: Multiple currencies