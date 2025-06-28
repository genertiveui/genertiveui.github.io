import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.development', override: true });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool });

console.log('Database connected successfully to PostgreSQL');

export { pool };
