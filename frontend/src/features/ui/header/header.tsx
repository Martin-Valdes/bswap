"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import useAuth from "@/shared/hooks/useAuth";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  // ojo cierra el menu cuando se hace click fuera de el
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <header className="flex px-8 justify-between items-center  text-black py-2">
      <Link href="/">
        <h1 className="">
          <Image
            src="/logoSinFondo.png"
            alt="BSwap Logo"
            width={80}
            height={80}
          />
        </h1>
      </Link>
      <nav>
        <ul className="flex items-center gap-8">
          <li>
            <Link href="/exchange">Intercambios</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link href="/mylibrary">Mi Biblioteca</Link>
            </li>
          )}
          <li>
            <Link href="/reviews">Reseñas</Link>
          </li>
          <li>
            <Link href="/community">Comunidad</Link>
          </li>

          {isAuthenticated && user ? (
            <li className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center"
                aria-label="Menú de usuario"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  {user.profile_picture ? (
                    <Image
                      src={user.profile_picture}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white font-bold">
                      {user && user.name ? user.name.charAt(0) : "?"}
                    </div>
                  )}
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Mi perfil
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Configuración
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li className="px-4 py-1 rounded-xl bg-blue-600 text-white">
              <Link href="/login">Acceso</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
