import { relations } from "drizzle-orm";
import { integer, json, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { EntryTable } from "./entries";
import { UserTable } from "./users";

export const UserGeneratedImageTable = pgTable("user_generated_image", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  entryId: text("entry_id")
    .notNull()
    .references(() => EntryTable.id, { onDelete: "cascade" }),
  epitaphId: integer("epitaph_id").notNull(), // ID from the Placid API
  templateId: text("template_id"), // Template ID used for generation
  imageUrl: text("image_url"), // URL to access the generated image (optional, can be populated later)
  metadata: json("metadata"), // For storing additional metadata about the generation
  status: text("status")
    .$defaultFn(() => "generated")
    .notNull(), // e.g., 'generated', 'processed', 'failed'
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const UserGeneratedImageRelations = relations(
  UserGeneratedImageTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserGeneratedImageTable.userId],
      references: [UserTable.id],
    }),
    entry: one(EntryTable, {
      fields: [UserGeneratedImageTable.entryId],
      references: [EntryTable.id],
    }),
  })
);

export type UserGeneratedImage = typeof UserGeneratedImageTable.$inferSelect;
