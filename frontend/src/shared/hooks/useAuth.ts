"use client"
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function useAuth  () {
  const { user, isAuthenticated, isLoading, error, login, register, logout, loadUser, clearError } = useAuthStore();

  useEffect(() => {
  //  const token = localStorage.getItem("authToken");
  //  if (token && !isAuthenticated) {
  //    try {
  //      const parsedToken = JSON.parse(atob(token.split(".")[1]));
  //      if (parsedToken.exp > Date.now()) {
  //        useAuthStore.setState({ user: parsedToken.user, isAuthenticated: true });
 //       } else { localStorage.removeItem("authToken");  }
  //    } catch { localStorage.removeItem("authToken");} }
  //}, [isAuthenticated]);

  const token = localStorage.getItem("authToken");
  if (token && !user && !isLoading) {
    loadUser();
  }
}, [isLoading, loadUser, user]);


  return { user, isAuthenticated, isLoading, error, login, register, logout, loadUser, clearError  };
};