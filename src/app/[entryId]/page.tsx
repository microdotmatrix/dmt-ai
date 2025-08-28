// import { SavedQuotes } from "@/components/quotes/saved";
import { EntryDetailsDialog } from "@/components/sections/entries/details-dialog";
import { EntryForm } from "@/components/sections/entries/entry-form";
import { EntryImageUpload } from "@/components/sections/entries/entry-image-upload";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { getEntryImages } from "@/lib/db/actions/images";
import { getEntryById, getEntryDetailsById } from "@/lib/db/queries/entries";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Helper function to format family members for display
const formatFamilyMembers = (data: string | null | undefined): string => {
  if (!data || data.trim() === "") return "";

  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((member) => member && member.name && member.relationship)
        .map((member) => `${member.name} (${member.relationship})`)
        .join(", ");
    }
  } catch {
    // If parsing fails, return the original text
    return data;
  }

  return data;
};

// Helper function to convert 24-hour time to 12-hour AM/PM format
const formatTimeToAMPM = (time: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to format services for display
const formatServices = (data: string | null | undefined): string => {
  if (!data || data.trim() === "") return "";

  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((service) => service && service.location)
        .map((service) => {
          const location = service.location;
          const address = service.address ? ` at ${service.address}` : "";

          let dateTimeInfo = "";
          if (service.date) {
            const date = new Date(service.date).toLocaleDateString();
            const timeRange =
              service.startTime && service.endTime
                ? `${formatTimeToAMPM(service.startTime)} - ${formatTimeToAMPM(
                    service.endTime
                  )}`
                : service.startTime
                ? formatTimeToAMPM(service.startTime)
                : service.endTime
                ? `until ${formatTimeToAMPM(service.endTime)}`
                : "";
            dateTimeInfo = ` on ${date}${timeRange ? ` at ${timeRange}` : ""}`;
          }

          return `${location}${address}${dateTimeInfo}`;
        })
        .join("\n");
    }
  } catch {
    // If parsing fails, return the original text
    return data;
  }

  return data;
};

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default async function EntryEditPage({ params }: PageProps) {
  const { entryId } = await params;
  const entry = await getEntryById(entryId);

  if (!entry) {
    notFound();
  }

  // Fetch obituaries for this deceased person
  // const obituaries = await getObituariesByDeceasedId(entryId);
  const obituaries: any[] = [];

  // Fetch generated images for this deceased person
  // const generatedImages = await getGeneratedImagesByDeceasedId(entryId);
  const generatedImages: any[] = [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback="Loading...">
          <EntryEditContent
            entry={entry}
            obituaries={obituaries}
            generatedImages={generatedImages}
          />
        </Suspense>
      </div>
    </main>
  );
}

