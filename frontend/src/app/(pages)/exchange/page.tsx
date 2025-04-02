"use client"

import ExchangeCard from "@/shared/components/ui/Exchange-card";
import { useBooks } from "@/shared/hooks/useBooks";
import Loading from "@/shared/components/common/Loading";
import Error from "@/shared/components/common/Error";

export default function ExchangePage() {
  const {data: books, loading, error} = useBooks();

  if(loading) return <Loading/>;
  if(error) return <Error message={error}/>;

   return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Libros Disponibles para Intercambio</h1>
       
       <div className="space-y-6">
        {books && books.length>0 ? (
          books.map( (book) => <ExchangeCard key={book.id} book={book} />)
        ) : ( <p> AUN NO TENEMOS LIBROS DISPONIBLES</p>   )}
     
       </div>

    </div>
  );
} 