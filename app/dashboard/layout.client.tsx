"use client";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

function isValidToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload || typeof payload !== "object") return false;
    if (payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const { token, isAuthLoaded } = useAuth();
  const router = useRouter();

  // Solo redirecciona si el contexto está listo y el token es inválido
  useEffect(() => {
    if (isAuthLoaded && (!token || !isValidToken(token))) {
      router.replace("/auth/sign-in");
    }
  }, [token, router, isAuthLoaded]);

  // Espera a que el contexto esté cargado antes de validar/redirigir
  if (!isAuthLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <span className="text-lg text-muted-foreground">Cargando sesión...</span>
      </div>
    );
  }

  const valid = isValidToken(token);

  // Si el token es válido, renderiza el contenido
  if (token && valid) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Sidebar solo visible en desktop (xl+) */}
        <aside className="hidden xl:flex w-80 bg-white border-r shrink-0 flex-col">
          <Sidebar />
        </aside>
        <main className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 p-6 bg-[#fafbfc] dark:bg-secondary">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Mientras redirecciona, muestra loader
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <span className="text-lg text-muted-foreground">Redirigiendo a login...</span>
    </div>
  );
}
