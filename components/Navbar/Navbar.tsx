import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ToggleTheme } from "@/components/ToggleTheme";
import { SidebarRoutes } from "../SidebarRoutes";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

export function Navbar() {
  return (
    <nav className="flex items-center px-2 gap-x-4 md:px-6 
    justify-between w-full bg-background border-b h-20">
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarRoutes/>
            </SheetContent>
        </Sheet>
      </div>
      <div className="relative w-75">
        <Input placeholder="Search..." className="rounded-lg" />
        <Search strokeWidth={1} className="absolute top-2 right-2" />
      </div>

      <div className="flex gap-x-2 items-center">
        <ToggleTheme />
        <UserMenu />
      </div>
    </nav>
  );
}

// Menú de usuario personalizado fuera del componente Navbar
function UserMenu() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as HTMLDivElement).contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Si el usuario está autenticado, mostrar menú con Perfil y Cerrar sesión
  // Si no está autenticado, mostrar solo opción Iniciar sesión
  const isLogged = !!user;

  return (
    <div className="relative flex flex-col items-center" ref={menuRef}>
      <button
        className="rounded-full bg-gray-200 hover:bg-gray-300 p-2 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de usuario"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
        </svg>
      </button>
      {isLogged && user?.email && (
        <span className="text-xs text-gray-700 mt-1">{user.email}</span>
      )}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
          {isLogged ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-700 border-b">{user?.name || 'Perfil'}</div>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => { setOpen(false); router.push('/perfil'); }}
              >
                Perfil
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => { setOpen(false); logout(); router.push('/auth/sign-in'); }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => { setOpen(false); router.push('/auth/sign-in'); }}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </div>
  );
}
