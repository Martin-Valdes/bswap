import { LoginCredentials, User } from "../types/auth.types";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<User> => {
  try {
    //  const response = await fetch("/mock/mockDataUser.json");
    // se debe modificar fetch a API_URL/login cuanto este endpoint

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al iniciar sesion");
    }

    const data = await response.json();

    localStorage.setItem("authToken", data.token);

    return data.user;
  } catch (error) {
    console.error("Error al loguear", error);
    throw new Error("Error al iniciar sesion");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      throw new Error("Usuario no autenticado");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener el usuario actual", error);
    return null;
  }
};

export const registerUser = async (userData: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al registrar usuario");
    }

    const data = await response.json();

    localStorage.setItem("authToken", data.token);

    return data.user;
  } catch (error) {
    console.error("Error en registro:", error);
    throw new Error("Error al registrar usuario");
  }
};
