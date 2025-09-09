import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export const ObituarySidebarSkeleton = () => {
  return (
    <Sidebar variant="sidebar" className="top-4 loading-fade">
      <SidebarHeader className="pt-[var(--header-height)] mt-4">
        <Skeleton className="h-6 w-32" />
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Messages skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* AI message skeleton */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-3 py-2 bg-muted">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          {/* User message skeleton */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-lg px-3 py-2 bg-primary">
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          {/* Another AI message skeleton */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-3 py-2 bg-muted">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="flex justify-end p-2">
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
