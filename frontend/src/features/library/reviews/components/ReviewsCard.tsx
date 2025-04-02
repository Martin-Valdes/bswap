import React from 'react';
import { Review } from "@/app/interface/book";
import { IoStarOutline } from 'react-icons/io5';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  bookTitle: string;
  bookAuthor: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, bookTitle, bookAuthor }) => {
  
  const userName = review.user?.name || 'Usuario';
  const userImage = review.user?.profile_picture || '/imagenprueba.png';
  const userLocation = review.user?.city && review.user?.country
    ? `${review.user.city}, ${review.user.country}`
    : '';
    
  // Contenido de la reseña (puede estar en content o comments según la estructura)
  const reviewContent = review.content || review.comments || '';

  return (
    <div className="border border-gray-400 rounded-lg p-4 mb-4 shadow-md">
      <h2 className="text-xl font-bold mb-2 w-full text-center border-b pb-2">Reseña de libro</h2>
      
      <div className="flex justify-between mb-2">
        <div>
          <h3 className="font-semibold inline">Título: </h3>
          <p className="inline ml-1">{bookTitle}</p>
        </div>
        <div>
          <h3 className="font-semibold inline">Autor: </h3>
          <p className="inline ml-1">{bookAuthor}</p>
        </div>
      </div>
      
      <hr className="my-3" />
      
      <div className="flex flex-row">
      <div className="w-1/3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-2 relative">
            <Image
              src={userImage}
              alt={userName}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center font-medium mb-2">{userName}</p>
          {userLocation && <p className="text-sm text-gray-500 mb-2">{userLocation}</p>}
          
          {/* Render estrellas según la calificación */}
          <div className="flex text-yellow-400 mb-2">
            {[...Array(5)].map((_, starIndex) => (
              <IoStarOutline
                className={`w-6 h-6 ${starIndex < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                key={starIndex} />
            ))}
          </div>
        </div>
        <div className="w-2/3 pr-4">
          <div className="border-2 border-gray-300 p-3 rounded-md h-full">
            <p>{reviewContent}</p>
          </div>
        </div>
        
      
      </div>
    </div>
  );
};

export default ReviewCard;