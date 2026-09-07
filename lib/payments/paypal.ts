import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

export type PayPalSubscription = {
  id: string;
  plan_id: string;
  custom_id?: string;
  status: string;
  links?: Array<{ href: string; rel: string; method?: string }>;
};

function isLiveEnvironment() {
  return process.env.PAYPAL_ENVIRONMENT === 'live';
}

function getPayPalBaseUrl() {
  return isLiveEnvironment()
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getAllowedPayPalPlanIds() {
  return [required('PAYPAL_BASE_PLAN_ID'), required('PAYPAL_PLUS_PLAN_ID')];
}

export function assertAllowedPayPalPlan(planId: string) {
  if (!getAllowedPayPalPlanIds().includes(planId)) {
    throw new Error('Unsupported PayPal plan ID.');
  }
}

export function getPayPalPlanName(planId: string) {
  if (planId === process.env.PAYPAL_BASE_PLAN_ID) {
    return process.env.PAYPAL_BASE_PLAN_NAME || 'Base';
  }
  if (planId === process.env.PAYPAL_PLUS_PLAN_ID) {
    return process.env.PAYPAL_PLUS_PLAN_NAME || 'Plus';
  }
  throw new Error('Unsupported PayPal plan ID.');
}

export async function getPayPalAccessToken() {
  const clientId = required('PAYPAL_CLIENT_ID');
  const clientSecret = required('PAYPAL_CLIENT_SECRET');
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`PayPal access token request failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

async function paypalFetch<T>(path: string, init: RequestInit = {}) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal API request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

export async function createPayPalCheckout({
  team,
  planId,
}: {
  team: Team | null;
  planId: string;
}) {
  assertAllowedPayPalPlan(planId);

  const user = await getUser();
  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${encodeURIComponent(planId)}`);
  }

  const subscription = await paypalFetch<PayPalSubscription>(
    '/v1/billing/subscriptions',
    {
      method: 'POST',
      headers: {
        'PayPal-Request-Id': `team-${team.id}-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        custom_id: String(team.id),
        subscriber: {
          email_address: user.email,
        },
        application_context: {
          brand_name: process.env.PAYPAL_BRAND_NAME || 'SaaS Starter',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.BASE_URL}/api/paypal/checkout`,
          cancel_url: `${process.env.BASE_URL}/pricing`,
        },
      }),
    }
  );

  const approvalUrl = subscription.links?.find((link) => link.rel === 'approve')?.href;
  if (!approvalUrl) throw new Error('PayPal did not return an approval URL.');

  redirect(approvalUrl);
}

export async function getPayPalSubscription(subscriptionId: string) {
  return paypalFetch<PayPalSubscription>(
    `/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`
  );
}

export async function verifyPayPalWebhook(
  headers: Headers,
  webhookEvent: unknown
) {
  const webhookId = required('PAYPAL_WEBHOOK_ID');

  const result = await paypalFetch<{ verification_status: string }>(
    '/v1/notifications/verify-webhook-signature',
    {
      method: 'POST',
      body: JSON.stringify({
        auth_algo: headers.get('paypal-auth-algo'),
        cert_url: headers.get('paypal-cert-url'),
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_sig: headers.get('paypal-transmission-sig'),
        transmission_time: headers.get('paypal-transmission-time'),
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    }
  );

  return result.verification_status === 'SUCCESS';
}

export function getPayPalPlans() {
  return [
    {
      id: required('PAYPAL_BASE_PLAN_ID'),
      productId: 'paypal-base',
      name: process.env.PAYPAL_BASE_PLAN_NAME || 'Base',
      description: null,
      unitAmount: Number(process.env.PAYPAL_BASE_PRICE_CENTS || 800),
      currency: (process.env.PAYPAL_CURRENCY || 'USD').toLowerCase(),
      interval: process.env.PAYPAL_BILLING_INTERVAL || 'month',
      trialPeriodDays: Number(process.env.PAYPAL_TRIAL_DAYS || 7),
    },
    {
      id: required('PAYPAL_PLUS_PLAN_ID'),
      productId: 'paypal-plus',
      name: process.env.PAYPAL_PLUS_PLAN_NAME || 'Plus',
      description: null,
      unitAmount: Number(process.env.PAYPAL_PLUS_PRICE_CENTS || 1200),
      currency: (process.env.PAYPAL_CURRENCY || 'USD').toLowerCase(),
      interval: process.env.PAYPAL_BILLING_INTERVAL || 'month',
      trialPeriodDays: Number(process.env.PAYPAL_TRIAL_DAYS || 7),
    },
  ];
}

export function getPayPalManageUrl() {
  if (process.env.PAYPAL_MANAGE_SUBSCRIPTIONS_URL) {
    return process.env.PAYPAL_MANAGE_SUBSCRIPTIONS_URL;
  }

  return isLiveEnvironment()
    ? 'https://www.paypal.com/myaccount/autopay/'
    : 'https://www.sandbox.paypal.com/myaccount/autopay/';
}
