// hooks/use-favorites.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "./session";
import { usePathname } from "next/navigation";

type FavoriteTrackInput = {
  track_id: string;
  track_album_id: string;
  track_artist_id: string;
  track_title: string;
  track_artist?: string;
  track_duration?: number;
  track_cover_id?: string;
  track_quality: string;
  explicit?: boolean;
};

type Favorite = {
  id: string;
  user_id: string;
  track_id: string;
  track_album_id: string;
  track_artist_id: string;
  track_title: string;
  track_artist: string;
  track_duration: number;
  track_cover_id: string;
  track_quality: string;
  explicit: boolean;
  added_at: string;
};

type FavoritesResponse = {
  success: boolean;
  favorites: Favorite[];
};

// GET all favorites
export function useFavorites() {
  const { isLoggedIn } = useSession();
  const pathname = usePathname();
  return useQuery<FavoritesResponse, Error>({
    queryKey: ["favorites"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await fetch("/api/favorites", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch favorites");
      }

      return res.json();
    },
    staleTime: 1000 * 60,
    retry: false,
  });
}

// POST - add to favorites
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; favorite: Favorite },
    Error,
    FavoriteTrackInput
  >({
    mutationFn: async (data) => {
      toast.loading("Adding to favorites...", { id: "add-favorite" });

      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add to favorites");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Added to favorites", { id: "add-favorite" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "add-favorite" });
    },
  });
}

// DELETE - remove from favorites
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { track_id: string }>({
    mutationFn: async ({ track_id }) => {
      toast.loading("Removing from favorites...", { id: "remove-favorite" });

      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ track_id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to remove from favorites");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed from favorites", { id: "remove-favorite" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "remove-favorite" });
    },
  });
}

// helper hook to check if a track is favorited
export function useIsFavorite(track_id: string) {
  const { data } = useFavorites();
  return data?.favorites.some((f) => f.track_id === track_id) ?? false;
}
