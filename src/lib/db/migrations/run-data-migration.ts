#!/usr/bin/env tsx

import { fixInvalidDocumentIds } from "./fix-document-ids";
import { db } from "../index";

/**
 * Run this script BEFORE pushing schema changes to Neon DB
 * This fixes existing invalid document IDs to prevent constraint violations
 */
async function runDataMigration() {
  try {
    console.log("🚀 Starting data migration for document IDs...");
    
    await fixInvalidDocumentIds();
    
    console.log("✅ Data migration completed successfully!");
    console.log("📋 Next steps:");
    console.log("   1. Run: pnpm db:push");
    console.log("   2. This will apply the UUID constraint to the schema");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Data migration failed:", error);
    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runDataMigration();
}

export { runDataMigration };
