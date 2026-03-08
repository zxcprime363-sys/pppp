"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ArtistEndpointTypes } from "../types";

export interface ArtistResponse {
  version: string;
  artist: ArtistEndpointTypes;
  cover: string | null;
}

export default function useArtistId({
  id,
  enable,
}: {
  id: number | null;
  enable?: boolean;
}) {
  const query = useQuery<ArtistResponse>({
    queryKey: ["artist-details-id", id],
    enabled: !!id && enable,
    queryFn: async () => {
      const res = await axios.get<ArtistResponse>(
        `https://maus.qqdl.site/artist/?id=${id}`,
      );
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
