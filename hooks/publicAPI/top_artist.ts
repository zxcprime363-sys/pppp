"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Artist } from "../types";

export default function useTopArtist({ isPh }: { isPh: boolean }) {
  const ph = "/popular-artist.json";
  const international = "/popular-artist.json";
  const toggle = isPh ? ph : international;
  const query = useQuery<Artist[]>({
    queryKey: ["top-artist-list", isPh],
    queryFn: async () => {
      const res = await axios.get<Artist[]>(toggle);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
