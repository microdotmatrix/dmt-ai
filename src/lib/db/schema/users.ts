import { relations } from "drizzle-orm";
import { boolean, integer, json, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { EntryTable } from "./entries";
import { UserGeneratedImageTable } from "./media";
import { SavedQuotesTable } from "./quotes";
import { UserSettingsTable } from "./settings";

export const UserTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const UserRelations = relations(UserTable, ({ many, one }) => ({
  uploads: many(UserUploadTable),
  entries: many(EntryTable),
  settings: one(UserSettingsTable, {
    fields: [UserTable.id],
    references: [UserSettingsTable.userId],
  }),
  generatedImages: many(UserGeneratedImageTable),
  savedQuotes: many(SavedQuotesTable),
}));

export const UserUploadTable = pgTable("user_upload", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  storageProvider: text("storage_provider").notNull(), // e.g., 'S3', 'Cloudinary', etc.
  storageKey: text("storage_key").notNull(), // The key/path in the storage service
  metadata: json("metadata"), // For storing additional metadata like dimensions, EXIF data, etc.
  isPublic: boolean("is_public")
    .$defaultFn(() => false)
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const UserUploadRelations = relations(UserUploadTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserUploadTable.userId],
    references: [UserTable.id],
  }),
}));

export type User = typeof UserTable.$inferSelect;
export type UserUpload = typeof UserUploadTable.$inferSelect;
