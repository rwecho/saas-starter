# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with authentication, subscription payments, and a dashboard for logged-in users.

## Features

- Marketing landing page (`/`)
- Pricing page (`/pricing`)
- Stripe subscriptions with Stripe Customer Portal
- PayPal subscriptions as a fallback payment provider
- Configuration-driven provider selection: Stripe first, PayPal fallback
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Email/password authentication with JWTs stored in cookies
- Global middleware to protect logged-in routes
- Activity logging system

## Tech Stack

- **Framework**: Next.js
- **Database**: Postgres
- **ORM**: Drizzle
- **Payments**: Stripe + PayPal
- **UI**: shadcn/ui

## Payment Provider Selection

The application automatically chooses a payment provider from environment configuration:

1. If Stripe is fully configured, Stripe is used.
2. Otherwise, if PayPal is fully configured, PayPal is used.
3. If neither provider is configured, checkout fails with an explicit configuration error.

When both Stripe and PayPal are configured, **Stripe always has priority**.

## Getting Started

```bash
git clone https://github.com/rwecho/saas-starter
cd saas-starter
pnpm install
pnpm db:setup
pnpm db:migrate
pnpm db:seed
pnpm dev
```

`pnpm db:setup` now supports either a Stripe-only or PayPal-only local setup.

## Stripe Configuration

```env
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***
```

Stripe webhook endpoint:

```text
https://yourdomain.com/api/stripe/webhook
```

For local Stripe testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## PayPal Configuration

```env
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_CLIENT_ID=***
PAYPAL_CLIENT_SECRET=***
PAYPAL_WEBHOOK_ID=***
PAYPAL_BASE_PLAN_ID=P-***
PAYPAL_PLUS_PLAN_ID=P-***

PAYPAL_BASE_PLAN_NAME=Base
PAYPAL_PLUS_PLAN_NAME=Plus
PAYPAL_BASE_PRICE_CENTS=800
PAYPAL_PLUS_PRICE_CENTS=1200
PAYPAL_CURRENCY=USD
PAYPAL_BILLING_INTERVAL=month
PAYPAL_TRIAL_DAYS=7
```

PayPal webhook endpoint:

```text
https://yourdomain.com/api/paypal/webhook
```

Recommended PayPal subscription webhook events:

- `BILLING.SUBSCRIPTION.CREATED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.UPDATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

The PayPal webhook handler verifies the PayPal signature and then fetches the canonical subscription state from PayPal before updating the database.

## Database

The `teams` table stores provider-neutral subscription state plus provider-specific identifiers:

- `paymentProvider`
- `stripeCustomerId`
- `stripeSubscriptionId`
- `stripeProductId`
- `paypalSubscriptionId`
- `paypalPlanId`
- `planName`
- `subscriptionStatus`

Run migrations after updating:

```bash
pnpm db:migrate
```

## Testing

Stripe test card:

```text
4242 4242 4242 4242
```

For PayPal, use sandbox buyer and merchant accounts and configure `PAYPAL_ENVIRONMENT=sandbox`.

## Production Checklist

- Set `BASE_URL` to the production domain.
- Configure production Postgres and `AUTH_SECRET`.
- Configure Stripe production secrets if Stripe is used.
- Configure PayPal live credentials and `PAYPAL_ENVIRONMENT=live` if PayPal is used.
- Register the correct production webhook URLs.
- Run `pnpm db:migrate` before serving production traffic.
