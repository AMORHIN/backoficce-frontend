"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import FormCreatePedido from "./FormCreatePedido/FormCreatePedido";

function HeaderPedido() {
	const [openModalCreate, setOpenModalCreate] = useState(false);
	return (
		<div className="mb-2">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Pedidos</h1>
				<Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
					<DialogTrigger asChild>
						<Button>Nuevo</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Crear Nuevo Pedido</DialogTitle>
							<DialogDescription>
							</DialogDescription>
						</DialogHeader>
						<FormCreatePedido setOpenModalCreate={setOpenModalCreate} />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

export default HeaderPedido;
