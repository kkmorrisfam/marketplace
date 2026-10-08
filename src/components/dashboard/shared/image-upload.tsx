"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value:string)=>void;
    onRemove: (value:string)=>void;
    value: string[];
    type: "standard" | "profile" | "cover";
    dontShowPreview?: boolean;
    //upload_preset: string;
}


const ImageUpload: FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
    type,
    dontShowPreview,
    //upload_preset
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
         // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
    if (!CLOUDINARY_UPLOAD_PRESET) return null;

    const onUpload = (result: CloudinaryUploadWidgetResults) => {
        console.log("onUpload result ", result);
        if (
            typeof result.info === "object" &&
            "secure_url" in result.info
        ) {
             onChange(result.info.secure_url);
        };       
    }

    //display image of profile type
    if (type==="profile") {
        return (<div className="relative rounded-full w-52 h-52  bg-gray-200 border-2 border-white shadow-2xl">
            {
                value.length>0 && 
                <Image 
                    src={value[0]} 
                    alt="" 
                    width={300} //to increase image quality
                    height={300} 
                    className="w-52 h-52 rounded-full object-cover absolute top-0 left-0 bottom-0 right-0"
                />
            }
            
            <CldUploadWidget uploadPreset={CLOUDINARY_UPLOAD_PRESET} onSuccess={onUpload}>
                {({open}) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                      <>
                        <button
                          type="button"
                          className="z-20 absolute right-0 bottom-6 flex items-center font-medium text-[17px]  h-14 w-14 justify-center  text-white bg-linear-to-t from-blue-primary to-blue-300 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm"
                          disabled={disabled}
                          onClick={onClick}
                        >
                          <svg
                            viewBox="0 0 640 512"
                            fill="white"
                            height="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                          </svg>  
                        </button>
                      </>
                    );
                }}
            </CldUploadWidget>
        </div>)
    } else if (type==="cover") {
        return (
          <div            
            className="relative w-full bg-gray-100 rounded-lg bg-linear-to-b from-gray-100 via-gray-400 overflow-hidden "
            style={{ height: "348px"}}
            >
              {
                value.length>0 && <Image 
                src={value[0]}
                alt=""
                width={1200}
                height={1200}
                className="w-full rounded-lg object-cover"
                />
              }

            <CldUploadWidget uploadPreset={CLOUDINARY_UPLOAD_PRESET} onSuccess={onUpload}>
                {({open}) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                      <>
                        <button
                          type="button"
                          className="absolute right-0 bottom-6 flex items-center font-medium text-[17px]  h-14 w-14 justify-center  text-white bg-linear-to-t from-blue-primary to-blue-300 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm"
                          disabled={disabled}
                          onClick={onClick}
                        >
                          <svg
                            viewBox="0 0 640 512"
                            fill="white"
                            height="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                          </svg>
                           <span>Upload images</span>  
                        </button>
                      </>
                    );
                }}
            </CldUploadWidget>

          </div>
    )} else {
        return (
        <div>
          <div className="mb-4 flex items-center gap-4" >
            {value.length >0  && !dontShowPreview &&
              value.map((imageUrl)=>(
                <div key={imageUrl} 
                  className="relative w-50 min-h-25 max-h-50"
                >
                  {/* Delete image button*/}
                  <div className="z-10 absolute top-2 right-2">
                    <Button 
                      onClick={()=>onRemove(imageUrl)}
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="rounded-full" 
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image */}
                  <Image
                    fill
                    className="object-cover rounded-md"
                    alt=""
                    src={imageUrl}
                  />
                </div>
              ))}
          </div>
          <CldUploadWidget uploadPreset={CLOUDINARY_UPLOAD_PRESET} onSuccess={onUpload}>
            {({open}) => {
                const onClick = () => {
                    open();
                };

                return (
                  <>
                    <button
                      type="button"
                      className="flex items-center font-medium text-[17px] py-3 px-6 text-white bg-linear-to-t from-blue-primary to-blue-300 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm"
                      disabled={disabled}
                      onClick={onClick}
                    >
                      <svg
                        viewBox="0 0 640 512"
                        fill="white"
                        height="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                      </svg>  
                      <span>Upload images</span>
                    </button>
                  </>
                );
            }}
        </CldUploadWidget>

      </div>
      )
    }

    return (<div></div>)
}

export default ImageUpload