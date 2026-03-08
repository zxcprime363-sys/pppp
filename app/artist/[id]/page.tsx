"use client";

import { Button } from "@/components/ui/button";

import { Dot, Heart, MoreHorizontal, Play, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { TrackQueue } from "@/hooks/types";
import useArtistId from "@/hooks/publicAPI/artist-id-info";
import useArtistTracksId from "@/hooks/publicAPI/artist-id-tracks";
import Design1 from "@/components/ui/design-1";
import HeaderRow from "@/components/ui/header-row";
import { coverUrl } from "@/lib/coverUrl";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Design1Skeleton } from "@/components/ui/Design1Skeleton";
import DetailsSkeleton from "@/components/ui/DesignSkeleton";

export default function ArtistDetails() {
  const params = useParams();
  const id = Number(params.id);
  const { data: ARTISTDETAILS, isLoading: loadingTracks } = useArtistId({ id });
  const { data: ARTISTTRACKS, isLoading: loadingArtist } = useArtistTracksId({
    id,
  });
  const artist = ARTISTDETAILS?.artist;
  const tracks = ARTISTTRACKS?.tracks ?? [];
  const albums = ARTISTTRACKS?.albums;

  const playlist: TrackQueue[] = tracks.map((track) => ({
    track_id: String(track.id),
    album_id: String(track.album.id),
    artist_id: String(track.artist.id),
    title: track.title,
    artist: track.artist.name,
    duration: track.duration,
    cover_id: String(track.album.cover),
    quality: track.audioQuality,
    explicit: track.explicit,
  }));

  const image = artist?.picture || artist?.selectedAlbumCoverFallback;
  const totalSeconds = tracks.reduce((acc, track) => acc + track.duration, 0);
  const totalMin = Math.floor(totalSeconds / 60);
  const remainingSec = totalSeconds % 60;
  const isLoading = loadingArtist || loadingTracks;

  if (isLoading) {
    return <DetailsSkeleton />;
  }
  return (
    <div className=" ">
      {artist && image && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 flex">
            <img
              src={`https://resources.tidal.com/images/${image.replace(/-/g, "/")}/750x750.jpg`}
              alt={artist.name}
              className="flex-1 brightness-30 object-cover"
            />
            <img
              src={`https://resources.tidal.com/images/${image.replace(/-/g, "/")}/750x750.jpg`}
              alt={artist.name}
              className="flex-1 max-w-md object-cover drop-shadow-2xl"
            />
            <img
              src={`https://resources.tidal.com/images/${image.replace(/-/g, "/")}/750x750.jpg`}
              alt={artist.name}
              className="flex-1 brightness-30 object-cover"
            />
            <div className="absolute inset-0  bg-linear-to-b from-transparent  to-background backdrop-blur-2xl"></div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row lg:gap-8 gap-4 items-start sm:items-end lg:p-6 p-4">
            <div className="relative shrink-0">
              <img
                src={coverUrl(image, 640)}
                alt={artist.name}
                className="relative size-45 lg:size-60 rounded-xl object-cover shadow-2xl  hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col lg:gap-3 gap-2  flex-1">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Artist
              </span>

              <h1 className="text-2xl lg:text-5xl font-bold tracking-tight">
                {artist.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground mt-0.5">
                <span>
                  {albums?.items.length}
                  {albums?.items.length === 1 ? " album" : " albums"}
                </span>
                <Dot />
                <span>
                  {tracks.length}
                  {tracks.length === 1 ? " song" : " songs"}
                </span>
                <Dot />
                <span>
                  {totalMin} min {remainingSec} sec
                </span>
              </div>

              {/* quality tags */}
              {/* <div className="flex flex-wrap gap-1.5 mt-0.5">
                {album.mediaMetadata.tags.map((tag) => (
                  <QualityBadge key={tag} tag={tag} />
                ))}
              </div> */}

              <div className="flex items-center gap-2.5 mt-3">
                <Button variant="outline">
                  <Play size={14} className="fill-black ml-0.5" /> Play Now
                </Button>

                <Button variant="outline" size="icon" className={cn("")}>
                  <Heart size={14} />
                </Button>

                <Button variant="outline" size="icon" className="">
                  <Share2 size={13} />
                </Button>

                <Button variant="outline" size="icon" className="">
                  <MoreHorizontal size={15} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-20">
          <div className="flex-1 ">
            <HeaderRow number={false} />
            <div className="grid grid-cols-1 lg:gap-1.5 gap-1 py-3">
              {tracks.map((track, index) => (
                <Design1
                  key={track.id}
                  single={{
                    track_id: String(track.id),
                    album_id: String(track.album.id),
                    artist_id: String(track.artist.id),
                    title: track.title,
                    artist: track.artist.name,
                    duration: track.duration,
                    cover_id: String(track.album.cover),
                    quality: track.audioQuality,
                    explicit: track.explicit,
                  }}
                  playlist={playlist}
                  index={index}
                />
              ))}
            </div>
          </div>
          {/* 
          <div className="space-y-3">
            <h1 className="text-xl font-medium">Albums</h1>
            <Separator />
            <div className="flex gap-3 flex-col py-3">
             {TRACKSandALBUMS?.albums.items.map((album) => (
                <Link key={album.id} href={`/music/home/album/${album.id}`}>
                  <div className="aspect-square max-w-50 p-3 bg-card/80">
                    <img
                      src={`https://resources.tidal.com/images/${album.cover.replace(/-/g, "/")}/320x320.jpg`}
                      alt={album.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="mt-3">
                      <h1 className="text-sm font-medium line-clamp-1">
                        {album.title}
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        {album.artist.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))} 
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
