import "server-only";

import { db } from "@/lib/db";
import { DocumentTable } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const getDocumentsById = async (id: string) => {
  try {
    const documents = await db
      .select()
      .from(DocumentTable)
      .where(eq(DocumentTable.id, id))
      .orderBy(asc(DocumentTable.createdAt));

    return documents;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get documents");
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const [selectedDocument] = await db
      .select()
      .from(DocumentTable)
      .where(eq(DocumentTable.id, id))
      .orderBy(asc(DocumentTable.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get document");
  }
};
