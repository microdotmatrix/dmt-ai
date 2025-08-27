"use server";

import { db } from "@/lib/db";
import { UserTable } from "@/lib/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const upsertUser = async (userId: string) => {
  const user = await currentUser();

  if (!user || user.id !== userId) return null;

  try {
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      `${user.id}@placeholder.local`;

    await db
      .insert(UserTable)
      .values({
        id: user.id,
        email: primaryEmail,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl ?? null,
      })
      .onConflictDoUpdate({
        target: [UserTable.id],
        set: {
          email: primaryEmail,
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl ?? null,
          updatedAt: new Date(),
        },
      });

    return user.id;
  } catch (error) {
    console.error("Error upserting user:", error);
    return null;
  }
};

export const deleteUser = async (userId: string) => {
  await db.delete(UserTable).where(eq(UserTable.id, userId));

  revalidateTag("user");
};
