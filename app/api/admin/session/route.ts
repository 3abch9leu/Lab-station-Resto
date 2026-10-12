import { NextResponse } from "next/server";
import { destroySession, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ auth: false }, { status: 401 });
  return NextResponse.json({ auth: true, username: admin.username });
}
