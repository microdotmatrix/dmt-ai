import { GenerateObituary } from "@/components/sections/obituaries/generate";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getEntryById, getEntryDetailsById } from "@/lib/db/queries/entries";
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
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Entry
        </Link>
      </div>
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

  return <GenerateObituary entry={entry} entryDetails={entryDetails!} />;
};
