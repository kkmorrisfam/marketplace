"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export default function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    async function handleSignOut() {
        setLoading(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            router.push("/");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleSignOut}
            disabled={loading}
            className="rounded border px-3 py-2"
        >
            {loading ? "Signing out ..." : "Sign out"}
        </Button>
    )
}