"use server";

import { saveDocument } from "@/lib/db/actions/documents";
import { createStreamableValue } from "@ai-sdk/rsc";
import { auth } from "@clerk/nextjs/server";
import { smoothStream, streamText } from "ai";
import { z } from "zod";
import { models } from "./models";
import {
  analyzeDocumentPrompt,
  createPromptFromEntryData,
  createPromptFromFile,
  systemPrompt,
} from "./prompts";

const ObitFormSchema = z.object({
  name: z.string(),
  style: z.string(),
  tone: z.string(),
  toInclude: z.string(),
  toAvoid: z.string(),
  isReligious: z.coerce.boolean().default(false),
});

export const generateObituary = async (
  entryId: string,
  // languageModel: LanguageModel = models.openai,
  { data }: { data: FormData }
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // let stream = createStreamableValue("");

  try {
    const { name, style, tone, toInclude, toAvoid, isReligious } =
      ObitFormSchema.parse(Object.fromEntries(data));

    const prompt = await createPromptFromEntryData(
      entryId,
      style,
      tone,
      toInclude,
      toAvoid,
      isReligious
    );

    let tokenUsage: number | undefined = 0;
    let generatedContent = "";
    let id = crypto.randomUUID();

    const { textStream } = streamText({
      model: models.openai,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      maxOutputTokens: 1000,
      experimental_transform: smoothStream({ chunking: "word" }),
      onFinish: async ({ usage, text }) => {
        const { totalTokens } = usage;

        tokenUsage = totalTokens;
        await saveDocument({
          id,
          title: `Obituary for ${name}`,
          content: text,
          tokenUsage,
          kind: "obituary",
          entryId,
          userId,
        });
      },
    });

    return {
      success: true,
      result: createStreamableValue(textStream).value,
      id,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to generate obituary",
    };
  }
};

const ObitFromFileSchema = z.object({
  name: z.string(),
  instructions: z.string().optional(),
  file: z.string().base64(),
});

export const generateObituaryFromDocument = async (
  entryId: string,
  { data }: { data: FormData }
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // let stream = createStreamableValue("");

  try {
    const { name, instructions, file } = ObitFromFileSchema.parse(
      Object.fromEntries(data)
    );

    const prompt = await createPromptFromFile(entryId, instructions);

    let tokenUsage: number | undefined = 0;

    const id = crypto.randomUUID();

    const result = streamText({
      model: models.anthropic,
      system: analyzeDocumentPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "file",
              filename: name,
              mediaType: "application/pdf",
              data: file,
            },
          ],
        },
      ],
      maxOutputTokens: 1000,
      experimental_transform: smoothStream({ chunking: "word" }),
      onFinish: async ({ usage, text }) => {
        const { totalTokens } = usage;

        tokenUsage = totalTokens;
        await saveDocument({
          id,
          title: `Obituary for ${name}`,
          content: text,
          tokenUsage,
          kind: "obituary",
          entryId,
          userId,
        });
      },
    });

    return {
      success: true,
      result: createStreamableValue(result.textStream).value,
      id,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to generate obituary",
    };
  }
};

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: React.ReactNode;
}
