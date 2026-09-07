'use server';

import { redirect } from 'next/navigation';
import { withTeam } from '@/lib/auth/middleware';
import { getPaymentProvider } from './provider';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { createPayPalCheckout, getPayPalManageUrl } from './paypal';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  if (!priceId) throw new Error('Missing payment price/plan ID.');

  const provider = getPaymentProvider();
  if (provider === 'stripe') {
    await createCheckoutSession({ team, priceId });
    return;
  }

  await createPayPalCheckout({ team, planId: priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  if (team.paymentProvider === 'paypal') {
    redirect(getPayPalManageUrl());
  }

  if (team.paymentProvider === 'stripe' || team.stripeCustomerId) {
    const portalSession = await createCustomerPortalSession(team);
    redirect(portalSession.url);
  }

  redirect('/pricing');
});
