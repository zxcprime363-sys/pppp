import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Playlist name is required" },
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

    const { data: playlist, error: insertError } = await supabase
      .from("playlists")
      .insert({ user_id: user.id, title: name, description })
      .select("*")
      .single();

    if (insertError || !playlist) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: insertError?.message || "Failed to create playlist" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, playlist });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
