import Image from "next/image";

export default function Community() {
  return (
<>
    <h1 className="text-4xl font-bold my-8 text-center">
    Comunidad
  </h1>


    <div className="relative w-screen h-screen">
      <Image 
        src="/pizarra_de_libros.png" 
        alt="Imagen de pizarra de eventos" 
        layout="fill" 
        objectFit="cover" 
        priority
      />
   
    </div>
    </>
  );
}
