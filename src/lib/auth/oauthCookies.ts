import { cookies } from "next/headers";

const STATE_COOKIE = "oauth_state";
const VERIFIER_COOKIE = "oauth_pkce_verifier";

const baseOptions = {
    httpOnly: true,   // for security. Javascript in browser cannot read cookies
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 10 * 60, // 10 minutes
};


// jar becomes a request/response bound cookie store provided by Next.js in the App Router
// await cookies() returns a getting an object connected to response/request
// then with jar.set you are modifying the http response headers
// adding a Set-Cookie header
export async function setOauthCookies(state: string, verifier: string) {
    const jar = await cookies();
    jar.set(STATE_COOKIE, state, baseOptions);
    jar.set(VERIFIER_COOKIE, verifier, baseOptions);
}


// returns incoming request cookie
export async function readOauthCookies() {
    const jar = await cookies();
    return {
        state: jar.get(STATE_COOKIE)?.value ?? null,
        verifier: jar.get(VERIFIER_COOKIE)?.value ?? null,        
    };
}

export async function clearOauthCookies() {
    const jar = await cookies();
    const options = { ...baseOptions, expires: new Date(0), maxAge: 0};
    jar.set(STATE_COOKIE, "", options);
    jar.set(VERIFIER_COOKIE, "", options);
}

/**
 * Could also be written similar to this:
 * import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("example", "123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60,
  });

  return response;
}

**Or could be written similar to this: 

export async function GET() {
  return new Response("ok", {
    headers: {
      "Set-Cookie":
        "example=123; HttpOnly; Path=/; Max-Age=60; SameSite=Lax",
    },
  });
}
 */