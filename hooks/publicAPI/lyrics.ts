"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface LyricSyllabus {
  time: number;
  duration: number;
  text: string;
}

export interface LyricLine {
  time: number;
  duration: number;
  text: string;
  syllabus: LyricSyllabus[];
  element: Record<string, unknown>;
}

export interface LyricsMetadata {
  source: string;
  songWriters: string[];
  leadingSilence: string;
}

export interface LyricsResponse {
  type: string;
  KpoeTools: string;
  metadata: LyricsMetadata;
  lyrics: LyricLine[];
  cached: string;
  processingTime: {
    timeElapsed: number;
    lastProcessed: number;
  };
}

export interface LyricsParams {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  source?: string;
}

const DEFAULT_SOURCE = "apple,lyricsplus,musixmatch,spotify,musixmatch-word";
const LYRICS_BASE_URL = "https://lyricsplus.binimum.org/v2/lyrics/get";

export default function useLyrics({
  title,
  artist,
  album,
  duration,
  source = DEFAULT_SOURCE,
}: LyricsParams) {
  const query = useQuery<LyricsResponse>({
    queryKey: ["lyrics", title, artist, album, duration],
    queryFn: async () => {
      const res = await axios.get<LyricsResponse>(LYRICS_BASE_URL, {
        params: { title, artist, album, duration, source },
      });
      return res.data;
    },
    enabled: !!(title && artist && duration),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
