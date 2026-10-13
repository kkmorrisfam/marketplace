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
    return (<div></div>)
};

export default ColorPalette;