// app/api/session/route.ts — becomes trivial

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

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, username, avatar_url, created_at, bio")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ user: profile });
}
