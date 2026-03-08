"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function DroppableQueueList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `queue-list`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition duration-200",
        isOver ? "bg-green-500/10" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}
