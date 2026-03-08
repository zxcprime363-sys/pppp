"use client";

import { useParams, useRouter } from "next/navigation";
import Design1 from "@/components/ui/design-1";
import { coverUrl } from "@/lib/coverUrl";
import { Button } from "@/components/ui/button";
import { LineWobble } from "ldrs/react";
import "ldrs/react/LineWobble.css";
import {
  Dot,
  ListMusic,
  Music,
  Music2Icon,
  Play,
  Share2,
  Shuffle,
} from "lucide-react";
import { usePlayerStore } from "@/store/playback";
import {
  SupabaseTrack,
  usePlaylistTracksId,
} from "@/hooks/user/playlist-tracks-id";
import { useDndMonitor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TrackQueue } from "@/hooks/types";

import SortableSong from "@/app/dnd/draggable";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconMusicOff } from "@tabler/icons-react";
export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const { data, isLoading } = usePlaylistTracksId(id);
  const playlist_tracks = data?.playlist.playlist_tracks ?? [];
  const [orderedTracks, setOrderedTracks] =
    useState<SupabaseTrack[]>(playlist_tracks);
  const playlist = data?.playlist;

  const shuffle = usePlayerStore((state) => state.shuffle);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);

  const setQueue = usePlayerStore((state) => state.setQueue);
  useEffect(() => {
    setOrderedTracks(data?.playlist.playlist_tracks ?? []);
  }, [data]);

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;
      if (!over) return;
      if (String(over.id).startsWith("playlist-")) return;
      if (active.id === over.id) return;

      const oldIndex = orderedTracks.findIndex(
        (t) => String(t.track_id) === active.id,
      );
      const newIndex = orderedTracks.findIndex(
        (t) => String(t.track_id) === over.id,
      );

      console.log(
        "Reorder:",
        active.id,
        "→",
        over.id,
        "| from index",
        oldIndex,
        "to",
        newIndex,
      );

      setOrderedTracks((tracks) => arrayMove(tracks, oldIndex, newIndex)); // ✅ this was missing
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 ">
        <h1>Loading please wait</h1>
        <LineWobble
          size="150"
          stroke="5"
          bgOpacity="0.1"
          speed="1.75"
          color="white"
        />
      </div>
    );
  }
  if (!playlist)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-background">
        <div className="text-center space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">404</h1>
          <p className="text-muted-foreground text-sm">
            This playlist doesn't exist or may have been deleted.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <IconArrowLeft /> Go Back
        </Button>
      </div>
    );

  const totalSeconds = playlist_tracks.reduce(
    (acc, track) => acc + track.track_duration,
    0,
  );
  const highlight = playlist_tracks[0];

  const totalMin = Math.floor(totalSeconds / 60);
  const remainingSec = totalSeconds % 60;
  const formattedDate = new Date(data.playlist.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const all_tracks: TrackQueue[] = orderedTracks.map((track) => ({
    track_id: String(track.track_id),
    album_id: track.track_album_id,
    artist_id: track.track_artist_id,
    title: track.track_title,
    artist: track.track_artist,
    duration: track.track_duration,
    cover_id: track.track_cover_id,
    quality: track.track_quality,
    explicit: track.explicit,
  }));

  return (
    <div className=" space-y-8 overflow-hidden p-4">
      <div className="relative ">
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end">
          <div className="relative shrink-0">
            {highlight ? (
              <img
                src={coverUrl(highlight.track_cover_id, 640)}
                alt={highlight.track_title}
                className="relative size-52 lg:size-60 rounded-xl object-cover shadow-2xl  hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <span className="flex items-center justify-center size-52 lg:size-60 rounded-xl  shadow-2xl">
                <Music className="size-20 text-muted-foreground" />
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3  flex-1">
            <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Playlist
            </span>

            <div className="space-y-1.5">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                {data.playlist.title}
              </h1>
              {data.playlist.description && (
                <h3 className="text-muted-foreground">
                  {data.playlist.description}
                </h3>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground mt-0.5">
              <span className="font-semibold text-foreground">
                Created at {formattedDate}
              </span>
              <Dot />
              <span>
                {playlist_tracks.length}{" "}
                {playlist_tracks.length === 1 ? "song" : "songs"}
              </span>
              <Dot />

              <span>
                {totalMin} min {remainingSec} sec
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-3">
              <Button
                variant="outline"
                onClick={() => setQueue(all_tracks, 0)}
                disabled={orderedTracks.length === 0}
              >
                <Play size={14} className="fill-black ml-0.5" /> Play Now
              </Button>
              <Button
                variant={shuffle ? "destructive" : "outline"}
                onClick={() => {
                  toggleShuffle();
                  setQueue(all_tracks, 0);
                }}
                className="rounded-full size-9"
                disabled={orderedTracks.length === 0}
              >
                <Shuffle size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-[50px_50px_4fr_2fr_1fr_1fr] border-b border-zinc-800 pb-3 mb-4 text-muted-foreground text-sm py-2 px-4">
          <div></div>
          <div>#</div>
          <div>Title</div>
          <div>Quality</div>
          <div className="flex justify-end">Duration</div>
        </div>
        {orderedTracks.length === 0 ? (
          <div className="grid place-items-center h-70">
            <div className="flex flex-col justify-center items-center">
              <span className="bg-card p-3 rounded-md">
                <IconMusicOff />
              </span>
              <h1 className="text-lg font-medium mt-3">No songs found</h1>
              <p className="text-muted-foreground">
                Start by browsing or searching song and add to playlist.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <SortableContext
              items={orderedTracks.map((t) => String(t.track_id))}
              strategy={verticalListSortingStrategy}
            >
              {orderedTracks.map((track, index) => (
                <SortableSong
                  key={track.track_id}
                  id={String(track.track_id)}
                  track={track}
                >
                  <Design1
                    single={{
                      track_id: String(track.track_id),
                      album_id: track.track_album_id,
                      artist_id: track.track_artist_id,
                      title: track.track_title,
                      artist: track.track_artist,
                      duration: track.track_duration,
                      cover_id: track.track_cover_id,
                      quality: track.track_quality,
                      explicit: track.explicit,
                    }}
                    playlist={all_tracks}
                    index={index}
                  />
                </SortableSong>
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}
