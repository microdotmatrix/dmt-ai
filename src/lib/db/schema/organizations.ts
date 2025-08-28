import { relations } from "drizzle-orm";
import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { UserTable } from "./users";

export const OrganizationTable = pgTable("organization", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const OrganizationRelations = relations(
  OrganizationTable,
  ({ many }) => ({
    users: many(UserTable),
  })
);
