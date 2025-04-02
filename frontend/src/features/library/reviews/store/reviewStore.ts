import { create } from 'zustand';
import { Review, Book } from '@/app/interface/book';
import { reviewService } from '@/shared/services/books/reviewService';
import { bookServices } from '@/shared/services/books/booksService';
import { userServices } from '@/shared/services/users/usersService';
import { User as ImportedUser } from '@/app/interface/user';

// Definimos un tipo que extiende el User importado para nuestro uso interno
type StoreUser = {
  id: string;
  name: string;
  profile_picture: string;
  email: string;
  password_hash: string;
  biography: string;
  country: string;
  city: string;
  phone: string;
  privacy_preferences: string;
  registration_date: Date;
  [key: string]: string | number | boolean | object | Date;
};

// datos de libro en el mock
interface MockBook {
  id: string;
  title: string;
  author: string;
  reviews: MockReview[];
}

// reseñas en el mock
interface MockReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  publication_date: string;
  [key: string]: string | number | boolean | object;
}

// datos del mock
interface MockData {
  books: MockBook[];
}

interface ReviewWithUIData extends Omit<Review, 'user'> {
  bookTitle?: string;
  bookAuthor?: string;
  user?: StoreUser;
}

interface ReviewState {
  reviews: ReviewWithUIData[];
  books: Book[];
  users: StoreUser[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
 
  // Acciones
  fetchReviews: () => Promise<void>;
  fetchBooks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addReview: (review: Omit<Review, 'id'>, title?: string, author?: string) => Promise<boolean>;
  setSearchTerm: (term: string) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  books: [],
  users: [],
  loading: false,
  error: null,
  searchTerm: '',
 
  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const reviewsData = await reviewService.getReviews();
     
      if (reviewsData.length > 0) {
  
        const convertedReviews: ReviewWithUIData[] = reviewsData.map(review => {
          //  nuevo objeto sin user
          const { user, ...rest } = review;
          
          // ReviewWithUIData con el usuario de StoreUser
          const convertedReview: ReviewWithUIData = {
            ...rest,
            // Si user existe convierte a StoreUser
            user: user ? {
              id: user.id,
              name: user.name,
              profile_picture: user.profile_picture || '',
              email: '', 
              password_hash: '',
              biography: '',
              country: user.country || '',
              city: user.city || '',
              phone: '',
              privacy_preferences: '',
              registration_date: new Date()
            } : undefined
          };
          
          return convertedReview;
        });
        
        set({ reviews: convertedReviews, loading: false });
      } else {
        try {
          const mockResponse = await fetch('/mock/mockDataReviews.json');
          if (!mockResponse.ok) {
            throw new Error(`Error al cargar mock: ${mockResponse.status}`);
          }
          
          const mockData = await mockResponse.json() as MockData;
         
          const mockReviews = mockData.books.flatMap((book: MockBook) =>
            book.reviews.map((review: MockReview) => ({
              ...review,
              bookId: book.id,
              bookTitle: book.title,
              bookAuthor: book.author,
              content: review.comment,
            }))
          );
         
          set({ reviews: mockReviews, loading: false });
        } catch (mockError) {
          console.error("Error al cargar datos mock:", mockError);
          set({ loading: false, error: "Error al cargar las reseñas" });
        }
      }
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      set({ loading: false, error: "Error al cargar las reseñas" });
     
      // Intentar cargar mock como fallback
      try {
        const mockResponse = await fetch('/mock/mockDataReviews.json');
        if (!mockResponse.ok) {
          throw new Error(`Error al cargar mock: ${mockResponse.status}`);
        }
        
        const mockData = await mockResponse.json() as MockData;
       
        const mockReviews = mockData.books.flatMap((book: MockBook) =>
          book.reviews.map((review: MockReview) => ({
            ...review,
            bookId: book.id,
            bookTitle: book.title,
            bookAuthor: book.author,
            content: review.comment,
          }))
        );
       
        set({ reviews: mockReviews });
      } catch (mockError) {
        console.error("Error al cargar datos mock:", mockError);
      }
    }
  },
 
  fetchBooks: async () => {
    try {
      const booksData = await bookServices.getBooks();
      set({ books: booksData });
    } catch (error) {
      console.error("Error al obtener libros:", error);
      set({ error: "Error al cargar los libros" });
    }
  },
 
  fetchUsers: async () => {
    try {
      const usersData = await userServices.getUsers();
      
      // Convertimos explícitamente cada campo que podría ser null a string vacía
      const convertedUsers: StoreUser[] = usersData.map((user: ImportedUser) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        profile_picture: user.profile_picture || '',
        biography: user.biography || '',
        country: user.country || '',
        city: user.city || '',
        phone: user.phone || '',
        privacy_preferences: user.privacy_preferences || '',
        registration_date: user.registration_date
      }));
      
      set({ users: convertedUsers });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      set({ error: "Error al cargar los usuarios" });
    }
  },
 
  addReview: async (reviewData: Omit<Review, 'id'>, title?: string, author?: string) => {
    console.log(" userId en addReview:", reviewData.userId);
    set({ error: null });
    try {
      // No permitir 'temp-book-id' o 'new-book' como ID de libro
      if (reviewData.bookId === 'temp-book-id' || reviewData.bookId === 'new-book') {
        set({ error: "ID de libro inválido. Por favor selecciona un libro existente." });
        return false;
      }
      
    
      const apiReviewData = {
        bookId: reviewData.bookId,
        userId: reviewData.userId,
        rating: reviewData.rating,
        content: reviewData.content,
        publication_date: new Date().toISOString(),
        comments: "[]",
        reactions: "[]"
      };
      
      console.log("Enviando reseña a la API:", apiReviewData);
      
      const result = await reviewService.createReview(apiReviewData);
     
      if (result) {
        const { books, users, reviews } = get();
        
        // Buscar informacion del libro para mostrar 
        const book = books.find(b => b.id === reviewData.bookId);
        
        // si no hay info de usuario usa predeterminado
        const user = users.find(u => u.id === reviewData.userId) || {
          id: reviewData.userId,
          name: "Usuario actual",
          profile_picture: "https://res.cloudinary.com/duyahznm2/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1741045251/bswap/avatar-perfil_fupyvn.jpg",
          email: "",
          password_hash: "",
          biography: "",
          country: "",
          city: "",
          phone: "",
          privacy_preferences: "",
          registration_date: new Date()
        };
       

        const newReviewForUI: ReviewWithUIData = {
          ...result,
          bookTitle: book?.title || title || "Título desconocido",
          bookAuthor: book?.author || author || "Autor desconocido",
          user
        };
       
        // Actualiza estado agregando la nueva reseña al inicio
        set({ reviews: [newReviewForUI, ...reviews] });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al crear la reseña:", error);
      set({ error: "Error al enviar la reseña" });
      return false;
    }
  },
 
  setSearchTerm: (term: string) => set({ searchTerm: term }),
}));