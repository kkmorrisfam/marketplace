import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    const body = await req.json().catch(()=>null);

    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();
    const firstName = body?.firstName ? String(body.firstName).trim(): null;
    const lastName = body?.lastName ? String(body.lastName).trim() : null;

    // Username optional at signup
    const username = body?.username ? String(body.username).trim() : null;

    if(!isValidEmail(email)) {
        return NextResponse.json({error: "Invalid email."}, { status: 400});

    }

    if (password.length < 8) {
        return NextResponse.json(
            { error: "Password must be at least 8 characters." },
            { status: 400 }
        );
    }

    // If username provided, enforce some basic rules
    if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return NextResponse.json(
            { error: "Username must be 3-20 chars (letters/numers/underscore)."},
            { status: 400 },
        );
    }

    const passwordHash = await hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: {
                email, 
                passwordHash,
                firstName,
                lastName,
                username,
                displayName: [firstName, lastName].filter(Boolean).join(" ") || null,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        const { token, expiresAt } = await createSession(user.id);
        await setSessionCookie(token, expiresAt);
        
        return NextResponse.json({user}, {status: 201});
    } catch (err: unknown) {
        const code = (err as { code?: string })?.code;
        //Prisma unique constraint violation
        if(code === "P2002") {
            return NextResponse.json(
                { error: "Email or username already in use." },
                { status: 409 }
            );
        }
        return NextResponse.json({error: "Server error. "}, { status: 500 });
    }
}