import { useState, useEffect } from "react";
import { Book } from "@/app/interface/book";
import useAuth  from "@/shared/hooks/useAuth";

interface ExchangeModalProps {
  book: Book;
  onClose: () => void;
}

export default function ExchangeModal({ book, onClose }: ExchangeModalProps) {
  const { user } = useAuth();
  const [ownerId, setOwnerId] = useState<string | null>(book.userId);

  useEffect(() => {
    const fetchOwnerId = async () => {
      if (!book.userId && user) {
        try {
          const response = await fetch(`https://equipo-s21-05-m-webapp.onrender.com/users/${user.id}`);
          if (!response.ok) throw new Error("Error al obtener el usuario");
          
          const userData = await response.json();

          if (userData && userData.library) {
            const foundBook = userData.library.find((b: Book) => b.id === book.id);
            if (foundBook) {
              setOwnerId(userData.id);
            }
          }
        } catch (error) {
          console.error("Error al obtener el ownerId:", error);
        }
      }
    };

    fetchOwnerId();
  }, [book.userId, user, book.id]);

  const handleSendEmail = async () => {
    try {
      if (!ownerId) {
        alert("No se pudo determinar el propietario del libro.");
        return;
      }

      const payload = {
        bookId: book.id,
        requesterId: user ? user.id : "current-user-id",
        ownerId: ownerId,
        status: "pending",
        request_date: new Date().toISOString(),
      };

      const response = await fetch("https://equipo-s21-05-m-webapp.onrender.com/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al enviar solicitud de intercambio");
      }

      alert("Solicitud enviada correctamente. Se enviará un correo de confirmación.");
    } catch (error) {
      console.error(error);
      alert("Error al enviar solicitud");
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Solicitud de intercambio</h2>
        <p className="mb-6">
          ¿Deseas solicitar el intercambio del libro <strong>{book.title}</strong>?
        </p>
        <div className="mt-4 flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendEmail}>
            Enviar solicitud
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

