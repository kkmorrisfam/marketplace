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
    .length(1,"Choose only one category image."),
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