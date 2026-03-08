"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TrackApi } from "../types";

interface MusicSearchResponse {
  data: {
    limit: number;
    offset: number;
    totalNumberOfItems: number;
    items: TrackApi[];
  };
}

export default function useMusicSearchTrack({
  search,
  enable,
}: {
  search: string | null;
  enable?: boolean;
}) {
  const query = useQuery<MusicSearchResponse>({
    queryKey: ["search-title-music", search],
    enabled: !!search && enable,
    queryFn: async () => {
      const res = await axios.get<MusicSearchResponse>(
        `https://vogel.qqdl.site/search/?s=${search}`,
      );
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
