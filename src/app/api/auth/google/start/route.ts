import crypto from "crypto";
import { NextResponse } from "next/server";
import { setOauthCookies } from "@/lib/auth/oauthCookies";

function b64url(bytes: Buffer) {
    return bytes.toString("base64url");
}

function sha256b64url(input:string) {
    return crypto.createHash("sha256").update(input).digest("base64url");
}

export async function GET() {
    const state = b64url(crypto.randomBytes(16));
    const verifier = b64url(crypto.randomBytes(32));
    const challenge = sha256b64url(verifier);

    await setOauthCookies(state, verifier);

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: "openid email profile",
        state,
        code_challenge: challenge,
        code_challenge_method: "S256",
        prompt: "select_account", // ??
    });

    return NextResponse.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
        
    );

}
