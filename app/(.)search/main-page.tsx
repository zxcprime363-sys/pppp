// app/search/page.tsx

"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useMusicSearchArtist from "@/hooks/publicAPI/search-artist";
import useMusicSearchTrack from "@/hooks/publicAPI/search-track";
import useMusicSearchAlbum from "@/hooks/publicAPI/search-album";
import { Tabs } from "@/components/ui/vercel";
import Songs from "./songs";
import Albums from "./albums";
import Artist from "./artist";
import All from "./all";
export default function SearchPage() {
  const [tab, setTab] = useState("all");
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const tabs = [
    { id: "all", label: "All" },
    { id: "songs", label: "Songs" },
    { id: "artist", label: "Artist" },
    { id: "albums", label: "Albums" },
  ];

  const { data: songs } = useMusicSearchTrack({ search: query });
  const { data: artist } = useMusicSearchArtist({ search: query });
  const { data: album } = useMusicSearchAlbum({ search: query });

  const tracks = songs?.data.items ?? [];
  const artists = artist?.data.artists.items ?? [];
  const albums = album?.data.albums.items ?? [];

  const playlist = tracks.map((track) => ({
    track_id: String(track.id),
    album_id: String(track.album.id),
    artist_id: String(track.artist.id),
    title: track.title,
    artist: track.artist.name,
    duration: track.duration,
    cover_id: String(track.album.cover),
    quality: track.audioQuality,
    explicit: track.explicit,
  }));

  return (
    <div className="flex-1 p-4">
      <Tabs
        tabs={tabs}
        onTabChange={(tabId) => setTab(tabId)}
        className="mb-3"
        activeTab={tab}
      />

      {/* <h1>Search results for {query}</h1> */}
      {tab === "all" && (
        <All
          tracks={tracks}
          artists={artists}
          albums={albums}
          playlist={playlist}
        />
      )}
      {tab === "songs" && <Songs tracks={tracks} playlist={playlist} />}
      {tab === "albums" && <Albums albums={albums} />}
      {tab === "artist" && <Artist artist={artists} />}
    </div>
  );
}
