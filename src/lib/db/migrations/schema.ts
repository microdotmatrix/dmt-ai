import { pgTable, foreignKey, unique, text, timestamp, boolean, integer, json, uuid, varchar, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const dmai2EntryDetails = pgTable("dmai2_entry_details", {
	entryId: text("entry_id").notNull(),
	occupation: text(),
	jobTitle: text("job_title"),
	companyName: text("company_name"),
	yearsWorked: text("years_worked"),
	education: text(),
	accomplishments: text(),
	milestones: text(),
	biographicalSummary: text("biographical_summary"),
	hobbies: text(),
	personalInterests: text("personal_interests"),
	familyDetails: text("family_details"),
	survivedBy: text("survived_by"),
	precededBy: text("preceded_by"),
	serviceDetails: text("service_details"),
	donationRequests: text("donation_requests"),
	specialAcknowledgments: text("special_acknowledgments"),
	additionalNotes: text("additional_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	militaryService: boolean("military_service"),
	militaryBranch: text("military_branch"),
	militaryRank: text("military_rank"),
	militaryYearsServed: integer("military_years_served"),
	religious: boolean(),
	denomination: text(),
	organization: text(),
	favoriteScripture: text("favorite_scripture"),
}, (table) => [
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [dmai2Entry.id],
			name: "dmai2_entry_details_entry_id_dmai2_entry_id_fk"
		}).onDelete("cascade"),
	unique("dmai2_entry_details_entry_id_unique").on(table.entryId),
]);

export const dmai2User = pgTable("dmai2_user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("dmai2_user_email_unique").on(table.email),
]);

export const dmai2UserUpload = pgTable("dmai2_user_upload", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	fileName: text("file_name").notNull(),
	fileType: text("file_type").notNull(),
	fileSize: integer("file_size").notNull(),
	url: text().notNull(),
	thumbnailUrl: text("thumbnail_url"),
	storageProvider: text("storage_provider").notNull(),
	storageKey: text("storage_key").notNull(),
	metadata: json(),
	isPublic: boolean("is_public").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_user_upload_user_id_dmai2_user_id_fk"
		}).onDelete("cascade"),
]);

export const dmai2UserSettings = pgTable("dmai2_user_settings", {
	userId: text("user_id").primaryKey().notNull(),
	theme: text().default('system').notNull(),
	notifications: boolean().default(true).notNull(),
	cookies: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_user_settings_user_id_dmai2_user_id_fk"
		}).onDelete("cascade"),
]);

export const dmai2Entry = pgTable("dmai2_entry", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	dateOfDeath: timestamp("date_of_death", { mode: 'string' }),
	locationBorn: text("location_born"),
	locationDied: text("location_died"),
	image: text(),
	causeOfDeath: text("cause_of_death"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_entry_user_id_dmai2_user_id_fk"
		}).onDelete("cascade"),
]);

export const dmai2Message = pgTable("dmai2_message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid("chat_id").notNull(),
	role: varchar().notNull(),
	parts: json().notNull(),
	attachments: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [dmai2Chat.id],
			name: "dmai2_message_chat_id_dmai2_chat_id_fk"
		}).onDelete("cascade"),
]);

export const dmai2Chat = pgTable("dmai2_chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	visibility: varchar().default('private').notNull(),
	entryId: text("entry_id").notNull(),
	documentId: uuid("document_id"),
	documentCreatedAt: timestamp("document_created_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_chat_user_id_dmai2_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [dmai2Entry.id],
			name: "dmai2_chat_entry_id_dmai2_entry_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.documentId, table.documentCreatedAt],
			foreignColumns: [dmai2Document.id, dmai2Document.createdAt],
			name: "dmai2_chat_document_id_document_created_at_dmai2_document_id_cr"
		}),
]);

export const dmai2Stream = pgTable("dmai2_stream", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid("chat_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [dmai2Chat.id],
			name: "dmai2_stream_chat_id_dmai2_chat_id_fk"
		}),
]);

export const dmai2UserGeneratedImage = pgTable("dmai2_user_generated_image", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	entryId: text("entry_id").notNull(),
	epitaphId: integer("epitaph_id").notNull(),
	templateId: text("template_id"),
	imageUrl: text("image_url"),
	metadata: json(),
	status: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_user_generated_image_user_id_dmai2_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [dmai2Entry.id],
			name: "dmai2_user_generated_image_entry_id_dmai2_entry_id_fk"
		}).onDelete("cascade"),
]);

export const dmai2Vote = pgTable("dmai2_vote", {
	chatId: uuid("chat_id").notNull(),
	messageId: uuid("message_id").notNull(),
	isUpvoted: boolean("is_upvoted").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [dmai2Chat.id],
			name: "dmai2_vote_chat_id_dmai2_chat_id_fk"
		}),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [dmai2Message.id],
			name: "dmai2_vote_message_id_dmai2_message_id_fk"
		}),
	primaryKey({ columns: [table.chatId, table.messageId], name: "dmai2_vote_chat_id_message_id_pk"}),
]);

export const dmai2Document = pgTable("dmai2_document", {
	id: uuid().defaultRandom().notNull(),
	userId: text("user_id").notNull(),
	title: text().notNull(),
	content: text(),
	kind: varchar().default('obituary').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	tokenUsage: integer("token_usage").default(0),
	entryId: text("entry_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_document_user_id_dmai2_user_id_fk"
		}),
	foreignKey({
			columns: [table.entryId],
			foreignColumns: [dmai2Entry.id],
			name: "dmai2_document_entry_id_dmai2_entry_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.id, table.createdAt], name: "dmai2_document_id_created_at_pk"}),
]);

export const dmai2Suggestion = pgTable("dmai2_suggestion", {
	id: uuid().defaultRandom().notNull(),
	documentId: uuid("document_id").notNull(),
	documentCreatedAt: timestamp("document_created_at", { mode: 'string' }).notNull(),
	originalText: text("original_text").notNull(),
	suggestedText: text("suggested_text").notNull(),
	description: text(),
	isResolved: boolean("is_resolved").default(false).notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [dmai2User.id],
			name: "dmai2_suggestion_user_id_dmai2_user_id_fk"
		}),
	foreignKey({
			columns: [table.documentId, table.documentCreatedAt],
			foreignColumns: [dmai2Document.id, dmai2Document.createdAt],
			name: "dmai2_suggestion_document_id_document_created_at_dmai2_document"
		}),
	primaryKey({ columns: [table.id, table.createdAt], name: "dmai2_suggestion_id_created_at_pk"}),
]);
