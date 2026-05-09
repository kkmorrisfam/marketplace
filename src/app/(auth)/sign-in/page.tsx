"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Form submitted with email:  ", email);
        console.log("Form submitted with password:  ", password);

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? "Login failed.");
                return;
            }

            router.push("/"); // return to "Home" page
            router.refresh();
        } catch {
            setError("Sign-in: Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground px-4 py-10">
            <div className="mx-auto max-w-md">
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            Log In
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Sign in with your email and password or continue with a provider.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form 
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            >
                            <div className="space-y-2">
                                <Label htmlFor="email" >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="w-full rounded border px-3 py-2"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" >
                                    Password
                                </Label>
                                <Input 
                                    id="password"
                                    type="password"
                                    className="w-full rounded border px-3 py-2"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required 
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"                        
                            >
                                {loading ? "Signing in ..." : "Sign in"}
                            </Button>
                        </form>

                        <div>
                            <a 
                                href="/api/auth/google/start"
                                className="block rounded border px-4 py-2 text-center"
                            >
                                Continue with Google
                            </a>
                            <a
                                href="/api/auth/facebook/start"
                                className="block rounded border px-4 py-2 text-center"
                            >
                                Continue with Facebook
                            </a>
                        </div>
                    </CardContent>
                </Card>                
            </div>
        </main>
    );

}