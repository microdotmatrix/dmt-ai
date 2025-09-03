import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const models = {
  openai: openai("gpt-4o-mini"),
  anthropic: anthropic("claude-3-5-sonnet-20240620"),
  openrouter: openrouter("@preset/obituary-generator"),
};
