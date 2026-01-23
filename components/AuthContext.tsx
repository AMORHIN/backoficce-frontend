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
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    let extractedRolId = null;
    let extractedId = null;
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        extractedRolId = payload.rolId || payload.RolId;
        if (typeof extractedRolId === 'string') extractedRolId = parseInt(extractedRolId, 10);
        extractedId = payload.id || payload.Id;
        if (typeof extractedId === 'string') extractedId = parseInt(extractedId, 10);
      } catch (e) {
        console.error('No se pudo extraer rolId/id del token', e);
      }
    }
    let userObj = storedUser ? JSON.parse(storedUser) : {};
    if (extractedRolId) userObj.rolId = extractedRolId;
    if (extractedId) userObj.id = extractedId;
    setUser(extractedRolId ? userObj : null);
    setIsAuthLoaded(true);
    setToken(storedToken ?? null);
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    let extractedRolId = null;
    let extractedId = user.id;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        extractedRolId = payload.rolId || payload.RolId;
        if (typeof extractedRolId === 'string') extractedRolId = parseInt(extractedRolId, 10);
        // Si el id no viene en el objeto user, lo tomamos del payload si existe
        if (!extractedId && (payload.id || payload.Id)) {
          extractedId = payload.id || payload.Id;
          if (typeof extractedId === 'string') extractedId = parseInt(extractedId, 10);
        }
      } catch (e) {
        console.error('No se pudo extraer rolId/id del token', e);
      }
    }
    setUser(extractedRolId ? { ...user, rolId: extractedRolId, id: extractedId } : null);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(extractedRolId ? { ...user, rolId: extractedRolId, id: extractedId } : user));
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
