"use client"

import { useReviews } from "@/shared/hooks/useReviews";

interface ReviewListProps {
  bookId: string;
}

export default function ReviewList({ bookId }: ReviewListProps) {
  const { data: reviews, loading } = useReviews(bookId);

  if (loading) {
    return (
      <div className="py-2">
        <p className="text-gray-500">Cargando recomendaciones de nuestros usuarios....</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-2">
        <p className="text-gray-500">NO TENEMOS RECOMENDACIONES AUN</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 py-2">
          <p className="font-medium text-gray-700">
            {review.user && typeof review.user === "object" ? review.user.name : review.user}
          </p>
          <p className="text-gray-600 mt-1">{review.content}</p>
        </div>
      ))}
    </div>
  );
}
