import { models } from "@/lib/ai/models";
import { saveDocument } from "@/lib/db/actions";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const {
    messages,
    entryId,
    name,
  }: { messages: UIMessage[]; entryId: string; name: string } =
    await req.json();

  let tokenUsage: number | undefined = 0;

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const id = crypto.randomUUID();

  const result = streamText({
    model: models.openai,
    system:
      "You are a writing assistant specializing in obituaries. Analyze the content of the document file submitted by the user and generate a new or revised obituary according to the user instructions. If the user does not provide any instructions, generate an obituary using the same words and style as the document file submitted by the user, with minor revisions to improve readability and flow.",
    messages: convertToModelMessages(messages),
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

  console.log(result.toTextStreamResponse());

  return result.toTextStreamResponse();
}
