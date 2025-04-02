"use client";

import { useEffect, useState, useCallback } from "react";
import { bookServices } from "../services/books/booksService";
import { Book } from "@/app/interface/book";

export function useBooks(quantity?: number): {
  data: Book[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await bookServices.getBooks(quantity);
      setBooks(result);
      setError(null);
    } catch (error) {
      console.error("Error al obtener libros:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [quantity]); // <- Agregar "quantity" como dependencia

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // <- Cambiar las dependencias para usar "fetchBooks"

  return { data: books, loading, error, refetch: fetchBooks };
}
