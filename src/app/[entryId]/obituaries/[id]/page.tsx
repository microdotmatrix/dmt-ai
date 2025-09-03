import { ObituarySidebar } from "@/components/sections/obituaries/sidebar";
import { ObituaryViewer } from "@/components/sections/obituaries/viewer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getChatByDocumentId, getMessagesByChatId } from "@/lib/db/queries/chats";
import { getDocumentById } from "@/lib/db/queries/documents";
import { getEntryById } from "@/lib/db/queries/entries";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ entryId: string; id: string }>;
}

export default async function ObituaryPage({ params }: PageProps) {
  const { entryId, id } = await params;

  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  const { userId } = await auth();
  const document = await getDocumentById(id);

  const existingChat = await getChatByDocumentId({
    documentId: document.id,
    documentCreatedAt: document.createdAt,
    userId: userId!,
  });

  // Fetch messages if chat exists
  const messages = existingChat
    ? await getMessagesByChatId({ id: existingChat.id })
    : [];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "40rem",
          "--sidebar-width-mobile": "20rem",
        } as Object
      }
      defaultOpen={sidebarOpen}
      className="min-h-full grow"
    >
      <Suspense fallback="Loading...">
        <ObituarySidebar
          documentId={id}
          initialChat={existingChat}
          initialMessages={messages}
        />
      </Suspense>
      <SidebarInset className="bg-transparent min-h-full grow">
        <SidebarTrigger />
        <Suspense fallback="Loading...">
          <ObituaryPageContent entryId={entryId} id={id} />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}

const ObituaryPageContent = async ({
  entryId,
  id,
}: {
  entryId: string;
  id: string;
}) => {
  const entry = await getEntryById(entryId);

  if (!entry) {
    notFound();
  }

  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <p className="font-bold mb-6">{document.title}</p>
      <ObituaryViewer id={document.id} content={document.content!} />
    </div>
  );
};
