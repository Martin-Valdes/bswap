import CardList from "@/shared/components/ui/card-list";
import Link from "next/link";

const LatestBooks: React.FC = () => {
  const quantity = 6;

  return (
    <>
      <div className="flex justify-between my-8 p-2">
        <p>Recien Agregados</p>
        <Link
          href={"/"}
          className="bg-blue-600 text-white py-4 px-6 rounded-full"
        >
          {" "}
          Ver más
        </Link>
      </div>
      <CardList quantity={quantity} />
    </>
  );
};

export default LatestBooks;
