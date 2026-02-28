import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionCookie, setSessionCookie } from "@/lib/auth/cookies";
import { getUserFromSessionToken, touchSession } from "@/lib/auth/session";

export async function GET() {
    const token = await getSessionCookie();
    if(!token) return NextResponse.json({user: null}, {status: 200});


    const user = await getUserFromSessionToken(token);
    if(!user) {
        clearSessionCookie(); 
        return NextResponse.json({user: null}, {status: 200});
    }

    //check to see if last time user session recorded an event and if 
    // it was recent, refresh token
    const touched = await touchSession(token);

    //if session returned, set cookie with token
    if (touched?.refreshed) {
        await setSessionCookie(touched.token, touched.expiresAt);  //update token and expiry
    } 

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
        { status: 200,
            headers: { "Cache-Control": "no-store"},
        }
    );
}