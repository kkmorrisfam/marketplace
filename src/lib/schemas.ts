import * as z from "zod";

// Category form schema using zod
export const CategoryFormSchema = z.object({
   name:z
    .string({
        // no longer needed with zod v.4
        //required_error: "Category name is required.",
        //invalid_type_error:"Category name must be a string.",

        error: "Category name must be a string.", // new for v.4, but not really necessary because react hook form passes "" not undefined
    })
    .min(1, { message: "Category name is required." })  // replaces above errors
    .min(2,{message:"Category name must be at least 2 characters long."})
    .max(50, {message: "Category name cannot exceed 50 characters."})
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        "Only letters, numbers, and spaces are allowed in the category name.",
    }),
   image: z
    .object({
        url: z.string(),
    })
    .array()
    .length(1,"Choose a category image."),
   url: z
    .string()
    .min(1, {message: "Category url is required"}) 
    .min(2,{message: "Category url must be at least 2 characters long."})
    .max(50, {message: "Category url cannot exceed 50 characters."})
    
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
   featured: z.boolean().default(false),      
})

// SubCategory form schema using zod
export const SubCategoryFormSchema = z.object({
   name:z
    .string({
        // no longer needed with zod v.4
        //required_error: "SubCategory name is required.",
        //invalid_type_error:"SubCategory name must be a string.",

        error: "Subcategory name must be a string.", // new for v.4, but not really necessary because react hook form passes "" not undefined
    })
    .min(1, { message: "Subcategory name is required." })  // replaces above errors
    .min(2,{message:"Subcategory name must be at least 2 characters long."})
    .max(50, {message: "Subcategory name cannot exceed 50 characters."})
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        "Only letters, numbers, and spaces are allowed in the subcategory name.",
    }),
   image: z
    .object({
        url: z.string(),
    })
    .array()
    .length(1,"Choose a subcategory image."),
   url: z
    .string()
    .min(1, {message: "Subcategory url is required"}) 
    .min(2,{message: "Subcategory url must be at least 2 characters long."})
    .max(50, {message: "Subcategory url cannot exceed 50 characters."})
    
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the subcategory url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
   categoryId:z.string(),
   featured: z.boolean().default(false),      
   
   // could also use //categoryId: z.string().min(1, {message: "Category is required.",}),
})


// Store schema


export const StoreFormSchema = z.object({
  name: z
    .string({
       error: "Store name must be a string.",
    })
    .min(2, {message: "Store name must be at least 2 characters long."})
    .max(50, { message: "Store name cannot exceed 50 characters."})
    .regex(/^(?!.*(?:[-_' ]){2,})[a-zA-Z0-9_' -]+$/, {
      message:
        "Only letters, numbers, spaces, hyphens, apostrophes and underscores are allowed in the store name, and consecutive occurrences of hyphens, underscores, apostrophes or spaces are not permitted.",
    }),
  description: z
    .string({
       error: "Store description must be a string.",
    })
    .min(30, {
      message: "Store description must be at least 30 characters long.",
    })
    .max(500,{
      message: "Store description cannot exceed 500 characters."
    }),
  email: z    
    .email({error: "Invalid email format."}),
  // could use this later for international phone numbers
  // phone: z.e164({error: "Invalid phone number"})
  phone: z
    .string({
      error: "Store phone number is required"
    })
    .min(1, {
      error: "Store phone number is required.",
    })
    .regex(/^\+?\d+$/, {
      error: "Invalid phone number format.",
    }),
    logo: z
      .object({
        url: z.string(),
      })
      .array()
      .max(1, {
        error: "Please choose a logo image.",
      }),

    cover: z
      .object({
        url: z.string(),
      })
      .array()
      .max(1, {
        error: "Please choose a cover image.",
      }),
    url: z
      .string()
      .min(2, { message: "Store url must be at least 2 characters long." })
      .max(50, { message: "Store url cannot exceed 50 characters." })
      .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
        message:
          "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
      }),
    featured: z.boolean().default(false).optional(),
    status: z.string().default("PENDING").optional(),

})