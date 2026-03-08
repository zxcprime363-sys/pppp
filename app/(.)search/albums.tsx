"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AlbumEndpointTypes } from "@/hooks/types";
import { coverUrl } from "@/lib/coverUrl";

interface AlbumsProps {
  albums: AlbumEndpointTypes[];
}

export default function Albums({ albums }: AlbumsProps) {
  if (!albums || albums.length === 0)
    return <p className="text-gray-500 dark:text-gray-400">No albums found.</p>;

  return (
    <div className="flex flex-col gap-4 py-6">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={album.url}
          className="group flex items-center rounded-xl bg-card/40 backdrop-blur-sm p-3 hover:bg-card transition-all duration-300 hover:shadow-md"
        >
          {/* Album Cover */}
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 relative">
            <img
              src={coverUrl(album.cover) || "/placeholder.png"}
              alt={album.title}
              className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Album Info */}
          <div className="ml-4 flex-1 overflow-hidden">
            <h3 className="text-sm md:text-base font-semibold truncate group-hover:text-primary transition-colors">
              {album.title}
            </h3>

            <p className="text-xs md:text-sm text-muted-foreground truncate">
              {album.artist?.name ||
                album.artists?.map((a) => a.name).join(", ")}
            </p>

            <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(album.releaseDate).getFullYear()}
            </p>
          </div>

          {/* Popularity Badge */}
          <div className="ml-4">
            <Badge
              variant="secondary"
              className="rounded-full text-[10px] md:text-xs px-2 py-1 backdrop-blur-md bg-black/60 text-white border-none"
            >
              {album.popularity}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
