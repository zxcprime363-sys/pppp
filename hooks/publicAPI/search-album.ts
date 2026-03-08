"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AlbumEndpointTypes } from "../types";

export interface AlbumResponse {
  data: {
    albums: {
      limit: number;
      offset: number;
      totalNumberOfItems: number;
      items: AlbumEndpointTypes[];
    };
  };
}
export default function useMusicSearchAlbum({
  search,
  enable,
}: {
  search: string | null;
  enable?: boolean;
}) {
  const query = useQuery<AlbumResponse>({
    queryKey: ["search-album-music", search],
    enabled: !!search && enable,
    queryFn: async () => {
      const url = `
https://eu-central.monochrome.tf/search/?al=${search}`;

      const res = await axios.get(url);

      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
