"use client"

// Prisma model
import { Category } from "@/generated/prisma/client";
import { FC, useEffect } from "react";

//form handling utilities
import * as z from "zod";
import {useForm} from 'react-hook-form';
import { CategoryFormSchema } from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";

//interface from Category schema already defined
interface CategoryDetailsProps {
    data?:Category;
    upload_preset: string;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({data, upload_preset})=>{
    // form hook for managing form state and validation
    // z.infer extracts type from Zod schema
    const form = useForm<
        //z.infer<typeof CategoryFormSchema>>({ // replace with z.input and z.output so input allows any type or undefined and resolver works with input not output type
        z.input<typeof CategoryFormSchema>, unknown,
        z.output<typeof CategoryFormSchema>
        >({
            mode:"onChange",  // form validation onChange
            resolver: zodResolver(CategoryFormSchema),
            defaultValues: {
                // Setting default form values from data (if available)
                name: data?.name ?? "",
                image: data?.image ? [{url:data?.image}] : [],
                url: data?.url ?? "",
                featured: data?.featured ?? false,
            },   
        });

    // Loading status based on form submission
    const isLoading = form.formState.isSubmitting;

    // Reset form values when data changes
    useEffect(()=> {
        if (data) {
            form.reset({
                name: data?.name,
                image: [{url:data?.image}],
                url: data?.url,
                featured: data?.featured,
            })
        }
    }, [data, form])

    // Submit handler for form submission
    const handleSubmit = async(values:z.infer<typeof CategoryFormSchema>) => {
        console.log(values);
    }
    return <AlertDialog>
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Category Information</CardTitle>
                <CardDescription>
                    {data?.id 
                        ? `Update ${data?.name} category information.` 
                        : "Let's create a category. You can edit category settings later from the category page."}
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
                                    upload_preset={upload_preset}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField disabled={isLoading}
                          control={form.control}
                          name="name"
                          render={({ field })=>(
                            <FormItem className="flex-1">
                              <FormLabel>Category name</FormLabel>
                              <FormControl>
                                <Input placeholder="Name" {...field} /> 
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                            
                        />

                        <FormField 
                          disabled={isLoading}
                          control={form.control}
                          name="url"
                          render={( { field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Category url</FormLabel>
                                <FormControl>
                                    <Input placeholder="/category-url" {...field} />                                    
                                </FormControl>
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
                                    This Category will appear on the home page
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading
                            ? "loading..."
                            : data?.id
                            ? "Save category information"
                            : "Create category"
                          }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </AlertDialog>
}

export default CategoryDetails;