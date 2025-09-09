"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ReactNode, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

type Tab = {
  id: number;
  label: string;
  content: ReactNode;
};

interface OgImageSectionProps {
  tabs: Tab[];
  className?: string;
  rounded?: string;
  onChange?: (tabId: number) => void;
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
}: OgImageSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, bounds] = useMeasure();

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      setActiveTab(newTabId);
      onChange ? onChange(newTabId) : null;
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div className=" flex flex-col items-center w-full">
      <div
        className={cn(
          "flex space-x-1 border border-none rounded-full cursor-pointer bg-neutral-600 p-0.5 shadow-inner",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm sm:text-base font-normal text-accent-foreground transition-all duration-200 ease-in-out focus-visible:outline-1 focus-visible:ring-1 focus-visible:outline-none flex gap-2 items-center ",
              activeTab === tab.id
                ? "text-foreground font-semibold"
                : "hover:text-accent-foreground  text-accent-foreground/75",
              rounded
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 z-10 bg-muted mix-blend-soft-light border border-border/10"
                style={rounded ? { borderRadius: 9 } : { borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}

            {tab.label}
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
        <motion.div
          className="relative mx-auto w-full h-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height }}
        >
          <div className="p-1" ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
}
export { DirectionAwareTabs };
