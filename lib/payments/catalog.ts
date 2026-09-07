import { getPaymentProvider } from './provider';
import { getPayPalPlans } from './paypal';
import { getStripePrices, getStripeProducts } from './stripe';

export type PricingPlan = {
  id?: string;
  name: string;
  description: string | null;
  unitAmount: number;
  currency: string;
  interval: string;
  trialPeriodDays: number;
};

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const provider = getPaymentProvider();

  if (provider === 'paypal') {
    return getPayPalPlans().map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      unitAmount: plan.unitAmount,
      currency: plan.currency,
      interval: plan.interval,
      trialPeriodDays: plan.trialPeriodDays,
    }));
  }

  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  return products.map((product) => {
    const price = prices.find((candidate) => candidate.productId === product.id);
    return {
      id: price?.id,
      name: product.name,
      description: product.description,
      unitAmount: price?.unitAmount || 0,
      currency: price?.currency || 'usd',
      interval: price?.interval || 'month',
      trialPeriodDays: price?.trialPeriodDays || 0,
    };
  });
}
