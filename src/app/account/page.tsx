// note: server component

async function getConnections() {
    const baseUrl = process.env.APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/account/connections`, {
        cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json();
}

export default async function AccountPage() {
    const data = await getConnections();

    return (
        <main className="mx-auto max-w-2xl p-6">
            <h1 className="mb-6 text-2xl font-bold">Account</h1>
            {!data ? (
                <p>You need to be signed in.</p>
            ) :(
                <div className="space-y-3">
                    <p>Password sign in: {data.hasPassword ? "Connected": "Not Connected"}</p>
                    <p>Google: {data.hasPassword ? "Connected": "Not Connected"}</p>
                    <p>Facebook: {data.hasPassword ? "Connected": "Not Connected"}</p>
                </div>
            )}
                
            
        </main>
    );
}