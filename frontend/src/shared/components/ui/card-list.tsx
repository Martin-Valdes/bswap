"use client";

import { useBooks } from "@/shared/hooks/useBooks";
import CardBook from "@/shared/components/common/card-book";
import Loading from "@/shared/components/common/Loading";
import Error from "@/shared/components/common/Error";

interface CardListProps {
  quantity?: number;
}

const CardList: React.FC<CardListProps> = ({ quantity }) => {
  const { data: books, loading, error } = useBooks(quantity);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="flex flex-wrap justify-around gap-2 my-8">
      {books.length === 0 ? (
        <div>Aún no hay libros cargados</div>
      ) : (
        books.map((book) => <CardBook key={book.id} book={book} />)
      )}
    </div>
  );
};

export default CardList;
