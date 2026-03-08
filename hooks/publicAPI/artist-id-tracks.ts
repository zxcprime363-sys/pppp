"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AlbumEndpointTypes, ArtistEndpointTypes, TrackApi } from "../types";

export interface ArtistTracksResponse {
  version: string;
  albums: { items: AlbumEndpointTypes[] };
  tracks: TrackApi[];
}

export default function useArtistTracksId({
  id,
  enable,
}: {
  id: number | null;
  enable?: boolean;
}) {
  const query = useQuery<ArtistTracksResponse>({
    queryKey: ["artist-track-details", id],
    enabled: !!id && enable,
    queryFn: async () => {
      const res = await axios.get<ArtistTracksResponse>(
        `https://us-west.monochrome.tf/artist/?f=${id}&skip_tracks=true`,
      );
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
