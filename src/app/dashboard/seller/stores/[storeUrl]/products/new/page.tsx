import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";

interface SellerNewProductPageProps {
  params: Promise<{ storeUrl: string}>;
}


export default async function SellerNewProductPage(
  {
    params,
  } : 
    SellerNewProductPageProps)  {
  
    const {storeUrl } = await params;

  const categories = await getAllCategories();

  return (
    <div className="w-full" >
      <ProductDetails categories={categories} storeUrl={storeUrl} />
    </div>
  ) 
}
