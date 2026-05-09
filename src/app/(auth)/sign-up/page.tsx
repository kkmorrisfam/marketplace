"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    username: username || null,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? "Registration failed.");
            }

            router.push("/");  // return "Home"
            router.refresh();
        } catch {
            setError("Registration: Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-6 text-2xl font-bold">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                            First name
                        </label>
                        <input 
                            id="firstName"
                            className="w-full rounded border px-3 py-2"
                            value={firstName}
                            onChange={(e)=>setFirstName(e.target.value)}
                        />                        
                    </div>
                    <div>
                        <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                            Last name
                        </label>
                        <input 
                            id="lastName"
                            className="w-full rounded border px-3 py-2"
                            value={lastName}
                            onChange={(e)=>setLastName(e.target.value)}
                        />
                    </div>
<div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Email
                        </label>
                        <input 
                            id="email"
                            className="w-full rounded border px-3 py-2"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
<div>
                        <label htmlFor="username" className="mb-1 block text-sm font-medium">
                            Username
                        </label>
                        <input 
                            id="username"
                            className="w-full rounded border px-3 py-2"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                        />
                    </div>
<div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium">
                            Password
                        </label>
                        <input 
                            id="password"
                            className="w-full rounded border px-3 py-2"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create account"}
                    </Button>
                </form>

                <div>
                    <a
                        href="/api/auth/google/start"
                        className="block rounded border px-4 py-2 text-center"
                    >
                        Sign up with Google
                    </a>
                    <a
                        href="/api/auth/facebook/start"
                        className="block rounded border px-4 py-2 text-center"
                    >
                        Sign up with Facebook
                    </a>
                </div>
            
        </main>
    )

}