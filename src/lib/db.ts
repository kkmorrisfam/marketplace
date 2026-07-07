import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
    db?: PrismaClient;
};

function makeDb() {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST!,
        port: Number(process.env.DATABASE_PORT! ?? "3306"),
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,    
        database: process.env.DATABASE_NAME!,
        connectionLimit: 5,  //address later for scaling        
    })

    return new PrismaClient({ adapter});
}

export const db = globalForPrisma.db ?? makeDb();

// needs to be after db created above
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.db = db;
}
