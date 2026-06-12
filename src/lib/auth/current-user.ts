import { getSessionCookie } from "./cookies";
import { getUserFromSessionToken } from "./session";

// Helper function. Get the user from the token/cookie
export async function getCurrentUser() {
    const token = await getSessionCookie();

    if(!token) {
        return null;
    }

    return getUserFromSessionToken(token);
}