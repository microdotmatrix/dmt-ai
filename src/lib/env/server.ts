import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BASE_URL: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    PLACID_PRIVATE_TOKEN: z.string().min(1),
    STANDS4_UID: z.string().min(1),
    STANDS4_TOKENID: z.string().min(1),
    BIBLE_API_KEY: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
