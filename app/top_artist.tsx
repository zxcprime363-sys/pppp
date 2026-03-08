"use client";

import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import useTopArtist from "@/hooks/publicAPI/top_artist";
import Link from "next/link";
import { swiperConfigBackdrop } from "@/lib/swiper_config";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopArtist() {
  const { data, isLoading } = useTopArtist({ isPh: true });
  const artists = data ?? [];
  return (
    <div className="relative overflow-hidden">
      <div className="text-lg flex justify-between items-center">
        <h2 className="font-medium mb-2">Top Artist</h2>
        <button className="text-sm font-medium cursor-pointer hover:underline flex justify-center items-center gap-2">
          Show All <ArrowRight className="size-4.5" />
        </button>
      </div>
      <Swiper {...swiperConfigBackdrop} className="">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <SwiperSlide key={i} className="p-1 w-auto!">
                <Skeleton className="lg:size-35 size-26 rounded-full" />
                <Skeleton className="mt-2 h-4 w-20 mx-auto rounded" />
              </SwiperSlide>
            ))
          : artists.map((artist) => (
              <SwiperSlide key={artist.id} className="p-1 w-auto!">
                <Link href={`/artist/${artist.id}`}>
                  {artist.images && (
                    <div className="lg:size-35 size-26 rounded-full overflow-hidden">
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="mt-2 font-medium text-sm lg:text-base line-clamp-1 text-center">
                    {artist.name}
                  </h1>
                </Link>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
