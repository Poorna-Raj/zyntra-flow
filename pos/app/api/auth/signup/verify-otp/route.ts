import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    // Step 1 — Verify OTP
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Step 2 — Check if user already exists in public.users
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .single();

    // Step 3 — Insert into public.users only if not already there
    if (!existing) {
      const { error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          user_id:    data.user.id,
          name:       data.user.user_metadata?.full_name ?? "",
          email:      data.user.email,
          role:       "cashier",
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Failed to insert user:", insertError.message);
        return NextResponse.json(
          { error: "Account verified but profile save failed: " + insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message:  "Email verified successfully.",
      user:     data.user,
      session:  data.session,
    });

  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Verification failed." },
      { status: 500 }
    );
  }
}