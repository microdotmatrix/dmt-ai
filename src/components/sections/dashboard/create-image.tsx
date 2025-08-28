"use client";

import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEntryImage } from "@/lib/state";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export const CreateEntryImage = () => {
  const { image, uploading } = useEntryImage();
  const isMobile = useIsMobile();

  return (
    <motion.figure
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "w-full lg:max-w-[75%] mx-auto relative h-full overflow-hidden aspect-square",
        isMobile && "w-full h-80"
      )}
    >
      <Badge variant="outline" className="absolute top-1 left-1 z-10 bg-muted">
        Preview
      </Badge>
      <Image
        src={image || "/images/create-entry_portrait-01.png"}
        alt="Create Entry"
        fill
        className="object-cover object-center size-full"
      />
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
    </motion.figure>
  );
};
