"use client";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai/prompt-input";
import { Response } from "@/components/ai/response";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { convertToUIMessages } from "@/lib/ai/utils";
import { generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ObituarySidebarProps {
  documentId: string;
  initialChat?: {
    id: string;
    title: string;
    userId: string;
    entryId: string;
    createdAt: Date;
    visibility: "public" | "private";
  } | null;
  initialMessages?: Array<{
    id: string;
    chatId: string;
    role: string;
    parts: unknown;
    attachments: unknown;
    createdAt: Date;
  }>;
}

export const ObituarySidebar = ({
  documentId,
  initialChat,
  initialMessages = [],
}: ObituarySidebarProps) => {
  const [input, setInput] = useState("");

  // Use existing chat ID or generate new UUID
  const chatId = useMemo(() => {
    return initialChat?.id || generateUUID();
  }, [initialChat]);

  // Convert initial messages to UI format
  const convertedMessages = useMemo(() => {
    return convertToUIMessages(initialMessages);
  }, [initialMessages]);

  const router = useRouter();

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    setMessages,
  } = useChat({
    id: chatId || undefined,
    transport: new DefaultChatTransport({
      api: `/api/create`,
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            message: messages.at(-1),
            documentId,
            visibility: "public",
            ...body,
          },
        };
      },
    }),
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
    onFinish: () => {
      router.refresh();
    },
  });

  // Set initial messages when they're loaded
  useEffect(() => {
    if (convertedMessages.length > 0 && setMessages) {
      setMessages(convertedMessages);
    }
  }, [convertedMessages, setMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <Sidebar variant="sidebar" className="top-4">
      <SidebarHeader className="pt-[var(--header-height)] mt-4">
        <h2 className="text-lg font-semibold">Edit Obituary</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4 text-sm text-muted-foreground">
          <p className="mb-2">
            Request suggestions, revisions, and make changes to your obituary by
            interacting with the chat input below.
          </p>
          <p className="text-xs">
            You can ask for tone adjustments, content additions, grammar fixes,
            or any other improvements.
          </p>
        </div>
        {messages.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
<<<<<<< HEAD
<<<<<<< HEAD
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm lg:text-base ${
=======
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
>>>>>>> f697123 (feat: add obituary chat sidebar and document management features)
=======
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm lg:text-base ${
>>>>>>> 82b2bd8 (feat: add 5 obituary limit and improve UI layout responsiveness)
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return <Response key={index}>{part.text}</Response>;
                    }
                    if (part.type === "data-updateDocument") {
                      return (
                        <div key={index}>
<<<<<<< HEAD
<<<<<<< HEAD
                          <p className="text-sm lg:text-base">
=======
                          <p>
>>>>>>> f697123 (feat: add obituary chat sidebar and document management features)
=======
                          <p className="text-sm lg:text-base">
>>>>>>> 82b2bd8 (feat: add 5 obituary limit and improve UI layout responsiveness)
                            {
                              (part.data as { changeDescription: string })
                                .changeDescription
                            }
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center text-muted-foreground text-sm">
              Get started by typing a message below!
            </div>
          </div>
        )}
        {(status === "streaming" || status === "submitted") && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {status === "submitted" && <div>Loading...</div>}
            <Button
              variant="outline"
              onClick={stop}
              disabled={status !== "streaming"}
            >
              <Icon icon="lucide:square" className="size-4" />
            </Button>
          </div>
        )}
        {error && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center text-destructive text-sm">
              {error.message}
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder="Ask AI to edit your obituary..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <div className="flex justify-end p-2">
            <PromptInputSubmit
              status={status === "streaming" ? "streaming" : undefined}
              disabled={!input.trim() || status === "streaming"}
            />
          </div>
        </PromptInput>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
