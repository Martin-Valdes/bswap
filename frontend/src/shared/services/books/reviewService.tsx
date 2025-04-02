import { Review } from "@/app/interface/book";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://equipo-s21-05-m-webapp.onrender.com";

class ReviewService {
  getReviews = async (): Promise<Review[]> => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
     
      if (!response.ok) {
        throw new Error(`Error al obtener reseñas: ${response.status} ${response.statusText}`);
      }
     
      const data = await response.json();
      
      // Verifica que el formato sea correcto
      const reviews = Array.isArray(data) ? data : (data.data || []);
     
      return reviews;
    } catch (error) {
      console.error("❌ Error al obtener reseñas:", error);
      return [];
    }
  }

  getReviewById = async (reviewId: string): Promise<Review | null> => {
    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`);
      if (!res.ok) {
        throw new Error(`Error al obtener reseña: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      return data || null;
    } catch (error) {
      console.error("❌ Error al obtener reseña por ID:", error);
      return null;
    }
  }

  getReviewsByBookId = async (bookId: string): Promise<Review[]> => {
    try {
      const res = await fetch(`${API_URL}/reviews?bookId=${bookId}`);
      if (!res.ok) {
        throw new Error(`Error al obtener reseñas por libro: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error al obtener reseñas por libro:", error);
      return [];
    }
  }

  // Valida el ID del libro
  validateBookId = async (bookId: string): Promise<boolean> => {
    if (!bookId || bookId === "temp-book-id" || bookId === "new-book") {
      return false;
    }
  
    try {
      const res = await fetch(`${API_URL}/books/${bookId}`);
  
      if (!res.ok) {
        console.error(`❌ Libro no encontrado: ${bookId}`);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error("❌ Error al validar el ID del libro:", error);
      return false;
    }
  };
  

  createReview = async (reviewData: Omit<Review, 'id'>): Promise<Review | null> => {
    console.log(" userId en createReview:", reviewData.userId);
    try {
     // Valida el ID del libro
      const isValidBookId = await this.validateBookId(reviewData.bookId);
      if (!isValidBookId) {
        console.error("❌ ID de libro inválido:", reviewData.bookId);
        throw new Error("ID de libro inválido");
      }
      //valida usuario
      if (!reviewData.userId) {
        console.error("❌ ID de usuario inválido:", reviewData.userId);
        throw new Error("ID de usuario inválido");
      }

      // Verifica que los campos de api esten completos
      const review = {
        bookId: reviewData.bookId,
        userId: reviewData.userId || "",
        rating: reviewData.rating || 0,
        content: reviewData.content || "",
        publication_date: new Date().toISOString(),
        // Para verificar que comments y reaction son string json validos
        comments: reviewData.comments || "[]",
        reactions: reviewData.reactions || "[]"
      };

      console.log("Enviando reseña:", JSON.stringify(review, null, 2));
      
      const response = await fetch("https://equipo-s21-05-m-webapp.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });
     
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("❌ Respuesta del servidor:", errorBody);
        console.error("❌ Código de estado:", response.status);
        console.error("❌ Cabeceras:", JSON.stringify(Object.fromEntries([...response.headers]), null, 2));
        throw new Error(`Error al crear reseña: ${response.status} ${response.statusText}`);
      }
     
      const data = await response.json();
      console.log("✅ Reseña creada:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al crear reseña:", error);
      return null;
    }
  }

  updateReview = async (review: Review): Promise<Review | null> => {
    try {
      const response = await fetch(`https://equipo-s21-05-m-webapp.onrender.com/reviews/${review.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar reseña: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error al actualizar reseña:", error);
      return null;
    }
  }

  deleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://equipo-s21-05-m-webapp.onrender.com/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar reseña: ${response.status} ${response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error("❌ Error al eliminar reseña:", error);
      return false;
    }
  }
}

export const reviewService = new ReviewService();