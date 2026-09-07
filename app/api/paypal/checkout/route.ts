import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import {
  assertAllowedPayPalPlan,
  getPayPalPlanName,
  getPayPalSubscription,
} from '@/lib/payments/paypal';

export async function GET(request: NextRequest) {
  const subscriptionId =
    request.nextUrl.searchParams.get('subscription_id') ||
    request.nextUrl.searchParams.get('token');

  if (!subscriptionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const subscription = await getPayPalSubscription(subscriptionId);
    assertAllowedPayPalPlan(subscription.plan_id);

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
        planName: getPayPalPlanName(subscription.plan_id),
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
