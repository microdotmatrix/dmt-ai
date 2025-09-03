import { UIMessage, UIMessagePart } from "ai";
import { formatISO } from "date-fns";
import { z } from "zod";
import type { Suggestion } from "../db/schema";

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type CustomUIDataTypes = {
  textDelta: string;
  suggestion: typeof Suggestion;
  id: string;
  title: string;
};

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatMessage = UIMessage<CustomUIDataTypes, MessageMetadata>;

export function convertToUIMessages(messages: any): ChatMessage[] {
  return messages.map((message: any) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    parts: message.parts as UIMessagePart<CustomUIDataTypes, any>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}
