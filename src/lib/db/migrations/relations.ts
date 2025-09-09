import { relations } from "drizzle-orm/relations";
import { dmai2Entry, dmai2EntryDetails, dmai2User, dmai2UserUpload, dmai2UserSettings, dmai2Chat, dmai2Message, dmai2Document, dmai2Stream, dmai2UserGeneratedImage, dmai2Vote, dmai2Suggestion } from "./schema";

export const dmai2EntryDetailsRelations = relations(dmai2EntryDetails, ({one}) => ({
	dmai2Entry: one(dmai2Entry, {
		fields: [dmai2EntryDetails.entryId],
		references: [dmai2Entry.id]
	}),
}));

export const dmai2EntryRelations = relations(dmai2Entry, ({one, many}) => ({
	dmai2EntryDetails: many(dmai2EntryDetails),
	dmai2User: one(dmai2User, {
		fields: [dmai2Entry.userId],
		references: [dmai2User.id]
	}),
	dmai2Chats: many(dmai2Chat),
	dmai2UserGeneratedImages: many(dmai2UserGeneratedImage),
	dmai2Documents: many(dmai2Document),
}));

export const dmai2UserUploadRelations = relations(dmai2UserUpload, ({one}) => ({
	dmai2User: one(dmai2User, {
		fields: [dmai2UserUpload.userId],
		references: [dmai2User.id]
	}),
}));

export const dmai2UserRelations = relations(dmai2User, ({many}) => ({
	dmai2UserUploads: many(dmai2UserUpload),
	dmai2UserSettings: many(dmai2UserSettings),
	dmai2Entries: many(dmai2Entry),
	dmai2Chats: many(dmai2Chat),
	dmai2UserGeneratedImages: many(dmai2UserGeneratedImage),
	dmai2Documents: many(dmai2Document),
	dmai2Suggestions: many(dmai2Suggestion),
}));

export const dmai2UserSettingsRelations = relations(dmai2UserSettings, ({one}) => ({
	dmai2User: one(dmai2User, {
		fields: [dmai2UserSettings.userId],
		references: [dmai2User.id]
	}),
}));

export const dmai2MessageRelations = relations(dmai2Message, ({one, many}) => ({
	dmai2Chat: one(dmai2Chat, {
		fields: [dmai2Message.chatId],
		references: [dmai2Chat.id]
	}),
	dmai2Votes: many(dmai2Vote),
}));

export const dmai2ChatRelations = relations(dmai2Chat, ({one, many}) => ({
	dmai2Messages: many(dmai2Message),
	dmai2User: one(dmai2User, {
		fields: [dmai2Chat.userId],
		references: [dmai2User.id]
	}),
	dmai2Entry: one(dmai2Entry, {
		fields: [dmai2Chat.entryId],
		references: [dmai2Entry.id]
	}),
	dmai2Document: one(dmai2Document, {
		fields: [dmai2Chat.documentId],
		references: [dmai2Document.id]
	}),
	dmai2Streams: many(dmai2Stream),
	dmai2Votes: many(dmai2Vote),
}));

export const dmai2DocumentRelations = relations(dmai2Document, ({one, many}) => ({
	dmai2Chats: many(dmai2Chat),
	dmai2User: one(dmai2User, {
		fields: [dmai2Document.userId],
		references: [dmai2User.id]
	}),
	dmai2Entry: one(dmai2Entry, {
		fields: [dmai2Document.entryId],
		references: [dmai2Entry.id]
	}),
	dmai2Suggestions: many(dmai2Suggestion),
}));

export const dmai2StreamRelations = relations(dmai2Stream, ({one}) => ({
	dmai2Chat: one(dmai2Chat, {
		fields: [dmai2Stream.chatId],
		references: [dmai2Chat.id]
	}),
}));

export const dmai2UserGeneratedImageRelations = relations(dmai2UserGeneratedImage, ({one}) => ({
	dmai2User: one(dmai2User, {
		fields: [dmai2UserGeneratedImage.userId],
		references: [dmai2User.id]
	}),
	dmai2Entry: one(dmai2Entry, {
		fields: [dmai2UserGeneratedImage.entryId],
		references: [dmai2Entry.id]
	}),
}));

export const dmai2VoteRelations = relations(dmai2Vote, ({one}) => ({
	dmai2Chat: one(dmai2Chat, {
		fields: [dmai2Vote.chatId],
		references: [dmai2Chat.id]
	}),
	dmai2Message: one(dmai2Message, {
		fields: [dmai2Vote.messageId],
		references: [dmai2Message.id]
	}),
}));

export const dmai2SuggestionRelations = relations(dmai2Suggestion, ({one}) => ({
	dmai2User: one(dmai2User, {
		fields: [dmai2Suggestion.userId],
		references: [dmai2User.id]
	}),
	dmai2Document: one(dmai2Document, {
		fields: [dmai2Suggestion.documentId],
		references: [dmai2Document.id]
	}),
}));