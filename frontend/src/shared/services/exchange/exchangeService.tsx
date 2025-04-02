import { Exchange } from "@/app/interface/exchange";
import { Book } from "@/app/interface/book";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://equipo-s21-05-m-webapp.onrender.com";

class ExchangeServices {
  async requestExchange(
    exchangeData: Exchange
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/exchange`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...exchangeData,
          status: "pending",
          request_date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error al solicitar intercambio: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en requestExchange:", error);
      throw error;
    }
  }

  async getOwnerId(
    bookId: string,
    userId: string | null
  ): Promise<string | null> {
    if (!userId) return null;

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error("Error al obtener el usuario");

      const userData = await response.json();

      if (userData?.library?.some((b: Book) => b.id === bookId)) {
        return userData.id;
      }

      return null;
    } catch (error) {
      console.error("Error en getOwnerId:", error);
      return null;
    }
  }
}

export const exchangeServices = new ExchangeServices();
