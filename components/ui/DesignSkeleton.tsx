import { Design1Skeleton } from "./Design1Skeleton";
import HeaderRow from "./header-row";
import { Skeleton } from "./skeleton";

export default function DetailsSkeleton() {
  return (
    <div>
      <div className="relative overflow-hidden">
        {/* Blurred background skeleton */}

        <div className="relative z-10 flex flex-col sm:flex-row lg:gap-8 gap-4 items-start sm:items-end lg:p-6 p-4">
          {/* Cover image skeleton */}
          <Skeleton className="shrink-0 size-45 lg:size-60 rounded-xl" />

          <div className="flex flex-col lg:gap-3 gap-2 flex-1">
            {/* "Artist" label */}
            <Skeleton className="h-3 w-12" />

            {/* Artist name */}
            <Skeleton className="h-8 lg:h-12 w-48 lg:w-72" />

            {/* Meta info: albums · songs · duration */}
            <div className="flex items-center gap-2 mt-0.5">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 mt-3">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-9 " />
              <Skeleton className="h-9 w-9 " />
              <Skeleton className="h-9 w-9 " />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <HeaderRow number={false} />
        {Array.from({ length: 8 }).map((_, i) => (
          <Design1Skeleton key={i} number={false} />
        ))}
      </div>
    </div>
  );
}
