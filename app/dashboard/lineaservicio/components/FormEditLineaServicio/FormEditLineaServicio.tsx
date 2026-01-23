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
import { useToast } from "@/hooks/use-toast";
import { FormEditLineaServicioProps } from "./FormEditLineaServicio.types";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  codigo: z.string().min(2, "El código debe tener al menos 2 caracteres").max(20),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
});

export function FormEditLineaServicio({ lineaServicio, setOpenModalEdit }: FormEditLineaServicioProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: lineaServicio?.nombre || "",
      codigo: lineaServicio?.codigo || "",
      descripcion: lineaServicio?.descripcion || ""
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
      // Aquí iría la lógica para actualizar la línea de servicio
      toast({ title: "Línea de servicio actualizada" });
      setOpenModalEdit(false);
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
                <Input {...field} />
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
