// React
import { Dispatch, FC, SetStateAction } from "react";

//Props definition
interface ColorPaletteProps {
  extractedColors?:string[]; // Extracted Colors (array of strings)
  colors?:{ color: string}[] // List of selected colors from form
  setColors: Dispatch<SetStateAction<{color:string}[]>> // Setter functino for colors
}

// ColorPalette component from displaying a color palette
const ColorPalette:FC<ColorPaletteProps>= ({
    extractedColors,
    colors,
    setColors,
}) => {
    return (<div className="pt-10 w-75 h-40 rounded-b-md overflow-hidden  " >
        {/* Color palette container */}
        <div className="w-[320px] h-40 rounded-md perspective-1000 " ></div>
    </div>)
};

export default ColorPalette;