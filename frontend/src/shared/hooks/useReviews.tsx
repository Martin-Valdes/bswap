import { useState, useEffect, useCallback } from "react";
import { Review } from "@/app/interface/book";
import { reviewService } from "@/shared/services/books/reviewService";

interface UseReviewsReturn {
  data: Review[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useReviews = (bookId?: string): UseReviewsReturn => {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      let reviewsData: Review[] = [];

      if (bookId) {
        reviewsData = await reviewService.getReviewsByBookId(bookId);
      } else {
        reviewsData = await reviewService.getReviews();
      }

      if (!reviewsData || reviewsData.length === 0) {
        setData([
          {
            id: "mock-1",
            userId: "user1",
            bookId: bookId || "book1",
            rating: 4,
            content: "Excelente libro, muy recomendado",
            publication_date: new Date().toISOString(),
            user: {
              id: "user1",
              name: "Usuario Demo",
              profile_picture: "/imagenprueba.png",
              country: "Argentina",
              city: "Buenos Aires",
            },
          },
          {
            id: "mock-2",
            userId: "user2",
            bookId: bookId || "book1",
            rating: 5,
            content: "Una historia fascinante que no pude dejar de leer",
            publication_date: new Date().toISOString(),
            user: {
              id: "user2",
              name: "Usuario Test",
              profile_picture: "/imagenprueba.png",
              country: "México",
              city: "CDMX",
            },
          },
        ]);
      } else {
        setData(reviewsData);
      }

      setError(null);
    } catch (err) {
      console.error("Error obteniendo reseñas:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Error desconocido al obtener reseñas")
      );
    } finally {
      setLoading(false);
    }
  }, [bookId]); // <-- Agregar bookId como dependencia

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // <-- Cambiar la dependencia

  return { data, loading, error, refetch: fetchReviews };
};

export default useReviews;
