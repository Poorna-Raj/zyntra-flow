// pages/api/shop/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {createClient} from "@supabase/supabase-js"; 

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { owner_id, name, district, province, address, business_type } = req.body;

  if (!owner_id || !name || !district || !province || !address || !business_type)
    return res.status(400).json({ error: "All fields are required." });

  const { data, error } = await supabaseAdmin
    .from("shops")
    .insert({ owner_id, name, district, province, address, business_type })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({ message: "Shop created.", shop: data });
}