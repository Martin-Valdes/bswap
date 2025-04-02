"use client";

import {useState} from "react";
import Image from "next/image";

export interface BookImageModalProps {
    images: string[];
}


export const BookImageModal = ({images}: BookImageModalProps)=>{
   console.log('🚀 ~ BookImageModal ~ images:', images)
   const [isModalOpen, setIsModalOpen] = useState(false);


   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);

   return(
    <>
        <button onClick={openModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-sky-600">
            Ver Libro
        </button>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black border-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
                    <div className="flex  justify-between mb-4">
                        <h2 className="text-xl font-bold ">Imagenes Extra</h2>
                        <button onClick={closeModal} className="text-2x1">&times;</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative h-64">
                                <Image 
                                 src={img || "/imagenprueba.png"}
                                 alt={`vista libro ${index + 1}`}
                                 fill
                                 className="object-contain"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    
    </>
   )
  }