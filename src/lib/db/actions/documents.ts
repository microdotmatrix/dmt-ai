import { db } from "@/lib/db";
import { DocumentTable, SuggestionTable } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import "server-only";

export const saveDocument = async ({
  id,
  title,
  entryId,
  content,
  kind,
  tokenUsage,
  userId,
}: {
  id: string;
  title: string;
  entryId: string;
  content: string;
  kind: "obituary" | "eulogy";
  tokenUsage: number | undefined;
  userId: string;
}) => {
  try {
    // Validate UUID format before saving
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid document ID format: ${id}. Expected UUID.`);
    }

    await db
      .insert(DocumentTable)
      .values({
        id,
        title,
        entryId,
        content,
        kind,
        tokenUsage,
        userId,
      })
      .returning();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save document" };
  }
};

export const updateDocumentContent = async ({
  id,
  title,
  content,
  tokenUsage,
  entryId,
}: {
  id: string;
  title: string;
  content: string;
  tokenUsage: number | undefined;
  entryId: string;
}) => {
  try {
    await db
      .update(DocumentTable)
      .set({
        title,
        content,
        tokenUsage,
      })
      .where(and(eq(DocumentTable.id, id), eq(DocumentTable.entryId, entryId)))
      .returning();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update document" };
  }
};

export const deleteDocumentById = async (id: string) => {
  try {
    await db.delete(DocumentTable).where(eq(DocumentTable.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete document" };
  }
};

export const deleteDocumentsByIdAfterTimestamp = async ({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) => {
  try {
    await db
      .delete(SuggestionTable)
      .where(
        and(
          eq(SuggestionTable.documentId, id),
          gt(SuggestionTable.documentCreatedAt, timestamp)
        )
      );

    return await db
      .delete(DocumentTable)
      .where(
        and(eq(DocumentTable.id, id), gt(DocumentTable.createdAt, timestamp))
      )
      .returning();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete documents by id after timestamp");
  }
};

export const saveSuggestions = async ({
  suggestions,
}: {
  suggestions: Array<typeof SuggestionTable.$inferSelect>;
}) => {
  try {
    await db.insert(SuggestionTable).values(suggestions);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save suggestions" };
  }
};
