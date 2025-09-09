import { relations } from "drizzle-orm";
import { serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { EntryTable } from "./entries";
import { UserTable } from "./users";

export const SavedQuotesTable = pgTable("saved_quotes", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  entryId: text("entry_id")
    .notNull()
    .references(() => EntryTable.id, { onDelete: "cascade" }),
  quote: text("quote").notNull(),
  citation: text("citation"),
  source: text("source"),
  length: varchar("length", { enum: ["short", "medium", "long"] })
    .notNull()
    .default("medium"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const SavedQuotesRelations = relations(SavedQuotesTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SavedQuotesTable.userId],
    references: [UserTable.id],
  }),
  entry: one(EntryTable, {
    fields: [SavedQuotesTable.entryId],
    references: [EntryTable.id],
  }),
}));

export type SavedQuote = typeof SavedQuotesTable.$inferSelect;