const EntryEditContent = async ({
  entry,
  obituaries,
  generatedImages,
}: {
  entry: any;
  obituaries: any[];
  generatedImages: any[];
}) => {
  const entryDetails = await getEntryDetailsById(entry.id);
  const entryImagesResult = await getEntryImages(entry.id);
  const entryImages = entryImagesResult.success
    ? entryImagesResult.images || []
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Edit Form - Takes up 2/3 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Commemoration Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <EntryForm entry={entry} />
            </CardContent>
          </Card>

          {/* Obituary Details Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Obituary Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon="mdi:account-details" className="w-5 h-5" />
                  Obituary Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entryDetails &&
                  [
                    entryDetails.occupation,
                    entryDetails.jobTitle,
                    entryDetails.companyName,
                    entryDetails.yearsWorked,
                    entryDetails.education,
                    entryDetails.accomplishments,
                    entryDetails.biographicalSummary,
                    entryDetails.hobbies,
                    entryDetails.personalInterests,
                    entryDetails.familyDetails,
                    entryDetails.survivedBy,
                    entryDetails.precededBy,
                    entryDetails.serviceDetails,
                    entryDetails.donationRequests,
                    entryDetails.specialAcknowledgments,
                    entryDetails.additionalNotes,
                  ].some((value) => value && value.trim() !== "") ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Professional & Personal */}
                        <div className="space-y-3">
                          {entryDetails.occupation && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Occupation
                              </span>
                              <p className="text-sm mt-1">
                                {entryDetails.occupation}
                              </p>
                            </div>
                          )}
                          {entryDetails.jobTitle && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Job Title
                              </span>
                              <p className="text-sm mt-1">
                                {entryDetails.jobTitle}
                              </p>
                            </div>
                          )}
                          {entryDetails.companyName && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Company
                              </span>
                              <p className="text-sm mt-1">
                                {entryDetails.companyName}
                              </p>
                            </div>
                          )}
                          {entryDetails.yearsWorked && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Years Worked
                              </span>
                              <p className="text-sm mt-1">
                                {entryDetails.yearsWorked}
                              </p>
                            </div>
                          )}
                          {entryDetails.education && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Education
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.education}
                              </p>
                            </div>
                          )}
                          {entryDetails.accomplishments && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Accomplishments
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.accomplishments}
                              </p>
                            </div>
                          )}
                          {entryDetails.hobbies && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Hobbies
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.hobbies}
                              </p>
                            </div>
                          )}
                          {entryDetails.personalInterests && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Personal Interests
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.personalInterests}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Life Story & Family */}
                        <div className="space-y-3">
                          {entryDetails.biographicalSummary && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Biographical Summary
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.biographicalSummary}
                              </p>
                            </div>
                          )}
                          {entryDetails.familyDetails && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Family Details
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.familyDetails}
                              </p>
                            </div>
                          )}
                          {entryDetails.survivedBy &&
                            formatFamilyMembers(entryDetails.survivedBy) && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Survived By
                                </span>
                                <p className="text-sm mt-1 whitespace-pre-wrap">
                                  {formatFamilyMembers(entryDetails.survivedBy)}
                                </p>
                              </div>
                            )}
                          {entryDetails.precededBy &&
                            formatFamilyMembers(entryDetails.precededBy) && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Preceded By
                                </span>
                                <p className="text-sm mt-1 whitespace-pre-wrap">
                                  {formatFamilyMembers(entryDetails.precededBy)}
                                </p>
                              </div>
                            )}
                          {entryDetails.serviceDetails &&
                            formatServices(entryDetails.serviceDetails) && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Service Details
                                </span>
                                <p className="text-sm mt-1 whitespace-pre-wrap">
                                  {formatServices(entryDetails.serviceDetails)}
                                </p>
                              </div>
                            )}
                          {entryDetails.donationRequests && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Donation Requests
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.donationRequests}
                              </p>
                            </div>
                          )}
                          {entryDetails.specialAcknowledgments && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Special Acknowledgments
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.specialAcknowledgments}
                              </p>
                            </div>
                          )}
                          {entryDetails.additionalNotes && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Additional Notes
                              </span>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {entryDetails.additionalNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <EntryDetailsDialog
                          entry={entry}
                          initialData={entryDetails}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Add detailed information about {entry.name} to generate
                        comprehensive obituaries with rich biographical details,
                        family relationships, and service information.
                      </p>
                      <EntryDetailsDialog
                        entry={entry}
                        initialData={entryDetails}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photos & Images Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-5 h-5" />
                  Photos & Images ({entryImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload and manage photos for {entry.name}'s memorial.
                  </p>
                  <EntryImageUpload
                    entryId={entry.id}
                    initialImages={entryImages}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Content Sections - Takes up 1/3 */}
        <div className="space-y-6">
          {/* Generated Obituaries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:file-document-outline" className="w-5 h-5" />
                Obituaries ({obituaries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {obituaries.length > 0 ? (
                  <>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {obituaries.map((obituary) => (
                        <div
                          key={obituary.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {obituary.fullName}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(obituary.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {obituary.generatedText.substring(0, 100)}...
                              </p>
                            </div>
                            <Link
                              href={`/${entry.id}/obituaries/${obituary.id}`}
                              className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                                className: "h-8 w-8 p-0 flex-shrink-0",
                              })}
                            >
                              <Icon icon="mdi:eye" className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <Link
                        href={`/${entry.id}/obituaries/new`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "w-full",
                        })}
                      >
                        <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                        Generate New Obituary
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      No obituaries generated yet.
                    </p>
                    <Link
                      href={`/${entry.id}/obituaries/new`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full",
                      })}
                    >
                      <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                      Generate Obituary
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Memorial Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:image-multiple-outline" className="w-5 h-5" />
                Memorial Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedImages && generatedImages.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {generatedImages.slice(0, 3).map((image) => (
                        <div
                          key={image.id}
                          className="flex items-center justify-between p-2 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                              <Icon
                                icon="mdi:image"
                                className="w-6 h-6 text-gray-400"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Memorial Image #{image.epitaphId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(image.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {image.status}
                          </div>
                        </div>
                      ))}
                    </div>
                    {generatedImages.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{generatedImages.length - 3} more images
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        href={`/${entry.id}/images`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "flex-1",
                        })}
                      >
                        <Icon icon="mdi:eye" className="w-4 h-4 mr-2" />
                        View All
                      </Link>
                      <Link
                        href={`/${entry.id}/images/new`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "flex-1",
                        })}
                      >
                        <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                        Create New
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      No memorial images created yet.
                    </p>
                    <Link
                      href={`/${entry.id}/images/new`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full",
                      })}
                    >
                      <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                      Create Memorial Image
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saved Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:format-quote-close" className="w-5 h-5" />
                Saved Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px]">
                <span>No saved quotes</span>
              </div>
            </CardContent>
          </Card>

          {/* Entry Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:information-outline" className="w-5 h-5" />
                Entry Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Created:</span>
                  <br />
                  <span className="text-muted-foreground">
                    {format(
                      new Date(entry.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <br />
                  <span className="text-muted-foreground">
                    {format(
                      new Date(entry.updatedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function SavedQuotesSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-muted animate-pulse mb-4"></div>
      <div className="h-4 w-48 bg-muted animate-pulse mb-2"></div>
      <div className="h-4 w-32 bg-muted animate-pulse mb-4"></div>
      <div className="h-8 w-28 bg-muted animate-pulse rounded-md"></div>
    </div>
  );
}
