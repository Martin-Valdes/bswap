"use client";
import React, { useEffect} from "react"; /* , useState  */
import { IoSearchOutline } from "react-icons/io5";
import { useReviewStore } from '../store/reviewStore';
import ReviewCard from "./ReviewsCard";
import ReviewForm from "./ReviewForm";
import useAuth from "@/shared/hooks/useAuth";

const ReviewsComponent: React.FC = () => {
  const {
    reviews,
    books,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchReviews,
    fetchBooks,
    fetchUsers,
  } = useReviewStore();
 const {user} = useAuth()
  // setCurrentUser no usado
  // // Estado para el usuario actual (simulado)
  // const [currentUser, setCurrentUser] = useState({
  //   id: "usuario1",
  //   name: "Usuario actual",
  // });
  // Estado para el usuario actual (simulado)
  //const [currentUser] = useState({ id: "usuario1", name: "Usuario actual" });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchReviews(), fetchBooks(), fetchUsers()]);
    };

    loadData();
  }, [fetchReviews, fetchBooks, fetchUsers]);

  const filteredReviews = reviews.filter((review) => {
    const bookTitle = review.bookTitle || "";
    const bookAuthor = review.bookAuthor || "";
    return (
      bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookAuthor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  interface Review {
    id: string;
    bookId: string;
    bookTitle?: string;
    bookAuthor?: string;
  }

  const getBookDetails = (review: Review) => {
    if (review.bookTitle && review.bookAuthor) {
      return {
        title: review.bookTitle,
        author: review.bookAuthor,
      };
    }

    const book = books.find((b) => b.id === review.bookId);
    return {
      title: book?.title || "Título desconocido",
      author: book?.author || "Autor desconocido",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabecera */}
      <div className="bg-blue-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Reseñas de lectores</h1>
        <p>
          Cada libro es una puerta a un mundo nuevo. Descubre qué opinan otros
          lectores sobre sus historias favoritas
        </p>
      </div>

      <div className="w-full px-4 py-4 relative">
        <form
          className="relative w-full px-4 py-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por título o autor"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </form>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {loading ? (
            <p className="text-center text-gray-500">Cargando reseñas...</p>
          ) : error ? (
            <p className="text-center text-red-500">
              Error al cargar las reseñas: {error}
            </p>
          ) : filteredReviews.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron reseñas.
            </p>
          ) : (
            filteredReviews.map((review) => {
              const bookDetails = getBookDetails(review);

              return (
                <ReviewCard
                  key={review.id || `review-${Math.random()}`}
                  review={review}
                  bookTitle={bookDetails.title}
                  bookAuthor={bookDetails.author}
                />
              );
            })
          )}

        </div>
        

       {/*  <ReviewForm userId={currentUser.id} /> */}
      </div>
      
      {user ? (<ReviewForm userId={user.id}/>):(<p className="text-center text-red-600">Debes iniciar sesion para publicar una reseña</p>)}
    
    </div>
  );
};

export default ReviewsComponent;