import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
