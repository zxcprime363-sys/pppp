// app/auth/callback/route.ts

import { createServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServer();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Create profile if first time
    if (data.user) {
      await supabase.from("users").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata.full_name,
          avatar_url: data.user.user_metadata.avatar_url,
        },
        { onConflict: "id", ignoreDuplicates: true },
      );
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
