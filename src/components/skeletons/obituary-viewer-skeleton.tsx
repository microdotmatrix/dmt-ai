import { Skeleton } from "@/components/ui/skeleton";

export const ObituaryViewerSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-8 loading-fade">
      {/* Title skeleton */}
      <h3 className="text-muted-foreground font-bold opacity-50 animate-pulse mb-8">
        Loading...
      </h3>

      {/* Content skeleton - multiple paragraphs to simulate obituary length */}
      <div className="space-y-4 opacity-50">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        <div className="mt-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="mt-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
};
