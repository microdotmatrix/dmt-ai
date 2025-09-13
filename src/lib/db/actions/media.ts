"use server";

import { TAGS } from "@/lib/cache";
import { db } from "@/lib/db";
import { UserGeneratedImageTable } from "@/lib/db/schema";
import {
  fetchTemplates,
  generateImage,
  type PlacidRequest,
} from "@/lib/services/placid";
import type { ActionState } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function createEpitaphs(
  formData: PlacidRequest,
  entryId: string
  // userId: string
): Promise<ActionState> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const templates = await fetchTemplates();
    const variables = {
      portrait: formData.portrait.toString(),
      name: formData.name.toString(),
      epitaph: formData.epitaph.toString(),
      citation: formData.citation.toString(),
      birth: formData.birth.toString(),
      death: formData.death.toString(),
    };

    const epitaphs = templates.data.map((template) => {
      return generateImage({
        templateId: template.uuid,
        variables: variables,
      });
    });

    const results = await Promise.allSettled(epitaphs);

    const successfulResults = results.filter(
      (result) => result.status === "fulfilled"
    );

    const epitaphIds = successfulResults.map((result) => {
      if (result.status === "fulfilled") {
        return result.value.id;
      }
      return null;
    });

    console.log("Successful results", successfulResults);
    console.log("Epitaph IDs", epitaphIds);

    // Store each generated image in the database
    const dbInsertPromises = successfulResults.map((result, index) => {
      if (result.status === "fulfilled") {
        const template = templates.data[index];
        return db.insert(UserGeneratedImageTable).values({
          id: crypto.randomUUID(),
          userId: userId,
          entryId: entryId,
          epitaphId: result.value.id,
          templateId: template.uuid,
          metadata: {
            variables: variables,
            templateName: template.title || "Unknown template",
            generatedAt: new Date().toISOString(),
          },
        });
      }
      return Promise.resolve(); // Skip failed generations
    });

    // Execute all database insertions in parallel
    await Promise.all(dbInsertPromises.filter(Boolean));

    return { result: epitaphIds.filter((id) => id !== null) as number[] };
  } catch (error) {
    console.error("Error creating epitaphs:", error);
    return { error: "Failed to create epitaphs" };
  }
}

export async function deleteImage(id: string) {
  try {
    await db
      .delete(UserGeneratedImageTable)
      .where(eq(UserGeneratedImageTable.id, id));
    revalidateTag(TAGS.userGeneratedImages);
    return { result: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error: "Failed to delete image" };
  }
}
