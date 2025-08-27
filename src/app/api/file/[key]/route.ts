import { db } from "@/lib/db";
import { UserUploadTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = (await params) as { key: string };

  if (!key) {
    return NextResponse.json({ error: "File key not found" }, { status: 400 });
  }
  const upload = await db
    .select()
    .from(UserUploadTable)
    .where(eq(UserUploadTable.storageKey, key))
    .limit(1)
    .then((x) => x[0] ?? null);

  if (!upload) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  return NextResponse.json(upload);
}
