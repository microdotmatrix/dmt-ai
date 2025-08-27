import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export const ImageDialog = ({
  src,
  alt,
  className,
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  if (!src) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={src as string}
          alt={alt || ""}
          sizes="100vw"
          className={className}
          style={{
            width: "100%",
            height: "auto",
          }}
          width={500}
          height={100}
        />
      </DialogTrigger>
      <DialogContent className="lg:max-w-5xl border-0 bg-transparent p-0">
        <DialogTitle className="sr-only">Image</DialogTitle>
        <DialogDescription className="sr-only">Image</DialogDescription>
        <div className="relative size-full aspect-square overflow-clip rounded-md bg-transparent shadow-md">
          <Image
            src={src as string}
            fill
            alt={alt || ""}
            className="object-contain size-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
