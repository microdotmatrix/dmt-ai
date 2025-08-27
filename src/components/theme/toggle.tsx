"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useMetaColor } from "@/hooks/use-meta-color";
import { meta } from "@/lib/config";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export const ThemeToggle = ({ iconSize = "size-5" }: { iconSize?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark" ? meta.colors.light : meta.colors.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "light" ? (
        <Icon
          key={resolvedTheme}
          icon="line-md:moon-to-sunny-outline-loop-transition"
          className={iconSize}
        />
      ) : (
        <Icon
          key={resolvedTheme}
          icon="line-md:sunny-outline-to-moon-loop-transition"
          className={iconSize}
        />
      )}
    </Button>
  );
};
