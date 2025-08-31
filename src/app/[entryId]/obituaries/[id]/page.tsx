import { Response } from "@/components/ai/response";
import { getDocumentById } from "@/lib/db/queries/documents";
import { getEntryById } from "@/lib/db/queries/entries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ entryId: string; id: string }>;
}

export default async function ObituaryPage({ params }: PageProps) {
  const { entryId, id } = await params;

  return (
    <main>
      <Suspense fallback="Loading...">
        <ObituaryPageContent entryId={entryId} id={id} />
      </Suspense>
    </main>
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
    <div className="max-w-6xl mx-auto">
      <p>{document.title}</p>
      <Response key={document.id}>{document.content}</Response>
    </div>
  );
};
