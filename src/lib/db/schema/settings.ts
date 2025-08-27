import { relations } from "drizzle-orm";
import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "../utils";
import { UserTable } from "./users";

export const UserSettingsTable = pgTable("user_settings", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  theme: text("theme").default("system").notNull(),
  notifications: boolean("notifications").default(true).notNull(),
  cookies: boolean("cookies").default(false).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const UserSettingsRelations = relations(
  UserSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserSettingsTable.userId],
      references: [UserTable.id],
    }),
  })
);

export type UserSettings = typeof UserSettingsTable.$inferSelect;
