"use client"

// Prisma model
import { Category, SubCategory } from "@/generated/prisma/client";
import { FC, useEffect } from "react";

//form handling utilities
import * as z from "zod";
import {useForm} from 'react-hook-form';
import { SubCategoryFormSchema } from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "../shared/image-upload";
import { upsertSubCategory } from "@/queries/subCategory";

// messages
import { toast } from "sonner";
import { useRouter } from "next/navigation";


//interface from Category schema already defined
interface SubCategoryDetailsProps {
    data?:SubCategory;
    categories: Category[];
    //upload_preset: string;
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({data, categories})=>{
    // Hook for routing
    const router = useRouter();

    // form hook for managing form state and validation
    // z.infer extracts type from Zod schema
    const form = useForm<
        //z.infer<typeof SubCategoryFormSchema>>({ // replace with z.input and z.output so input allows any type or undefined and resolver works with input not output type
        z.input<typeof SubCategoryFormSchema>, unknown,
        z.output<typeof SubCategoryFormSchema>
        >({
            mode:"onChange",  // form validation onChange
            resolver: zodResolver(SubCategoryFormSchema),
            defaultValues: {
                // Setting default form values from data (if available)
                name: data?.name ?? "",
                image: data?.image ? [{url:data?.image}] : [],
                url: data?.url ?? "",
                featured: data?.featured ?? false,
                categoryId: data?.categoryId,
            },   
        });
    

    // Loading status based on form submission
    const isLoading = form.formState.isSubmitting;

    // *** only use this for testing ***
    const formData = form.watch();
    console.log("formData", formData);

    // Reset form values when data changes
    useEffect(()=> {
        if (data) {
            form.reset({
                name: data?.name,
                image: [{url:data?.image}],
                url: data?.url,
                featured: data?.featured,
                categoryId: data.categoryId,
            })
        }
    }, [data, form])

    // Submit handler for form submission
    // need to conform to name, image, url, featured fields
    const handleSubmit = async(values:z.infer<typeof SubCategoryFormSchema>) => {
          // console.log(values);
          try {
            console.log("FORM VALUES: ", values)
            // Upserting category data
            const response = await upsertSubCategory({
             //id:data?.id ? data.id : uuid(), // prisma creates id, so no need to do it here.
             id: data?.id,   //if data has id, get it
             // form values
             name: values.name,
             image: values.image[0].url,
             url: values.url,
             featured: values.featured,
             categoryId: values.categoryId,
             // use database auto created date/time
             //createdAt: new Date(), 
             //updatedAt: new Date(),
            })

            

            // Display success message
            toast.success(
              data?.id
               ? "Subcategory has been updated."
               : `Congratulations! "${response?.name}" has been created.`
            );

            // Redirect or Refresh data
            if (data?.id) {
              router.refresh();
            } else {
              router.push("/dashboard/admin/subCategories");
            }
          } catch (error) {
            // handling form submission errors
            console.log(error);
            toast.error("Oops!", {
              description: 
                error instanceof Error
                ? error.message
                : "An unexpected error occurred.",
            })
          }
    }
    return <AlertDialog>
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Subcategory Information</CardTitle>
                <CardDescription>
                    {data?.id 
                        ? `Update ${data?.name} subcategory information.` 
                        : "Let's create a subcategory. You can edit subcategory settings later from the subcategory page."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField 
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUpload
                                    type="profile"
                                    value={field.value.map((image) => image.url)}
                                    disabled={isLoading}
                                    onChange={(url) => field.onChange([{ url }])}
                                    onRemove={(url) =>
                                    field.onChange([
                                        ...field.value.filter(
                                        (current) => current.url !== url
                                        ),
                                    ])
                                    }
                                   
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField                         
                          control={form.control}
                          name="name"
                          render={({ field })=>(
                            <FormItem className="flex-1">
                              <FormLabel>Subcategory name</FormLabel>
                              <FormControl>
                                <Input placeholder="Name" {...field} disabled={isLoading} /> 
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                            
                        />

                        <FormField                           
                          control={form.control}
                          name="url"
                          render={( { field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Subcategory url</FormLabel>
                                <FormControl>
                                    <Input placeholder="/subcategory-url" {...field} disabled={isLoading}/>                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField                           
                          control={form.control}
                          name="categoryId"
                          render={ ({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Category</FormLabel>
                               
                                  <Select 
                                      disabled={isLoading || categories.length==0}
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {
                                        categories.map((category) =>(
                                          <SelectItem key={category.id} value={category.id} >
                                            {category.name}
                                          </SelectItem>
                                        ))
                                      }
                                    </SelectContent>
                                    
                                  
                                  </Select>                               
                                <FormMessage />
                            </FormItem>
                          )}
                        />
    
                        <FormField 
                          control={form.control}
                          name="featured"
                          render={( {field} ) =>(
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                 
                                  onCheckedChange={field.onChange}                                  
                                />                                
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured</FormLabel>
                                <FormDescription>
                                    This subcategory will appear on the home page
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          disabled={isLoading}>
                          {isLoading
                            ? "loading..."
                            : data?.id
                            ? "Save subcategory information"
                            : "Create subcategory"
                          }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </AlertDialog>
}

export default SubCategoryDetails;