import { z } from 'zod';

// Esquema para el formulario de reseña
export const reviewFormSchema = z.object({
  bookId: z.string().optional(),
  title: z.string().min(1, "El titulo es obligatorio").optional(),
  author: z.string().min(1, "El autor es obligatorio").optional(),
  content: z.string().min(10, "La reseña debe tener al menos 10 caracteres"),
  rating: z.number().min(1, "Debes seleccionar al menos 1 estrella").max(5),
  userId: z.string(),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

// Valida el formulario
export const validateReviewForm = (data: ReviewFormData): { success: boolean; errors?: Record<string, string> } => {
  try {
    // Si es un nuevo libro, valida titulo y autor
    if (data.bookId === 'new' || !data.bookId) {
      if (!data.title || !data.author) {
        return {
          success: false,
          errors: {
            ...((!data.title) ? { title: "El título es obligatorio" } : {}),
            ...((!data.author) ? { author: "El autor es obligatorio" } : {})
          }
        };
      }
    }
 
    if (!data.content || data.content.length < 10) {
      return {
        success: false,
        errors: {
          content: "La reseña debe tener al menos 10 caracteres"
        }
      };
    }
    
    if (!data.rating || data.rating < 1) {
      return {
        success: false,
        errors: {
          rating: "Debes seleccionar al menos 1 estrella"
        }
      };
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      
      return { success: false, errors };
    }
    
    return {
      success: false,
      errors: { form: "Error de validacion" }
    };
  }
};
