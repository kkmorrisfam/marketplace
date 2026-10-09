import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to generate a unique slug


// Helper function to create grid classnames depending on length
export const getGridClassName = (length:number)=> {
  switch(length){
    case 2: return "grid-col-2"; 
    case 3: return "grid-col-3 grid-rows-2"; 
    case 4: return "grid-col-4 grid-rows-1"; 
    case 5: return "grid-col-5 grid-rows-6"; 
    case 6: return "grid-col-6"; 
    default: return "";
  }
}
