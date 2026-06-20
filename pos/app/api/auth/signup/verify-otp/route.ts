import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  "https://qpkznmugehwiiewoznfy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwa3pubXVnZWh3aWlld296bmZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDMyMjQxNiwiZXhwIjoyMDk1ODk4NDE2fQ.0zoKp3UnCtroxmsBlFDStqARokm9mhvWbTIh3gToPGk"
);

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  const { data, error } = await supabaseAdmin.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Email verified successfully",
    user: data.user,
    session: data.session,
  });
}