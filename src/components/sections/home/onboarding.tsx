"use client";

import { cn } from "@/lib/utils";
import { Code, Paintbrush, Plus, Rocket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const features = [
  {
    step: "Step 1",
    title: "Create an Entry",
    content:
      "Start by creating a memorial profile to commemorate the person you want to remember.",
    icon: <Plus className="text-primary h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    step: "Step 2",
    title: "Add Details",
    content:
      "Tell us how you want them to be remembered by providing details about their life, family, achievements and more.",
    icon: <Paintbrush className="text-primary h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop",
  },
  {
    step: "Step 3",
    title: "Create content",
    content:
      "Create content commemorating their life using our AI-powered tools: write their obituary, create a eulogy, find moving quotes, and generate digital epitaph images to remember them by.",
    icon: <Code className="text-primary h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
  {
    step: "Step 4",
    title: "Publish and Share",
    content:
      "Create shareable links to share with friends and family, and invite them to contribute or share them with the world.",
    icon: <Rocket className="text-primary h-6 w-6" />,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
];

export const Onboarding = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (4000 / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <div className="p-8 md:p-12">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="relative mx-auto mb-12 max-w-3xl sm:text-center">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-balance uppercase">
              How we make Death Matter
            </h2>
            <p className="text-foreground/60 mt-3 text-base">
              We are using technology to make one of the hardest things in life
              just a little bit easier. Our suite of cutting edge tools are
              built to modernize the process of commemorating the deceased using
              AI.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, oklch(from var(--color-primary) l c h / 0.2) 4.54%, oklch(from var(--color-primary) l c h / 0.5) 34.2%, oklch(from var(--color-primary) l c h / 0.75) 77.55%)",
            }}
          ></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mb-10 h-px w-1/3" />

        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-12 items-center">
          <div className="order-2 space-y-8 md:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.3,
                  x: 0,
                  scale: index === currentFeature ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 md:h-14 md:w-14",
                    index === currentFeature
                      ? "border-primary bg-primary/10 text-primary scale-110 [box-shadow:0_0_15px_rgba(192,15,102,0.3)]"
                      : "border-muted-foreground bg-muted"
                  )}
                >
                  {feature.icon}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              "relative order-1 h-[200px] overflow-hidden rounded-md md:order-2 md:h-[300px] lg:h-[400px] w-full"
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 overflow-hidden"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-full w-full transform object-cover transition-transform"
                        width={1000}
                        height={640}
                      />
                      <div className="from-background via-background/50 absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t to-transparent" />

                      <div className="bg-background/80 absolute bottom-4 left-4 rounded-lg p-2 backdrop-blur-sm">
                        <span className="text-primary text-xs font-medium">
                          {feature.step}
                        </span>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
