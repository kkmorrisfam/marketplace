// React
import { Dispatch, FC, SetStateAction, useState } from "react";

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
  //console.log("Extracted colors:", extractedColors);
    // State to track the active color
    const [activeColor, setActiveColor] = useState<string>("");


    return (
    <div className="pt-10 w-75 h-40 rounded-b-md overflow-hidden  " >
      {/* Color palette container */}
      <div className=" relative w-[320px] h-45 rounded-md perspective-1000 " >
        {/* Active color display */}
        <div className="relative w-full flex items-center justify-center bg-white h-16 rounded-t-md" >
          {/* Active color circle */}
          <div className="absolute w-16 h-16 grid items-center justify-center shadow-lg rounded-full -top-10" 
            style={{backgroundColor:activeColor || "#fff"}}
          >
            {/* Spinner icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill={activeColor ? "#fff" : "#000"}
              viewBox="0 0 16 16"
              className="animate-spin"
            >
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
            </svg>
          </div>
        </div>
        {/* Color blocks */}
        <div className="w-full h-45 absolute bottom-0 flex! items-center justify-center">
          {/* Map over colors to display color blocks */}
           {
              extractedColors?.map((color, index)=> (
                <Color key={index} index={index} color={color} />
              ))
           }
        </div>
      </div>
    </div>)
};

// Color component for individual color block
const Color = ({color, index}: {color: string; index: number}) => {
    return (
      <div
        className="w-20 h-20 cursor-pointer transition-all duration-100 ease-linear relative hover:w-30 hover:duration-300"    
        style={{backgroundColor: color}}
      >
         {/* Color label */}
         <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black" >            
            {color}
         </div>
      </div>
    )

}

export default ColorPalette;