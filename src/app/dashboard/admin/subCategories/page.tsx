import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory"
import { Plus } from "lucide-react";
import { columns } from "./columns";  // same folder subCategories


export default async function AdminSubCategoriesPage() {
    // get subCategories from the database
    const subCategories = await getAllSubCategories();
 
    // Check if no subcategories are found
    if (!subCategories) return null;

    // Get categories from the database
    const categories = await getAllCategories();

  return (
   <DataTable
      actionButtonText={
        <>
        <Plus size={15} />
        Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink='/dashboard/admin/subCategories/new' 
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subcategory name..."
      columns={columns}
   />    
  );
}
