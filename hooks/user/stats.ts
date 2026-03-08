// hooks/user/useStats.ts
import { useQuery } from "@tanstack/react-query";

type Stats = {
  listening_time: number;
  tracks_played: number;
  listened_today: number;
  playlist_count: number;
  favorites_count: number;
};

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats", { credentials: "include" });

      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }

      return res.json(); // automatically inferred as Stats
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
