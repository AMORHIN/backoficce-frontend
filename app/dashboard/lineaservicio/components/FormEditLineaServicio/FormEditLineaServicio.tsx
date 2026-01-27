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
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { FormEditLineaServicioProps } from "./FormEditLineaServicio.types";
import { useAuth } from "@/components/AuthContext";
import { BASE_URL_API } from '@/lib/api';

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  codigo: z.string().min(2, "El código debe tener al menos 2 caracteres").max(20),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
});

export function FormEditLineaServicio({ lineaServicio, setOpenModalEdit, onSuccess }: FormEditLineaServicioProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: lineaServicio?.nombre || "",
      codigo: lineaServicio?.codigo || "",
      descripcion: lineaServicio?.descripcion || "",
      estado: lineaServicio?.estadoServicio || "ACTIVO"
    },
  });

  interface FormValues {
    nombre: string;
    codigo: string;
    descripcion?: string;
    estado?: string;
  }
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await axios.put(
        `${BASE_URL_API}/LineaServicio/UpdateLineaServicio`,
        {
          lineaServicioId: lineaServicio.lineaServicioId,
          nombre: values.nombre,
          codigo: values.codigo,
          estadoServicio: values.estado,
          descripcion: values.descripcion,
          updateUserId: user?.id
        },
        {
          headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      toast({ title: "Línea de servicio actualizada" });
      setOpenModalEdit(false);
      if (typeof onSuccess === 'function') onSuccess();
    } catch (error) {
      toast({ title: "Error al actualizar", description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="DESACTIVO">DESACTIVO</option>
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
