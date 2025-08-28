"use server";

import { db } from "@/lib/db";
import { EntryDetailsTable, EntryTable } from "@/lib/db/schema";
import { action } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateEntrySchema = z.object({
  name: z.string().min(1).max(150),
  dateOfBirth: z.string(),
  dateOfDeath: z.string(),
  birthLocation: z.string().max(250),
  deathLocation: z.string().max(250),
  image: z.string(),
  causeOfDeath: z.string().max(250),
});

export const createEntryAction = action(CreateEntrySchema, async (data) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }
  try {
    await db.insert(EntryTable).values({
      id: crypto.randomUUID(),
      name: data.name,
      dateOfBirth: new Date(data.dateOfBirth),
      dateOfDeath: new Date(data.dateOfDeath),
      locationBorn: data.birthLocation,
      locationDied: data.deathLocation,
      image: data.image,
      causeOfDeath: data.causeOfDeath,
      userId,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create entry" };
  } finally {
    revalidatePath("/dashboard");
  }
});

const UpdateEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(150),
  dateOfBirth: z.string(),
  dateOfDeath: z.string(),
  birthLocation: z.string().max(250),
  deathLocation: z.string().max(250),
  image: z.string(),
  causeOfDeath: z.string().max(250),
});

export const updateEntryAction = action(UpdateEntrySchema, async (data) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }
  try {
    await db
      .update(EntryTable)
      .set({
        name: data.name,
        dateOfBirth: new Date(data.dateOfBirth),
        dateOfDeath: new Date(data.dateOfDeath),
        locationBorn: data.birthLocation,
        locationDied: data.deathLocation,
        image: data.image,
        causeOfDeath: data.causeOfDeath,
      })
      .where(and(eq(EntryTable.id, data.id), eq(EntryTable.userId, userId)));

    return { success: true };
  } catch (error) {
    return { error: "Failed to update entry" };
  } finally {
    revalidatePath(`/dashboard/${data.id}`);
  }
});

export const deleteEntryAction = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: true, message: "Unauthorized" };
  }
  try {
    await db
      .delete(EntryTable)
      .where(and(eq(EntryTable.id, id), eq(EntryTable.userId, userId)));

    return { error: false };
  } catch (error) {
    return { error: true, message: "Failed to delete entry" };
  } finally {
    revalidatePath("/dashboard");
  }
};

const UpdateEntryDetailsSchema = z.object({
  id: z.string(),
  occupation: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  yearsWorked: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  accomplishments: z.string().nullable().optional(),
  biographicalSummary: z.string().nullable().optional(),
  hobbies: z.string().nullable().optional(),
  personalInterests: z.string().nullable().optional(),
  familyDetails: z.string().nullable().optional(),
  survivedBy: z.string().nullable().optional(),
  precededBy: z.string().nullable().optional(),
  serviceDetails: z.string().nullable().optional(),
  donationRequests: z.string().nullable().optional(),
  specialAcknowledgments: z.string().nullable().optional(),
  additionalNotes: z.string().nullable().optional(),
});

export const updateEntryDetailsAction = action(
  UpdateEntryDetailsSchema,
  async (data) => {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }
    try {
      await db
        .update(EntryDetailsTable)
        .set({
          occupation: data.occupation,
          jobTitle: data.jobTitle,
          companyName: data.companyName,
          yearsWorked: data.yearsWorked,
          education: data.education,
          accomplishments: data.accomplishments,
          biographicalSummary: data.biographicalSummary,
          hobbies: data.hobbies,
          personalInterests: data.personalInterests,
          familyDetails: data.familyDetails,
          survivedBy: data.survivedBy,
          precededBy: data.precededBy,
          serviceDetails: data.serviceDetails,
        })
        .where(
          and(
            eq(EntryDetailsTable.entryId, data.id),
            eq(EntryDetailsTable.entryId, data.id)
          )
        );

      return { success: true };
    } catch (error) {
      return { error: "Failed to update entry" };
    } finally {
      revalidatePath(`/dashboard/${data.id}`);
    }
  }
);

// Direct action for updating entry details (not wrapped with action utility)
export const updateEntryDetailsDirectAction = async (
  entryId: string,
  formData: any
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const dataWithId = { ...formData, id: entryId };
  const result = UpdateEntryDetailsSchema.safeParse(dataWithId);

  if (!result.success) {
    return { error: result.error.message };
  }

  try {
    // First verify the user owns the entry
    const entry = await db
      .select()
      .from(EntryTable)
      .where(and(eq(EntryTable.id, entryId), eq(EntryTable.userId, userId)))
      .limit(1);

    if (entry.length === 0) {
      return { error: "Entry not found or unauthorized" };
    }

    // Use upsert pattern - try to update, if no rows affected, insert
    const updateResult = await db
      .update(EntryDetailsTable)
      .set({
        occupation: result.data.occupation,
        jobTitle: result.data.jobTitle,
        companyName: result.data.companyName,
        yearsWorked: result.data.yearsWorked,
        education: result.data.education,
        accomplishments: result.data.accomplishments,
        biographicalSummary: result.data.biographicalSummary,
        hobbies: result.data.hobbies,
        personalInterests: result.data.personalInterests,
        familyDetails: result.data.familyDetails,
        survivedBy: result.data.survivedBy,
        precededBy: result.data.precededBy,
        serviceDetails: result.data.serviceDetails,
        donationRequests: result.data.donationRequests,
        specialAcknowledgments: result.data.specialAcknowledgments,
        additionalNotes: result.data.additionalNotes,
        updatedAt: new Date(),
      })
      .where(eq(EntryDetailsTable.entryId, entryId));

    // If no existing record was updated, create a new one
    if (updateResult.rowCount === 0) {
      await db.insert(EntryDetailsTable).values({
        entryId,
        occupation: result.data.occupation,
        jobTitle: result.data.jobTitle,
        companyName: result.data.companyName,
        yearsWorked: result.data.yearsWorked,
        education: result.data.education,
        accomplishments: result.data.accomplishments,
        biographicalSummary: result.data.biographicalSummary,
        hobbies: result.data.hobbies,
        personalInterests: result.data.personalInterests,
        familyDetails: result.data.familyDetails,
        survivedBy: result.data.survivedBy,
        precededBy: result.data.precededBy,
        serviceDetails: result.data.serviceDetails,
        donationRequests: result.data.donationRequests,
        specialAcknowledgments: result.data.specialAcknowledgments,
        additionalNotes: result.data.additionalNotes,
      });
    }

    revalidatePath(`/dashboard/${entryId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update entry details:", error);
    return { error: "Failed to update entry details" };
  }
};
