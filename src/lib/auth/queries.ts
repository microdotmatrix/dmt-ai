import { db } from "@/lib/db";
import { UserTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getCurrentUser = async (userId: string) => {
  try {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
