import { GenerateObituary } from "@/components/sections/obituaries/generate";
import { ObituaryCreateSkeleton } from "@/components/skeletons/obituary-create-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  getDocumentsByEntryId,
  getEntryById,
  getEntryDetailsById,
} from "@/lib/db/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default async function ObituaryCreatePage({ params }: PageProps) {
  const { entryId } = await params;

  return (
    <main>
      <div className="flex items-center gap-4 px-4 lg:px-8 mt-8 mb-4">
        <Link
          href={`/${entryId}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Icon icon="mdi:arrow-left" className="size-4 mr-2" />
          Back to Entry
        </Link>
      </div>
      <Suspense fallback={<ObituaryCreateSkeleton />}>
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

  const documents = await getDocumentsByEntryId(entryId);

  if (!entry) {
    notFound();
  }

  if (documents.length >= 5) {
    return (
      <div>
        <p className="text-center">
          You have reached the maximum number of obituaries for this entry.
          Return to your <Link href={`/${entryId}`}>entry</Link> to edit
          existing obituaries, or delete an obituary to make room for a new one.
        </p>
      </div>
    );
  }

  return <GenerateObituary entry={entry} entryDetails={entryDetails!} />;
};
