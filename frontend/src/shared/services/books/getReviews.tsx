import { Book } from "@/app/interface/book";

export const getReviews = async (bookId: string) => {
  // try {
  //   const res =  fetch("https://equipo-s21-05-m-webapp.onrender.com/books");

  //   if (!res.ok) throw new Error("Error al obtener los datos");

  //   const response = await res.json();

  //   const books: Book[] = response.data || [];

  //   if (!Array.isArray(books)) {
  //     console.error("❌ La respuesta no es un array:", books);
  //     throw new Error("La respuesta no es un array de libros.");
  //   }

  //   const book = books.find((b) => b.id === bookId);

  //   if (!book) {
  //     throw new Error("No se encontró el libro");
  //   }

  //   return book.reviews || [];
  // } catch (error) {
  //   console.error("❌ No pudimos obtener recomendaciones:", error);
  //   return [];
  // }
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books`).then((res) => {
       return res.json();
  }
  ).then((response) => {
    const books: Book[] = response.data as Book[] || [];

    const book = books.find((b) => b.id === bookId);

    if (!book) {
      throw new Error("No se encontró el libro");
    }

    return book.reviews || [];
  }
  ).catch((error) => {
    console.error("❌ No pudimos obtener recomendaciones:", error);
    return [];
  }
  );


};
