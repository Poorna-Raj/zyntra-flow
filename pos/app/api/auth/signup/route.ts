import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, phone } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, password and full name are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Verification email sent.",
      user: data.user,
    });

  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Signup failed." },
      { status: 500 }
    );
  }
}