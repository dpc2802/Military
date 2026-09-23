import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está configurada en las variables de entorno");
}

// Conexión serverless de Neon vía HTTP (óptima para Vercel Edge/Serverless)
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export type Db = typeof db;
