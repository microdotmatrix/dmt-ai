import { uploadRouter } from "@/lib/services/uploadthing";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Provider as StateProvider } from "jotai";
import { connection } from "next/server";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { ViewportSize } from "./elements/viewport-size";
import { ThemeProvider } from "./theme/provider";
import { Toaster } from "./ui/sonner";

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />;
}

export const AppContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <StateProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster position="bottom-right" closeButton />
        <ViewportSize />
        <Suspense fallback={null}>
          <UTSSR />
        </Suspense>
      </ThemeProvider>
    </StateProvider>
  );
};
