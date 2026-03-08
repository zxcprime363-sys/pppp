import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { Music, X } from "lucide-react";
import { usePlayerStore } from "@/store/playback";
import CardBar from "@/components/ui/card-bar";
import { useEffect, useRef } from "react";
import { useDndMonitor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import DroppableQueueList from "../dnd/droppable-queue";
import { cn } from "@/lib/utils";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const queue = usePlayerStore((state) => state.queue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const currentTrack = queue[currentIndex];
  const clearQueue = usePlayerStore((state) => state.clearQueue);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reorderQueue = usePlayerStore((state) => state.reorderQueue);

  const handleReorder = (newItems: { id: string }[]) => {
    const trackMap = new Map(queue.map((t) => [t.track_id, t]));
    const newQueue = newItems.map((item) => trackMap.get(item.id)!);
    reorderQueue(newQueue);
  };

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRefs.current[currentIndex];
    if (!container || !card) return;

    container.scrollTo({
      top: card.offsetTop - container.offsetTop,
      behavior: "smooth",
    });
  }, [currentIndex, queue]);

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;
      if (!over) return;
      if (String(over.id).startsWith("playlist-")) return; // ignore playlist drops
      if (String(over.id) === "queue-list") return; // ignore drop-into-queue
      if (active.id === over.id) return;

      const oldIndex = queue.findIndex(
        (t) => String(t.track_id) === String(active.id),
      );
      const newIndex = queue.findIndex(
        (t) => String(t.track_id) === String(over.id),
      );

      if (oldIndex === -1 || newIndex === -1) return;

      const newQueue = arrayMove(queue, oldIndex, newIndex);
      reorderQueue(newQueue);
    },
  });

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="inset"
      className="sticky top-0 hidden h-svh lg:flex w-sm"
      {...props}
    >
      <SidebarContent
        className={cn(
          "bg-card rounded-xl",
          "[&::-webkit-scrollbar]:w-2.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-white/20",
          "[&::-webkit-scrollbar-thumb]:rounded-xs",
          "[&::-webkit-scrollbar-thumb]:hover:bg-white/40",
        )}
      >
        <div className="">
          <div className="relative">
            {currentTrack?.cover_id ? (
              <img
                src={`https://resources.tidal.com/images/${currentTrack.cover_id.replace(/-/g, "/")}/750x750.jpg`}
                alt=""
                className=" w-full object-cover rounded-md aspect-square"
              />
            ) : (
              <span className=" w-full object-cover rounded-md aspect-square flex justify-center items-center bg-card">
                <Music className="size-18 text-muted-foreground" />
              </span>
            )}

            <div className="absolute inset-0 bg-linear-to-b from-transparent to-card"></div>
          </div>

          <div className=" px-2 pb-4 border-b">
            <h1 className=" text-2xl font-semibold">
              {currentTrack?.title || "Unknown Title"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {currentTrack?.artist || "Unknown Artist"}
            </p>
          </div>
        </div>
        <div className="p-2">
          <h1 className="font-medium">Up Next</h1>
          <DroppableQueueList className="h-full rounded-md divide-y ">
            {queue.map((track, index) => (
              <CardBar
                key={`${index}-${track.id}`}
                single={track}
                playlist={queue}
                index={index}
                isActive={index === currentIndex}
              />
            ))}
          </DroppableQueueList>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
// rgba(${primaryColor},0.5)
