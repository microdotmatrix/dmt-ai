CREATE TABLE "dmai2_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmai2_document_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"kind" varchar DEFAULT 'obituary' NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "dmai2_document_v2_id_created_at_pk" PRIMARY KEY("id","created_at")
);
--> statement-breakpoint
CREATE TABLE "dmai2_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"role" varchar NOT NULL,
	"parts" json NOT NULL,
	"attachments" json,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmai2_stream" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "dmai2_stream_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "dmai2_suggestion" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"document_created_at" timestamp NOT NULL,
	"original_text" text NOT NULL,
	"suggested_text" text NOT NULL,
	"description" text,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "dmai2_suggestion_id_created_at_pk" PRIMARY KEY("id","created_at")
);
--> statement-breakpoint
CREATE TABLE "dmai2_vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"is_upvoted" boolean NOT NULL,
	CONSTRAINT "dmai2_vote_chat_id_message_id_pk" PRIMARY KEY("chat_id","message_id")
);
--> statement-breakpoint
CREATE TABLE "dmai2_entry_details" (
	"entry_id" text NOT NULL,
	"occupation" text,
	"job_title" text,
	"company_name" text,
	"years_worked" text,
	"education" text,
	"accomplishments" text,
	"milestones" text,
	"biographical_summary" text,
	"hobbies" text,
	"personal_interests" text,
	"military_service" boolean,
	"military_branch" text,
	"military_rank" text,
	"military_years_served" integer,
	"religious" boolean,
	"denomination" text,
	"organization" text,
	"favorite_scripture" text,
	"family_details" text,
	"survived_by" text,
	"preceded_by" text,
	"service_details" text,
	"donation_requests" text,
	"special_acknowledgments" text,
	"additional_notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "dmai2_entry_details_entry_id_unique" UNIQUE("entry_id")
);
--> statement-breakpoint
CREATE TABLE "dmai2_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"date_of_birth" timestamp,
	"date_of_death" timestamp,
	"location_born" text,
	"location_died" text,
	"image" text,
	"cause_of_death" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmai2_user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"notifications" boolean DEFAULT true NOT NULL,
	"cookies" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmai2_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image_url" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "dmai2_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "dmai2_user_upload" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"storage_provider" text NOT NULL,
	"storage_key" text NOT NULL,
	"metadata" json,
	"is_public" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dmai2_chat" ADD CONSTRAINT "dmai2_chat_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_document_v2" ADD CONSTRAINT "dmai2_document_v2_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_message" ADD CONSTRAINT "dmai2_message_chat_id_dmai2_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."dmai2_chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_stream" ADD CONSTRAINT "dmai2_stream_chat_id_dmai2_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."dmai2_chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_suggestion" ADD CONSTRAINT "dmai2_suggestion_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_suggestion" ADD CONSTRAINT "dmai2_suggestion_document_id_document_created_at_dmai2_document_v2_id_created_at_fk" FOREIGN KEY ("document_id","document_created_at") REFERENCES "public"."dmai2_document_v2"("id","created_at") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_vote" ADD CONSTRAINT "dmai2_vote_chat_id_dmai2_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."dmai2_chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_vote" ADD CONSTRAINT "dmai2_vote_message_id_dmai2_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."dmai2_message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_entry_details" ADD CONSTRAINT "dmai2_entry_details_entry_id_dmai2_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."dmai2_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_entry" ADD CONSTRAINT "dmai2_entry_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_user_settings" ADD CONSTRAINT "dmai2_user_settings_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_user_upload" ADD CONSTRAINT "dmai2_user_upload_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;