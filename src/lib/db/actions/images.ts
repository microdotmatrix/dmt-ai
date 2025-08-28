"use server";

import { db } from "@/lib/db";
import { EntryTable, UserUploadTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const uploadEntryImage = async (
  entryId: string,
  fileName: string,
  fileUrl: string,
  fileSize: number,
  mimeType: string,
  storageProvider: string = "local",
  storageKey: string,
  thumbnailUrl?: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    // Verify the user owns the entry
    const entry = await db
      .select()
      .from(EntryTable)
      .where(eq(EntryTable.userId, userId))
      .limit(1);

    if (entry.length === 0) {
      return { error: "Entry not found or unauthorized" };
    }

    const imageId = crypto.randomUUID();

    await db.insert(UserUploadTable).values({
      id: imageId,
      userId,
      fileName,
      fileType: mimeType,
      fileSize,
      url: fileUrl,
      thumbnailUrl,
      storageProvider,
      storageKey,
      isPublic: false,
    });

    revalidatePath(`/dashboard/${entryId}`);
    return { success: true, imageId };
  } catch (error) {
    console.error("Failed to upload image:", error);
    return { error: "Failed to upload image" };
  }
};

export const deleteEntryImage = async (imageId: string, entryId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(UserUploadTable).where(eq(UserUploadTable.id, imageId));

    revalidatePath(`/dashboard/${entryId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { error: "Failed to delete image" };
  }
};

export const getEntryImages = async (entryId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const images = await db
      .select()
      .from(UserUploadTable)
      .where(eq(UserUploadTable.userId, userId))
      .orderBy(UserUploadTable.createdAt);

    return { success: true, images };
  } catch (error) {
    console.error("Failed to get images:", error);
    return { error: "Failed to get images" };
  }
};
