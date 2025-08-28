import { db } from "@/lib/db";
import {
  EntryDetailsTable,
  EntryTable,
  UserUploadTable,
} from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCreatorEntries = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const entries = await db.query.EntryTable.findMany({
    where: eq(EntryTable.userId, userId),
    orderBy: (EntryTable, { desc }) => [desc(EntryTable.createdAt)],
  });

  return entries;
});

export const getEntryById = cache(async (entryId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const entry = await db.query.EntryTable.findFirst({
    where: (EntryTable, { eq, and }) =>
      and(eq(EntryTable.userId, userId), eq(EntryTable.id, entryId)),
  });

  return entry;
});

export const getUserUploads = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  // Fetch all uploads for this user
  const uploads = await db.query.UserUploadTable.findMany({
    where: eq(UserUploadTable.userId, userId),
    orderBy: (UserUploadTable, { desc }) => [desc(UserUploadTable.createdAt)],
  });

  return uploads;
});

export const getEntryDetailsById = cache(async (entryId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const entryDetails = await db.query.EntryDetailsTable.findFirst({
    where: eq(EntryDetailsTable.entryId, entryId),
  });

  return entryDetails;
});
