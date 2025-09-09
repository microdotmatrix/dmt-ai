CREATE TABLE "dmai2_saved_quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entry_id" text NOT NULL,
	"quote" text NOT NULL,
	"citation" text,
	"source" text,
	"length" varchar DEFAULT 'medium' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dmai2_saved_quotes" ADD CONSTRAINT "dmai2_saved_quotes_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_saved_quotes" ADD CONSTRAINT "dmai2_saved_quotes_entry_id_dmai2_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."dmai2_entry"("id") ON DELETE cascade ON UPDATE no action;