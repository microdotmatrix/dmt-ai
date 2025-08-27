import { createRouteHandler } from "uploadthing/next";

import { uploadRouter } from "@/lib/services/uploadthing";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: uploadRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
