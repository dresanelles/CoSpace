import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

type SqlClient = ReturnType<typeof postgres>;
const globalForDb = globalThis as unknown as { sqlClient?: SqlClient };

const sqlClient: SqlClient =
  globalForDb.sqlClient ?? postgres(connectionString, { prepare: false, max: 5 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlClient = sqlClient;
}

export const db = drizzle(sqlClient, { schema });