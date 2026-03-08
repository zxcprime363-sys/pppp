"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ArtistEndpointTypes, TrackApi } from "../types";

export interface MusicSearchResponse {
  data: {
    artists: {
      items: ArtistEndpointTypes[];
    };
    tracks: {
      items: TrackApi[];
    };
  };
}
export default function useMusicSearchArtist({
  search,
  enable,
}: {
  search: string | null;
  enable?: boolean;
}) {
  const query = useQuery<MusicSearchResponse>({
    queryKey: ["search-artist-by-id", search],
    enabled: !!search && enable,
    queryFn: async () => {
      const url = `
https://us-west.monochrome.tf/search/?a=${search}`;

      const res = await axios.get<MusicSearchResponse>(url);
    
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
