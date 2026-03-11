import { setOauthCookies } from "@/lib/auth/oauthCookies";
import crypto from "crypto";
import { NextResponse } from "next/server";


function b64url(bytes: Buffer) {
    return bytes.toString("base64url");
}

export async function GET() {
    const state = b64url(crypto.randomBytes(16));

    /**Facebook doesn't require PKCE the same way Google does
     * but we can reuse the verifier cookie slot safely or just store state onlly.
     * Easiest: store state, adn store a dummy verifier (or update helper to allow optional verifier?)
     */
    await setOauthCookies(state, "facebook");  //"facebook" currently a placeholder

    const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
        response_type: "code",
        state,
        scope: "email,public_profile",
    });

    return NextResponse.redirect(
        `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`
    );
}

