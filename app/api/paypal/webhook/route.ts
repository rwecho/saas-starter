import { NextRequest, NextResponse } from 'next/server';
import {
  assertAllowedPayPalPlan,
  getPayPalPlanName,
  getPayPalSubscription,
  verifyPayPalWebhook,
  type PayPalSubscription,
} from '@/lib/payments/paypal';
import {
  getTeamByPayPalSubscriptionId,
  updateTeamSubscription,
} from '@/lib/db/queries';

async function syncSubscription(subscription: PayPalSubscription) {
  assertAllowedPayPalPlan(subscription.plan_id);

  let teamId = Number(subscription.custom_id);
  if (!Number.isInteger(teamId) || teamId <= 0) {
    const existingTeam = await getTeamByPayPalSubscriptionId(subscription.id);
    if (!existingTeam) return;
    teamId = existingTeam.id;
  }

  await updateTeamSubscription(teamId, {
    paymentProvider: 'paypal',
    paypalSubscriptionId: subscription.id,
    paypalPlanId: subscription.plan_id,
    planName: getPayPalPlanName(subscription.plan_id),
    subscriptionStatus: subscription.status.toLowerCase(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    const verified = await verifyPayPalWebhook(request.headers, event);
    if (!verified) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const eventType = String(event.event_type || '');
    if (!eventType.startsWith('BILLING.SUBSCRIPTION.')) {
      return NextResponse.json({ received: true });
    }

    const resource = event.resource as PayPalSubscription | undefined;
    const subscriptionId = resource?.id;
    if (!subscriptionId) {
      return NextResponse.json({ received: true });
    }

    // Fetch canonical state from PayPal instead of trusting the webhook payload.
    const subscription = await getPayPalSubscription(subscriptionId);
    await syncSubscription(subscription);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
