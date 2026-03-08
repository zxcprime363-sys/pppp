// app/favorites/page.tsx
"use client";

import Design1 from "@/components/ui/design-1";
import { coverUrl } from "@/lib/coverUrl";
import { Button } from "@/components/ui/button";
import {
  Dot,
  Heart,
  MoreHorizontal,
  Music,
  Play,
  Share2,
  Shuffle,
} from "lucide-react";
import { usePlayerStore } from "@/store/playback";
import { TrackQueue } from "@/hooks/types";
import { useFavorites } from "@/hooks/user/favorites";
import HeaderRow from "@/components/ui/header-row";
import { cn } from "@/lib/utils";
import SortableSong from "../dnd/draggable";

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites();
  const favorites = data?.favorites ?? [];

  const shuffle = usePlayerStore((state) => state.shuffle);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const all_tracks: TrackQueue[] = favorites.map((track) => ({
    id: track.id,
    track_id: track.track_id,
    album_id: track.track_album_id,
    artist_id: track.track_artist_id,
    title: track.track_title,
    duration: track.track_duration ?? 0,
    artist: track.track_artist,
    cover_id: track.track_cover_id,
    quality: track.track_quality,
    explicit: track.explicit,
  }));

  const totalSeconds = favorites.reduce(
    (acc, track) => acc + (track.track_duration ?? 0),
    0,
  );
  const totalMin = Math.floor(totalSeconds / 60);
  const remainingSec = totalSeconds % 60;
  const highlight = favorites[0];

  if (isLoading) return <p className="p-4 text-muted-foreground">Loading...</p>;

  return (
    <div className="lg:p-4 p-2 lg:space-y-8 space-y-4">
      <div className="relative ">
        <div className="flex flex-col sm:flex-row lg:gap-8 gap-4 items-start sm:items-end">
          <div className="relative shrink-0">
            <img
              src={coverUrl(highlight?.track_cover_id, 640)}
              alt={highlight?.track_title}
              className="relative size-45 lg:size-60 rounded-xl object-cover shadow-2xl  hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          <div className="flex flex-col lg:gap-3 gap-2  flex-1">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Library
            </span>

            <h1 className="text-2xl lg:text-5xl font-bold tracking-tight">
              Favorites
            </h1>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground mt-0.5">
              <span>
                {favorites.length}
                {favorites.length === 1 ? " song" : " songs"}
              </span>
              <Dot />
              <span>{totalMin} min</span>
            </div>

            <div className="flex items-center gap-2.5 mt-3">
              <Button variant="outline">
                <Play size={14} className="fill-black ml-0.5" /> Play Now
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full")}
              >
                <Heart size={14} />
              </Button>

              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 size={13} />
              </Button>

              <Button variant="outline" size="icon" className="rounded-full">
                <MoreHorizontal size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {/* Header Row */}
        <HeaderRow />
        {favorites.length === 0 && (
          <div className="text-zinc-400 py-10 text-center">
            No liked songs yet.
          </div>
        )}

        {favorites.map((track, index) => (
          <SortableSong
            key={track.id}
            id={String(track.id)}
            track={{
              track_id: String(track.track_id),
              track_album_id: String(track.track_album_id),
              track_artist_id: String(track.track_artist_id),
              track_title: track.track_title,
              track_artist: track.track_artist,
              track_duration: track.track_duration,
              track_cover_id: String(track.track_cover_id),
              track_quality: track.track_quality,
              explicit: track.explicit,
            }}
          >
            <Design1
              key={track.id}
              single={{
                track_id: String(track.track_id),
                album_id: String(track.track_album_id),
                artist_id: String(track.track_artist_id),
                title: track.track_title,
                artist: track.track_artist,
                duration: track.track_duration,
                cover_id: String(track.track_cover_id),
                quality: track.track_quality,
                explicit: track.explicit,
              }}
              playlist={all_tracks}
              index={index}
            />
          </SortableSong>
        ))}
      </div>
    </div>
  );
}
