import ReviewsComponent from '@/features/library/reviews/components/ReviewsComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bswap - Reseñas',
  description: 'Revisa Las reseñas de otros usuarios y comparte la tuya.',
};

export default function Reviews() {
  return (
    <>
      <ReviewsComponent/>
    </>
  );
}
