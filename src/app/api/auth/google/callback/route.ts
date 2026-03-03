import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet} from "jose";
import { prisma } from "@/lib/prisma";
import { readOauthCookies, clearOauthCookies } from "@/lib/auth/oauthCookies";
import { createSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";



// Google JWKS (public keys) for verifying id_token
const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

async function exchangeCodeForTokens(code: string, verifier: string) {
    const body = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Token exchange failed: ${txt}`);
    }

    return response.json() as Promise<{id_token: string}>;

}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");

    const { state, verifier } = await readOauthCookies();
    await clearOauthCookies();

    if(!code || !returnedState || !state || !verifier || returnedState !== state) {
        return NextResponse.json({error: "Invalid OAuth state."}, {status: 400});
    }

    const {id_token} = await exchangeCodeForTokens(code, verifier);

    const { payload } = await jwtVerify(id_token, JWKS, {
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const providerUserId = payload.sub;
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
    const emailVerified = payload.email_verified === true;

    const firstName = typeof payload.given_name === "string" ? payload.given_name : null;
    const lastName = typeof payload.family_name === "string" ? payload.family_name : null;
    const picture = typeof payload.picture === "string" ? payload.picture : null;

    if (!providerUserId || !email) {
        return NextResponse.json({error: "Missing Google identity fields."}, {status: 400});
    }

    //***check this later against prisma generate fields */
    const provider = "GOOGLE"; // must match AuthProvider enum value

    // if account exists, use it
    const existingAccount = await prisma.oAuthAccount.findUnique({
        where: {provider_providerUserId: { provider, providerUserId }},
    });

    let userId: string;

    if (existingAccount) { 
        userId = existingAccount.userId;
    } else {
        // if email is verified, link to existing user by email
        let user = emailVerified ? await prisma.user.findUnique({ where: { email }}) : null;

        // otherwise create user
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    emailVerified: emailVerified ? new Date() : null,
                    firstName,
                    imageUrl: picture,
                    displayName: [firstName, lastName].filter(Boolean).join(" ") || null,
                    passwordHash: null,
                },
            });
        }

        userId = user.id;

        await prisma.oAuthAccount.create({
            data: {
                userId,
                provider,
                providerUserId,
            },
        });
    }

    // Create session + cookie
    const session = await createSession(userId);
    await setSessionCookie(session.token, session.expiresAt);

    // Redirect back to app
    return NextResponse.redirect(`${process.env.APP_URL}`)


}