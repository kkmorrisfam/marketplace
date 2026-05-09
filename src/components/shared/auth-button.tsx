// note: server component

import Link from "next/link";
import SignOutButton from "./sign-out-button";

async function getCurrentUser() {
    const baseUrl = process.env.APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/auth/me`, {
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.user;
}

export default async function AuthButton() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex gap-2">
                <Link href="/login" className="rounded border px-3 py-2" >
                    Log in
                </Link>
                <Link href="/logout" className="rounded bg-black px-3 py-2 text-white">
                    Sign up
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link href="/account" className="text-sm underline">
                {user.username || user.firstName || user.email}
            </Link>
            <SignOutButton />
        </div>
    )
}