import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Headers", "authorization, content-type");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(request) {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return cors(NextResponse.json({ error: "Missing SUPABASE env vars" }, { status: 500 }));
  }

  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return cors(NextResponse.json({ error: "No token" }, { status: 401 }));

  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return cors(NextResponse.json({ error: "Invalid token" }, { status: 401 }));
  }

  const body = await request.json().catch(() => ({}));
  const message = String(body?.message || "");
  if (!message) return cors(NextResponse.json({ error: "Missing message" }, { status: 400 }));

  // TODO: write to DB + call GPT later
  return cors(NextResponse.json({ output: `echo: ${message}` }));
}
