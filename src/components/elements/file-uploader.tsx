"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  Crop as CropIcon,
  File,
  FileAudio,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
      style={{ width: `${value}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export interface FileWithPreview {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string | null;
  preview?: string | null;
  croppedPreview?: string | null;
  originalFile?: File;
}

export interface FileUploaderProps {
  onFilesReady?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string[];
  className?: string;
  enableCropping?: boolean;
  cropAspectRatio?: number;
  cropMinWidth?: number;
  cropMinHeight?: number;
}

export function FileUploader({
  onFilesReady,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  accept = ["image/*", "application/pdf", "text/*"],
  className,
  enableCropping = false,
  cropAspectRatio,
  cropMinWidth = 50,
  cropMinHeight = 50,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentCropFile, setCurrentCropFile] =
    useState<FileWithPreview | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
        if (file.croppedPreview) URL.revokeObjectURL(file.croppedPreview);
      });
    };
  }, [files]);

  const getFileIcon = useCallback((file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-4 h-4" aria-hidden="true" />;
    if (file.type.startsWith("video/"))
      return <FileVideo className="w-4 h-4" aria-hidden="true" />;
    if (file.type.startsWith("audio/"))
      return <FileAudio className="w-4 h-4" aria-hidden="true" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" aria-hidden="true" />;
    return <File className="w-4 h-4" aria-hidden="true" />;
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`;
      }

      const fileType = file.type;
      const isAccepted = accept.some((type) => {
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.slice(0, -1));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return "File type not supported";
      }

      return null;
    },
    [maxSize, accept, formatFileSize]
  );

  const createCroppedImage = useCallback(
    async (
      image: HTMLImageElement,
      crop: Crop,
      fileName: string
    ): Promise<File> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const pixelCrop = convertToPixelCrop(
        crop,
        image.naturalWidth,
        image.naturalHeight
      );

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error("Failed to create blob");
            }
            const file = new globalThis.File([blob], fileName, {
              type: "image/jpeg",
            });
            resolve(file);
          },
          "image/jpeg",
          0.9
        );
      });
    },
    []
  );

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef || !currentCropFile) return;

    try {
      const croppedFile = await createCroppedImage(
        imgRef,
        completedCrop,
        currentCropFile.name
      );

      const croppedPreview = URL.createObjectURL(croppedFile);

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === currentCropFile.id
            ? {
                ...f,
                file: croppedFile,
                croppedPreview,
                size: croppedFile.size,
                originalFile: f.originalFile || f.file,
              }
            : f
        )
      );

      const updatedFiles = files.map((f) =>
        f.id === currentCropFile.id ? croppedFile : f.file
      );

      if (onFilesReady) {
        const validFiles = updatedFiles.filter(
          (_, index) => !files[index].error
        );
        onFilesReady(validFiles);
      }

      setCropDialogOpen(false);
      setCurrentCropFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }, [
    completedCrop,
    imgRef,
    currentCropFile,
    createCroppedImage,
    files,
    onFilesReady,
  ]);

  const handleCropCancel = useCallback(() => {
    setCropDialogOpen(false);
    setCurrentCropFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const initializeCrop = useCallback(
    (imageWidth: number, imageHeight: number) => {
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 80,
          },
          cropAspectRatio || imageWidth / imageHeight,
          imageWidth,
          imageHeight
        ),
        imageWidth,
        imageHeight
      );
      setCrop(crop);
      setCompletedCrop(crop);
    },
    [cropAspectRatio]
  );

  const addFiles = useCallback(
    (newFiles: FileList) => {
      if (files.length >= maxFiles) return;

      const filesToAdd = Array.from(newFiles).slice(0, maxFiles - files.length);

      const processedFiles = filesToAdd.map((file) => {
        const error = validateFile(file);
        const isImage = file.type.startsWith("image/");

        return {
          id: Math.random().toString(36).substring(2, 11),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: error ? 0 : 100,
          status: error ? "error" : "complete",
          error,
          preview: isImage ? URL.createObjectURL(file) : null,
        } as FileWithPreview;
      });

      const newFileList = [...files, ...processedFiles];
      setFiles(newFileList);

      const validFiles = newFileList.filter((f) => !f.error).map((f) => f.file);
      if (onFilesReady) {
        onFilesReady(validFiles);
      }
    },
    [files, maxFiles, validateFile, onFilesReady]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prevFiles) => {
        const fileToRemove = prevFiles.find((f) => f.id === fileId);
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        if (fileToRemove?.croppedPreview) {
          URL.revokeObjectURL(fileToRemove.croppedPreview);
        }

        const updatedFiles = prevFiles.filter((f) => f.id !== fileId);

        if (onFilesReady) {
          const validFiles = updatedFiles
            .filter((f) => !f.error)
            .map((f) => f.file);
          onFilesReady(validFiles);
        }

        return updatedFiles;
      });
    },
    [onFilesReady]
  );

  const openCropDialog = useCallback((file: FileWithPreview) => {
    setCurrentCropFile(file);
    setCropDialogOpen(true);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const clearAllFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
      if (file.croppedPreview) URL.revokeObjectURL(file.croppedPreview);
    });

    setFiles([]);
    if (onFilesReady) {
      onFilesReady([]);
    }
  }, [files, onFilesReady]);

  const openFileDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const getReadableFileTypes = useCallback(() => {
    return accept.map((type) => {
      if (type === "image/*") return "Images";
      if (type === "application/pdf") return "PDF";
      if (type === "text/*") return "Text files";
      if (type === "video/*") return "Videos";
      if (type === "audio/*") return "Audio";
      return type;
    });
  }, [accept]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      <Card
        className={cn(
          "relative border border-dashed transition-colors duration-200",
          dragActive ? "border-primary bg-primary/5" : "border-muted",
          files.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
          <div
            className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors",
              dragActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? "Drop file here" : "Upload Image"}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here or click to browse
            {enableCropping && accept.includes("image/*") && (
              <span className="block text-xs text-primary mt-1">
                Image cropping enabled
              </span>
            )}
          </p>

          {/* <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {getReadableFileTypes().map((type, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div> */}

          <Button
            onClick={openFileDialog}
            variant="outline"
            className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            disabled={files.length >= maxFiles}
          >
            Choose Files
          </Button>

          <p className="text-xs text-muted-foreground mt-2">
            Max {maxFiles} files, up to {formatFileSize(maxSize)} each
          </p>
        </CardContent>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </Card>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Uploaded Files ({files.length}/{maxFiles})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFiles}
              className="text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              Clear All
            </Button>
          </div>

          {files.map((fileData) => (
            <Card key={fileData.id} className="relative overflow-hidden group">
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-200",
                  fileData.error ? "bg-destructive/5" : "bg-primary/5"
                )}
              />
              <CardContent className="p-4 relative">
                <div className="flex items-start gap-3">
                  {fileData.preview ? (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border">
                      <img
                        src={fileData.croppedPreview || fileData.preview}
                        alt={fileData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0 border">
                      {fileData.error ? (
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      ) : (
                        getFileIcon(fileData.file)
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate max-w-2xs">
                        {fileData.name}
                      </p>
                      {fileData.status === "complete" && !fileData.error && (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                      {fileData.croppedPreview && (
                        <Badge variant="secondary" className="text-xs">
                          Cropped
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      {formatFileSize(fileData.size)} • {fileData.type}
                    </p>

                    {fileData.error ? (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fileData.error}
                      </p>
                    ) : (
                      <Progress value={fileData.progress} className="h-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {enableCropping && fileData.preview && !fileData.error && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openCropDialog(fileData)}
                          className="flex-shrink-0 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                          title="Crop image"
                        >
                          <CropIcon className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(fileData.id)}
                      className="flex-shrink-0 h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {currentCropFile && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={cropAspectRatio}
                  minWidth={cropMinWidth}
                  minHeight={cropMinHeight}
                >
                  <img
                    ref={setImgRef}
                    src={currentCropFile.preview!}
                    alt="Crop preview"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      initializeCrop(naturalWidth, naturalHeight);
                    }}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCropCancel}>
                  Cancel
                </Button>
                <Button onClick={handleCropComplete} disabled={!completedCrop}>
                  Apply Crop
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
