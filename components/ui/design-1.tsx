import { formatDuration } from "@/lib/format-duration";
import { usePlayerStore } from "@/store/playback";
import {
  IconDots,
  IconDownload,
  IconGripVertical,
  IconHeart,
  IconHeartFilled,
  IconMicrophone2,
  IconPlayCard,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconPlayerTrackNextFilled,
  IconSquareNumber0Filled,
  IconSquareNumber1Filled,
  IconSquareNumber2Filled,
  IconSquareNumber3Filled,
  IconSquareNumber4Filled,
  IconSquareNumber5Filled,
  IconSquareNumber6Filled,
  IconSquareNumber7Filled,
  IconSquareNumber8Filled,
  IconSquareNumber9Filled,
} from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dot,
  Heart,
  LinkIcon,
  List,
  ListMusic,
  ListPlus,
  MoreVertical,
  Play,
  Plus,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import EqBars from "./eq-bars";
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
import { Input } from "./input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrackQueue } from "@/hooks/types";
import { useCreatePlaylist } from "@/hooks/user/create-playlist";
import { usePlaylists } from "@/hooks/user/get-playlist";
import { useAddTrack } from "@/hooks/user/add-tracks";
import {
  useAddFavorite,
  useIsFavorite,
  useRemoveFavorite,
} from "@/hooks/user/favorites";
import { Badge } from "./badge";
import Link from "next/link";
export default function Design1({
  index,
  single,
  playlist,
  number = true,
}: {
  index: number;
  single: TrackQueue;
  playlist: TrackQueue[];
  number?: boolean;
}) {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const isFavorite = useIsFavorite(single.track_id);
  console.log("xxx", isFavorite);
  const queue = usePlayerStore((state) => state.queue);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue);
  const playNextNow = usePlayerStore((state) => state.playNextNow);

  const isInQueue = queue.some((track) => track.track_id === single.track_id);
  const isCurrentTrack = queue[currentIndex]?.track_id === single.track_id;
  const isAlreadyNext = queue[currentIndex + 1]?.track_id === single.track_id;

  const isPlayNextDisabled = isAlreadyNext || isCurrentTrack;
  const handlePlayNext = () => {
    playNextNow(single);
  };

  //API PLAYLIST
  const createPlaylist = useCreatePlaylist();
  const addTrack = useAddTrack();
  const { data } = usePlaylists();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const numberIcons = [
    IconSquareNumber0Filled,
    IconSquareNumber1Filled,
    IconSquareNumber2Filled,
    IconSquareNumber3Filled,
    IconSquareNumber4Filled,
    IconSquareNumber5Filled,
    IconSquareNumber6Filled,
    IconSquareNumber7Filled,
    IconSquareNumber8Filled,
    IconSquareNumber9Filled,
  ];
  const handlePlay = () => {
    if (!isCurrentTrack) {
      setQueue(playlist, index);
    }
  };
  const digit = index + 1;
  const Icon = numberIcons[digit] ?? null;
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "rounded-md hover:bg-card transition group py-2 lg:px-4 ",
            // Mobile: simple flex row. sm+: full grid
            "flex items-center gap-3",
            "lg:grid justify-between ",
            number
              ? "lg:grid-cols-[50px_4fr_2fr_1fr_1fr]"
              : "lg:grid-cols-[4fr_2fr_1fr_1fr]",
          )}
        >
          {number && (
            <div className="text-muted-foreground group-hover:text-foreground font-medium hidden lg:block">
              {isCurrentTrack ? <EqBars /> : Icon ? <Icon /> : digit}
            </div>
          )}

          {/* Title + Cover */}
          <div
            className="flex items-center lg:gap-4 gap-2 cursor-pointer"
            onClick={handlePlay}
          >
            <img
              src={
                single.cover_id
                  ? `https://resources.tidal.com/images/${single.cover_id.replace(
                      /-/g,
                      "/",
                    )}/160x160.jpg`
                  : ""
              }
              alt={single.title}
              className="size-11 rounded-md object-cover"
            />
            <div>
              <p className="font-medium max-w-sm line-clamp-1 text-sm lg:text-base">
                {single.title}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Badge className="rounded-sm size-5" variant="secondary">
                  E
                </Badge>
                <Link
                  href={``}
                  className="text-muted-foreground hover:underline text-sm"
                >
                  {single.artist}
                </Link>
                <span className="flex lg:hidden items-center gap-1 ">
                  <Dot className="text-muted-foreground" />
                  <span className="text-muted-foreground  text-sm">
                    {formatDuration(single.duration)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Artist */}
          <div className="text-muted-foreground text-sm lg:block hidden">
            {single.quality}
          </div>

          {/* Duration */}
          <div className="text-muted-foreground  text-right text-sm hidden lg:block">
            {formatDuration(single.duration)}
          </div>
          <div className="flex justify-end items-center text-muted-foreground ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-popover p-2 rounded-md ">
                  <IconDots />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handlePlay}
                    disabled={isCurrentTrack}
                  >
                    <IconPlayerPlayFilled />
                    Play
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlePlayNext}
                    disabled={isPlayNextDisabled}
                    className={
                      isAlreadyNext ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <IconPlayerTrackNextFilled />
                    Play Next
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => addToQueue(single)}
                    disabled={isInQueue}
                    className={isInQueue ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Plus />
                    Add to queue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (isFavorite) {
                        removeFavorite.mutate({ track_id: single.track_id });
                      } else {
                        addFavorite.mutate({
                          track_id: single.track_id,
                          track_album_id: single.album_id,
                          track_artist_id: single.artist_id,
                          track_quality: single.quality,
                          track_title: single.title,
                          track_artist: single.artist,
                          track_duration: single.duration,
                          track_cover_id: single.cover_id,
                          explicit: single.explicit,
                        });
                      }
                    }}
                    disabled={addFavorite.isPending || removeFavorite.isPending}
                  >
                    {isFavorite ? <IconHeartFilled /> : <IconHeart />}
                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ListMusic /> Add to playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              Add New Playlist
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Add New Playlist
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Give your playlist a title and optional
                                  description.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <div className="flex flex-col gap-4 mt-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Title
                                  </label>
                                  <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Playlist Name"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Description
                                  </label>
                                  <Input
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    placeholder="Optional description"
                                  />
                                </div>
                              </div>

                              <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>
                                  Create Playlist
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        {data?.playlists.map((playlist) => (
                          <DropdownMenuItem
                            key={playlist.id}
                            // onClick={() =>
                            //   addTrack.mutate({
                            //     playlistId: playlist.id,
                            //     track_album_id: playlist
                            //     track_id: single.id,
                            //     track_title: single.title,
                            //     track_artist: single.artist,
                            //     track_duration: single.duration,
                            //     track_cover_id: single.cover_id,
                            //   })
                            // }
                          >
                            {playlist.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                  // onClick={() => router.push(`/artist/${single.artist_id}`)}
                  >
                    <IconMicrophone2 />
                    Go to Artist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  // onClick={() => router.push(`/artist/${single.artist_id}`)}
                  >
                    <IconDownload />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/track/${single.track_id}`,
                      );
                      // toast({ description: "Link copied!" });
                    }}
                  >
                    <LinkIcon />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {isInQueue && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => removeFromQueue(single.track_id)}
                      >
                        <TrashIcon />
                        Remove from queue
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handlePlay} disabled={isCurrentTrack}>
          <IconPlayerPlayFilled /> Play
        </ContextMenuItem>
        <ContextMenuItem onClick={handlePlayNext} disabled={isPlayNextDisabled}>
          <IconPlayerTrackNextFilled /> Play Next
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => addToQueue(single)}
          disabled={isInQueue}
        >
          <Plus /> Add to queue
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            if (isFavorite) {
              removeFavorite.mutate({ track_id: single.track_id });
            } else {
              addFavorite.mutate({
                track_id: single.track_id,
                track_album_id: single.album_id,
                track_artist_id: single.artist_id,
                track_quality: single.quality,
                track_title: single.title,
                track_artist: single.artist,
                track_duration: single.duration,
                track_cover_id: single.cover_id,
                explicit: single.explicit,
              });
            }
          }}
          disabled={addFavorite.isPending || removeFavorite.isPending}
        >
          {isFavorite ? <IconHeartFilled /> : <IconHeart />}
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/track/${single.track_id}`,
            );
          }}
        >
          <LinkIcon /> Copy Link
        </ContextMenuItem>
        {isInQueue && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              variant="destructive"
              onClick={() => removeFromQueue(single.track_id)}
            >
              <TrashIcon /> Remove from queue
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
