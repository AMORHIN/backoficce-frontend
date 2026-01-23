import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/api";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${BASE_URL_API.replace(/\/$/, "")}/User/Login`,
        {
          method: "POST",
          headers: {
            "accept": "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: username,
            password: password
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data?.data?.token && data?.data?.user) {
        // Validar que el token es un JWT válido
        const token = data.data.token;
        const isJwt = typeof token === "string" && token.split(".").length === 3;
        if (!isJwt) {
          setError("Token inválido recibido del backend");
          return;
        }
        // Construir el objeto user según la respuesta de la API externa
        const user = {
          id: data.data.id,
          name: data.data.user,
          email: data.data.email,
          rolId: data.data.rolId // Asegúrate que este campo exista en la respuesta
        };
        login(token, user);
        setError("");
        router.replace("/");
      } else {
        setError(data.message || "Credenciales inválidas");
      }
    } catch (e) {
      setError("Error de red o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full -mt-48">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-md">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Usuario</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="SharfAdmin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
              />
              <FieldDescription>
                Ingrese usuario para iniciar sesión.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
              <FieldDescription>
                Ingrese contraseña para iniciar sesión.
              </FieldDescription>
            </Field>
            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}
            <Button className="w-full mt-2" onClick={handleLogin} disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
}
