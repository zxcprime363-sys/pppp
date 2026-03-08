"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type AddTrackInput = {
  playlistId: string;
  track_id: string;
  track_album_id: string;
  track_artist_id: string;
  track_title: string;
  track_artist: string;
  track_duration: number;
  track_cover_id: string;
  track_quality: string;
  explicit?: boolean;
};

type AddTrackResponse = {
  success: boolean;
  track: any;
};

export function useAddTrack() {
  const queryClient = useQueryClient();

  return useMutation<AddTrackResponse, Error, AddTrackInput>({
    mutationFn: async (data) => {
      toast.loading("Adding track...", { id: "add-track" });
      const res = await fetch(`/api/playlists/${data.playlistId}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add track");
      }

      return res.json();
    },

    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      toast.success("Track added to playlist", { id: "add-track" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "add-track" });
    },
  });
}
