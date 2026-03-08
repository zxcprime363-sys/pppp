"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreatePlaylistInput = {
  name: string;
  description?: string;
};

type CreatePlaylistResponse = {
  success: boolean;
  playlist: any;
};

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation<CreatePlaylistResponse, Error, CreatePlaylistInput>({
    mutationFn: async (data) => {
      toast.loading("Adding playlist...", { id: "add-playlist" });
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create playlist");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Playlist added...", { id: "add-playlist" });
      queryClient.invalidateQueries({ queryKey: ["playlists-get"] });
    },
    onError: (error) => {
      toast.error(error.message, { id: "add-playlist" });
    },
  });
}
