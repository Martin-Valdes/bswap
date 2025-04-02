export interface Image {
  id: string;
  url: string;
  file?: string;
}

interface Audio {
  id: string;
  url: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  content: string;
  publication_date: string;
  comments?: string;
  reactions?: string;
  exchange_status?: string;
  user?: {
    id: string;
    name: string;
    profile_picture: string;
    country: string;
    city: string;
  };
}
export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  published?: Date;
  publisher?: string;
  cover?: string; //Image [0]
  Images: Image[];
  audio?: Audio[];
  genre: string;
  exchange_available: boolean;
  status: "pending" | "approved" | "rejected";
  libraryId: string | null;
  userId: string;
  reviews: Review[];
}
