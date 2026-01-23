"use client";
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL_API } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface AuthCardLoginData {
  token: string;
  user: unknown;
}

export function AuthCard({ onLogin }: { onLogin: (data: AuthCardLoginData) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  // Register states
  const [usuario, setUsuario] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const response = await axios.post(`${BASE_URL_API}/Usuarios/Login`, {
        email,
        password,
      });
      onLogin(response.data);
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        setLoginError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            "Error de autenticación"
        );
      } else if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Error de autenticación");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const response = await axios.post(`${BASE_URL_API}/User/CreateUser`, {
        rolId: 0,
        usuario,
        email: regEmail,
        password: regPassword,
      }, {
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
      });
      setRegisterSuccess("Usuario creado correctamente. Ahora puedes iniciar sesión.");
      setTimeout(() => {
        setTab("login");
        setRegisterSuccess("");
      }, 1200);
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        setRegisterError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            "Error al registrar usuario"
        );
      } else if (err instanceof Error) {
        setRegisterError(err.message);
      } else {
        setRegisterError("Error al registrar usuario");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#1a0e23] via-[#2d193c] to-[#1a0e23]">
      <div className="w-full max-w-105 bg-[#1a0e23]/90 rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-[#3a2a4d]" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <div className="flex w-full mb-7 border-b border-[#3a2a4d]">
          <button
            className={`flex-1 py-3 text-center text-base font-semibold tracking-wide transition-colors ${tab === "login" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-300"}`}
            onClick={() => setTab("login")}
            type="button"
            style={{letterSpacing: 0.1}}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-3 text-center text-base font-semibold tracking-wide transition-colors ${tab === "register" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-300"}`}
            onClick={() => setTab("register")}
            type="button"
            style={{letterSpacing: 0.1}}
          >
            Crear cuenta
          </button>
        </div>
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5 animate-fade-in">
            <h2 className="text-xl font-bold text-yellow-400 text-center mb-2">Te damos la bienvenida</h2>
            <div className="flex flex-col gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Usuario o correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-12 text-base bg-[#2d193c] border border-[#3a2a4d] text-white placeholder:text-gray-300 rounded-md px-4"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-12 text-base bg-[#2d193c] border border-[#3a2a4d] text-white placeholder:text-gray-300 rounded-md px-4"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-yellow-400 w-4 h-4" />
              <label htmlFor="remember" className="text-gray-200 text-sm">Recordar contraseña</label>
            </div>
            {loginError && <div className="text-red-400 text-xs text-center mt-1">{loginError}</div>}
            <Button
              type="submit"
              className="mt-2 w-full h-12 text-base bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg shadow font-bold tracking-wide disabled:opacity-60"
              disabled={loginLoading || !email || !password}
            >
              {loginLoading ? "Ingresando..." : "INICIAR SESIÓN"}
            </Button>
            <div className="w-full text-center mt-2">
              <a href="#" className="text-sm text-yellow-400 underline hover:text-yellow-300">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="w-full text-center mt-4">
              <span className="text-sm text-gray-200">¿Aún no tienes una cuenta? </span>
              <button type="button" className="text-yellow-400 font-semibold underline ml-1" onClick={() => setTab('register')}>Regístrate</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-5 animate-fade-in">
            <h2 className="text-xl font-bold text-yellow-400 text-center mb-2">Crea tu cuenta</h2>
            <div className="flex flex-col gap-2">
              <Input
                id="usuario"
                type="text"
                placeholder="Nombre de usuario"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
                className="h-12 text-base bg-[#2d193c] border border-[#3a2a4d] text-white placeholder:text-gray-300 rounded-md px-4"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="regEmail"
                type="email"
                placeholder="Correo electrónico"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                className="h-12 text-base bg-[#2d193c] border border-[#3a2a4d] text-white placeholder:text-gray-300 rounded-md px-4"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="regPassword"
                type="password"
                placeholder="Contraseña"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
                className="h-12 text-base bg-[#2d193c] border border-[#3a2a4d] text-white placeholder:text-gray-300 rounded-md px-4"
              />
            </div>
            {registerError && <div className="text-red-400 text-xs text-center mt-1">{registerError}</div>}
            {registerSuccess && <div className="text-green-300 text-xs text-center mt-1">{registerSuccess}</div>}
            <Button
              type="submit"
              className="mt-2 w-full h-12 text-base bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg shadow font-bold tracking-wide disabled:opacity-60"
              disabled={registerLoading || !usuario || !regEmail || !regPassword}
            >
              {registerLoading ? "Creando..." : "REGISTRARME"}
            </Button>
            <div className="w-full text-center mt-4">
              <span className="text-sm text-gray-200">¿Ya tienes una cuenta? </span>
              <button type="button" className="text-yellow-400 font-semibold underline ml-1" onClick={() => setTab('login')}>Inicia sesión</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
