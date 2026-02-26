import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";

export async function POST(req: Request) {
    // get results from request, if there's an error, return null - handle empty response?
    const body = await req.json().catch(()=> null);

    // if body has email, convert to string, trim and change to lowercase - or empty string
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    // if body has a password, convert to string - or empty string
    const password = (body?.password ?? "").toString();

    // check for user in database where email matches
    const user = await prisma.user.findUnique({where: {email}});

    // if no user or user password was returned
    // Don't reveal whether email exists, send invalid response
    if (!user || !user.passwordHash) {
        return NextResponse.json({error: "Invalid credentials."}, {status: 401});        
    }

    // check for valid password
    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) {
        return NextResponse.json({error: "Invalid credentials." }, {status: 401});
    }

    // create a token and expiresAt for user
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    // return matched user in response
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
        { status: 200 }
    )
}