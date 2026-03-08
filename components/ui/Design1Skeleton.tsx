import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

export function Design1Skeleton({ number = true }: { number?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md py-2 lg:px-4",
        "flex items-center gap-3",
        "lg:grid justify-between",
        number
          ? "lg:grid-cols-[50px_4fr_2fr_1fr_1fr]"
          : "lg:grid-cols-[4fr_2fr_1fr_1fr]",
      )}
    >
      {/* Track number / index — desktop only */}
      {number && <Skeleton className="h-4 w-5 hidden lg:block" />}

      {/* Cover + Title + Artist */}
      <div className="flex items-center lg:gap-4 gap-2 flex-1 lg:flex-none">
        <Skeleton className="size-11 rounded-md shrink-0" />
        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Title */}
          <Skeleton className="h-4 w-36 lg:w-48" />
          {/* Artist row: badge + name (+ duration on mobile) */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <Skeleton className="size-5 rounded-sm shrink-0" />
            <Skeleton className="h-3 w-24" />
            {/* Mobile-only duration */}
            <Skeleton className="h-3 w-12 lg:hidden" />
          </div>
        </div>
      </div>

      {/* Quality — desktop only */}
      <Skeleton className="h-3.5 w-16 hidden lg:block" />

      {/* Duration — desktop only */}
      <Skeleton className="h-3.5 w-10 hidden lg:block ml-auto" />

      {/* More button */}
      <div className="flex justify-end items-center">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}
