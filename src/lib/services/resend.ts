import { env } from "@/lib/env/server";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);
