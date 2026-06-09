import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { withReplicas } from "drizzle-orm/pg-core";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const primaryDB = drizzle(pool, { schema });
const replica1 = drizzle(process.env.DATABASE_REPLICA_1!, { schema });
const replica2 = drizzle(process.env.DATABASE_REPLICA_2!, { schema });

export const db = withReplicas(primaryDB, [replica1, replica2]);
export type Database = typeof db;
