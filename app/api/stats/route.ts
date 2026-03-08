// app/api/user/stats/route.ts
import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [{ data: stats }, { count: playlistCount }, { count: favoritesCount }] =
    await Promise.all([
      supabase.rpc("get_user_stats", { p_user_id: user.id }),
      supabase
        .from("playlists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  return NextResponse.json({
    listening_time: stats?.listening_time ?? 0,
    tracks_played: stats?.tracks_played ?? 0,
    listened_today: stats?.listened_today ?? 0,
    playlist_count: playlistCount ?? 0,
    favorites_count: favoritesCount ?? 0,
  });
}
