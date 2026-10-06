"use server"

/**  Function: upsertSubCategory
 * Description: Upserts a SubCategory into the database, updating if it exists or creating a new one if not.
 * Permission Level: Admin only
 * Parameters: 
 *      -SubCategory: SubCategory object containing details of the SubCategory to be upserted.
 * Returns: Updated or newly created category details
 * */

import { getCurrentUser } from "@/lib/auth/current-user"
//import { SubCategory } from "@/generated/prisma/client"; 
import { db } from "@/lib/db";

// we only need the following fields for the form, not all of the Category fields
// we will let prisma generate the other fields
type UpsertSubCategoryInput = {
    id?: string;
    name: string;
    image: string;
    url: string;
    featured: boolean;
    categoryId: string;
}

//export const upsertSubCategory=async(category: Category)=> {
export const upsertSubCategory=async(subCategory: UpsertSubCategoryInput)=> {
    try {
        //Get current user from session token
        const user = await getCurrentUser();

        // Check to see if user is authenticated
        if (!user) throw new Error('Unauthenticated.');

        // Verify admin permission
        if (user.role !== "ADMIN") throw new Error("Admin Privilages Required for Entry")

        // Check to see of category is provided
        if (!subCategory) throw new Error("Please provide subcategory data.");

        // Check for duplicate category name or URL    
        const existingSubCategory = await db.subCategory.findFirst({
            where: {
                AND: [
                {
                    // check for either same name or url
                    OR: [
                    { name: subCategory.name },
                    { url: subCategory.url },
                    ],
                },
                // is the subcatetory id there?
                subCategory.id
                    ? {
                        NOT: {
                        id: subCategory.id,
                        },
                    }
                    : {},
                ],
            },
        });
 
        // Throw error if subcategory name is a duplicate
        if (existingSubCategory) {
            let errorMessage="";
            if(existingSubCategory.name===subCategory.name) {
                errorMessage = "A subcategory with the same name already exists.";
            } else if (existingSubCategory.url === subCategory.url) {
                errorMessage = "A subcategory with the same URL already exists.";                
            }
            throw new Error(errorMessage);
        }

        // Upsert subcategory into the database
        // can use this version if I manually create a cuid first, but we're letting the database do it.
        /*const SubCategoryDetails = await db.subCategory.upsert({
            where: {
                id: subCategory.id,                
            },
            update: subCategory,
            create: subCategory,
        });
        return SubCategoryDetails;
        */
        
        // Upsert subcategory into the database
        if (subCategory.id) {
            return await db.subCategory.update({
                where: {
                id: subCategory.id,
                },
                data: {
                name: subCategory.name,
                image: subCategory.image,
                url: subCategory.url,
                featured: subCategory.featured,
                },
            });
        }

        return await db.subCategory.create({
            data: {
                name: subCategory.name,
                image: subCategory.image,
                url: subCategory.url,
                featured: subCategory.featured,
            },
        });

    } catch (error) {
        // Log and re-throw any errors
        console.error(error);
        throw error;
    }
}

/**
 * Function: getAllCategories
 * Description: Retrives all cateories from the database.
 * Permission level: public
 * Returns: Array of categories sorted by updatedAt date in descending order.
 */

export const getAllSubCategories = async()=>{
    // Get all categires from the database
    const subCategories = await db.subCategory.findMany({
        include: {
            category: true,
        },
        
        orderBy: {
            updatedAt: "desc",
        },
    });
    return subCategories;

}

// Function: getCategory
// Description: Retrieves a specific subCategory from the database.
// Access Level: Public
// Parameters:
//   - subCategoryId: The ID of the subCategory to be retrieved.
// Returns: Details of the requested subCategory.
export const getSubCategory = async (subCategoryId: string) => {
  // Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide subcategory ID.");

  // Retrieve subCategory
  const subCategory = await db.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

// Function: deleteSubCategory
// Description: Deletes a subCategory from the database.
// Permission Level: Admin only
// Parameters:
//   - subCategoryId: The ID of the subCategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteSubCategory = async (subCategoryId: string) => {
  // Get current user
  const user = await getCurrentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Verify admin permission
  if (user.role !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );

  // Ensure subCategory ID is provided
  if (!subCategoryId) throw new Error("Please provide subcategory ID.");

  // Delete subCategory from the database
  const response = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });
  return response;
};