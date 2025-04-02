"use client";

import Image from "next/image";
import Link from "next/link";
import useAuth from "@/shared/hooks/useAuth";

export default function MyLibrary() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <h2 className="text-center  text-4xl font-bold my-8">Mi Biblioteca</h2>

      <div className="bg-white border-blue-800 p-4 rounded-md max-w-4xl mx-auto">
        <p className="font-bold text-xl">Estas en tu cuenta de Bswap</p>
        <div className="flex my-2 gap-2">
          <p>¿Necesitas cambiar tu cuenta?</p>{" "}
          <Link href={"/logout"} className="underline">
            Cerrar Sesión
          </Link>
        </div>
        <nav>
          <ul className="flex gap-4 [&>li]:underline [&>li]:font-bold my-4">
            <li>Datos Personales</li>
            <li className="bg-yellow-200">Mi biblioteca</li>
            <li>Mis seguidores</li>
          </ul>

          <div>
            <div className="flex gap-2 items-center border border-blue-400 p-2">
              <Image
                src="/booksEmoji.png"
                alt="emoji de libros"
                width={30}
                height={30}
              />
              <p className="font-bold text-xl">Mis Libros</p>
            </div>
            <p className="py-4">¡Tu Biblioteca esta vacia!</p>
          </div>
          <div>
            <div className="flex gap-2  items-center border border-blue-400 p-2">
              <Image
                src="/orangeBookEmoji.png"
                alt="emoji de libros"
                width={30}
                height={30}
              />
              <p className="font-bold text-xl">Libros Intercambiados</p>
            </div>
            <p className="py-4">¡Tu Biblioteca esta vacia!</p>
          </div>
          <div>
            <div className="flex gap-2  items-center border border-blue-400 p-2">
              <Image
                src="/bookStarEmoji.png"
                alt="emoji de libros"
                width={30}
                height={30}
              />
              <p className="font-bold text-xl">Libros que deseo</p>
            </div>
            <p className="py-4">¡Tu Biblioteca esta vacia!</p>
          </div>
          <div>
            <div className="flex gap-2  items-center border border-blue-400 p-2">
              {isAuthenticated ? (
                <>
                  <Image
                    src="/uploadImageButton.png"
                    alt="emoji de libros"
                    width={30}
                    height={30}
                  />
                  <Link href="/books/createbook" className="font-bold text-xl">
                    Cargar Libro
                  </Link>
                </>
              ) : (
                <Link href="/login">Login</Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
