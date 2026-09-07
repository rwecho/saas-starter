export type PaymentProvider = 'stripe' | 'paypal';

function hasValues(...values: Array<string | undefined>) {
  return values.every((value) => Boolean(value?.trim()));
}

export function isStripeConfigured() {
  return hasValues(process.env.STRIPE_SECRET_KEY, process.env.STRIPE_WEBHOOK_SECRET);
}

export function isPayPalConfigured() {
  return hasValues(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET,
    process.env.PAYPAL_WEBHOOK_ID,
    process.env.PAYPAL_BASE_PLAN_ID,
    process.env.PAYPAL_PLUS_PLAN_ID
  );
}

export function getPaymentProvider(): PaymentProvider {
  if (isStripeConfigured()) return 'stripe';
  if (isPayPalConfigured()) return 'paypal';

  throw new Error(
    'No payment provider is configured. Configure Stripe or PayPal environment variables.'
  );
}

export function getConfiguredPaymentProvider(): PaymentProvider | null {
  try {
    return getPaymentProvider();
  } catch {
    return null;
  }
}
