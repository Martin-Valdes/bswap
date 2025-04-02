export interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    biography: string | null;
    profile_picture: string | null;
    country: string | null;
    city: string | null;
    phone: string | null;
    privacy_preferences: string | null;
    registration_date: Date;
  }