"use server";

// Prisma model, schema
import { Store } from "@/generated/prisma/client";


// Auth
import { getCurrentUser } from "@/lib/auth/current-user";

// Database
import { db } from "@/lib/db";

type UpsertStoreInput = {
    id?: string;
    name: string;
    description: string;
    email: string;
    phone: string;
    logo?: string | null;
    cover?: string | null;
    url: string;
    featured: boolean;
};

/**
 * Function: upsertStore
 * Description: Upserts store details into the database, ensuring uniqueness of name, email and phone number
 * Access Level: Seller Only
 * Parameters: 
 *  -store: Partial store object containing details of the store to be upserted.
 * Returns: Updated or newly created store details.
 */

export const upsertStore = async (store: UpsertStoreInput) => {
    try {
        // Get user
        const user = await getCurrentUser();

        // Check user is authenticated
        if (!user) throw new Error("Unauthenticated.")

        // Verify seller permission
        if (user.role !== "SELLER")
            throw new Error(
              "Unauthorized Access: Seller Privileges Required for Entry."
        );

        // Check for store data 
        
        if (!store) throw new Error("Please provide store data.");

        // Check if store with the same name, email, url or phone number already exists
        const existingStore = await db.store.findFirst({
            where: {
                AND: [
                    {
                      OR: [
                        { name: store.name },
                        { url: store.url},
                        { email: store.email },
                        { phone: store.phone },

                      ],
                    },
                    {
                        NOT: {
                          id: store.id,
                        },
                    },
                ],
            },
        });

        // If a store with same name, email or phone number already exists, throw and error
        if (existingStore) {
            let errorMessage = "";
            if (existingStore.name === store.name) {
                errorMessage = "A store with the same name already exists";                
            } else if (existingStore.url === store.url) {
                errorMessage = "A store with the same URL already exists";                
            } else if (existingStore.email === store.email) {
                errorMessage = "A store with the same email address already exists";                
            } else if (existingStore.phone === store.phone) {
                errorMessage = "A store with the same phone number already exists";                
            }
            throw new Error(errorMessage); 
        }

        // Uspert store details into the database
/*        const storeDetails = await db.store.upsert({
            where: {
                id: store.id,
            },
            update: store,
            create: {
                ...store,
                user: {
                  connect:{id:user.id}
                }
            },
        });
*/
        // Check for store id
        const storeDetails = store.id
        // if store id exists, update store
            ? await db.store.update({
                where: {
                    id: store.id,
                },
                data: store,
            })
            // if store id doesn't exist, create one
            : await db.store.create({
                data: {
                    ...store,
                    user: {
                        connect: { id: user.id },
                    },
                },
            });

        return storeDetails;

    } catch (error) {
        console.log(error);
        throw error;
    }
}