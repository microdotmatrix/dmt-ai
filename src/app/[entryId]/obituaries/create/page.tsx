import { EntryDetailsCard } from "@/components/sections/entries/details-card";
import { EntryCard } from "@/components/sections/entries/entry-card";
import { ObituaryOptions } from "@/components/sections/obituaries/options";
import { getEntryById, getEntryDetailsById } from "@/lib/db/queries/entries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default async function ObituaryCreatePage({ params }: PageProps) {
  const { entryId } = await params;

  return (
    <main>
      <Suspense fallback="Loading...">
        <ObituaryCreateContent entryId={entryId} />
      </Suspense>
    </main>
  );
}

const ObituaryCreateContent = async ({ entryId }: { entryId: string }) => {
  const [entry, entryDetails] = await Promise.all([
    getEntryById(entryId),
    getEntryDetailsById(entryId),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-6xl mx-auto py-8">
        <p>Generate an obituary for {entry.name}</p>
        <EntryCard entry={entry} />
        <EntryDetailsCard entry={entry} entryDetails={entryDetails!} />

        <ObituaryOptions />
      </div>
    </main>
  );
};
