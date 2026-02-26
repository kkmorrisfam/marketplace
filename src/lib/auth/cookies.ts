import { cookies } from "next/headers";

const COOKIE_NAME = "session";

export async function setSessionCookie(token: string, expiresAt: Date) {
    const cookie = await cookies();
    cookie.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
}

export async function clearSessionCookie() {
    const cookie = await cookies();
    cookie.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });
}

export async function getSessionCookie() {
    const cookie = await cookies();
    return cookie.get(COOKIE_NAME)?.value ?? null;
}
