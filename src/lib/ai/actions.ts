"use server";

import { saveDocument } from "@/lib/db/actions/documents";
import { createStreamableValue } from "@ai-sdk/rsc";
import { auth } from "@clerk/nextjs/server";
import { smoothStream, streamText } from "ai";
import { z } from "zod";
import { models } from "./models";
import { createPromptFromEntryData, systemPrompt } from "./prompts";

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
          id: crypto.randomUUID(),
          title: `Obituary for ${name}`,
          content: text,
          tokenUsage,
          kind: "obituary",
          entryId,
          userId,
        });
      },
    });

    // (async () => {
    //   const { textStream } = streamText({
    //     model: models.openai,
    //     system: systemPrompt,
    //     messages: [{ role: "user", content: prompt }],
    //     maxOutputTokens: 1000,
    //     experimental_transform: smoothStream({ chunking: "word" }),
    //     onFinish: async ({ usage, text }) => {
    //       const { totalTokens } = usage;

    //       tokenUsage = totalTokens;
    //       await saveDocument({
    //         id: crypto.randomUUID(),
    //         title: `Obituary for ${name}`,
    //         content: text,
    //         tokenUsage,
    //         kind: "obituary",
    //         entryId,
    //         userId,
    //       });
    //     },
    //   });

    //   for await (const delta of textStream) {
    //     generatedContent += delta;
    //     stream.update(delta);
    //   }

    //   stream.done();
    // })();

    return {
      success: true,
      result: createStreamableValue(textStream).value,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to generate obituary",
    };
  }
};
