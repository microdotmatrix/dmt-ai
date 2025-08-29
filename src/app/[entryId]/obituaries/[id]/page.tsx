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

  return (
    <main>
      <p>{entry.name}</p>
      <p>Obituary {id} content</p>
    </main>
  );
};
