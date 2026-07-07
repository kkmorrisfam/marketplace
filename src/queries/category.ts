

/**  Function: upsertCategory
 * Description: Upserts a category into the database, updating if it exists or creating a new one if not.
 * Permission Level: Admin only
 * Parameters: 
 *      -category: Category object containing details of the category to be upserted.
 * Returns: Updated or newly created category details
 * */

import { getCurrentUser } from "@/lib/auth/current-user"
import { Category } from "@/generated/prisma/client"; 
import { db } from "@/lib/db";

// we only need the following fields for the form, not all of the Category fields
// we will let prisma generate the other fields
type UpsertCategoryInput = {
    id?: string;
    name: string;
    image: string;
    url: string;
    featured: boolean;
}


export const upsertCategory=async(category: Category)=> {
    try {
        //Get current user from session token
        const user = await getCurrentUser();

        // Check to see if user is authenticated
        if (!user) throw new Error('Unauthenticated.');

        // Verify admin permission
        if (user.role !== "ADMIN") throw new Error("Admin Privilages Required for Entry")

        // Check to see of category is provided
        if (!category) throw new Error("Please provide category data.");

        // Check for duplicate category name
        const existingCategory = await db.category.findFirst({
            where: {
                AND: [
                    {
                        OR: [{name: category.name}, {url: category.url}],
                    },
                    {
                        NOT: {
                            id: category.id,
                        }
                    }
                ],
            },
        });

        // Throw error if category name is a duplicate
        if (existingCategory) {
            let errorMessage="";
            if(existingCategory.name===category.name) {
                errorMessage = "A category with the same name already exists.";
            } else if (existingCategory.url === category.url) {
                errorMessage = "A category with the same URL already exists.";                
            }
            throw new Error(errorMessage);
        }

        // Upsert category into the database
        const categoryDetails = await db.category.upsert({
            where: {
                id: category.id,                
            },
            update: category,
            create: category,
        });
        return categoryDetails;
    } catch (error) {
        // Log and re-throw any errors
        console.log(error);
    }
}