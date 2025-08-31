import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { customProvider } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const ai = customProvider({
  languageModels: {
    "chat-openai": openai("gpt-4o"),
    "chat-anthropic": anthropic("claude-3-5-sonnet-20240620"),
    "chat-openrouter": openrouter("@preset/obituary-generator"),
  },
});
