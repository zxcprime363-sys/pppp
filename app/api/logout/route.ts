// app/api/sign-out/route.ts

import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createServer();
  await supabase.auth.signOut(); // clears cookies automatically
  return NextResponse.json({ message: "Logged out" });
}
