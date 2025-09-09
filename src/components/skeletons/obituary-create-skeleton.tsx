import { Skeleton } from "@/components/ui/skeleton";

export const ObituaryCreateSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-6 gap-4 px-4 lg:px-8 loading-fade">
      {/* Left Sidebar - Entry Details & Form */}
      <aside className="lg:col-span-2 space-y-4">
        {/* Entry Card Skeleton */}
        <div className="w-full p-0">
          <div className="grid md:grid-cols-8 gap-2 p-4 border rounded-lg">
            {/* Profile Image */}
            <div className="lg:col-span-3 flex justify-center">
              <Skeleton className="min-h-64 size-full rounded-lg" />
            </div>

            {/* Key Information */}
            <div className="lg:col-span-5 space-y-1 lg:p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-6 w-32" />
              </div>

              {/* Birth Date */}
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Death Date */}
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Age */}
              <div>
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Location */}
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Entry Details Card Skeleton */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Collapsible Content */}
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-4 w-22" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-22" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="py-4 px-4 lg:px-2 border rounded-lg">
          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </aside>

      {/* Right Sidebar - Language Model & Response */}
      <aside className="lg:col-span-4">
        {/* Language Model Selector */}
        <div className="flex flex-col lg:flex-row items-center gap-4 max-w-sm ml-auto mr-0 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 flex-1" />
        </div>

        {/* Response Area */}
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </aside>
    </div>
  );
};
