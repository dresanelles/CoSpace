import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;
type SqlClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { sqlClient?: SqlClient };

function createDb(): Database {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sqlClient: SqlClient =
    globalForDb.sqlClient ?? postgres(connectionString, { prepare: false, max: 5 });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.sqlClient = sqlClient;
  }
  return drizzle(sqlClient, { schema });
}

let instance: Database | undefined;

// Conexión perezosa: no se crea al importar el módulo, sino en la primera consulta.
// Así `next build` (Docker, Vercel, CI) no necesita DATABASE_URL.
export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    instance ??= createDb();
    const value: unknown = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
