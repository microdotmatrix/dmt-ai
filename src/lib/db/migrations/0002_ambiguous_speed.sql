ALTER TABLE "dmai2_document_v2" RENAME TO "dmai2_document";--> statement-breakpoint
ALTER TABLE "dmai2_document" DROP CONSTRAINT "dmai2_document_v2_user_id_dmai2_user_id_fk";
--> statement-breakpoint
ALTER TABLE "dmai2_suggestion" DROP CONSTRAINT "dmai2_suggestion_document_id_document_created_at_dmai2_document_v2_id_created_at_fk";
--> statement-breakpoint
ALTER TABLE "dmai2_document" DROP CONSTRAINT "dmai2_document_v2_id_created_at_pk";--> statement-breakpoint
ALTER TABLE "dmai2_document" ADD CONSTRAINT "dmai2_document_id_created_at_pk" PRIMARY KEY("id","created_at");--> statement-breakpoint
ALTER TABLE "dmai2_document" ADD CONSTRAINT "dmai2_document_user_id_dmai2_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dmai2_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmai2_suggestion" ADD CONSTRAINT "dmai2_suggestion_document_id_document_created_at_dmai2_document_id_created_at_fk" FOREIGN KEY ("document_id","document_created_at") REFERENCES "public"."dmai2_document"("id","created_at") ON DELETE no action ON UPDATE no action;