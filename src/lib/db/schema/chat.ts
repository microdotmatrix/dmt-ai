import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  integer,
  json,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { EntryTable } from "./entries";
import { UserTable } from "./users";

export const ChatTable = pgTable("chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  entryId: text("entry_id")
    .notNull()
    .references(() => EntryTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export const ChatRelations = relations(ChatTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [ChatTable.userId],
    references: [UserTable.id],
  }),
  entry: one(EntryTable, {
    fields: [ChatTable.entryId],
    references: [EntryTable.id],
  }),
}));

export const MessageTable = pgTable("message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => ChatTable.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const MessageRelations = relations(MessageTable, ({ one }) => ({
  chat: one(ChatTable, {
    fields: [MessageTable.chatId],
    references: [ChatTable.id],
  }),
}));

export const VoteTable = pgTable(
  "vote",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => ChatTable.id),
    messageId: uuid("message_id")
      .notNull()
      .references(() => MessageTable.id),
    isUpvoted: boolean("is_upvoted").notNull(),
  },
  (table) => {
    return [primaryKey({ columns: [table.chatId, table.messageId] })];
  }
);

export const VoteRelations = relations(VoteTable, ({ one }) => ({
  chat: one(ChatTable, {
    fields: [VoteTable.chatId],
    references: [ChatTable.id],
  }),
  message: one(MessageTable, {
    fields: [VoteTable.messageId],
    references: [MessageTable.id],
  }),
}));

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
    return [primaryKey({ columns: [table.id, table.createdAt] })];
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

export const StreamTable = pgTable(
  "stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chat_id").notNull(),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [ChatTable.id],
    }),
  ]
);

export const StreamRelations = relations(StreamTable, ({ one }) => ({
  chat: one(ChatTable, {
    fields: [StreamTable.chatId],
    references: [ChatTable.id],
  }),
}));

export const Chat = typeof ChatTable.$inferSelect;
export const Message = typeof MessageTable.$inferSelect;
export const Vote = typeof VoteTable.$inferSelect;
export const Document = typeof DocumentTable.$inferSelect;
export const Stream = typeof StreamTable.$inferSelect;
export const Suggestion = typeof SuggestionTable.$inferSelect;
