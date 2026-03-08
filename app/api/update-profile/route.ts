// app/api/update-profile/route.ts
import { createServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { full_name, username, email, password, bio } = await req.json();

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Check username uniqueness (exclude current user)
    if (username) {
      const { data: existingUsername } = await adminClient
        .from("users")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .maybeSingle();

      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 },
        );
      }
    }

    // Update auth user (email + password)
    const authUpdates: any = {};
    if (email && email !== user.email) authUpdates.email = email;
    if (password) authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(
        user.id,
        authUpdates,
      );
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }
    }

    // Update profile table
    const { data: profile, error: profileError } = await adminClient
      .from("users")
      .update({ full_name, username, email, bio })
      .eq("id", user.id)
      .select("id, email, full_name, username, avatar_url, bio")
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to update profile" },
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
