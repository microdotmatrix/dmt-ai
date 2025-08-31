import { GenerateObituary } from "@/components/sections/obituaries/generate";
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
      <GenerateObituary entry={entry} entryDetails={entryDetails!} />
    </main>
  );
};
