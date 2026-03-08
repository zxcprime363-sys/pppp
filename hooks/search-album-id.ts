"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Instances } from "@/lib/instances";
import { AlbumEndpointTypes } from "./types";

export interface AlbumDetailsResponse {
  version: string;
  data: AlbumEndpointTypes;
}
export default function useAlbumId({
  id,
  enable,
}: {
  id: number | null;
  enable?: boolean;
}) {
  return useQuery<AlbumDetailsResponse>({
    queryKey: ["album-details", id],
    enabled: !!id && enable,
    staleTime: 1000 * 60 * 5,
    retry: false, // we control retry manually
    queryFn: async () => {
      if (!id) {
        throw new Error("Album ID is required");
      }

      let lastError: unknown;

      for (const base of Instances) {
        const url = `${base}/album/?id=${id}`;

        try {
          const res = await axios.get<AlbumDetailsResponse>(url, {
            timeout: 5000,
          });

          if (res.data) {
            return res.data;
          }
        } catch (error) {
          console.warn(`Failed instance: ${base}`);
          lastError = error;
        }
      }

      // If all instances failed
      throw lastError ?? new Error("All instances failed");
    },
  });
}
