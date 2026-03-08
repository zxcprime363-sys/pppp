// app/recent/page.tsx
"use client";

import Design1 from "@/components/ui/design-1";
import { coverUrl } from "@/lib/coverUrl";
import { Button } from "@/components/ui/button";
import { Dot, Heart, Music, Play, Shuffle } from "lucide-react";
import { usePlayerStore } from "@/store/playback";
import { TrackQueue } from "@/hooks/types";
import { useRecentlyPlayed } from "@/hooks/user/recently_played";
import HeaderRow from "@/components/ui/header-row";

export default function RecentlyPlayed() {
  const { data, isLoading } = useRecentlyPlayed();
  const recent = data?.tracks ?? [];

  const shuffle = usePlayerStore((state) => state.shuffle);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const all_tracks: TrackQueue[] = recent.map((track) => ({
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
  console.log("aaa", all_tracks);
  const totalSeconds = recent.reduce(
    (acc, track) => acc + (track.track_duration ?? 0),
    0,
  );
  const totalMin = Math.floor(totalSeconds / 60);
  const remainingSec = totalSeconds % 60;
  const highlight = recent[0];

  if (isLoading) return <p className="p-4 text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-8 overflow-hidden p-4">
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end">
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Recently Played
            </h1>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground mt-0.5">
              <span className="font-semibold text-foreground">
                {recent.length} {recent.length === 1 ? "song" : "songs"}
              </span>
              <Dot />
              <span>
                {totalMin} min {remainingSec} sec
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-3">
              <Button
                variant="outline"
                disabled={recent.length === 0}
                onClick={() => setQueue(all_tracks, 0)}
              >
                <Play size={14} className="fill-black ml-0.5" /> Play Now
              </Button>
              <Button
                variant={shuffle ? "destructive" : "outline"}
                onClick={toggleShuffle}
                className="rounded-full size-9"
              >
                <Shuffle size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <HeaderRow number={false} />

        {recent.map((track, index) => (
          <Design1
          
            key={track.id}
            single={{
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
            }}
            playlist={all_tracks}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
