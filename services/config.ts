import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
export const pool = new Pool({
    connectionString: process.env.NEXT_PUBLIC_DB_CONNECTION_STRING,
});

export const db = drizzle(pool);

