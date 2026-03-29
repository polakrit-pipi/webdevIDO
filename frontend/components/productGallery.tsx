"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [] }: { images: string[] }) {
    const [selectedImg, setSelectedImg] = useState(images.length > 0 ? images[0] : "");

    if (images.length === 0) {
        return <div className="w-[30vw] h-[30vw] bg-gray-100 animate-pulse" />;
    }
    return (
        <div className="flex justify-between w-full border-gray-200">
            <div className="flex flex-col gap-2" >
                {images.map((url, id) => (
                    <div 
                        key={id} 
                        className={`w-[8vw] cursor-pointer border-2 ${selectedImg === url ? 'border-[#5F4B8B]' : 'border-transparent'}`}
                        onClick={() => setSelectedImg(url)}
                    >
                        <Image
                            src={url}
                            width={500}
                            height={500}
                            alt="Thumbnail"
                            className="w-full h-auto"
                        />
                    </div>
                ))}
            </div>
            <div className="flex-1 flex justify-center items-start">
               <div className="w-[30vw]">
                    <Image 
                        src={selectedImg || '/placeholder.png'} 
                        width={500}    
                        height={500}     
                        alt="Shirt Preview" 
                        className="w-full h-auto" 
                    />
                </div> 
            </div>
            
        </div>
    );
}