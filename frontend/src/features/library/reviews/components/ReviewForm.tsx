import React, { useState } from 'react';
import { useReviewStore } from '../store/reviewStore';
import { validateReviewForm, ReviewFormData } from '../schemas/reviewSchema';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { Review } from "@/app/interface/book";

interface ReviewFormProps {
  userId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ userId }) => {
  const { books, addReview } = useReviewStore();

  const [formData, setFormData] = useState<ReviewFormData>({
    bookId: '',
    title: '',
    author: '',
    content: '',
    rating: 0,
    userId/* : userId || 'usuario1' */,
  });
 
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
   
    if (name === 'bookId') {
      if (value === 'new') {
        setShowCustomTitleInput(true);
        setFormData((prev: ReviewFormData) => ({
          ...prev,
          bookId: 'new-book',
          title: '',
          author: ''
        }));
      } else {
        setShowCustomTitleInput(false);
        const selectedBook = books.find(book => book.id === value);
        if (selectedBook) {
          setFormData((prev: ReviewFormData) => ({
            ...prev,
            bookId: value,
            title: selectedBook.title,
            author: selectedBook.author,
          }));
        }
      }
    } else {
      setFormData((prev: ReviewFormData) => ({ ...prev, [name]: value }));
    }
    

    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
 
  const handleRatingSelect = (rating: number) => {
    setFormData((prev: ReviewFormData) => ({ ...prev, rating }));
    

    if (formErrors.rating) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.rating;
        return newErrors;
      });
    }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   // console.log("userId en ReviewForm antes de enviar la reseña:", formData.userId);
    setSubmitSuccess(false);
   
    // Verifica que bookId no sea undefined o vacio
    if (!formData.bookId) {
      setFormErrors(prev => ({ ...prev, bookId: "Debes seleccionar un libro" }));
      return;
    }


  // Verifica si `userId` está vacío o undefined
  if (!formData.userId) {
    console.error("❌ ERROR: userId no está definido en el formulario.");
    return;
  }
   
    const validation = validateReviewForm(formData);
   
    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }
   
    setIsSubmitting(true);
   
    try {
      
      const reviewToSubmit: Omit<Review, 'id'> = {
        bookId: formData.bookId,
        userId: formData.userId,
        rating: formData.rating,
        content: formData.content,
        publication_date: new Date().toISOString(),
        comments: "[]",
        reactions: "[]"
      };
     
      // NO puedo usar 'temp-book-id' para nuevos libros
      // La API necesita un ID de libro valido
      if (formData.bookId === 'new-book') {
        // Aquí debería crear primero el libro y luego usar su ID
        setFormErrors({ form: "Para agregar reseñas de libros nuevos, primero debes registrar el libro en el sistema." });
        setIsSubmitting(false);
        return;
      }
     
      console.log("Enviando datos a la API:", reviewToSubmit);
     
      const success = await addReview(reviewToSubmit, formData.title, formData.author);
     
      if (success) {
        setSubmitSuccess(true);
        // Reiniciar formulario
        setFormData({
          bookId: '',
          title: '',
          author: '',
          content: '',
          rating: 0,
          userId: formData.userId,
        });
        setShowCustomTitleInput(false);
        setFormErrors({});
      } else {
        setFormErrors({ form: "No se pudo guardar la reseña. Inténtalo de nuevo." });
      }
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      setFormErrors({ form: "Ocurrió un error al enviar la reseña." });
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="border border-gray-200 rounded-lg shadow-md p-6 bg-white">
      <h2 className="text-2xl font-semibold w-full text-center mb-6">Agregar reseña</h2>
     
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ¡Tu reseña ha sido publicada con éxito!
        </div>
      )}
     
      {formErrors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formErrors.form}
        </div>
      )}
     
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona un libro
          </label>
          <select
            id="bookId"
            name="bookId"
            className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${formErrors.bookId ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.bookId || ''}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un libro</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.title} - {book.author}</option>
            ))}
            {/* si no hay libros agrego uno pero va a enviar mensaje de error porque el libro ya debe estar cargado*/}
             <option value="new">Otro libro no listado</option>
          </select>
          
          {formErrors.bookId && <p className="text-red-500 text-sm mt-1">{formErrors.bookId}</p>}
        </div>
       
        {showCustomTitleInput && (
          <>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titulo del libro
              </label>
              <input
                id="title"
                className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                name="title"
                placeholder="Titulo del libro"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
            </div>
           
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Autor del libro
              </label>
              <input
                id="author"
                className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${formErrors.author ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                name="author"
                placeholder="Nombre del Autor"
                value={formData.author}
                onChange={handleInputChange}
              />
              {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
            </div>
          </>
        )}
       
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Tu reseña
          </label>
          <textarea
            id="content"
            className={`w-full p-3 border rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500 ${formErrors.content ? 'border-red-500' : 'border-gray-300'}`}
            name="content"
            placeholder="Escribe tu reseña aquí"
            value={formData.content}
            onChange={handleInputChange}
          />
          {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex justify-center text-2xl mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="cursor-pointer mx-1"
                onClick={() => handleRatingSelect(star)}
              >
                {star <= formData.rating ? (
                  <IoStar className="text-yellow-400 w-8 h-8" />
                ) : (
                  <IoStarOutline className="text-gray-300 w-8 h-8" />
                )}
              </span>
            ))}
          </div>
          {formErrors.rating && (
            <p className="text-red-500 text-sm text-center">{formErrors.rating}</p>
          )}
        </div>
       
        <button
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ENVIANDO...' : 'ENVIAR RESEÑA'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;