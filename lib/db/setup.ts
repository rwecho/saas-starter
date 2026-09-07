import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import readline from 'node:readline';
import crypto from 'node:crypto';
import path from 'node:path';

const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function getPostgresURL(): Promise<string> {
  console.log('Step 1: Setting up Postgres');
  const dbChoice = await question(
    'Use local Postgres with Docker (L) or remote Postgres (R)? (L/R): '
  );

  if (dbChoice.toLowerCase() === 'l') {
    await setupLocalPostgres();
    return 'postgres://postgres:postgres@localhost:54322/postgres';
  }

  return await question('Enter your POSTGRES_URL: ');
}

async function setupLocalPostgres() {
  try {
    await execAsync('docker --version');
  } catch {
    throw new Error('Docker is required for local Postgres.');
  }

  const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: next_saas_starter_postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

  await fs.writeFile(path.join(process.cwd(), 'docker-compose.yml'), dockerComposeContent);
  await execAsync('docker compose up -d');
}

async function getPaymentEnvironment(): Promise<Record<string, string>> {
  console.log('Step 2: Configuring payments');
  const provider = (
    await question('Configure Stripe or PayPal? (stripe/paypal): ')
  ).toLowerCase();

  if (provider === 'paypal') {
    return {
      PAYPAL_ENVIRONMENT: (await question('PayPal environment (sandbox/live) [sandbox]: ')) || 'sandbox',
      PAYPAL_CLIENT_ID: await question('PAYPAL_CLIENT_ID: '),
      PAYPAL_CLIENT_SECRET: await question('PAYPAL_CLIENT_SECRET: '),
      PAYPAL_WEBHOOK_ID: await question('PAYPAL_WEBHOOK_ID: '),
      PAYPAL_BASE_PLAN_ID: await question('PAYPAL_BASE_PLAN_ID: '),
      PAYPAL_PLUS_PLAN_ID: await question('PAYPAL_PLUS_PLAN_ID: '),
      PAYPAL_BASE_PLAN_NAME: 'Base',
      PAYPAL_PLUS_PLAN_NAME: 'Plus',
      PAYPAL_BASE_PRICE_CENTS: '800',
      PAYPAL_PLUS_PRICE_CENTS: '1200',
      PAYPAL_CURRENCY: 'USD',
      PAYPAL_BILLING_INTERVAL: 'month',
      PAYPAL_TRIAL_DAYS: '7',
    };
  }

  if (provider !== 'stripe') {
    throw new Error('Payment provider must be either stripe or paypal.');
  }

  return {
    STRIPE_SECRET_KEY: await question('STRIPE_SECRET_KEY: '),
    STRIPE_WEBHOOK_SECRET: await question('STRIPE_WEBHOOK_SECRET: '),
  };
}

function generateAuthSecret() {
  return crypto.randomBytes(32).toString('hex');
}

async function writeEnvFile(envVars: Record<string, string>) {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  await fs.writeFile(path.join(process.cwd(), '.env'), `${envContent}\n`);
}

async function main() {
  const POSTGRES_URL = await getPostgresURL();
  const paymentEnv = await getPaymentEnvironment();

  await writeEnvFile({
    POSTGRES_URL,
    BASE_URL: 'http://localhost:3000',
    AUTH_SECRET: generateAuthSecret(),
    ...paymentEnv,
  });

  console.log('Setup completed. Run pnpm db:migrate, pnpm db:seed, then pnpm dev.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
