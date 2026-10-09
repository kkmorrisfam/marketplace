"use client"

// Prisma model, schema
import { Category, Store } from "@/generated/prisma/client";
import { ProductFormSchema } from "@/lib/schemas";

// React, Next.js
import { FC, useEffect, useState } from "react";
import {useForm} from 'react-hook-form';
import { useRouter } from "next/navigation";

// utilities
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ImageUpload from "../shared/image-upload";

// components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Queries
import { upsertStore } from "@/queries/store";

// Types
import { ProductTypeWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";


//interface from store schema already defined
interface ProductDetailsProps {
    data?:ProductTypeWithVariantType;
    categories: Category[];
    storeUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories, 
  storeUrl
})=>{
    // Hook for routing
    const router = useRouter();

     // Temporary state for images
  const [images, setImages] = useState <{ url: string }[]>([]);

    // form hook for managing form state and validation
    // z.infer extracts type from Zod schema
    const form = useForm<
        //z.infer<typeof ProductFormSchema>>({ // replace with z.input and z.output so input allows any type or undefined and resolver works with input not output type
        z.input<typeof ProductFormSchema>, unknown,
        z.output<typeof ProductFormSchema>
        >({
            mode:"onChange",  // form validation onChange
            resolver: zodResolver(ProductFormSchema),
            defaultValues: {
                // Setting default form values from data (if available)
                name: data?.name ?? "",
                description: data?.description,
                variantName: data?.variantName,
                variantDescription: data?.variantDescription,
                images: data?.images || [],
                categoryId: data?.categoryId,
                subCategoryId: data?.subCategoryId,
                brand: data?.brand,
                sku: data?.sku,
                colors: data?.colors || [{color: ""}],
                sizes: data?.sizes,
                keywords: data?.keywords,
                isSale: data?.isSale,
            },   
        });
    

    // Loading status based on form submission
    const isLoading = form.formState.isSubmitting;

    // Reset form values when data changes
    useEffect(()=> {
        if (data) {
            form.reset(data)
        }
    }, [data, form])

    // Submit handler for form submission
    // need to conform to name, logo, url, featured fields
    const handleSubmit = async(values:z.infer<typeof ProductFormSchema>) => {
          // console.log(values);
          try {
            console.log("FORM VALUES: ", values)
            // Upserting Store data
            const response = await upsertStore({             
              id: data?.id,   //if data has id, get it
             // form values
              name: values.name,
              description: values.description,
              email: values.email,
              phone: values.phone,
              logo: values.logo[0].url,
              cover: values.cover[0].url,
              url: values.url,
              featured: values.featured ?? false,           
             // use database auto created date/time?
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
              router.push("/dashboard/seller/stores");
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
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                    {data?.productId && data?.variantId
                        ? `Update information for ${data?.name}.` 
                        : "Let's create a product. You can edit the product later from the products page."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                      {/* Images - colors*/}
                      <div className="flex flex-col gap-y-6 xl:flex-row">
                        <FormField                          
                          control={form.control}
                          name="images"
                          render={({ field })=>(
                            <FormItem  >
                              <FormControl>
                              <>
                                <ImagesPreviewGrid 
                                    images={form.getValues().images}
                                    onRemove={(url) => {
                                      const updatedImages = images.filter(
                                        (img) => img.url !== url
                                      );
                                      setImages(updatedImages);
                                      field.onChange(updatedImages);
                                    }}                                  />
                                <FormMessage className="mt-4!" />
                                <ImageUpload
                                  dontShowPreview 
                                  type="standard"
                                  value={field.value.map((image) => image.url)}
                                  disabled={isLoading}
                                  onChange={(url) => {
                                    setImages((prevImages)=>{
                                      const updatedImages =[...prevImages, {url}];
                                      field.onChange(updatedImages)
                                      return updatedImages;
                                    });
                                  }}
                                  onRemove={(url)=>
                                    field.onChange([
                                      ...field.value.filter(
                                        (current) => current.url !== url
                                      ),
                                    ])
                                  }
                                />
                              </>
                              </FormControl>
                              
                            </FormItem>
                           )
                          }                        
                        />
        
                      </div>

                      {/* Name */}
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

                       {/* Description*/}
                        <FormField                         
                          control={form.control}
                          name="description"
                          render={({ field })=>(
                            <FormItem className="flex-1">
                              <FormLabel>Store description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Description" {...field} disabled={isLoading} /> 
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}                            
                        />
                        
                      {/* Email - Phone*/}

                        <Button 
                          type="submit" 
                          disabled={isLoading}>
                          {isLoading
                            ? "loading..."
                            : data?.productId && data.variantId
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

export default ProductDetails;