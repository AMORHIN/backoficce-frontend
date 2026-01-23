"use client";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

function isValidToken(token: string | null): boolean {
  if (!token) {
    console.log("[isValidToken] No token");
    return false;
  }
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("[isValidToken] Token mal formado");
      return false;
    }
    const payload = JSON.parse(atob(parts[1]));
    if (!payload || typeof payload !== "object") {
      console.log("[isValidToken] Payload inválido");
      return false;
    }
    // Si tiene exp, valida expiración. Si no tiene exp, lo acepta.
    if (payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        console.log("[isValidToken] Token expirado");
        return false;
      }
      console.log("[isValidToken] Token válido con exp");
      return true;
    }
    console.log("[isValidToken] Token válido sin exp");
    return true;
  } catch (e) {
    console.log("[isValidToken] Error al parsear token:", e);
    return false;
  }
}

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthLoaded } = useAuth();

  // Hook para redirección si el token es inválido
  useEffect(() => {
    if (isAuthLoaded && (!token || !isValidToken(token))) {
      router.replace("/auth/sign-in");
    }
  }, [token, router, isAuthLoaded]);

  if (!isAuthLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <span className="text-lg text-muted-foreground">Cargando sesión...</span>
      </div>
    );
  }

  const valid = isValidToken(token);
  console.log("[Layout] isValidToken:", valid);

  if (token && valid) {
    return (
      <div className="flex h-screen w-full">
        {/* Sidebar fijo a la izquierda */}
        <aside className="h-screen w-62.5 sticky top-0 left-0 z-30 shrink-0">
          <Sidebar />
        </aside>
        <div className="flex flex-col flex-1 h-screen w-full">
          <header className="sticky top-0 z-20 w-full">
            <Navbar />
          </header>
          <main className="flex-1 bg-muted/40 p-4 overflow-y-auto h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
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
