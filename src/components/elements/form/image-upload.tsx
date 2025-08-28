"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  images?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export const ImageUpload = ({
  onUpload,
  onRemove,
  images = [],
  maxFiles = 10,
  maxSize = 5,
  className,
  disabled = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      // Check if adding these files would exceed the limit
      if (images.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }

      // Check file sizes
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        toast.error(`Files must be smaller than ${maxSize}MB`);
        return;
      }

      setUploading(true);
      try {
        onUpload?.(acceptedFiles);
      } catch (error) {
        toast.error("Failed to upload images");
      } finally {
        setUploading(false);
      }
    },
    [images.length, maxFiles, maxSize, onUpload, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    disabled: disabled || uploading,
    multiple: true,
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove?.(index)}
                disabled={disabled}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          uploading && "opacity-50"
        )}
      >
        <Input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Icon
            icon={uploading ? "lucide:loader-2" : "lucide:cloud-upload"}
            className={cn(
              "h-8 w-8 text-muted-foreground",
              uploading && "animate-spin"
            )}
          />
          <div className="text-sm">
            <span className="font-medium">
              {uploading ? "Uploading..." : "Click to upload"}
            </span>{" "}
            or drag and drop
          </div>
          <div className="text-xs text-muted-foreground">
            PNG, JPG, GIF up to {maxSize}MB ({maxFiles - images.length}{" "}
            remaining)
          </div>
        </div>
      </div>
    </div>
  );
};
