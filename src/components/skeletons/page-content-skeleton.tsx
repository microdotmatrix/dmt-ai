import { Skeleton } from "@/components/ui/skeleton";

export const PageContentSkeleton = () => {
  return (
    <div className="space-y-8 px-4 lg:px-8 loading-fade">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Featured Entry - Large Section */}
      <section className="min-h-[50vh]">
        <div className="grid md:grid-cols-2 min-h-fit border rounded-lg p-4">
          {/* Image Section - Left Half */}
          <div className="relative shadow-xl rounded-lg overflow-clip aspect-auto 3xl:aspect-[4/3] max-w-full">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content Section - Right Half */}
          <div className="p-8 flex flex-col justify-center space-y-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-32 mb-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col gap-2 pr-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Previous Entries (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Skeleton className="w-full md:w-40 h-40 rounded-lg" />
                  <div className="flex-grow min-w-0 w-full pl-4 md:pl-0">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-32 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - User Stats (1/3 width) */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
