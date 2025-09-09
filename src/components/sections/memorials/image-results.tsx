"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadImage } from "@/lib/helpers";
import type { PlacidImage } from "@/lib/services/placid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImagePollerProps {
  initialImageData: PlacidImage;
  id: number;
}

export function ImageResult({ initialImageData, id }: ImagePollerProps) {
  const [imageData, setImageData] = useState<PlacidImage | undefined>(
    initialImageData
  );
  const [isPolling, setIsPolling] = useState(
    initialImageData.status === "queued"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollImage = async () => {
      try {
        const response = await fetch(`/api/image/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }

        const data = await response.json();
        setImageData(data);

        if (data.status !== "queued") {
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Error polling image:", err);
        setError("Failed to update image status");
        setIsPolling(false);
      }
    };

    if (isPolling) {
      // Poll every second
      intervalId = setInterval(pollImage, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, isPolling]);

  if (error || imageData?.status === "error") {
    return (
      <div className="grid place-content-center p-4 lg:p-8 aspect-square w-full">
        <Icon icon="carbon:warning-alt" className="mx-auto size-12" />
        <p className="text-center">{error || "Error generating image"}</p>
      </div>
    );
  }

  if (imageData?.status === "queued") {
    return (
      <div className="grid place-content-center p-4 lg:p-8 aspect-square w-full">
        <Icon icon="mdi:loading" className="animate-spin mx-auto size-12" />
        <p className="text-center">Image is processing</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {imageData?.image_url ? (
        <figure className="border rounded-md overflow-hidden relative aspect-square size-full">
          <Image
            src={imageData.image_url}
            alt="Generated Epitaph"
            width={1200}
            height={1200}
            priority
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute top-2 right-2 z-10 flex flex-col items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger className="bg-accent/80 hover:bg-accent text-accent-foreground rounded-md overflow-hidden shadow-lg transition-all">
                <Button
                  asChild
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    downloadImage(
                      imageData?.image_url,
                      `epitaph-${imageData?.id}`
                    )
                  }
                  className="p-2.5 lg:p-2 rounded-sm transition-colors"
                >
                  <Icon icon="carbon:download" className="size-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span>Download Image</span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="bg-accent/80 hover:bg-accent text-accent-foreground rounded-md overflow-hidden shadow-lg transition-all">
                <Button
                  asChild
                  size="icon"
                  variant="ghost"
                  className="p-2.5 lg:p-2 rounded-sm transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(imageData?.image_url);
                    toast("Image URL copied to clipboard");
                  }}
                >
                  <Icon icon="carbon:copy" className="size-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span>Copy Image URL</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </figure>
      ) : (
        <div className="grid place-content-center mx-auto p-4 lg:p-8 aspect-square w-full">
          <Icon icon="tabler:alert-triangle" className="size-8 text-red-700" />
          <p>Image not available</p>
        </div>
      )}
    </div>
  );
}

const ImageContainer = ({ image }: { image: PlacidImage }) => {
  return (
    <figure className="border rounded-md overflow-hidden relative aspect-square size-full">
      <Image
        src={image?.image_url}
        alt="Generated epitaph"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover size-full"
      />
    </figure>
  );
};

const ImageActions = ({ image }: { image: PlacidImage }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2"></div>
  );
};
