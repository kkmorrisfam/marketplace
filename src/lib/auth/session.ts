import crypto from "crypto";
import { prisma as defaultPrisma } from '../prisma';

const SESSION_TTL_DAYS = 30;
const ROLLING_REFRESH_HOURS = 12;  // only extend at most twice/day

type PrismaLike = Pick<typeof defaultPrisma, "session" | "user" | "$transaction">;

type TouchResult = 
    | { refreshed: false; expiresAt: Date }
    | { refreshed: true; token: string; expiresAt: Date }

type NowFn = () => Date;

// helper function to create hash
function sha256Base64Url(input: string) {
    return crypto.createHash("sha256").update(input).digest("base64url");
}

export function generateSessionToken() {
    // 32 bytes for strong random token
    return crypto.randomBytes(32).toString("base64url");
}

// export function for testing
export function makeSessionService(prisma: PrismaLike = defaultPrisma, now: NowFn = () => new Date()) {
    
    // create two functions to return
    async function createSession(userId: string) {
        const token = generateSessionToken();
        const sessionHash = sha256Base64Url(token);

        const expiresAt = new Date(now());
        expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

        await prisma.session.create({
            data: { userId, sessionHash, expiresAt },
        });

        return { token, expiresAt };        
    } //end createSession

    // check for active user session
    async function touchSession(token: string): Promise<TouchResult | null> {
         const sessionHash = sha256Base64Url(token)
         

        // check to see if there's a matching session in table
        const session = await prisma.session.findUnique({where: { sessionHash } });

        const current = now();

        // if no session, or expired, return null
        if (!session) return null;
        if (session.expiresAt <= current) return null; // if expiresAt is less than today, return null

        // If we refreshed recently, don't keep writing to DB every request
        const lastSeenAt = session.lastSeenAt ?? session.createdAt;
        const hoursSinceSeen = (current.getTime() - lastSeenAt.getTime()) / (1000 * 60 * 60);

        // Not time to refresh yet
        if (hoursSinceSeen < ROLLING_REFRESH_HOURS) {
            return { refreshed: false, expiresAt: session.expiresAt };
        }

        // Rotate: new token + new row, delete old row
        const newToken = generateSessionToken();
        const newSessionHash = sha256Base64Url(newToken);

        const newExpiresAt = new Date(current);
        newExpiresAt.setDate(newExpiresAt.getDate() + SESSION_TTL_DAYS);

        await prisma.$transaction([
            prisma.session.create({
                data: {
                    userId: session.userId,
                    sessionHash: newSessionHash,
                    expiresAt: newExpiresAt,
                    lastSeenAt: current,
                },
            }),
            prisma.session.delete( { where: { sessionHash } }),
        ]);

        return { refreshed: true, token: newToken, expiresAt: newExpiresAt };     
        }  // end touch session

        async function getUserFromSessionToken(token: string) {
            const sessionHash = sha256Base64Url(token);

            // get session fields and associated user record as nested object
            const session = await prisma.session.findUnique({ where: { sessionHash}, include: { user: true}, });
            
            // check for valid sessions
            if (!session) return null;
            if (session.expiresAt <= now()) return null;

            return session.user;

        } //end getUserFromSessionToken

        async function deleteSession(token: string) {
            const sessionHash = sha256Base64Url(token);

            await prisma.session.delete({where: { sessionHash} }).catch(()=>{})
        }

    return { createSession, touchSession, getUserFromSessionToken, deleteSession };
}

// App-facing exports (use the real prisma)
export const { createSession, touchSession, getUserFromSessionToken, deleteSession } = makeSessionService();

/*
// use when user still using site
export async function touchSession(token: string) : Promise<TouchResult | null> {
    const sessionHash = sha256Base64Url(token)

    // check to see if there's a matching session in table
    const session = await prisma.session.findUnique({where: { sessionHash } });

    // if no session, or expired, return null
    if (!session) return null;
    if (session.expiresAt <= new Date()) return null; // if expiresAt is less than today, return null

    // If we refreshed recently, don't keep writing to DB every request
    const lastSeenAt = session.lastSeenAt ?? session.createdAt;
    const hoursSinceSeen = (Date.now() - lastSeenAt.getTime()) / (1000 * 60 * 60);


    // Code block checks if time for refresh, if so create new token
    // and delete old token with new exiry

    // Not time to refresh yet
    if (hoursSinceSeen < ROLLING_REFRESH_HOURS) {
        return { refreshed: false, expiresAt: session.expiresAt };
    }

    // Rotate: new token + new row, delete old row
    const newToken = generateSessionToken();
    const newSessionHash = sha256Base64Url(newToken);

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + SESSION_TTL_DAYS);

    await prisma.$transaction([
        prisma.session.create({
            data: {
                userId: session.userId,
                sessionHash: newSessionHash,
                expiresAt: newExpiresAt,
                lastSeenAt: new Date(),
            },
        }),
        prisma.session.delete( { where: { sessionHash } }),
    ]);

    return { refreshed: true, token: newToken, expiresAt: newExpiresAt };
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

*/