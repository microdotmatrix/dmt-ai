import { AppContext } from "@/components/context";
import { Header } from "@/components/layout/header";
import { meta } from "@/lib/config";
import { code, display, text } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          display.variable,
          text.variable,
          code.variable,
          "antialiased"
        )}
      >
        <AppContext>
          <Header />
          {children}
        </AppContext>
      </body>
    </html>
  );
}
