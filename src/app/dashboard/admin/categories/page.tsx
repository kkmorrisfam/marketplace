import CategoryDetails from '@/components/dashboard/forms/category-details';
import DataTable from '@/components/ui/data-table';
import { getAllCategories } from '@/queries/category'
import React from 'react'
import { Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  
  const categories = await getAllCategories();

  // Check if no categories are found
  if(!categories) return null;

  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  if (!CLOUDINARY_UPLOAD_PRESET) return null;


  return (
    <div>
     
      <DataTable 
        actionButtonText={
          <>          
            <Plus size = {15}/>
            Create Category
         </>
        }
        modalChildren={<CategoryDetails upload_preset='CLOUDINARY_UPLOAD_PRESET'/>}
        filterValue='name'
        data={categories}
        searchPlaceholder='Search category name...'
        columns={}
      />

    </div>
  )
}
