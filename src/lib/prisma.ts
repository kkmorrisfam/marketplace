import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";  //needed for v7 prisma

// create a new Prisma client if one doesn't exist in global scope.
// we just want one prisma client
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makePrisma() {
        const adapter = new PrismaMariaDb({
            host: process.env.DATABASE_HOST!,
            port: Number(process.env.DATABASE_PORT ?? "3306"),
            user: process.env.DATABASE_USER!,
            password: process.env.DATABASE_PASSWORD!,
            database: process.env.DATABASE_NAME!,
        
            connectionLimit: 5,    
             // Fix MySQL 8 auth handshake issue
            allowPublicKeyRetrieval: true,

            // Often needed on hosted DBs (try with and without)
            // ssl: { rejectUnauthorized: false },
            

        });

        return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? makePrisma();

// in non production environment, saves prisma client for global use
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
