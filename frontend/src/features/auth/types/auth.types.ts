//validacion zod

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  profile_picture: z.string().nullable(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}


/* export interface LoginCredentials {
  email: string;
  password: string;
} */

export interface RegisterData {
  email: string;
  password: string;
}

/* export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
 */