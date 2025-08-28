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
ALTER TABLE "dmai2_entry_details" ADD CONSTRAINT "dmai2_entry_details_entry_id_dmai2_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."dmai2_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_entry" ADD CONSTRAINT "dmai2_entry_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_user_settings" ADD CONSTRAINT "dmai2_user_settings_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_user_upload" ADD CONSTRAINT "dmai2_user_upload_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;