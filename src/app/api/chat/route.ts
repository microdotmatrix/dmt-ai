import { models } from "@/lib/ai/models";
import { assistantPrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { saveDocument } from "@/lib/db/actions/documents";
import { getDocumentById } from "@/lib/db/queries/documents";
import { auth } from "@clerk/nextjs/server";
import { streamText, tool, convertToModelMessages } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateDocument = tool({
  description:
    "Update the obituary document with revised content based on user's request",
  inputSchema: z.object({
    documentId: z.string().describe("The ID of the document to update"),
    revisedContent: z
      .string()
      .describe("The complete revised content of the obituary document"),
    changeDescription: z
      .string()
      .describe("Brief description of what changes were made"),
  }),
  execute: async ({ documentId, revisedContent, changeDescription }) => {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return { error: "Document not found" };
    }

    // Save the updated document
    const result = await saveDocument({
      id: document.id,
      title: document.title,
      entryId: document.entryId,
      content: revisedContent,
      kind: document.kind,
      tokenUsage: document.tokenUsage || 0,
      userId: document.userId,
    });

    if (result.error) {
      return { error: result.error };
    }

    return {
      success: true,
      message: `Document updated successfully. ${changeDescription}`,
      documentId,
    };
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages, documentId } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!documentId) {
      return new Response("Document ID is required", { status: 400 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(documentId)) {
      return new Response("Invalid document ID format", { status: 400 });
    }

    // Get the document content to provide context
    const document = await getDocumentById(documentId);
    if (!document) {
      return new Response("Document not found", { status: 404 });
    }

    const result = streamText({
      model: models.openai,
      system: assistantPrompt,
      messages: [
        {
          role: "system",
          content: updateDocumentPrompt(document.content),
        },
        ...convertToModelMessages(messages),
      ],
      tools: {
        updateDocument,
      },
      maxOutputTokens: 2000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
