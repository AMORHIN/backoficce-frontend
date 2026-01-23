import React, { useState } from "react";
import axios from "axios";
import { BASE_URL_API } from "@/lib/api";

interface RegisterResponse {
  success: boolean;
  message: string;
  // Puedes agregar más campos según la respuesta de tu API
}

export default function RegisterForm({ onRegister }: { onRegister: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(`${BASE_URL_API}/User/CreateUser`, {
        rolId: 0, // O puedes permitir elegir el rol si lo necesitas
        usuario,
        email,
        password,
      }, {
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
      });
      setSuccess("Usuario creado correctamente. Ahora puedes iniciar sesión.");
      onRegister();
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            "Error al registrar usuario"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button type="submit" className="bg-primary text-white rounded px-4 py-2" disabled={loading}>
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
    </form>
  );
}
