import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { getPayPalSubscription } from '@/lib/payments/paypal';

function getPlanName(planId: string) {
  if (planId === process.env.PAYPAL_BASE_PLAN_ID) {
    return process.env.PAYPAL_BASE_PLAN_NAME || 'Base';
  }
  if (planId === process.env.PAYPAL_PLUS_PLAN_ID) {
    return process.env.PAYPAL_PLUS_PLAN_NAME || 'Plus';
  }
  return 'PayPal';
}

export async function GET(request: NextRequest) {
  const subscriptionId =
    request.nextUrl.searchParams.get('subscription_id') ||
    request.nextUrl.searchParams.get('token');

  if (!subscriptionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const subscription = await getPayPalSubscription(subscriptionId);
    const teamId = Number(subscription.custom_id);

    if (!Number.isInteger(teamId) || teamId <= 0) {
      throw new Error('PayPal subscription is missing a valid team custom_id.');
    }

    await db
      .update(teams)
      .set({
        paymentProvider: 'paypal',
        paypalSubscriptionId: subscription.id,
        paypalPlanId: subscription.plan_id,
        planName: getPlanName(subscription.plan_id),
        subscriptionStatus: subscription.status.toLowerCase(),
        updatedAt: new Date(),
      })
      .where(eq(teams.id, teamId));

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error handling PayPal checkout:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
