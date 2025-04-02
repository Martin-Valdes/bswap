import { User } from "@/app/interface/user";

const BASE_URL = `${
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://equipo-s21-05-m-webapp.onrender.com"
}`;

const getUsers = async (): Promise<User[]> => {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) {
      throw new Error(`Error fetching users: ${res.status} ${res.statusText}`);
    }
    const { data } = await res.json();
    console.log("✅ ~ getUser ~ data:", data);
    return data ?? [];
  } catch (error) {
    console.error("❌ ~ getUsers ~ error:", error);
    return [];
  }
};

const getUsersById = async (userId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`);
    if (!res.ok) {
      throw new Error(`Error fetching users: ${res.status} ${res.statusText}`);
    }
    const { data } = await res.json();
    console.log("✅ ~ getUserById ~ data:", data);
    return data ?? [];
  } catch (error) {
    console.error("❌ ~ getUsersByid ~ error:", error);
    return [];
  }
};

const setUser = async (user: User) => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const response = await res.json();
    console.log("✅ ~ setUser ~ response:", response);

    return response;
  } catch (error) {
    console.error("❌ ~ setUser ~ error:", error);
    return null;
  }
};

const deleteUser = async (userId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.error("❌ ~ deleteUser ~ error:", error);
    return null;
  }
};

const updateUser = async (user: User) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.error("❌ ~ updateUser ~ error:", error);
    return null;
  }
};

export const userServices = {
  getUsers,
  getUsersById,
  setUser,
  deleteUser,
  updateUser,
};
