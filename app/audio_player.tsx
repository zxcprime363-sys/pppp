"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  Pause,
  Volume2,
  Music,
  Download,
  Heart,
  ListMusic,
  Menu,
  SkipForward,
  MoreHorizontal,
} from "lucide-react";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import {
  IconArrowsShuffle,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconX,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePlayerStore } from "@/store/playback";
import { useIsMobile } from "@/hooks/use-mobile";
import useMusicSource from "@/hooks/source";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useAddFavorite,
  useIsFavorite,
  useRemoveFavorite,
} from "@/hooks/user/favorites";
import { useAddRecentlyPlayed } from "@/hooks/user/recently_played";
import useLyrics from "@/hooks/publicAPI/lyrics";
import LyricsPanel from "@/components/ui/lyrics";
export default function AudioPlayer() {
  const queue = usePlayerStore((state) => state.queue);
  const repeat = usePlayerStore((state) => state.repeat);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const setRepeat = usePlayerStore((state) => state.setRepeat);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const playNext = usePlayerStore((state) => state.playNext);
  const playPrev = usePlayerStore((state) => state.playPrev);
  const currentTrack = queue[currentIndex];
  const audioRef = useRef<HTMLAudioElement>(null);
  const { data: music, isLoading } = useMusicSource({
    id: currentTrack?.track_id,
  });
  const manifestMimeType = music?.data?.manifestMimeType;
  const manifestBase64 = music?.data?.manifest;
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);

  const isMobile = useIsMobile();

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const isFavorite = useIsFavorite(currentTrack?.track_id);
  const addToRecent = useAddRecentlyPlayed();

  const { data: lyricsData } = useLyrics({
    title: currentTrack?.title ?? "",
    artist: currentTrack?.artist ?? "",
    duration: currentTrack?.duration ?? 0,
  });
  const lyrics = lyricsData?.lyrics ?? [];
  const activeLyricIndex = lyrics.reduce((acc, line, i) => {
    return line.time <= currentTime * 1000 ? i : acc;
  }, -1);
  useEffect(() => {
    if (!manifestBase64 || !manifestMimeType || !audioRef.current) return;

    const audio = audioRef.current;
    const decoded = atob(manifestBase64);

    let player: dashjs.MediaPlayerClass | null = null;

    if (manifestMimeType.includes("dash+xml")) {
      import("dashjs").then((dashjs) => {
        player = dashjs.MediaPlayer().create();
        player.initialize(
          audio,
          URL.createObjectURL(
            new Blob([decoded], { type: "application/dash+xml" }),
          ),
          true,
        );
      });
    } else if (manifestMimeType.includes("bts")) {
      try {
        const flacJson = JSON.parse(decoded);
        const flacUrl = flacJson.urls?.[0];
        if (flacUrl) {
          audio.src = flacUrl;
          audio.load();
          audio.play().catch((err) => console.warn("Autoplay blocked", err));
        }
      } catch (err) {
        console.error("Failed to parse BTS manifest:", err);
      }
    }

    return () => {
      // Cleanup dash player
      if (player) {
        try {
          player.reset(); // safely removes SourceBuffers
        } catch (e) {
          console.warn("Failed to reset DASH player:", e);
        }
        player = null;
      }
      // Stop audio element
      audio.pause();
      audio.src = "";
    };
  }, [manifestBase64, manifestMimeType]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let hasAdded = false;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => {
      setCurrentTime(audio.currentTime);

      if (!hasAdded && audio.currentTime >= 5) {
        addToRecent.mutate({
          id: String(currentTrack?.id),
          track_id: currentTrack?.track_id,
          track_album_id: currentTrack?.album_id,
          track_artist_id: currentTrack?.artist_id,
          track_title: currentTrack?.title,
          track_artist: currentTrack?.artist,
          track_duration: currentTrack?.duration,
          track_cover_id: currentTrack?.cover_id,
          track_quality: currentTrack?.quality,
          explicit: currentTrack?.explicit,
        });
        hasAdded = true;
      }
    };
    const onPlay = () => usePlayerStore.setState({ isPlaying: true });
    const onPause = () => usePlayerStore.setState({ isPlaying: false });
    const onEnded = () => {
      if (repeat !== "one") {
        playNext();
      }
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const seek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
  };
  const seekToMs = (timeMs: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeMs / 1000;
  };
  const changeVolume = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value[0] / 100;
    setVolume(value[0]);
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleDownload = async () => {
    if (!manifestBase64 || !manifestMimeType) return;

    const decoded = atob(manifestBase64);

    if (manifestMimeType.includes("dash+xml")) {
      // Parse MPD XML
      const parser = new DOMParser();
      const mpd = parser.parseFromString(decoded, "application/xml");

      const segTemplate = mpd.querySelector("SegmentTemplate");
      const timeline = mpd.querySelectorAll("SegmentTimeline S");
      const initUrl = segTemplate?.getAttribute("initialization");
      const mediaTemplate = segTemplate?.getAttribute("media");
      const startNumber = parseInt(
        segTemplate?.getAttribute("startNumber") || "1",
      );

      if (!initUrl || !mediaTemplate) return;

      // Build segment URLs from timeline
      const segmentUrls: string[] = [];
      let segNum = startNumber;
      timeline.forEach((s) => {
        const repeat = parseInt(s.getAttribute("r") || "0");
        for (let i = 0; i <= repeat; i++) {
          segmentUrls.push(mediaTemplate.replace("$Number$", String(segNum++)));
        }
      });

      // Fetch init + all segments
      const allUrls = [initUrl, ...segmentUrls];
      const chunks = await Promise.all(
        allUrls.map((url) => fetch(url).then((r) => r.arrayBuffer())),
      );

      const blob = new Blob(chunks, { type: "audio/mp4" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${currentTrack?.title ?? "track"}.flac`;
      a.click();
      URL.revokeObjectURL(a.href);
    } else if (manifestMimeType.includes("bts")) {
      const flacJson = JSON.parse(decoded);
      const flacUrl = flacJson.urls?.[0];
      if (!flacUrl) return;
      const res = await fetch(flacUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${currentTrack?.title ?? "track"}.flac`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };
  const renderMobie = () => (
    <div className="sticky bottom-0 inset-x-0  z-10 bg-background/50 backdrop-blur-2xl border-t">
      <Slider
        value={[currentTime]}
        max={duration || 1}
        step={1}
        onValueChange={seek}
        className="flex-1"
      />
      <div className="flex items-center gap-3 p-2">
        <div className="flex items-center flex-1 gap-2">
          {currentTrack ? (
            <img
              className="size-13 rounded-md"
              src={
                currentTrack?.cover_id
                  ? `https://resources.tidal.com/images/${currentTrack?.cover_id.replace(/-/g, "/")}/320x320.jpg`
                  : undefined
              }
              alt=""
            />
          ) : (
            <span className="size-13 rounded-md bg-card flex justify-center items-center">
              <Music className="opacity-50" />
            </span>
          )}
          <div>
            <h1 className="font-medium line-clamp-1">{currentTrack?.title}</h1>
            <Link href={`/album/${currentTrack?.album_id}`}>
              <h3 className="text-sm text-muted-foreground hover:underline cursor-pointer">
                {currentTrack?.artist}
              </h3>
            </Link>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {isLoading ? (
            <Tailspin size="25" stroke="7" speed="0.9" color="white" />
          ) : (
            <button onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="fill-current" />
              ) : (
                <Play className="fill-current" />
              )}
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={() => playNext()}>
                <MoreHorizontal />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconPlayerSkipForwardFilled />
                  Next
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlayerSkipBackFilled />
                  Previous
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {repeat === "off" && <IconRepeatOff />} {/* Repeat off */}
                  {repeat === "all" && <IconRepeat />} {/* Repeat all */}
                  {repeat === "one" && <IconRepeatOnce />} {/* Repeat one */}
                  Repeat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconArrowsShuffle />
                  Shuffle
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Queue</DropdownMenuItem>
                <DropdownMenuItem>Volume</DropdownMenuItem>
                <DropdownMenuItem>Lyrics</DropdownMenuItem>
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
  const renderDesktop = () => (
    <div className="sticky bottom-0  pb-8 z-10 bg-background/80 backdrop-blur-2xl border-t">
      <Slider
        value={[currentTime]}
        max={duration || 1}
        step={1}
        onValueChange={seek}
        className="flex-1"
      />
      <div className="mt-6 flex items-center justify-between px-4">
        <div className="flex items-end gap-3 flex-1">
          {currentTrack ? (
            <img
              className="size-13 rounded-md"
              src={
                currentTrack?.cover_id
                  ? `https://resources.tidal.com/images/${currentTrack?.cover_id.replace(/-/g, "/")}/320x320.jpg`
                  : undefined
              }
              alt=""
            />
          ) : (
            <span className="size-13 rounded-md bg-card flex justify-center items-center">
              <Music className="opacity-50" />
            </span>
          )}
          <div>
            <h1 className="font-medium ">{currentTrack?.title}</h1>
            <div className="flex gap-3 items-center text-sm text-muted-foreground">
              <Link href={`/album/${currentTrack?.album_id}`}>
                <h3 className=" hover:underline cursor-pointer">
                  {currentTrack?.artist}
                </h3>
              </Link>
              -
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 flex-1 max-w-md ">
          <button
            className={cn("mr-3", repeat !== "off" ? "text-blue-400" : "")}
            onClick={() => {
              const next =
                repeat === "off" ? "all" : repeat === "all" ? "one" : "off";
              setRepeat(next);
            }}
          >
            {repeat === "off" && <IconRepeatOff />} {/* Repeat off */}
            {repeat === "all" && <IconRepeat />} {/* Repeat all */}
            {repeat === "one" && <IconRepeatOnce />} {/* Repeat one */}
          </button>
          <button onClick={() => playPrev()}>
            <IconPlayerSkipBackFilled />
          </button>
          {isLoading ? (
            <Tailspin size="36" stroke="7" speed="0.9" color="white" />
          ) : (
            <button onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="fill-current size-7.5" />
              ) : (
                <Play className="fill-current size-7.5" />
              )}
            </button>
          )}
          <button onClick={() => playNext()}>
            <IconPlayerSkipForwardFilled />
          </button>
          <button
            className={cn("ml-3", shuffle ? "text-blue-400" : "")}
            onClick={toggleShuffle} // ← using store function directly
          >
            <IconArrowsShuffle />
          </button>
        </div>
        <div className="flex-1 flex justify-end gap-5">
          <LyricsPanel
            lyrics={lyrics}
            activeLyricIndex={activeLyricIndex}
            onSeek={seekToMs}
          />

          <button className=" opacity-80 group-hover:opacity-100">
            <Heart className="size-6" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className=" opacity-80 group-hover:opacity-100">
                <Volume2 className="size-6" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="max-w-40 border-none">
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={changeVolume}
              />
            </PopoverContent>
          </Popover>

          <button
            onClick={handleDownload}
            className=" opacity-80 group-hover:opacity-100"
          >
            <Download className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <audio
        autoPlay={true}
        loop={repeat === "one"}
        ref={audioRef}
        key={currentTrack?.id}
      />
      {isMobile
        ? currentTrack && renderMobie()
        : currentTrack && renderDesktop()}
    </>
  );
}
