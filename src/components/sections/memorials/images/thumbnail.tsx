"use client";

import { ImageDialog } from "@/components/elements/image-dialog";
import { Button } from "@/components/ui/button";
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
      try {
        await deleteImage(image.id.toString());
        toast("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast("Failed to delete image");
      }
      startTransition(() => {
        router.refresh();
      });
    });
  };

  return (
    <figure className="relative overflow-hidden aspect-square">
      <ImageDialog
        src={image?.image_url}
        alt="Generated epitaph"
        className="cursor-pointer"
      />
      <figcaption className="absolute top-0.5 right-0.5 z-10 flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          className="p-1.5 rounded-md bg-background opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          disabled={isPending}
          onClick={() => downloadImage(image.image_url, `epitaph-${image.id}`)}
          aria-label="Download Image"
        >
          <Icon icon="carbon:download" className="size-4" />
        </Button>
        <Button
          variant="ghost"
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
        </Button>
      </figcaption>
    </figure>
  );
};
