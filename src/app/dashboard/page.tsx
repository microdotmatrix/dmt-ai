import { ActionButton } from "@/components/elements/action-button";
import { CreatePortal } from "@/components/sections/dashboard/create-dialog";
import { CreateEntryForm } from "@/components/sections/dashboard/create-form";
import { CreateEntryImage } from "@/components/sections/dashboard/create-image";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { upsertUser } from "@/lib/auth/actions";
import { deleteEntryAction } from "@/lib/db/actions/entries";
import { getCreatorEntries, getUserUploads } from "@/lib/db/queries/entries";
import { Entry } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { differenceInYears, format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="grid h-full place-items-center">
        <article className="max-w-lg mx-auto space-y-8 text-center">
          <h1>Access Denied</h1>
          <p>
            You must have an account to access our tools. Please{" "}
            <Link href="/sign-in">sign in</Link>, or{" "}
            <Link href="/sign-up">create an account</Link> to get started.
          </p>
        </article>
      </main>
    );
  }

  await upsertUser(userId);

  return (
    <main className="grid h-full place-items-center">
      <div className="max-w-screen-2xl w-full mx-auto py-8">
        <PageContent />
      </div>
    </main>
  );
}

const PageContent = async () => {
  const entries = await getCreatorEntries();
  const uploads = await getUserUploads();
  const hasEntries = entries.length > 0;
  const [featuredEntry, ...remainingEntries] = entries;

  // Calculate server-side date stats to avoid hydration mismatch
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate entries this month on server side
  const entriesThisMonth = entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt);
    return (
      entryDate.getMonth() === currentMonth &&
      entryDate.getFullYear() === currentYear
    );
  }).length;

  let featuredEntryStats = null;
  if (featuredEntry) {
    // const [obituaries, generatedImages] = await Promise.all([
    //   getObituariesByDeceasedId(featuredEntry.id),
    //   getGeneratedImagesByDeceasedId(featuredEntry.id),
    // ]);
    featuredEntryStats = {
      obituariesCount: 0,
      imagesCount: 0,
    };
  }

  if (!hasEntries) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        <div className="w-full lg:w-1/3">
          <CreateEntryForm />
        </div>
        <div className="w-full lg:w-2/3">
          <CreateEntryImage />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <CreatePortal />
      </div>

      {/* Featured Entry - Large Section */}
      <section className="min-h-[50vh]">
        <FeaturedEntryCard entry={featuredEntry} stats={featuredEntryStats} />
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Previous Entries (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">Previous Entries</h2>
          {remainingEntries.length > 0 ? (
            <div className="space-y-4">
              {remainingEntries.map((entry) => (
                <PreviousEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No previous entries yet.</p>
          )}
        </div>

        {/* Right Column - User Stats (1/3 width) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Statistics</h2>
          <UserStats
            entries={entries}
            uploads={uploads}
            entriesThisMonth={entriesThisMonth}
          />
        </div>
      </div>
    </div>
  );
};

const FeaturedEntryCard = ({
  entry,
  stats,
}: {
  entry: Entry;
  stats: { obituariesCount: number; imagesCount: number } | null;
}) => {
  return (
    <Card className="border-0 shadow-none">
      <div className="grid md:grid-cols-2 min-h-fit">
        {/* Image Section - Left Half */}
        <figure className="relative shadow-xl dark:shadow-foreground/5 transition-shadow duration-200 rounded-lg overflow-clip aspect-auto 3xl:aspect-[4/3] max-w-full">
          <Image
            src={entry.image!}
            alt={entry.name}
            height={1280}
            width={1280}
            className="h-full w-full object-cover"
            priority
          />
        </figure>

        {/* Content Section - Right Half */}
        <div className="p-8 flex flex-col justify-center space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Most Recent
            </p>
            <h2 className="text-4xl font-bold mb-4">{entry.name}</h2>
            {entry.locationBorn && (
              <p className="text-lg text-muted-foreground mb-6">
                {entry.locationBorn}
              </p>
            )}
          </div>

          <div className="space-y-1 h-full">
            <div className="flex items-center gap-4">
              <span className="font-medium">Born:</span>
              <span>
                {entry.dateOfBirth
                  ? format(new Date(entry.dateOfBirth), "MMMM d, yyyy")
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Died:</span>
              <span>
                {entry.dateOfDeath
                  ? format(new Date(entry.dateOfDeath), "MMMM d, yyyy")
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Age:</span>
              <span>
                {entry.dateOfBirth && entry.dateOfDeath
                  ? differenceInYears(
                      new Date(entry.dateOfDeath),
                      new Date(entry.dateOfBirth)
                    )
                  : ""}{" "}
                years
              </span>
            </div>

            {/* Generated Content Stats */}
            {stats && (
              <>
                <div className="h-px bg-border my-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Generated Content
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Obituaries:</span>
                    <span className="flex items-center gap-1">
                      <Icon
                        icon="mdi:file-document-outline"
                        className="w-4 h-4"
                      />
                      {stats.obituariesCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Memorial Images:</span>
                    <span className="flex items-center gap-1">
                      <Icon
                        icon="mdi:image-multiple-outline"
                        className="w-4 h-4"
                      />
                      {stats.imagesCount}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col gap-2 pr-4">
            <ActionButtons entry={entry} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const PreviousEntryCard = ({ entry }: { entry: Entry }) => {
  return (
    <Card className="hover:shadow-xl dark:shadow-foreground/5 transition-shadow duration-200 p-0">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Small thumbnail on the left */}
          <div className="relative w-full md:size-40 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={entry.image!}
              alt={entry.name}
              width={420}
              height={420}
              className="size-full object-cover"
            />
          </div>

          {/* Name and dates in the middle */}
          <div className="flex-grow min-w-0 w-full pl-4 md:pl-0">
            <h3 className="font-semibold text-lg truncate">{entry.name}</h3>
            {entry.locationBorn && (
              <p className="text-sm text-muted-foreground truncate">
                {entry.locationBorn}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>
                {entry.dateOfBirth
                  ? format(new Date(entry.dateOfBirth), "MMM d, yyyy")
                  : ""}
              </span>
              <span>-</span>
              <span>
                {entry.dateOfDeath
                  ? format(new Date(entry.dateOfDeath), "MMM d, yyyy")
                  : ""}
              </span>
            </div>
            <div className="mt-4 pb-4 md:pb-0">
              <ActionButtons entry={entry} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UserStats = ({
  entries,
  uploads,
  entriesThisMonth,
}: {
  entries: Entry[];
  uploads: any[];
  entriesThisMonth: number;
}) => {
  const totalEntries = entries.length;
  const totalUploads = uploads.length;

  const stats = [
    {
      label: "Total Entries",
      value: totalEntries,
      icon: "mdi:account-multiple",
      color: "text-blue-600",
    },
    {
      label: "This Month",
      value: entriesThisMonth,
      icon: "mdi:calendar-month",
      color: "text-green-600",
    },
    {
      label: "Total Uploads",
      value: totalUploads,
      icon: "mdi:cloud-upload",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="px-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                <Icon icon={stat.icon} className="size-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-md font-semibold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const ActionButtons = ({ entry }: { entry: Entry }) => {
  const deleteAction = deleteEntryAction.bind(null, entry.id);
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Link
        href={`/${entry.id}`}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2",
        })}
      >
        <Icon icon="mdi:pencil-outline" className="size-4" /> Edit
      </Link>
      <Link
        href={`/${entry.id}/obituaries/new`}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2",
        })}
      >
        <Icon icon="mdi:plus" className="size-4" /> New Obituary
      </Link>
      <Link
        href={`/${entry.id}/images/new`}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2",
        })}
      >
        <Icon icon="mdi:image-outline" className="size-4" /> New Memorial Image
      </Link>
      <ActionButton
        variant="destructive"
        size="sm"
        className="flex items-center gap-2"
        action={deleteAction}
        requireAreYouSure
      >
        <Icon icon="mdi:delete-outline" className="size-4" /> Delete
      </ActionButton>
    </div>
  );
};
