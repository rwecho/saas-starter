import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Database connection is not configured. Set POSTGRES_URL or DATABASE_URL.'
  );
}

export const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });
