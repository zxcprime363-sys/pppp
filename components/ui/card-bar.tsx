import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlayerStore } from "@/store/playback";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "./badge";
import {
  Heart,
  List,
  ListMusic,
  ListPlus,
  MoreVertical,
  Play,
  Plus,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { TrackQueue } from "@/hooks/types";
import { usePrimaryColorStore } from "@/store/dynamic-color";

export default function CardBar({
  single,
  playlist,
  index,
  isActive,
}: {
  single: TrackQueue; // single track
  playlist: TrackQueue[]; // full playlist
  index: number; // clicked track index
  isActive?: boolean;
}) {
  const queue = usePlayerStore((state) => state.queue);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue);
  const playNextNow = usePlayerStore((state) => state.playNextNow);

  const isInQueue = queue.some((track) => track.id === single.track_id);
  const isCurrentTrack = queue[currentIndex]?.track_id === single.track_id;
  const isAlreadyNext = queue[currentIndex + 1]?.track_id === single.track_id;

  const isPlayNextDisabled = isAlreadyNext || isCurrentTrack;
  const handlePlayNext = () => {
    if (isCurrentTrack) {
      playNextNow(single);
    }
  };
  const handlePlay = () => {
    if (!isCurrentTrack) {
      setQueue(playlist, index);
    }
  };
  const primaryColor = usePrimaryColorStore((state) => state.primaryColor);
  return (
    <div className="py-1 group">
      <div
        key={single.track_id}
        className={`flex justify-between items-center p-1.5 cursor-pointer rounded-md`}
        style={
          isActive
            ? { backgroundColor: primaryColor.replace("0.5", "0.15") }
            : undefined
        }
        onClick={handlePlay}
      >
        <div className="flex gap-3 items-center">
          <div className="min-w-13 size-13 overflow-hidden rounded-sm">
            <img
              src={`https://resources.tidal.com/images/${single.cover_id.replace(/-/g, "/")}/320x320.jpg`}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className=" font-medium flex items-center gap-2">
              <h1 className="line-clamp-1">{single.title}</h1>
              {/* <Badge
                variant="secondary"
                className="text-[10px] px-2 h-4 text-muted-foreground"
              >
                HD
              </Badge> */}
            </div>
            <p className="text-sm text-muted-foreground">{single.artist}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-muted-foreground">
          {/* {isActive && (
            <h1 className=" font-medium">
              {`${Math.floor(single.duration / 60)}:${String(single.duration % 60).padStart(2, "0")}`}
            </h1>
          )} */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition duration-200"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handlePlay}
                    disabled={isCurrentTrack}
                  >
                    <Play />
                    Play
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlePlayNext}
                    disabled={isPlayNextDisabled}
                    className={
                      isAlreadyNext ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <ListPlus />
                    Play Next
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => addToQueue(single)}
                    disabled={isInQueue}
                    className={isInQueue ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <List />
                    {isInQueue ? "Already in queue" : "Add to queue"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart />
                    Add to favorite
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <ShareIcon />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {isInQueue && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => removeFromQueue(single.track_id)}
                    >
                      <TrashIcon />
                      Remove from queue
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
