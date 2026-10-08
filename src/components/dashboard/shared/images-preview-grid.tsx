/**
 *    images: z
     .object({
         url: z.string(),
     })
     .array()
     .length(1,"Choose a product image.")
     .min(1, "Please upload at least 3 images for the product.")
     .max(10, "You can upload up to 10 images for the product."),
 */

import { FC } from "react";

interface ImagesPreviewGridProps{
    images: { url: string }[]; 
    onRemove: (values: string) => void; 
}

const ImagesPreviewGrid:FC<ImagesPreviewGridProps> = ({
    images,
    onRemove,
}) => {
    return  <div></div>;
    
};

export default ImagesPreviewGrid