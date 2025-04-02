"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components/common/Button";

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const { register, error, clearError, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setFormError("Todos los campos son obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
      });

      // redirige si se registra ok
      router.push("/login");
    } catch (err) {
      console.error("Error en registro:", err);
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        {formError && <div>{formError}</div>}

        {error && <div>{error}</div>}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            placeholder="email@email.com"
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="(minimo 6 caracteres)"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          variant="secondary"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>

        <div>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
