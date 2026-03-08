import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import { Play } from "lucide-react";
import Link from "next/link";
import {
  AlbumEndpointTypes,
  ArtistEndpointTypes,
  TrackApi,
  TrackQueue,
} from "@/hooks/types";
import { coverUrl } from "@/lib/coverUrl";
import Design1 from "@/components/ui/design-1";

export default function All({
  tracks,
  artists,
  albums,
  playlist,
}: {
  tracks: TrackApi[];
  artists: ArtistEndpointTypes[];
  albums: AlbumEndpointTypes[];
  playlist: TrackQueue[];
}) {
  const topResult = tracks[0];
  return (
    <div className="space-y-12">
      <div className="flex gap-8 justify-between py-6">
        <div className="flex-1 max-w-2xs space-y-4 bg-background/30 rounded-md p-4 shadow-2xl">
          <h1 className="text-2xl font-bold">Top Result</h1>
          <div className="aspect-square ">
            <img
              src={coverUrl(topResult?.album.cover, 640)}
              alt=""
              className="object-cover h-full w-full rounded-md"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{topResult?.title}</h1>
            <h3 className="text-muted-foreground">{topResult?.artist.name}</h3>
          </div>
        </div>
        <div className=" flex-1 max-w-4xl space-y-2 p-4">
          <h1 className="text-xl font-bold">Songs</h1>
          <div className="flex flex-col gap-1">
            {tracks.slice(0, 5).map((track, index) => (
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
                playlist={[
                  {
                    track_id: String(track.id),
                    album_id: String(track.album.id),
                    artist_id: String(track.artist.id),
                    title: track.title,
                    artist: track.artist.name,
                    duration: track.duration,
                    cover_id: String(track.album.cover),
                    quality: track.audioQuality,
                    explicit: track.explicit,
                  },
                ]}
                index={index}
                number={false}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Artists</h1>
        <Swiper {...swiperConfigBackdrop} className="">
          {artists
            .filter(
              (f) =>
                f.picture && f.picture !== "undefined" && f.picture !== "null",
            )
            .slice(0, 6)
            .map((artist, i) => (
              <SwiperSlide key={artist.id} className="p-1 w-auto!">
                <Link href={`/music/home/artist/${artist.id}`}>
                  {artist.picture && (
                    <div className="max-w-40 rounded-full overflow-hidden">
                      <img
                        src={coverUrl(artist.picture)}
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="mt-2 font-medium text-sm lg:text-base line-clamp-1 text-center ">
                    {artist.name}
                  </h1>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Albums</h1>
        <Swiper {...swiperConfigBackdrop} className="">
          {albums.slice(0, 6).map((a, i) => (
            <SwiperSlide key={a.id} className="p-1 w-auto!">
              {a.cover && (
                <div className="group relative lg:size-50 size-25 overflow-hidden rounded-sm ">
                  <img
                    src={coverUrl(a.cover)}
                    alt={a.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-400"
                  />

                  <div className="absolute inset-0 bg-linear-to-b from-transparent  to-black/80 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-end p-4">
                    <div className="mt-2 font-medium text-sm lg:text-base">
                      {a.title}
                    </div>
                    <div className="lg:text-sm text-xs text-muted-foreground">
                      {a.artists[0].name}
                    </div>
                  </div>
                  <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-200 bg-foreground rounded-full p-2">
                    <Play className="fill-background size-5.5" />
                  </button>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
const swiperConfigBackdrop: SwiperOptions = {
  keyboard: { enabled: true },

  modules: [Navigation, Pagination, Keyboard, Scrollbar],
  slidesPerView: "auto",
  spaceBetween: 10,
};
