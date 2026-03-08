import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const supabase = await createServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: playlist, error: playlistError } = await supabase
      .from("playlists")
      .select(
        `
        id,
        user_id,
        title,
        description,
        created_at,
        updated_at,
        playlist_tracks (
          id,
          track_id,
          track_title,
          track_album_id,
          track_artist_id,
          track_quality,
          track_artist,
          track_duration,
          track_cover_id,
          explicit,
          added_at
        )
      `,
      )
      .eq("id", id)
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

    return NextResponse.json({ success: true, playlist });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
