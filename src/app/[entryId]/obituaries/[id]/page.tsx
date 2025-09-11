import { ObituarySidebar } from "@/components/sections/obituaries/sidebar";
import { ObituaryViewer } from "@/components/sections/obituaries/viewer";
import { ObituaryViewerSkeleton } from "@/components/skeletons/obituary-viewer-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  getChatByDocumentId,
  getMessagesByChatId,
} from "@/lib/db/queries/chats";
import { getDocumentById } from "@/lib/db/queries/documents";
import { getEntryById } from "@/lib/db/queries/entries";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Link from "next/link";
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
          "--sidebar-width-mobile": "40rem",
        } as Object
      }
      defaultOpen={sidebarOpen || true}
      className="min-h-full grow"
    >
      <ObituarySidebar
        documentId={id}
        initialChat={existingChat}
        initialMessages={messages}
        isVisible={sidebarOpen}
      />

      <SidebarInset className="bg-transparent min-h-full grow">
        <SidebarTrigger />
        <Suspense fallback={<ObituaryViewerSkeleton />}>
          <ObituaryPageContent entryId={entryId} id={id} />
        </Suspense>
        <div className="absolute top-0 right-0 p-1 z-10">
          <Link
            href={`/${entryId}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Icon icon="mdi:close" className="size-6" />
          </Link>
        </div>
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
    <div className="p-8">
      <ObituaryViewer id={document.id} content={document.content!} />
    </div>
  );
};
