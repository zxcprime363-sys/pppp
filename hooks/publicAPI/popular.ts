"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Track } from "../types";

export default function usePopularTracks({ isPh }: { isPh: boolean }) {
  const ph = "/popular-music.json";
  const international = "/popular-international.json";
  const toggle = isPh ? ph : international;
  const query = useQuery<Track[]>({
    queryKey: ["popular-list", isPh],
    queryFn: async () => {
      const res = await axios.get<Track[]>(toggle);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
