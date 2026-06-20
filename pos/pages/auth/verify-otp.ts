// pages/api/auth/verify-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, token } = req.body;

  if (!email || !token)
    return res.status(400).json({ error: "Email and OTP token required." });

  // Use anon client for OTP verification (needs user-side flow)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({
    message: "Email verified.",
    session: data.session,
    user: data.user,
  });
}