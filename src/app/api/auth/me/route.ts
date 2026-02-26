import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/auth/cookies";
import { getUserFromSessionToken } from "@/lib/auth/session";

export async function GET() {
    const token = await getSessionCookie();
    if(!token) return NextResponse.json({user: null}, {status: 200});

    const user = await getUserFromSessionToken(token);
    if(!user) return NextResponse.json({user: null}, {status: 200});

    return NextResponse.json(
        {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        },
        { status: 200}
    );
}