
import { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Bswap - Logearse",
  description:
    "Logeate a Bswap y comienza a intercambiar tus libros en tu ciudad.",
};



export default function Login() {

  return(
    <div className="flex flex-col items-start justify-center w-full">
      <LoginForm/>
    </div>

  );
}

