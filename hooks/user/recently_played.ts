// hooks/users_history.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "./session";

type RecentlyPlayedResponse = {
  success: boolean;
  tracks: RecentTrack[];
};

type RecentTrack = {
  id: string;
  track_id: string;
  track_album_id: string;
  track_artist_id: string;
  track_title: string;
  track_artist: string;
  track_duration: number;
  track_cover_id: string;
  track_quality: string;
  explicit: boolean;
};

// GET recently played
export function useRecentlyPlayed() {
  const { isLoggedIn } = useSession();
  return useQuery<RecentlyPlayedResponse, Error>({
    queryKey: ["users_history"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await fetch("/api/users_history", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch users_history");
      }

      return res.json();
    },
    staleTime: 1000 * 30, // 30 seconds — changes more frequently than favorites
    retry: false,
  });
}

// POST - add to recently played (call this when a track starts playing)
export function useAddRecentlyPlayed() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; track: RecentTrack },
    Error,
    RecentTrack
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/users_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add to users_history");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_history"] });
    },
    // no toast here — this runs silently in the background when a track plays
  });
}

// DELETE - clear entire history
export function useClearRecentlyPlayed() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: async () => {
      toast.loading("Clearing history...", { id: "clear-history" });

      const res = await fetch("/api/users_history", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to clear history");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_history"] });
      toast.success("History cleared", { id: "clear-history" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "clear-history" });
    },
  });
}
// const addRecentlyPlayed = useAddRecentlyPlayed();

// // call this when a track starts playing
// const handlePlay = (track) => {
//   playTrack(track);
//   addRecentlyPlayed.mutate({
//     track_id: track.id,
//     track_title: track.title,
//     track_artist: track.artist,
//     track_cover: track.cover,
//   });
// };
