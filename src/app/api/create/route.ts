import { models } from "@/lib/ai/models";
import { assistantPrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { convertToUIMessages } from "@/lib/ai/utils";
import { updateDocumentContent } from "@/lib/db/actions/documents";
import {
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries/chats";
import { getDocumentById } from "@/lib/db/queries/documents";
import { generateUUID } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const {
    message,
    documentId,
    id,
    visibility = "public",
  } = await request.json();

  const { userId } = await auth();

  const document = await getDocumentById(documentId);

  if (!document) {
    return new Response("Document not found", { status: 404 });
  }

  console.log("Attempting to get chat with ID:", id, "Type:", typeof id);

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error("Invalid UUID format:", id);
    return new Response("Invalid chat ID format", { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = document.title;

    await saveChat({
      id,
      userId,
      entryId: document.entryId,
<<<<<<< HEAD
<<<<<<< HEAD
      documentId: document.id,
      documentCreatedAt: document.createdAt,
=======
>>>>>>> f697123 (feat: add obituary chat sidebar and document management features)
=======
      documentId: document.id,
      documentCreatedAt: document.createdAt,
>>>>>>> 859b3cb (feat: add document reference to chat schema and update related queries)
      title,
      visibility,
    });
  } else {
    if (chat.userId !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const messageCount = await getMessageCountByUserId({
    id: userId,
    differenceInHours: 24,
  });

  if (messageCount >= 10) {
    return new Response("You have reached the message limit", { status: 403 });
  }

  const messagesFromDb = await getMessagesByChatId({ id });
  const uiMessages = [...convertToUIMessages(messagesFromDb), message];

  // Generate proper UUID for message ID
  const messageId = generateUUID();

  await saveMessages({
    messages: [
      {
        chatId: id,
        id: messageId,
        role: "user",
        parts: message.parts,
        attachments: [],
        createdAt: new Date(),
      },
    ],
  });

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
          ...convertToModelMessages(uiMessages),
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
              writer.write({
                type: "data-updateDocument",
                id: toolCallId,
                data: { changeDescription, status: "loading" },
              });

              // Save the updated document
              const result = await updateDocumentContent({
                id: document.id,
                title: document.title,
                entryId: document.entryId,
                content: revisedContent,
                tokenUsage: document.tokenUsage || 0,
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
    onFinish: async ({ messages }) => {
      await saveMessages({
        messages: messages.map((message) => ({
          id: generateUUID(), // Generate proper UUID for AI response messages
          role: message.role,
          parts: message.parts,
          attachments: [],
          chatId: id,
          createdAt: new Date(),
        })),
      });
    },
    onError: () => {
      return "Oops, an error occurred.";
    },
  });

  return createUIMessageStreamResponse({ stream });
}
