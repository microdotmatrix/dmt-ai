import { cn } from "@/lib/utils";

export const ElectricGridPattern = ({
  height = "100vh",
  width = "100vw",
  patternSize = "44px",
  className,
}: {
  height?: string;
  width?: string;
  patternSize?: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)} style={{ height, width }}>
      {/* Diagonal Grid with Red/Blue Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none size-full"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, oklch(from var(--color-primary) l c h / 12%) 0, oklch(from var(--color-accent) l c h / 12%) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, oklch(from var(--color-primary) l c h / 12%) 0, oklch(from var(--color-accent) l c h / 12%) 1px, transparent 1px, transparent 22px)
          `,
          backgroundSize: `${patternSize} ${patternSize}`,
        }}
      />
      {/* Your Content/Components */}
    </div>
  );
};
