import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Bswap - Registro',
  description: 'Registrate a Bswap y comienza a intercambiar tus libros en tu ciudad.', 
};

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
  <RegisterForm/>
  </div>
  );
}
