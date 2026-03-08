import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { SupabaseTrack } from "@/hooks/user/playlist-tracks-id";

export default function SortableSong({
  id,
  track,
  children,
}: {
  id: string;
  track: SupabaseTrack;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { track } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center", isDragging ? "opacity-40" : "")}
    >
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab px-2 hidden lg:block"
      >
        <IconGripVertical className="text-muted-foreground" />
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
