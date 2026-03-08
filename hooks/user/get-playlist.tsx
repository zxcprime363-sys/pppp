
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "./session";

type Playlist = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  playlist_tracks: TrackCover[];
};

type PlaylistsResponse = {
  success: boolean;
  playlists: Playlist[];
};
type TrackCover = {
  track_cover_id: string;
};
export function usePlaylists() {
  const { isLoggedIn } = useSession();
  return useQuery<PlaylistsResponse, Error>({
    queryKey: ["playlists-get"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await fetch("/api/playlist-get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch playlists");
      }

      return res.json();
    },
    staleTime: 1000 * 60,
    retry: false,
  });
}
