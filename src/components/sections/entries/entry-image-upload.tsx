"use client";

import { ImageUpload } from "@/components/elements/form/image-upload";
import { deleteEntryImage, uploadEntryImage } from "@/lib/db/actions/images";
import { UserUpload } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EntryImageUploadProps {
  entryId: string;
  initialImages?: UserUpload[];
  className?: string;
}

export const EntryImageUpload = ({
  entryId,
  initialImages = [],
  className,
}: EntryImageUploadProps) => {
  const router = useRouter();
  const [images, setImages] = useState<UserUpload[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  // Convert UserUpload objects to URL strings for ImageUpload component
  const imageUrls = images.map((img) => img.url);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", file);

        // Upload to a simple storage solution (you can replace this with your preferred service)
        // For now, we'll use a data URL as a placeholder
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        // Upload to database
        const result = await uploadEntryImage(
          entryId,
          file.name,
          dataUrl, // In production, replace with actual file URL from storage service
          file.size,
          file.type,
          "local",
          `entry-${entryId}-${file.name}`,
          undefined
        );

        if (result.success && result.imageId) {
          // Add the new image to local state
          const newImage: UserUpload = {
            id: result.imageId,
            userId: "", // Will be filled by the server
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            url: dataUrl,
            thumbnailUrl: null,
            storageProvider: "local",
            storageKey: `entry-${entryId}-${file.name}`,
            metadata: null,
            isPublic: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setImages((prev) => [...prev, newImage]);
          return newImage;
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} image(s)`);
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];

    try {
      const result = await deleteEntryImage(imageToRemove.id, entryId);

      if (result.success) {
        setImages((prev) => prev.filter((_, i) => i !== index));
        toast.success("Image deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <ImageUpload
      onUpload={handleUpload}
      onRemove={handleRemove}
      images={imageUrls}
      maxFiles={20}
      maxSize={10}
      className={className}
      disabled={uploading}
    />
  );
};
