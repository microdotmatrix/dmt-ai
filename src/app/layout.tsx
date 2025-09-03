import { AuthProvider } from "@/components/auth/provider";
import { AppContext } from "@/components/context";
import { HexPattern } from "@/components/elements/svg/hex-pattern";
import { Header } from "@/components/layout/header";
import { meta } from "@/lib/config";
import { code, display, text } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: `%s | ${meta.title}`,
    default: meta.title,
  },
  description: meta.description,
  keywords: meta.keywords,
  authors: [{ name: meta.author }],
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: `${meta.colors.dark}` },
    { media: "(prefers-color-scheme: light)", color: `${meta.colors.light}` },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        suppressHydrationWarning
        className="[--header-height:4rem]"
      >
        <body
          className={cn(
            display.variable,
            text.variable,
            code.variable,
            "antialiased"
          )}
        >
          <AppContext>
            <Suspense>
              <Header />
            </Suspense>
            {children}
            <BackgroundPattern />
          </AppContext>
        </body>
      </html>
    </AuthProvider>
  );
}

const BackgroundPattern = () => {
  return (
    <>
      <HexPattern className="text-primary/10 size-2/3 stroke-0 opacity-15 fixed -z-10 top-1/3 right-12 transition-all duration-1000 delay-500 blur-none" />
      <HexPattern className="text-primary/20 size-1/3 opacity-15 fixed -z-10 top-1/4 right-1/8 transition-all duration-2000 delay-1500 blur-xl" />
      <HexPattern className="text-primary/25 size-3/4 stroke-0 opacity-25 fixed -z-10 top-1/2 right-0 transition-all duration-1500 delay-500 blur-2xl" />
    </>
  );
};
