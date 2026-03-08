"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArtistEndpointTypes } from "@/hooks/types";
import { coverUrl } from "@/lib/coverUrl";

interface Props {
  artist: ArtistEndpointTypes[];
}

export default function Artist({ artist }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-8">
      {artist
        .filter((f) => f.picture)
        .map((item) => (
          <Link
            key={item.id}
            href={`/movie/home/artist/${item.id}`}
            className="group relative rounded-2xl p-4 bg-card/40 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Artist Image */}
            <div className="relative mx-auto w-28 h-28 lg:w-32 lg:h-32">
              {item.picture && (
                <img
                  src={coverUrl(item.picture, 320)}
                  alt={item.name}
                  className="rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>

            {/* Info */}
            <div className="mt-4 text-center space-y-1">
              <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                {item.name}
              </h3>

              <p className="text-xs text-muted-foreground">
                {item.artistTypes === "ARTIST" ? "Main Artist" : "Contributor"}
              </p>
            </div>

            {/* Popularity Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="rounded-full text-[10px] px-2 py-0.5 backdrop-blur-md bg-black/60 text-white border-none"
              >
                {item.popularity}
              </Badge>
            </div>
          </Link>
        ))}
    </div>
  );
}
