"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import axios from "axios";
import { BASE_URL_API } from "@/lib/api";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre del rol debe tener al menos 3 caracteres").max(100),
  codigo: z.string().min(1, "El código es requerido"),
  descripcion: z.string().min(3, "La descripción es requerida"),
});

export function FormCreateRol({ setOpenModalCreate, onSuccess }: { setOpenModalCreate: (open: boolean) => void, onSuccess?: () => void }) {
  const { toast } = useToast();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      codigo: "",
      descripcion: "",
    },
  });

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL_API}/Rol/CreateRol`,
        {
          ...values,
          createUserId: user?.id ?? 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            accept: 'text/plain',
          },
        }
      );
      toast({ title: "Rol creado exitosamente" });
      setOpenModalCreate(false);
      onSuccess?.();
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (typeof error === "object" && error && "response" in error && typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string") {
        message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Error desconocido";
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({ title: "Error al crear rol", description: message, variant: "destructive" });
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
        <Button type="submit" disabled={isLoading} className="mt-4 w-full">
          {isLoading ? "Creando..." : "Crear Rol"}
        </Button>
      </form>
    </Form>
  );
}
