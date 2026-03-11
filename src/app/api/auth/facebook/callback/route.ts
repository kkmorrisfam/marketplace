import { setSessionCookie } from "@/lib/auth/cookies";
import { clearOauthCookies, readOauthCookies } from "@/lib/auth/oauthCookies";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ExchangeToken = {
    access_token: string;
    token_type: string;
    expires_in: number;
}

type FacebookMe = {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    picture?: { data?: { url?: string}};
};

//Facebook sends back a code. I need to exchange it for the access token at Facebook
async function exchangeCodeForAccessToken(code: string) {
    // create params to send back to Facebook
    const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
        code,
    });

    // send code back with client id and secret - should match
    const response = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`,
        {method: "GET"}
    );

    if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Facebook token exchange failed: ${txt}`);
    }

    // if everthing ok, return json in response as a Promise, 
    // because it's waiting for data to finish loading over network
    // and will contain an object conforming to type ExchangeToken
    return response.json() as Promise<ExchangeToken>;
}

async function fetchFacebookProfile(accessToken: string) {
    const params = new URLSearchParams({
        fields: "id,email,first_name,last_name,picture",
        access_token: accessToken,
    });

    const response = await fetch(
        `https://graph.facebook.com/me?${params.toString()}`,
        {method: "GET",}
    );

    if(!response.ok) {
        const txt = await response.text();
        throw new Error(`Facebook /me failed ${txt}`);
    }

    // returns a promise of type FacebookMe when done as json
    return response.json() as Promise<FacebookMe>;
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    // get the state from the url
    const returnedState = url.searchParams.get("state");

    // returns object w/ state and verifier from request header "Set-Cookie" object
    const {state} = await readOauthCookies();
    //clears state param and expires temp OAuth cookie, after retrieving state
    await clearOauthCookies();

    // if Facebook doesn't return a code, or state from the cookie, 
    // if there's no state from the url, or if the cookie state does not equal the url state
    // protect against CSRF attack
    if(!code || !state || !returnedState || returnedState !== state) {
        return NextResponse.json({error: "Invalid Oauth state."}, {status: 400});
    }

    // get an access token from Facebook after state check
    const tokenRes = await exchangeCodeForAccessToken(code);
    const profile = await fetchFacebookProfile(tokenRes.access_token);

    // get fields from profile object
    const providerUserId = profile.id;
    const email = profile.email ? profile.email.toLowerCase() : null;
    const firstName = profile.first_name ?? null;
    const lastName = profile.last_name ?? null;
    const picture = profile.picture?.data?.url ?? null;

    if(!providerUserId) {
        return NextResponse.json({error: "Missing Facebook ID."}, {status: 400});
    }

    const provider = "FACEBOOK" as const;

    // if OAuthAccount exists in our database -> use it
    const existingAccount = await prisma.oAuthAccount.findUnique({
        where: {provider_providerUserId: {provider, providerUserId } },
    });

    let userId: string;

    if (existingAccount) {
        userId = existingAccount.userId;
    } else {
        // if we have an email, link to existing user
        let user = email ? await prisma.user.findUnique({ where: { email }}) : null;
        
        // otherwise create user (email can be null for some FB users)
        if (!user) {
            if (!email) {
                /**  TODO - SEND USER TO PAGE ASKING FOR EMAIL */
                return NextResponse.json(
                    {error: "Facebook did not provide an email address.  Please add an email to continue."},
                    {status: 400}
                );
            }

            // if facebook returns an email, but no user in database, create user
            user = await prisma.user.create({
                data: {
                    email,
                    emailVerified: null, //Facebook doesn't provide a simple 'email_verified' like Google
                    firstName,
                    lastName,
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

    const session = await createSession(userId);
    await setSessionCookie(session.token, session.expiresAt);

    return NextResponse.redirect(`${process.env.APP_URL}/`);

}