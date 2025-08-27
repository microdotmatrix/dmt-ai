import { cn } from "@/lib/utils";

export function ViewportSize({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div
      data-viewport-size=""
      className={cn(
        "fixed bottom-16 z-50 flex size-9 items-center justify-center uppercase rounded-full bg-black p-3 font-code font-bold text-[11px] text-gray-300 hover:text-gray-100 border border-border/50 outline outline-1 outline-border hover:outline-primary/50 transition-colors duration-200",
        align === "left" ? "left-5" : "right-5"
      )}
    >
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block 3xl:hidden">2xl</div>
      <div className="hidden 3xl:block 4xl:hidden">3xl</div>
      <div className="hidden 4xl:block">4xl</div>
    </div>
  );
}
