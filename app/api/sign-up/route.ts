// app/api/sign-up/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, full_name, username } = await request.json();

    if (!email || !password || !full_name || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // 1️⃣ Public client (respects RLS)
    const publicClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // 2️⃣ Admin client (ONLY for creating auth user)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Check username uniqueness safely
    const { data: existingUsername } = await publicClient
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      );
    }

    // Create auth user (needs service role)
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Failed to create user" },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await adminClient
      .from("users")
      .insert({
        id: data.user.id,
        email,
        full_name,
        username,
      })
      .select("id, email, full_name, username, avatar_url")
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, user: profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
