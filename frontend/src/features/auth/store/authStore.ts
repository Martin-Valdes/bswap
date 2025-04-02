import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginCredentials, RegisterData, User } from "../types/auth.types";
import { getCurrentUser, loginUser, registerUser } from "../services/authServices";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await loginUser(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error ) {
          set({  error: error instanceof Error ? error.message : "Error al iniciar sesion", 
            isLoading: false });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await registerUser(userData);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error ) {
          set({ error: error instanceof Error ? error.message  : "Error al registrar usuario", isLoading: false });
        }
      },
      
      loadUser: async () => {
        if (localStorage.getItem("authToken")) {
          set({ isLoading: true });
          try {
            const user = await getCurrentUser();
            if (user) {
              set({ user, isAuthenticated: true, isLoading: false });
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
        localStorage.removeItem("authToken");
      },
      
      clearError: () => set({ error: null })
    }),
    { name: "auth-storage" }
  )
);