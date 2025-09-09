import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  integer,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { EntryTable } from "./entries";
import { UserTable } from "./users";

export const DocumentTable = pgTable(
  "document",
  {
    id: uuid("id").notNull().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => UserTable.id),
    entryId: text("entry_id")
      .notNull()
      .references(() => EntryTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("kind", { enum: ["obituary", "eulogy"] })
      .notNull()
      .default("obituary"),
    tokenUsage: integer("token_usage").default(0),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.id, table.createdAt] }),
    ];
  }
);

export const DocumentRelations = relations(DocumentTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [DocumentTable.userId],
    references: [UserTable.id],
  }),
  entry: one(EntryTable, {
    fields: [DocumentTable.entryId],
    references: [EntryTable.id],
  }),
}));

export const SuggestionTable = pgTable(
  "suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("document_id").notNull(),
    documentCreatedAt: timestamp("document_created_at").notNull(),
    originalText: text("original_text").notNull(),
    suggestedText: text("suggested_text").notNull(),
    description: text("description"),
    isResolved: boolean("is_resolved").notNull().default(false),
    userId: text("user_id")
      .notNull()
      .references(() => UserTable.id),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.createdAt] }),
    foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [DocumentTable.id, DocumentTable.createdAt],
    }),
  ]
);

export const SuggestionRelations = relations(SuggestionTable, ({ one }) => ({
  document: one(DocumentTable, {
    fields: [SuggestionTable.documentId, SuggestionTable.documentCreatedAt],
    references: [DocumentTable.id, DocumentTable.createdAt],
  }),
}));

export type Document = typeof DocumentTable.$inferSelect;
export type Suggestion = typeof SuggestionTable.$inferSelect;
