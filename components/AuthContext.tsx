"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id?: number;
  name?: string;
  email?: string;
  rolId: number;
  // ...otros campos
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthLoaded: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    // Siempre lee el token de localStorage al montar
    const storedToken = localStorage.getItem("token");
    let extractedRolId = null;
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        extractedRolId = payload.rolId || payload.RolId;
        if (typeof extractedRolId === 'string') extractedRolId = parseInt(extractedRolId, 10);
      } catch (e) {
        console.error('No se pudo extraer rolId del token', e);
      }
    }
    requestAnimationFrame(() => {
      setUser(extractedRolId ? { rolId: extractedRolId } : null);
      setIsAuthLoaded(true);
      setToken(storedToken ?? null);
    });
    console.log("[AuthContext] token:", storedToken);
    console.log("[AuthContext] rolId extraído:", extractedRolId);
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    let extractedRolId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        extractedRolId = payload.rolId || payload.RolId;
        if (typeof extractedRolId === 'string') extractedRolId = parseInt(extractedRolId, 10);
      } catch (e) {
        console.error('No se pudo extraer rolId del token', e);
      }
    }
    setUser(extractedRolId ? { ...user, rolId: extractedRolId } : null);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(extractedRolId ? { ...user, rolId: extractedRolId } : user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
