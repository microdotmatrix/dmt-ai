import { db } from "@/lib/db";
import { env } from "@/lib/env/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { UserUploadTable } from "../db/schema";

export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN!,
});

const f = createUploadthing({
  errorFormatter: (error) => {
    console.log("Error uploading file", error.message);
    console.log("Cause of error", error.cause);
    return {
      message: error.message,
    };
  },
});

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      await db.insert(UserUploadTable).values({
        id: crypto.randomUUID(),
        userId: metadata.userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: file.ufsUrl,
        thumbnailUrl: file.ufsUrl,
        storageProvider: "S3",
        storageKey: file.key,
        metadata: {},
        isPublic: false,
      });

      revalidatePath(`/api/file/${file.key}`);
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
