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