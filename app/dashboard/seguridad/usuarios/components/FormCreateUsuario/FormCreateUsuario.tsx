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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
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
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rolId: z.string().min(1, "Seleccione un rol válido"),
});


export function FormCreateUsuario({ setOpenModalCreate, onSuccess }: { setOpenModalCreate: (open: boolean) => void, onSuccess?: () => void }) {
  const { toast } = useToast();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
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
  }, [token]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: "",
      email: "",
      password: "",
      rolId: "1",
    },
  });

  const onSubmit = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL_API}/User/CreateUser`,
        {
          ...values,
          userCreateId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            accept: 'text/plain',
          },
        }
      );
      toast({ title: "Usuario creado exitosamente" });
      setOpenModalCreate(false);
      onSuccess?.();
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (typeof error === "object" && error && "response" in error && typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string") {
        message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Error desconocido";
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({ title: "Error al crear usuario", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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
                  value={field.value}
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
        <Button type="submit" disabled={isLoading} className="mt-4 w-full">
          {isLoading ? "Creando..." : "Crear Usuario"}
        </Button>
      </form>
    </Form>
  );
}
