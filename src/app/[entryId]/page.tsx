// import { SavedQuotes } from "@/components/quotes/saved";
import { ActionButton } from "@/components/elements/action-button";
import { EntryDetailsCard } from "@/components/sections/entries/details-card";
import { EntryForm } from "@/components/sections/entries/entry-form";
import { EntryImageUpload } from "@/components/sections/entries/entry-image-upload";
import { EntryEditContentSkeleton } from "@/components/skeletons/entry-edit-content-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { deleteDocumentById } from "@/lib/db/actions/documents";
import { getEntryImages } from "@/lib/db/actions/images";
import { getUserGeneratedImages } from "@/lib/db/queries";
import { getDocumentsByEntryId } from "@/lib/db/queries/documents";
import { getEntryById, getEntryDetailsById } from "@/lib/db/queries/entries";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
  const obituaries = await getDocumentsByEntryId(entryId);

  // Fetch generated images for this deceased person
  const generatedImages = await getUserGeneratedImages(entry.userId!, entryId);

  return (
    <main>
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<EntryEditContentSkeleton />}>
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
    <div className="space-y-8 loading-fade">
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
            <EntryDetailsCard entry={entry} entryDetails={entryDetails!} />

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
                    <div className="space-y-2 max-h-60 overflow-y-auto scroll-style">
                      {obituaries.map((obituary) => (
                        <div
                          key={obituary.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {obituary.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(obituary.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {obituary.content.substring(0, 100)}...
                              </p>
                            </div>
                            <Link
                              href={`/${entry.id}/obituaries/${obituary.id}`}
                              className={buttonVariants({
                                variant: "outline",
                                size: "sm",
                                className: "size-8 p-0 flex-shrink-0",
                              })}
                            >
                              <Icon icon="mdi:eye" className="w-4 h-4" />
                            </Link>
                            <ActionButton
                              action={async () => {
                                "use server";
                                const result = await deleteDocumentById(
                                  obituary.id
                                );
                                if (result.success) {
                                  return { error: false };
                                } else {
                                  return { error: true, message: result.error };
                                }
                              }}
                              requireAreYouSure={true}
                              areYouSureDescription={`Are you sure you want to delete ${obituary.title}?`}
                              variant="destructive"
                              size="sm"
                              className="size-8 p-0 flex-shrink-0"
                            >
                              <Icon icon="mdi:delete" className="w-4 h-4" />
                            </ActionButton>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      {obituaries.length >= 5 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          <Icon
                            icon="mdi:do-not-disturb"
                            className="w-4 h-4 mr-2"
                          />
                          Obituary Limit Reached
                        </Button>
                      ) : (
                        <Link
                          href={`/${entry.id}/obituaries/create`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "w-full",
                          })}
                        >
                          <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                          Generate New Obituary
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      No obituaries generated yet.
                    </p>
                    <Link
                      href={`/${entry.id}/obituaries/create`}
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
                        href={`/${entry.id}/images/create`}
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
                      href={`/${entry.id}/images/create`}
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
