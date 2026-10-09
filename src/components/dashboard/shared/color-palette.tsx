import { Dispatch, FC, SetStateAction } from "react";

//Props definition
interface ColorPaletteProps {
  colors?:{colors:string}[]; // Extracted Colors (array of strings)
  colorsData?:{ color: string}[] // List of selected colors from form
  setColors: Dispatch<SetStateAction<{color:string}[]>> // Setter functino for colors
}

// ColorPalette component from displaying a color palette
const ColorPalette:FC<ColorPaletteProps>= ({
    colors,
    colorsData,
    setColors,
}) => {
    return ()
};

export default ColorPalette;