import { getSessionCookie } from "@/lib/auth/cookies";

import { getUserFromSessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() { 
    const token = await getSessionCookie();

    //check for vallid token
    if (!token) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401})
    }

    const user = await getUserFromSessionToken(token);

    //check for valid user
    if (!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    // find all accounts for user
    const accounts = await prisma.oAuthAccount.findMany({where: {userId: user.id}, select: { provider: true}, });

    const connectedProviders = new Set(accounts.map((a)=> a.provider));

    return NextResponse.json({ 
        hasPassword: !!user.passwordHash, 
        providers: {
            google: connectedProviders.has("GOOGLE"), 
            facebook: connectedProviders.has("FACEBOOK"),
            },
        }, {status: 200, headers: {"Cache-Control": "no-store"},
    });

    

}