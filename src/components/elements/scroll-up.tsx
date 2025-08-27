"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icon } from "../ui/icon";

export const ScrollUp = ({ size = "size-6" }: { size?: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Initial check
    toggleVisibility();

    // Clean up event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-primary/0 text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/50 active:ring-2 active:ring-primary active:ring-offset-2",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <Icon
        icon="line-md:arrow-up"
        key={isVisible ? "visible" : "hidden"}
        className={size}
      />
    </button>
  );
};

export default ScrollUp;
