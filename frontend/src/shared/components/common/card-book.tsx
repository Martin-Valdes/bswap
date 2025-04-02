import { Book } from "@/app/interface/book";
import Image from "next/image";
import Link from "next/link";

interface CardBookProps {
  book: Book;
}

export default function CardBook({ book }: CardBookProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-bwhite border-2 border-gray-400 p-8 h-full ">
        <Image
          src={
            book.cover && book.cover.trim() !== ""
              ? book.cover
              : "/imagenprueba.png"
          }
          alt={`Imagen del Libro ${book.title}`}
          width={250}
          height={400}
          className="w-[250px] h-[400px] object-cover"
        />
        {book.author && <p>{book.author}</p>}
        {book.title && <p>{book.title}</p>}
      </div>
    </Link>
  );
}
