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

  const { data, error: fetchError } = await supabase
    .from("users_history")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(20);

  if (fetchError) {
    return NextResponse.json(
      { error: "Failed to fetch recently played" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, tracks: data });
}

export async function POST(req: Request) {
  const supabase = await createServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const {
    track_id,
    track_album_id,
    track_artist_id,
    track_title,
    track_artist,
    track_duration,
    track_cover_id,
    track_quality,
    explicit,
  } = await req.json();
  const region = req.headers.get("x-vercel-ip-country") || "Unknown";
  if (!track_id || !track_title || !track_album_id || !track_artist_id) {
    return NextResponse.json(
      { error: "Missing Required Fields" },
      { status: 400 },
    );
  }

  const { data, error: insertError } = await supabase
    .from("users_history")
    .insert({
      user_id: user.id,
      track_id,
      track_album_id,
      track_artist_id,
      track_title,
      track_artist,
      track_duration,
      track_cover_id,
      track_quality,
      explicit: explicit || false,
      region: region || "Unknown",
    })
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to add to users history" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, track: data });
}

export async function DELETE() {
  const supabase = await createServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error: deleteError } = await supabase
    .from("users_history")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to clear history" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
