import { getDocumentsByEntryId } from "@/lib/db/queries/documents";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("entryId");

  const { userId } = await auth();

  if (!entryId) {
    return new Response("Entry ID is required", { status: 400 });
  }

  const documents = await getDocumentsByEntryId(entryId!);

  const [document] = documents;

  if (!document) {
    return new Response("Document not found", { status: 404 });
  }

  if (document.userId !== userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json(document, { status: 200 });
}
