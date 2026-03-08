import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: playlists, error: playlistsError } = await supabase
      .from("playlists")
      .select(
        `
    *,
    playlist_tracks (
      track_cover_id
    )
  `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (playlistsError) {
      return NextResponse.json(
        { error: "Failed to fetch playlists" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, playlists });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
