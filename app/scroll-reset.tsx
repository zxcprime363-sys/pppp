"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollReset({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-10 flex flex-col h-full overflow-y-auto",

        "lg:[&::-webkit-scrollbar]:w-2.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-white/20",
        "[&::-webkit-scrollbar-thumb]:rounded-xs",
        "[&::-webkit-scrollbar-thumb]:hover:bg-white/40",
      )}
    >
      {children}
    </div>
  );
}
