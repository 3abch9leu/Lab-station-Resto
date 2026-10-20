import { NextResponse } from "next/server";
import { destroySession, requireAdmin, isDatabaseAvailable } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroySession();
  } catch {}
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const admin = await requireAdmin().catch(() => null);
  if (admin) return NextResponse.json({ auth: true, username: admin.username });
  // No session — report whether a database exists at all, so the dashboard
  // can open in demo mode on deployments without one.
  const hasDb = await isDatabaseAvailable();
  return NextResponse.json({ auth: false, demo: !hasDb }, { status: 401 });
}
