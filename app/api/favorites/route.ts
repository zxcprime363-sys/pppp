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
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  if (fetchError) {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, favorites: data });
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
    region,
  } = await req.json();

  // track_album_id and track_artist_id are NOT NULL in schema
  if (!track_id || !track_title || !track_album_id || !track_artist_id) {
    return NextResponse.json(
      {
        error:
          "track_id, track_title, track_album_id, and track_artist_id are required",
      },
      { status: 400 },
    );
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("track_id", track_id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Track already in favorites" },
      { status: 409 },
    );
  }

  const { data, error: insertError } = await supabase
    .from("favorites")
    .insert({
      user_id: user.id,
      track_id,
      track_album_id, // required NOT NULL
      track_artist_id, // required NOT NULL
      track_title,
      track_artist,
      track_duration,
      track_cover_id, // was incorrectly named track_cover
      track_quality,
      explicit: explicit ?? false,
      region,
    })
    .select("*")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Track already in favorites" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, favorite: data });
}

export async function DELETE(req: Request) {
  const supabase = await createServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { track_id } = await req.json();
  if (!track_id) {
    return NextResponse.json(
      { error: "Track ID is required" },
      { status: 400 },
    );
  }

  const { error: deleteError } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("track_id", track_id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
