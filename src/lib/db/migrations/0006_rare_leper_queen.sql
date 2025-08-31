ALTER TABLE "dmai2_document" DROP CONSTRAINT "dmai2_document_entry_id_dmai2_entry_id_fk";
--> statement-breakpoint
ALTER TABLE "dmai2_document" ADD CONSTRAINT "dmai2_document_entry_id_dmai2_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."dmai2_entry"("id") ON DELETE cascade ON UPDATE no action;