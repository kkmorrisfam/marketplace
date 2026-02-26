import crypto from "crypto";
import { prisma } from '../prisma';

const SESSION_TTL_DAYS = 30;

function sha256Base64Url(input: string) {
    return crypto.createHash("sha256").update(input).digest("base64url");
}

export function generateSessionToken() {
    // 32 bytes for strong random token
    return crypto.randomBytes(32).toString("base64url");
}

export async function createSession(userId: string) {
    const token = generateSessionToken();
    const sessionHash = sha256Base64Url(token);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate()+ SESSION_TTL_DAYS);

    await prisma.session.create({
        data: {
            userId,
            sessionHash,
            expiresAt,
        },
    });

    return { token, expiresAt };
}

export async function getUserFromSessionToken(token: string) {
    const sessionHash = sha256Base64Url(token);

    const session = await prisma.session.findUnique({
        where: { sessionHash },
        include: { user: true },
    });

    // check for a session value
    if(!session) return null;
    // check to see if exiration is less than or equal to now
    if(session.expiresAt <= new Date()) return null;

    // if pass checks, return session
    return session.user;
}

export async function deleteSession(token: string) {
    const sessionHash = sha256Base64Url(token);
    await prisma.session.delete({where: {sessionHash}}).catch(()=>{});
}