"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { UsuarioList } from "../ListUsuario/colums.types";
type Rol = {
  rolId: number;
  rol: string;
};
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import axios from "axios";
import { BASE_URL_API } from "@/lib/api";


const formSchema = z.object({
  usuario: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  rolId: z.coerce.number().int().min(1, "Seleccione un rol válido"),
});


export function FormEdithUsuario({ lineaUsuario, setOpenModalEdit, onSuccess }: { lineaUsuario: UsuarioList, setOpenModalEdit: (open: boolean) => void, onSuccess?: () => void }) {
  const { toast } = useToast();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const isNotAllowed = user && user.rolId !== 1;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: lineaUsuario.usuario,
      email: lineaUsuario.gmail,
      password: "",
      rolId: lineaUsuario.rolId,
    },
  });

  useEffect(() => {
    if (!token || isNotAllowed) return;
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BASE_URL_API}/Rol/GetAllRol`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'text/plain',
          },
        });
        if (response.data.success && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        }
      } catch (error) {
        setRoles([]);
      }
    };
    fetchRoles();
  }, [token, isNotAllowed]);

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      await axios.put(
        `${BASE_URL_API}/User/UpdateUser`,
        {
          userId: lineaUsuario.userId,
          ...values,
          userUpdateId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            accept: 'text/plain',
          },
        }
      );
      toast({ title: "Usuario actualizado" });
      setOpenModalEdit(false);
      onSuccess?.();
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (typeof error === "object" && error && "response" in error && typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string") {
        message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Error desconocido";
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({ title: "Error al actualizar", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isNotAllowed) {
    return (
      <div className="flex items-center justify-center h-96 text-lg text-red-500">
        Acceso denegado. Solo administradores pueden editar usuarios.
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border rounded px-2 py-1"
                  value={field.value as string | number | undefined}
                  onChange={e => field.onChange(Number(e.target.value))}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.rolId} value={rol.rolId}>{rol.rol}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
