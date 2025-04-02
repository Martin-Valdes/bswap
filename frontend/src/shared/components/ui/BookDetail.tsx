/* src/shared/components/ui/BookDetail.tsx */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { bookServices } from "@/shared/services/books/booksService";
import Loading from "@/shared/components/common/Loading";
import Error from "@/shared/components/common/Error";
import { Book } from "@/app/interface/book";
import ExchangeModal from "@/shared/components/ui/ExchangeModal";
import { Button } from "@/shared/components/common/Button";

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  interface UserData {
    id: string;
    name: string;
    city?: string;
    country?: string;
    profile_picture?: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);

        const bookData = await bookServices.getBookById(params.id);

        if (!bookData || !bookData.id) {
          setError("No se pudo obtener la información del libro");
        }

        setBook(bookData);

        if (bookData.userId) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${bookData.userId}`
            );
            if (response.ok) {
              const userData = await response.json();
              setUserData(userData.data || null);
            }
          } catch (userError) {
            console.error("Error al obtener datos del usuario:", userError);
          }
        }
      } catch (err) {
        setError(`Error: ${err as string}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [params.id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!book) return <Error message="No se encontró el libro solicitado" />;

  // Obtener las imágenes adicionales del libro
  const additionalImages = book.Images || [];
  console.log('🚀 ~ BookDetailPage ~ additionalImages:', additionalImages)
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Ficha técnica del libro */}
      <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        {/* Columna izquierda - Imagen principal */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-auto">
          <Image
            src={book.Images[0].file  ? book.Images[0].file : "/imagenprueba.png"}
            alt={`Portada del libro ${book.title}`}
            fill
            className="object-cover"
            priority={true}
          />
        </div>

        {/* Columna derecha - Detalles del libro */}
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Ficha Técnica
          </h1>

          <div className="space-y-3 mb-6">
            <p>
              <strong>Título:</strong> {book.title}
            </p>
            <p>
              <strong>Autor:</strong> {book.author}
            </p>
            <p>
              <strong>Género:</strong> {book.genre || "No especificado"}
            </p>
            <p>
              <strong>Editorial:</strong> {book.publisher || "No especificada"}
            </p>
            <p>
              <strong>ISBN:</strong> {book.isbn || "No especificado"}
            </p>
            <p>
              <strong>Estado del libro:</strong>{" "}
              {book.status === "pending"
                ? "Pendiente"
                : book.status === "approved"
                ? "Aprobado"
                : "Rechazado"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
            <p className="text-gray-700">
              {book.description || "No hay sinopsis disponible."}
            </p>
          </div>

          <Button
            onClick={() => setImageModalOpen(true)}
            className="w-full mb-6 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Ver imágenes del libro
          </Button>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Datos de contacto</h2>
            <p>
              <strong>Subido por:</strong> {book.userId}
            </p>
            {userData && (
              <p>
                <strong>Ubicación:</strong>{" "}
                <span>{userData.city || "Ciudad no especificada"}</span> -
                <span>{userData.country || "País no especificado"}</span>
              </p>
            )}
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Solicitar Intercambio
          </Button>
        </div>
      </div>

      {/* Información del usuario */}
      {userData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden relative mr-4">
                <Image
                  src={userData.profile_picture || "/imagenprueba.png"}
                  alt={`Foto de perfil de ${userData.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
            </div>

            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4">
              Seguir
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-2">📚</span>
              <p>Libros publicados = 5</p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <span className="mr-2">❤️</span>
                <p>Libros que deseo conseguir</p>
              </div>
              <ul className="list-disc ml-8">
                <li>Moby Dick</li>
                <li>El ilusionista</li>
                <li>El psicoanalista</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Intercambio */}
      {isModalOpen && book && (
        <ExchangeModal book={book} onClose={() => setModalOpen(false)} />
      )}

      {/* Modal de Imágenes */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Más imágenes</h3>
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {additionalImages.length > 0 ? (
                  additionalImages.map((image, index) => (
                    <div
                      key={image.id || index}
                      className="relative h-64 rounded overflow-hidden"
                    >
                      <Image
                        src={image.file || "/imagenprueba.png"}
                        alt={`Imagen ${index + 1} del libro ${book.title}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-center py-12 text-gray-500">
                    No hay imágenes adicionales disponibles
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
