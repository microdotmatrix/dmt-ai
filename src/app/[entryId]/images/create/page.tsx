import { CreateImage } from "@/components/sections/memorials/create-image";
import { ImageResult } from "@/components/sections/memorials/image-results";
import { Icon } from "@/components/ui/icon";
import { createEpitaphs } from "@/lib/db/actions";
import { getEntryById } from "@/lib/db/queries";
import type { PlacidImage, PlacidRequest } from "@/lib/services/placid";
import { fetchImage } from "@/lib/services/placid";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export async function getEpitaphImage(id: number) {
  try {
    if (!id) return null;

    const imageData = await fetchImage(id);
    return imageData;
  } catch (error) {
    console.error("Error fetching epitaph image:", error);
    return null;
  }
}

export default async function Create({
  params,
  searchParams,
}: {
  params: Promise<{ entryId: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { entryId } = await params;
  const { id } = await searchParams;
  const imageIds = id ? id.split(",").map((id) => Number(id)) : [];

  let images: PlacidImage[] = [];

  if (imageIds.length > 0) {
    images = (await Promise.all(
      imageIds.map(async (id) => await getEpitaphImage(id))
    )) as PlacidImage[];
  }
  const { userId } = await auth();
  // const { quotes } = await getUserSavedQuotes();

  // Fetch the deceased data for this entry
  const deceased = await getEntryById(entryId);
  if (!deceased) {
    redirect("/dashboard");
  }

  // Create action wrapper that includes the entryId
  const createEpitaphsAction = async (formData: PlacidRequest) => {
    "use server";
    return createEpitaphs(formData, entryId);
  };

  return (
    <main className="flex flex-col lg:flex-row items-center lg:items-start relative pb-12 lg:pb-24">
      <aside className="flex-none lg:flex-1/3 sticky lg:top-32 mt-12 order-2 lg:order-1">
        <CreateImage
          action={createEpitaphsAction}
          userId={userId}
          deceased={deceased}
          entryId={entryId}
        />
      </aside>
      <article className="flex-1 lg:flex-2/3 px-4 order-1 lg:order-2 flex">
        <Suspense fallback={<div>Loading...</div>}>
          {imageIds.length > 0 ? (
            <div className=" grid lg:grid-cols-2 gap-2 mx-auto my-4">
              {images &&
                images.map((image) => (
                  <ImageResult
                    key={image.id}
                    id={image.id}
                    initialImageData={image}
                  />
                ))}
            </div>
          ) : (
            <div className="grid place-content-center w-full relative">
              <div className="flex flex-col lg:flex-row items-center gap-4 pt-12 lg:pt-24 relative top-0 lg:top-full">
                <Icon
                  icon="line-md:arrow-left"
                  className="size-8 hidden lg:block mt-0.5"
                />
                <h6 className="text-center text-foreground/75">
                  <span className="starting:opacity-0 opacity-100 transition-all duration-1000 delay-1500">
                    Complete the form
                  </span>{" "}
                  <span className="starting:opacity-0 opacity-100 transition-all duration-1000 delay-2500">
                    to generate a new image
                  </span>
                </h6>
                <Icon icon="line-md:arrow-down" className="size-8 lg:hidden" />
              </div>
            </div>
          )}
        </Suspense>
      </article>
    </main>
  );
}
