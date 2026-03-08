import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ playlistId: string }> },
) {
  try {
    const { playlistId } = await context.params;
    const {
      track_id,
      track_title,
      track_album_id,
      track_artist_id,
      track_quality,
      track_artist,
      track_duration,
      track_cover_id,
      explicit,
    } = await req.json();

    if (!track_id || !track_title || !track_album_id || !track_artist_id) {
      return NextResponse.json(
        { error: "Track ID and title are required" },
        { status: 400 },
      );
    }

    const supabase = await createServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if playlist belongs to user (RLS ensures only their playlists are visible)
    const { data: playlist, error: playlistError } = await supabase
      .from("playlists")
      .select("id, user_id")
      .eq("id", playlistId)
      .single();

    if (playlistError || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 },
      );
    }

    if (playlist.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if track already in playlist
    const { data: existing } = await supabase
      .from("playlist_tracks")
      .select("id")
      .eq("playlist_id", playlistId)
      .eq("track_id", track_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Track already in playlist" },
        { status: 409 },
      );
    }

    const { data: track, error: insertError } = await supabase
      .from("playlist_tracks")
      .insert({
        playlist_id: playlistId,
        track_id,
        track_title,
        track_album_id,
        track_artist_id,
        track_quality,
        track_artist,
        track_duration,
        track_cover_id,
        explicit: explicit || false,
      })
      .select("*")
      .single();

    if (insertError || !track) {
      return NextResponse.json(
        { error: "Failed to add track" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, track });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
