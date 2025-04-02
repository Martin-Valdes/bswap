import { Book } from "@/app/interface/book";

const BASE_URL = `${
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://equipo-s21-05-m-webapp.onrender.com"
}`;

class BookServices {
  getBooks = async (quantity?: number): Promise<Book[]> => {
    try {
      const url = quantity
        ? `${BASE_URL}/books?quantity=${quantity}`
        : `${BASE_URL}/books`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error al obtener libros: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data?.data || [];
    } catch (error) {
      console.error("Error en getBooks:", error);
      throw error;
    }
  };

  getBookById = async (bookId: string): Promise<Book> => {
    try {
      const res = await fetch(`${BASE_URL}/books/${bookId}`);

      if (!res.ok) {
        throw new Error(
          `Error al obtener libro: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      return data?.data || {};
    } catch (error) {
      console.error("Error en getBookById:", error);
      throw error;
    }
  };

  createBook = async (bookData: FormData): Promise<Book> => {
    try {
      const token = localStorage.getItem("authToken");

      console.log(token);
      const response = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bookData,
      });

      if (!response.ok) {
        throw new Error(
          `Error al crear libro: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en createBook:", error);
      throw error;
    }
  };

  updateBook = async (book: Book): Promise<Book> => {
    try {
      const response = await fetch(`${BASE_URL}/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error(
          `Error al actualizar libro: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en updateBook:", error);
      throw error;
    }
  };

  deleteBook = async (bookId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/books/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Error al eliminar libro: ${response.status} ${response.statusText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error en deleteBook:", error);
      throw error;
    }
  };
}

export const bookServices = new BookServices();
