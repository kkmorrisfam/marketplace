
import { getAllSubCategories } from "@/queries/subCategory";
import {
  tableFeatures,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  createFilteredRowModel,
} from "@tanstack/react-table";


export interface DashboardSidebarMenuInterface{
    label: string;
    icon: string;
    link: string;
}


export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
});


// using a function to determine the type allows the type to 
// adapt as the function may change over time
// "I need the shape returned by this query/function" 
// use: Awaited<ReturnType<typeof someFunction>>
// "I need one object from the array returned by this query" by using it's index
// use: Awaited<ReturnType<typeof someFunction>>[number]


// SubCategory + parent category
export type SubCategoryWithCategoryType=
//Prisma.PromiseReturnType< typeof getAllSubCategories>[0];
  Awaited<ReturnType<typeof getAllSubCategories>>[number];  //using [number] because it's the type of an element in the array
