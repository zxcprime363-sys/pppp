"use client";
import useAlbumId from "@/hooks/search-album-id";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Heart, MoreHorizontal, Share2, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { coverUrl } from "@/lib/coverUrl";
import QualityBadge from "@/components/ui/quality-badge";
import Design1 from "@/components/ui/design-1";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackQueue } from "@/hooks/types";
import SortableSong from "@/app/dnd/draggable";
import HeaderRow from "@/components/ui/header-row";
import DetailsSkeleton from "@/components/ui/DesignSkeleton";

export default function Album() {
  const param = useParams();
  const id = Number(param.id);
  const { data, isLoading } = useAlbumId({ id });
  const [liked, setLiked] = useState(false);

  const album = data?.data;
  if (!album || isLoading) {
    return <DetailsSkeleton />;
  }
  const releaseYear = new Date(album.releaseDate).getFullYear();
  const totalMin = Math.floor(album.duration / 60);

  const albums: TrackQueue[] =
    album.items.map((track) => ({
      track_id: String(track.item.id),
      album_id: String(track.item.album.id),
      artist_id: String(track.item.artist.id),
      title: track.item.title,
      artist: track.item.artist.name,
      duration: track.item.duration,
      cover_id: String(track.item.album.cover),
      quality: track.item.audioQuality,
      explicit: track.item.explicit,
    })) ?? [];

  return (
    <div className="lg:p-4 p-2 lg:space-y-8 space-y-4">
      <div className="relative ">
        <div className="flex flex-col sm:flex-row lg:gap-8 gap-4 items-start sm:items-end">
          <div className="relative shrink-0">
            <img
              src={coverUrl(album?.cover, 640)}
              alt={album.title}
              className="relative size-45 lg:size-60 rounded-xl object-cover shadow-2xl  hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          <div className="flex flex-col lg:gap-3 gap-2  flex-1">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {album.type === "SINGLE" ? "Single" : "Album"}
            </span>

            <h1 className="text-2xl lg:text-5xl font-bold tracking-tight">
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground mt-0.5">
              <span className="font-semibold text-foreground">
                {album.artists.map((a) => a.name).join(", ")}
              </span>
              <Dot />
              <span>{releaseYear}</span>
              <Dot />
              <span>
                {album.numberOfTracks}
                {album.numberOfTracks === 1 ? "song" : "songs"}
              </span>
              <Dot />
              <span>{totalMin} min</span>
            </div>

            {/* quality tags */}
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {album.mediaMetadata.tags.map((tag) => (
                <QualityBadge key={tag} tag={tag} />
              ))}
            </div>

            <div className="flex items-center gap-2.5 mt-3">
              <Button variant="outline">
                <Play size={14} className="fill-black ml-0.5" /> Play Now
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn("rounded-full")}
                onClick={() => setLiked((l) => !l)}
              >
                <Heart size={14} className={cn(liked && "fill-white")} />
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
        {album.items.length === 0 && (
          <div className="text-zinc-400 py-10 text-center">
            No liked songs yet.
          </div>
        )}

        {album.items.map((track, index) => (
          <SortableSong
            key={track.item.id}
            id={String(track.item.id)}
            track={{
              track_id: String(track.item.id),
              track_album_id: String(track.item.album.id),
              track_artist_id: String(track.item.artist.id),
              track_title: track.item.title,
              track_artist: track.item.artist.name,
              track_duration: track.item.duration,
              track_cover_id: String(track.item.album.cover),
              track_quality: track.item.audioQuality,
              explicit: track.item.explicit,
            }}
          >
            <Design1
              key={track.item.id}
              single={{
                track_id: String(track.item.id),
                album_id: String(track.item.album.id),
                artist_id: String(track.item.artist.id),
                title: track.item.title,
                artist: track.item.artist.name,
                duration: track.item.duration,
                cover_id: String(track.item.album.cover),
                quality: track.item.audioQuality,
                explicit: track.item.explicit,
              }}
              playlist={albums}
              index={index}
            />
          </SortableSong>
        ))}
      </div>
    </div>
  );
}
