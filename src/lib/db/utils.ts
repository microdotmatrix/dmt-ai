import { pgTableCreator } from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator(
  (name) => `${process.env.DATABASE_PREFIX}_${name}`
);
