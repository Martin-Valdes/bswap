'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  profilePicture: string;
}


const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  country: z.string().min(1, 'El país es requerido'),
});


interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: async (userData) => {
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          ...userData,
        },
      };
    });

    const currentUser = useUserStore.getState().user;
    if (!currentUser?.id) return;

    try {
        //se puede implementar asi para que modifique el usuario que esta logueado??
      const response = await fetch(`https://equipo-s21-05-m-webapp.onrender.com/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
     
    }
  },
}));

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, updateUser } = useUserStore();
  
  const [editMode, setEditMode] = useState<{
    name: boolean;
    email: boolean;
    city: boolean;
    country: boolean;
  }>({
    name: false,
    email: false,
    city: false,
    country: false,
  });

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    city: string;
    country: string;
  }>({
    name: '',
    email: '',
    city: '',
    country: '',
  });

  const [originalData, setOriginalData] = useState<{
    name: string;
    email: string;
    city: string;
    country: string;
  }>({
    name: '',
    email: '',
    city: '',
    country: '',
  });


  useEffect(() => {
 
    const defaultUser: User = {
      id: '1', 
      name: 'Usuario Bswap',
      email: 'correo@email.com',
      city: 'ciudad',
      country: 'pais',
      profilePicture: 'https://res.cloudinary.com/duyahznm2/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1741045251/bswap/avatar-perfil_fupyvn.jpg',
    };
    
    setUser(defaultUser);
    setFormData({
      name: defaultUser.name,
      email: defaultUser.email,
      city: defaultUser.city,
      country: defaultUser.country,
    });
    setOriginalData({
      name: defaultUser.name,
      email: defaultUser.email,
      city: defaultUser.city,
      country: defaultUser.country,
    });
  }, [setUser]);

  const handleEdit = (field: keyof typeof editMode) => {
    setEditMode({ ...editMode, [field]: true });
  };


  const handleSave = async (field: keyof typeof editMode) => {
    try {
    
      const fieldSchema = z.object({
        [field]: userSchema.shape[field],
      });
      
      fieldSchema.parse({ [field]: formData[field] });
      
  
      await updateUser({ [field]: formData[field] } as Partial<User>);
      
  
      setOriginalData({
        ...originalData,
        [field]: formData[field]
      });
      
   
      setEditMode({ ...editMode, [field]: false });
    } catch (error) {
      console.error(`Error validating field ${field}:`, error);

    }
  };


  const handleCancel = (field: keyof typeof editMode) => {

    setFormData({
      ...formData,
      [field]: originalData[field]
    });

    setEditMode({ ...editMode, [field]: false });
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Perfil de Usuario</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cerrar
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
          <Image
            src={user.profilePicture}
            alt="Foto de perfil"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      <div className="space-y-6">
  
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            {editMode.name ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            ) : (
              <p className="text-lg">{user.name}</p>
            )}
          </div>
          <div className="flex ml-8 space-x-2">
            {editMode.name ? (
              <>
                <button
                  onClick={() => handleSave('name')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleCancel('name')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit('name')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Editar
              </button>
            )}
          </div>
        </div>

      
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            {editMode.email ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            ) : (
              <p className="text-lg">{user.email}</p>
            )}
          </div>
          <div className="flex ml-8 space-x-2">
            {editMode.email ? (
              <>
                <button
                  onClick={() => handleSave('email')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleCancel('email')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit('email')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Editar
              </button>
            )}
          </div>
        </div>

     
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Ciudad</label>
            {editMode.city ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            ) : (
              <p className="text-lg">{user.city}</p>
            )}
          </div>
          <div className="flex ml-8 space-x-2">
            {editMode.city ? (
              <>
                <button
                  onClick={() => handleSave('city')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleCancel('city')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit('city')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Editar
              </button>
            )}
          </div>
        </div>


        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">País</label>
            {editMode.country ? (
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            ) : (
              <p className="text-lg">{user.country}</p>
            )}
          </div>
          <div className="flex ml-8 space-x-2">
            {editMode.country ? (
              <>
                <button
                  onClick={() => handleSave('country')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleCancel('country')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit('country')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}