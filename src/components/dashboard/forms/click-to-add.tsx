import { Input } from "@/components/ui/input";
import React, { FC } from "react";

// Define the interface for each detail object
export interface Detail {
  [key:string]: string | number | undefined;

}

// Lifting state up, shared state is maintained by a parent component.
//Define props for the ClickToAddInputs component
interface ClickToAddInputsProps<T extends Detail> {
  details: T[];
  setDetails: React.Dispatch<React.SetStateAction<T[]>>;  // Setter function for details
  initialDetail?:T;  //Optional initial detail object
  header: string;       // Header text for the component
}

  // PlusButton component for adding new details
  const PlusButton = ({ onClick }: {onClick: () => void}) => {
   return (
    <button
      type="button"
      title="Add new detail"
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
      onClick={onClick}
    >
      {/* Plus icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-blue-primary group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
      >
      <path
        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
        strokeWidth="1.5"
      />
        <path d="M8 12H16" strokeWidth="1.5" />
        <path d="M12 16V8" strokeWidth="1.5" />
      </svg>
    </button>

   );
  }; // end PlusButton
  
    // MinusButton component for removing details
  const MinusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Remove detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        {/* Minus icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-white group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.5"
          />
          <path d="M8 12H16" strokeWidth="1.5" />
        </svg>
      </button>
    );
  }; // end MinusButton



// ClickToAddInputs component definition
const ClickToAddInputs = <T extends Detail,>({
  details,
  setDetails,
  header,
  initialDetail,
}: ClickToAddInputsProps<T>) => {

  // Function to handle changes in detail properties
  const handleDetailChange = (index:number, property:string, value: string | number) => { 

     // Update the details array with the new property value
    const updatedDetails=details.map((detail,i)=>(
      i===index ? {...detail, [property]:value} : detail
    ));

    setDetails(updatedDetails);
  };


  // Add a new detail object to the details array
  const handleAddDetail = () => {
    // Add a new detail object to the details array
    if (initialDetail) {
      setDetails((prevDetails) => [
        ...prevDetails,
        { ...initialDetail },
      ]);
    }
  };

  // Function to handle removal of a detail
  const handleRemove = (index: number) => {
    // We must atleast keep one detail we can't delete if it's the only detail available
    if (details.length === 1) return;
    // Filter out the detail at the specified index
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails); // Update the state with the filtered details
  };


  return <div className="flex flex-col gap-y-4 ">
    {/* Header */}
    <div>{header}</div>
    {/* Display PlusButton if no details exist */}
    {details.length===0 && <PlusButton onClick={handleAddDetail} />}  
    {/* Map through details and render input fields */} 
    {details.map((detail, index)=>(
      <div key={index} className="flex flex-items-center gap-x-4">
        { 
          Object.keys(detail).map((property, propIndex)=> (
            <div key={propIndex} className="flex items-center gap-x-4" >
              {/* Input field for each property */}
              <Input 
                className="w-28"
                type={typeof detail[property]==="number" ? "number" : "text"}
                name={property}
                placeholder={property}
                value={detail[property] as string} 
                min={typeof detail[property]==="number" ? 0 : undefined}
                onChange={(e)=>
                  handleDetailChange(
                    index, 
                    property, 
                    e.target.type==="number" 
                      ? parseFloat(e.target.value) 
                      : e.target.value
                    )
                  }
              />    
            </div>
          ))
        }
        {/* Show buttons for each row of inputs */}
        <MinusButton 
          onClick={()=>{}}
        />
        <PlusButton 
          onClick={handleAddDetail}          
        />
      </div>
    ))}
  </div>; //final div

}

export default ClickToAddInputs;