import { NextResponse } from "next/server";
import { destroySession, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroySession();
  } catch {}
  return NextResponse.json({ ok: true });
}

export async function GET() {
  let admin = null;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ auth: false, demo: true }, { status: 401 });
  }
  if (!admin) return NextResponse.json({ auth: false }, { status: 401 });
  return NextResponse.json({ auth: true, username: admin.username });
}
