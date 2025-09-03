import { models } from "@/lib/ai/models";
import { assistantPrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { saveDocument } from "@/lib/db/actions/documents";
import { getDocumentById } from "@/lib/db/queries/documents";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
} from "ai";
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
  execute: async (
    { documentId, revisedContent, changeDescription },
    { toolCallId }
  ) => {
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

export async function POST(request: NextRequest) {
  const { messages, params } = await request.json();
  const { documentId } = params;

  const document = await getDocumentById(documentId);

  if (!document) {
    return new Response("Document not found", { status: 404 });
  }

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
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
          updateDocument: {
            description:
              "Update the obituary document with revised content based on user's request",
            inputSchema: z.object({
              documentId: z
                .string()
                .describe("The ID of the document to update"),
              revisedContent: z
                .string()
                .describe(
                  "The complete revised content of the obituary document"
                ),
              changeDescription: z
                .string()
                .describe("Brief description of what changes were made"),
            }),
            execute: async (
              { revisedContent, changeDescription },
              { toolCallId }
            ) => {
              // const document = await getDocumentById(documentId);

              // if (!document) {
              //   return { error: "Document not found" };
              // }
              writer.write({
                type: "data-updateDocument",
                id: toolCallId,
                data: { changeDescription, status: "loading" },
              });

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
                writer.write({
                  type: "data-updateDocument",
                  id: toolCallId,
                  data: { changeDescription, revisedContent, status: "error" },
                });
                return { error: result.error };
              }

              writer.write({
                type: "data-updateDocument",
                id: toolCallId,
                data: { changeDescription, revisedContent, status: "success" },
              });

              return {
                success: true,
                message: `Document updated successfully. ${changeDescription}`,
                documentId: document.id,
                revisedContent,
                changeDescription,
              };
            },
          },
        },
        onFinish: async ({ toolResults }) => {
          console.log(toolResults);
        },
      });
      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
