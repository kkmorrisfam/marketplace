import crypto from "crypto";
import { prisma } from '../prisma';

const SESSION_TTL_DAYS = 30;
const ROLLING_REFRESH_HOURS = 12;  // only extend at most twice/day


// helper function to create hash
function sha256Base64Url(input: string) {
    return crypto.createHash("sha256").update(input).digest("base64url");
}



// use when user still using site
export async function touchSession(token: string) {
    const sessionHash = sha256Base64Url(token)

    // check to see if there's a matching session in table
    const session = await prisma.session.findUnique({where: { sessionHash } });

    // if no session, or expired, return null
    if (!session) return null;
    if (session.expiresAt <= new Date()) return null; // if expiresAt is less than today, return null

    // If we refreshed recently, don't keep writing to DB every request
    const lastSeenAt = session.lastSeenAt ?? session.createdAt;
    const hoursSinceSeen = (Date.now() - lastSeenAt.getTime()) / (1000 * 60 * 60);


    const LAST_SEEN_WRITE_HOURS = 1;

    if (hoursSinceSeen < ROLLING_REFRESH_HOURS) {
        // maybe still update lastSeenAt occasionally
        if (hoursSinceSeen >= LAST_SEEN_WRITE_HOURS) {
            await prisma.session.update({
                where: { sessionHash },
                data: { lastSeenAt : new Date() },
            });
        }
        
        return { expiresAt: session.expiresAt, refreshed: false};
    }

    // Extend expiry (rolling)
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + SESSION_TTL_DAYS);

    const updated = await prisma.session.update({
        where: { sessionHash},
        data: { expiresAt: newExpiresAt, lastSeenAt: new Date() },
    });

    return { expiresAt: updated.expiresAt, refreshed: true};

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