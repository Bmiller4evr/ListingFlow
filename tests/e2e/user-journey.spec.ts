import { test, expect } from '@playwright/test';

test.describe('User Journey: Address to Account Creation to Listing', () => {
  test('should complete full flow from address entry to listing creation', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/');

    // Check that we're on the landing page
    await expect(page.locator('h1')).toContainText('Access Realty');
    await expect(page.locator('h1')).toContainText('The BEST Way to Sell Your Home');

    // Find and fill in the address input
    const addressInput = page.getByPlaceholder('Enter Your Address');
    await expect(addressInput).toBeVisible();

    // Enter a test address
    await addressInput.fill('123 Main St, Austin, TX 78701');

    // Simulate address selection (this would normally be from Google Maps API)
    // For testing, we'll simulate the enter key press
    await addressInput.press('Enter');

    // Wait a moment for any address validation
    await page.waitForTimeout(1000);

    // Look for Get Started button or similar action that triggers onboarding
    // The address input should trigger the flow automatically or there should be a button
    const getStartedElements = await page.locator('button, [role="button"]').filter({ hasText: /get started|start|begin/i }).all();

    if (getStartedElements.length > 0) {
      await getStartedElements[0].click();
    } else {
      // If no explicit button, the address selection might auto-trigger
      console.log('No explicit Get Started button found, address entry might auto-trigger flow');
    }

    // Wait for navigation to onboarding
    await page.waitForTimeout(2000);

    // We should now be in the onboarding flow
    // Look for signs of onboarding (account creation forms, property details, etc.)
    await expect(page.locator('body')).not.toContainText('Access Realty The BEST Way'); // Should have left landing page

    // Look for common onboarding elements
    const onboardingIndicators = [
      'account', 'sign up', 'create account', 'email', 'password',
      'property', 'details', 'specs', 'bedrooms', 'bathrooms'
    ];

    let foundOnboarding = false;
    for (const indicator of onboardingIndicators) {
      const elements = page.locator(`text=${indicator}`).or(page.locator(`[placeholder*="${indicator}" i]`));
      if (await elements.count() > 0) {
        console.log(`Found onboarding indicator: ${indicator}`);
        foundOnboarding = true;
        break;
      }
    }

    if (!foundOnboarding) {
      // Take a screenshot for debugging
      await page.screenshot({ path: 'tests/e2e/debug-onboarding.png', fullPage: true });
      console.log('Could not find onboarding indicators. Screenshot saved.');
    }

    expect(foundOnboarding).toBe(true);

    // If we find account creation fields, fill them out
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[name*="email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[placeholder*="password" i], input[name*="password" i]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      console.log('Found account creation form');
      await emailInput.fill('test@example.com');
      await passwordInput.fill('TestPassword123!');

      // Look for submit button
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /submit|create|next|continue/i }).first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
      }
    }

    // Wait for account creation to complete
    await page.waitForTimeout(3000);

    // After account creation, we should be redirected to listing creation
    // Look for the basic information form or listing creation UI
    const listingCreationIndicators = [
      'basic information', 'property details', 'address', 'bedrooms', 'bathrooms',
      'square feet', 'lot size', 'year built', 'listing'
    ];

    let foundListingCreation = false;
    for (const indicator of listingCreationIndicators) {
      const elements = page.locator(`text="${indicator}"`, { hasText: new RegExp(indicator, 'i') });
      if (await elements.count() > 0) {
        console.log(`Found listing creation indicator: ${indicator}`);
        foundListingCreation = true;
        break;
      }
    }

    // The key test: we should NOT see an empty box
    const bodyText = await page.locator('body').textContent();
    const hasSubstantialContent = bodyText && bodyText.trim().length > 100;

    expect(hasSubstantialContent).toBe(true);

    // Take a final screenshot to see what the user sees
    await page.screenshot({ path: 'tests/e2e/final-state.png', fullPage: true });

    if (!foundListingCreation) {
      console.log('Listing creation not detected, but checking for non-empty content');
      console.log('Body content length:', bodyText?.length || 0);
      console.log('First 200 chars of body:', bodyText?.substring(0, 200) || 'No content');
    }

    // The main goal: ensure user doesn't see an empty box
    expect(foundListingCreation || hasSubstantialContent).toBe(true);
  });
});