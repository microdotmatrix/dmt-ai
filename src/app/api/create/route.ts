import { models } from "@/lib/ai/models";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const { data, messages } = await request.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const result = streamText({
        model: models.openai,
        system: data,
        messages: convertToModelMessages(messages),
        tools: {
          obituary: {
            description: "Generate an obituary for the given person.",
            inputSchema: z.object({
              name: z.string(),
              data: z.object({
                input: z.json(),
              }),
            }),
            execute: async ({ name, data }, { toolCallId }) => {
              writer.write({
                type: "data-obituary",
                id: toolCallId,
                data: { name, status: "loading" },
              });

              writer.write({
                type: "data-obituary",
                id: toolCallId,
                data: { name, data, status: "success" },
              });

              return { name, data };
            },
          },
        },
        onFinish: async ({ messages }) => {
          console.log(messages);
        },
      });
      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
