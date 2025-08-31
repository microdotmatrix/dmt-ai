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
