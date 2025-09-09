import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

export const EntryEditContentSkeleton = () => {
  return (
    <div className="space-y-8 loading-fade">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Edit Form - Takes up 2/3 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Obituary Details Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Entry Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Photos & Images Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-5 h-5" />
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="aspect-square w-full rounded-lg"
                      />
                    ))}
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Content Sections - Takes up 1/3 */}
        <div className="space-y-6">
          {/* Generated Obituaries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:file-document-outline" className="w-5 h-5" />
                <Skeleton className="h-5 w-28" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Memorial Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:image-multiple-outline" className="w-5 h-5" />
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-md" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:format-quote-close" className="w-5 h-5" />
                <Skeleton className="h-5 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-8 w-28 mx-auto rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entry Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="mdi:information-outline" className="w-5 h-5" />
                <Skeleton className="h-5 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
