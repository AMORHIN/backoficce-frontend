"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

// Adaptar el schema a los campos de pedido
const formSchema = z.object({
	nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre es demasiado largo"),
	codigo: z.string().min(2, "El código debe tener al menos 2 caracteres").max(20, "El código es demasiado largo"),
	descripcion: z.string(),
	estado: z.string(),
});

export interface FormCreatePedidoProps {
	setOpenModalCreate: (open: boolean) => void;
}

export default function FormCreatePedido(props: FormCreatePedidoProps) {
	const { setOpenModalCreate } = props;
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: "",
			codigo: "",
			descripcion: "",
			estado: "ACTIVO"
		}
	});

	const { isValid, isDirty } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			await axios.post('/api/pedidos', values, {
				headers: { 'Content-Type': 'application/json' },
				timeout: 15000,
			});
			toast({ title: "Pedido creado", description: "Se ha creado correctamente." });
			setOpenModalCreate(false);
		} catch (error) {
			let errorMessage = "No se pudo crear el pedido.";
			if (error instanceof AxiosError) {
				errorMessage = error.message;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast({ title: "Error", description: errorMessage, variant: "destructive" });
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
				<Button type="submit" disabled={isLoading || !isDirty || !isValid}>
					{isLoading ? "Guardando..." : "Guardar"}
				</Button>
			</form>
		</Form>
	);
}
