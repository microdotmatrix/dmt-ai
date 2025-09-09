import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  json,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { DocumentTable } from "./documents";
import { EntryTable } from "./entries";
import { UserTable } from "./users";

export const ChatTable = pgTable(
  "chat",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    entryId: text("entry_id")
      .notNull()
      .references(() => EntryTable.id, { onDelete: "cascade" }),
    documentId: uuid("document_id"),
    documentCreatedAt: timestamp("document_created_at"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    visibility: varchar("visibility", { enum: ["public", "private"] })
      .notNull()
      .default("private"),
  },
  (table) => [
    foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [DocumentTable.id, DocumentTable.createdAt],
    }),
  ]
);

export const ChatRelations = relations(ChatTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [ChatTable.userId],
    references: [UserTable.id],
  }),
  entry: one(EntryTable, {
    fields: [ChatTable.entryId],
    references: [EntryTable.id],
  }),
  document: one(DocumentTable, {
    fields: [ChatTable.documentId, ChatTable.documentCreatedAt],
    references: [DocumentTable.id, DocumentTable.createdAt],
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

export type Chat = typeof ChatTable.$inferSelect;
export type Message = typeof MessageTable.$inferSelect;
export type Vote = typeof VoteTable.$inferSelect;
export type Stream = typeof StreamTable.$inferSelect;
