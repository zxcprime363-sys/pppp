"use client";

import { useQuery } from "@tanstack/react-query";

export type SupabaseTrack = {
  track_id: string;
  track_album_id: string;
  track_artist_id: string;
  track_title: string;
  track_artist: string;
  track_duration: number;
  track_cover_id: string;
  track_quality: string;
  explicit: boolean;
  added_at?: string;
};

type Playlist = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  playlist_tracks: SupabaseTrack[];
};

type PlaylistResponse = {
  success: boolean;
  playlist: Playlist;
};

export function usePlaylistTracksId(id: string) {
  return useQuery<PlaylistResponse, Error>({
    queryKey: ["playlist", id],
    queryFn: async () => {
      const res = await fetch(`/api/playlist-get/${id}`);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch playlist");
      }

      return res.json();
    },
    enabled: !!id, // only run if id exists
    staleTime: 1000 * 60, // 1 minute cache
    retry: false,
  });
}
