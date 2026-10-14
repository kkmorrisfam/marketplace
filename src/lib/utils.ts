import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getPaletteSync } from "colorthief";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to generate a unique slug


// Helper function to create grid classnames depending on length
export const getGridClassName = (length:number)=> {
  switch(length){
    case 2: return "grid-cols-2"; 
    case 3: return "grid-cols-2 grid-rows-2"; 
    case 4: return "grid-cols-2 grid-rows-1"; 
    case 5: return "grid-col-2 grid-rows-6"; 
    case 6: return "grid-cols-2"; 
    default: return "";
  }
}

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
     
    img.onload = () => {
      try {
       
        // extract four colors
        const palette = getPaletteSync(img, {colorCount: 4,}) ?? [] ;

        // convert colors into uppercase hexadecimal strings
        const colors = palette.map((color) => color.hex().toUpperCase());
        
        // returns a Promise<string[]> of colors
        resolve(colors);

     
      } catch (error) {
        reject(error);
      }
    };
 
  
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imgUrl;
  });
};

