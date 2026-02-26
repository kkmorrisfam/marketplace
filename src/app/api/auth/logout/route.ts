import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionCookie } from "@/lib/auth/cookies";
import { deleteSession } from "@/lib/auth/session";

export async function POST() {
    const token = await getSessionCookie();
    if (token) await deleteSession(token);
    await clearSessionCookie();
    return NextResponse.json({ok: true}, {status: 200});
}