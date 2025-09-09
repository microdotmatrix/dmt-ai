import { pgTable } from "@/lib/db/utils";
import { relations } from "drizzle-orm";
import { boolean, integer, text, timestamp } from "drizzle-orm/pg-core";
import { UserGeneratedImageTable } from "./media";
import { SavedQuotesTable } from "./quotes";
import { UserTable } from "./users";

export const EntryTable = pgTable("entry", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  dateOfDeath: timestamp("date_of_death"),
  locationBorn: text("location_born"),
  locationDied: text("location_died"),
  image: text("image"),
  causeOfDeath: text("cause_of_death"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const EntryRelations = relations(EntryTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [EntryTable.userId],
    references: [UserTable.id],
  }),
  entryDetails: one(EntryDetailsTable, {
    fields: [EntryTable.id],
    references: [EntryDetailsTable.entryId],
  }),
  generatedImages: many(UserGeneratedImageTable),
  savedQuotes: many(SavedQuotesTable),
}));

export const EntryDetailsTable = pgTable("entry_details", {
  entryId: text("entry_id")
    .notNull()
    .references(() => EntryTable.id, { onDelete: "cascade" })
    .unique(),
  // Occupation details
  occupation: text("occupation"),
  jobTitle: text("job_title"),
  companyName: text("company_name"),
  yearsWorked: text("years_worked"), // e.g., "1985-2010" or "15 years"

  // Education
  education: text("education"), // School names, degrees, etc.

  // Life summary and accomplishments
  accomplishments: text("accomplishments"), // Brief summary of achievements
  milestones: text("milestones"), // Important life events
  biographicalSummary: text("biographical_summary"), // Main life story

  // Personal details
  hobbies: text("hobbies"), // Hobbies and interests
  personalInterests: text("personal_interests"),

  // Military service
  militaryService: boolean("military_service"),
  militaryBranch: text("military_branch"),
  militaryRank: text("military_rank"),
  militaryYearsServed: integer("military_years_served"),

  // Religious information
  religious: boolean("religious"),
  denomination: text("denomination"),
  organization: text("organization"),
  favoriteScripture: text("favorite_scripture"),

  // Family and relationships
  familyDetails: text("family_details"), // Spouse, children, parents, siblings
  survivedBy: text("survived_by"), // Who they are survived by
  precededBy: text("preceded_by"), // Who preceded them in death

  // Additional obituary information
  serviceDetails: text("service_details"), // Funeral/memorial service info
  donationRequests: text("donation_requests"), // Charity donation requests
  specialAcknowledgments: text("special_acknowledgments"), // Thank yous, special mentions
  additionalNotes: text("additional_notes"), // Any other relevant information

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const EntryDetailsRelations = relations(
  EntryDetailsTable,
  ({ one }) => ({
    entry: one(EntryTable, {
      fields: [EntryDetailsTable.entryId],
      references: [EntryTable.id],
    }),
  })
);

export type Entry = typeof EntryTable.$inferSelect;
export type EntryDetails = typeof EntryDetailsTable.$inferSelect;
