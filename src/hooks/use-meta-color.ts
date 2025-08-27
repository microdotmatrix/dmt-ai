"use client";

import { meta } from "@/lib/config";
import { useTheme } from "next-themes";
import { useCallback, useMemo } from "react";

export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = useMemo(() => {
    return resolvedTheme !== "dark" ? meta.colors.light : meta.colors.dark;
  }, [resolvedTheme]);

  const setMetaColor = useCallback((color: string) => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, []);

  return {
    metaColor,
    setMetaColor,
  };
}
