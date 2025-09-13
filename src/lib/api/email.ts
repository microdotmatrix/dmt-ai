"use server";

import { EmailTemplate } from "@/components/email/template";
import { meta } from "@/lib/config";
import { resend } from "@/lib/services/resend";
import { action } from "@/lib/utils";
import { z } from "zod";

const emailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export const emailAction = action(emailSchema, async (_, formData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Missing name, email, or message" };
  }

  try {
    await resend.emails.send({
      from: `${meta.title} <${process.env.RESEND_EMAIL_FROM as string}>`,
      to: [process.env.RESEND_EMAIL_TO as string],
      subject: `New message from ${meta.title}`,
      react: EmailTemplate({ name, email, message }) as React.ReactElement,
    });
    return { success: "Email sent successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send email" };
  }
});
