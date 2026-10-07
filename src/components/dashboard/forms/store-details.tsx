"use client"

// Prisma model
import { Store } from "@/generated/prisma/client";
import { FC, useEffect } from "react";

//form handling utilities
import * as z from "zod";
import {useForm} from 'react-hook-form';
import { StoreFormSchema } from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import { upsertStore } from "@/queries/store";

// messages
import { toast } from "sonner";
import { useRouter } from "next/navigation";

//interface from store schema already defined
interface StoreDetailsProps {
    data?:Store;
    //upload_preset: string;
}

const StoreDetails: FC<StoreDetailsProps> = ({data})=>{
    // Hook for routing
    const router = useRouter();

    // form hook for managing form state and validation
    // z.infer extracts type from Zod schema
    const form = useForm<
        //z.infer<typeof StoreFormSchema>>({ // replace with z.input and z.output so input allows any type or undefined and resolver works with input not output type
        z.input<typeof StoreFormSchema>, unknown,
        z.output<typeof StoreFormSchema>
        >({
            mode:"onChange",  // form validation onChange
            resolver: zodResolver(StoreFormSchema),
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
    // need to conform to name, image, url, featured fields
    const handleSubmit = async(values:z.infer<typeof StoreFormSchema>) => {
          // console.log(values);
          try {
            console.log("FORM VALUES: ", values)
            // Upserting Store data
            const response = await upsertStore({
             //id:data?.id ? data.id : uuid(), // prisma creates id, so no need to do it here.
             id: data?.id,   //if data has id, get it
             // form values
             name: values.name,
             image: values.image[0].url,
             url: values.url,
             featured: values.featured,
             // use database auto created date/time
             //createdAt: new Date(), 
             //updatedAt: new Date(),
            })

            

            // Display success message
            toast.success(
              data?.id
               ? "Store has been updated."
               : `Congratulations! "${response?.name}" has been created.`
            );

            // Redirect or Refresh data
            if (data?.id) {
              router.refresh();
            } else {
              router.push("/dashboard/admin/categories");
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
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                    {data?.id 
                        ? `Update ${data?.name} Store information.` 
                        : "Let's create a store. You can edit the store later from the store settings page."}
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
                              <FormLabel>Store name</FormLabel>
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
                                <FormLabel>Store url</FormLabel>
                                <FormControl>
                                    <Input placeholder="/Store-url" {...field} disabled={isLoading}/>                                    
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
                                    This Store will appear on the home page
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
                            ? "Save Store information"
                            : "Create Store"
                          }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </AlertDialog>
}

export default StoreDetails;