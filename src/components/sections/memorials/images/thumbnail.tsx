"use client";

import { ImageDialog } from "@/components/elements/image-dialog";
import { Icon } from "@/components/ui/icon";
import { deleteImage } from "@/lib/db/actions/media";
import { downloadImage } from "@/lib/helpers";
import type { PlacidImage } from "@/lib/services/placid";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const EpitaphThumbnail = ({ image }: { image: PlacidImage }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteImage(image.id.toString());
      startTransition(() => {
        toast("Image deleted successfully");
        router.refresh();
      });
    });
  };

  return (
    <figure className="relative overflow-hidden aspect-square">
      <ImageDialog src={image?.image_url} alt="Generated epitaph" />
      <figcaption className="absolute top-0.5 right-0.5 z-10 flex items-center justify-center gap-1">
        <button
          className="p-1.5 rounded-md bg-background opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          disabled={isPending}
          onClick={() => downloadImage(image.image_url, `epitaph-${image.id}`)}
          aria-label="Download Image"
        >
          <Icon icon="carbon:download" className="size-4" />
        </button>
        {/* <button
          className="p-1.5 rounded-md bg-background opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          disabled={isPending}
          onClick={handleDelete}
          aria-label="Delete Image"
        >
          {isPending ? (
            <Icon icon="mdi:loading" className="animate-spin size-4" />
          ) : (
            <Icon icon="mdi:close" className="size-4" />
          )}
        </button> */}
      </figcaption>
    </figure>
  );
};
