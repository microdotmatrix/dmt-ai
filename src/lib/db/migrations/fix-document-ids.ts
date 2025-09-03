import { sql } from "drizzle-orm";
import { db } from "../index";

// Custom migration to fix invalid document IDs before adding UUID constraint
export const fixInvalidDocumentIds = async () => {
  console.log("🔄 Fixing invalid document IDs...");

  // First, check if there are any invalid document IDs
  const invalidDocs = await db.execute(sql`
    SELECT id, title FROM document 
    WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  `);

  if (invalidDocs.length === 0) {
    console.log("✅ No invalid document IDs found");
    return;
  }

  console.log(`🔍 Found ${invalidDocs.length} invalid document IDs`);

  // Create temporary mapping table
  await db.execute(sql`
    CREATE TEMP TABLE IF NOT EXISTS id_mapping AS
    SELECT 
      id as old_id, 
      gen_random_uuid()::text as new_id
    FROM document 
    WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  `);

  // Update suggestions table foreign keys first
  await db.execute(sql`
    UPDATE suggestion 
    SET document_id = id_mapping.new_id::uuid
    FROM id_mapping 
    WHERE suggestion.document_id::text = id_mapping.old_id
  `);

  // Update document table with new UUIDs
  await db.execute(sql`
    UPDATE document 
    SET id = id_mapping.new_id::uuid
    FROM id_mapping 
    WHERE document.id::text = id_mapping.old_id
  `);

  // Show what was changed
  const mapping = await db.execute(sql`SELECT * FROM id_mapping`);
  console.log("📊 Document ID mappings:", mapping);

  // Verify all IDs are now valid
  const remainingInvalid = await db.execute(sql`
    SELECT COUNT(*) as count FROM document 
    WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  `);

  console.log(`✅ Fixed invalid document IDs. Remaining invalid: ${remainingInvalid[0]?.count || 0}`);
};
