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
import { FormCreateCustomer } from "../FormCreateCustomer/FormCreateCustomer";

export function HeaderLineaServicio() {
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Linea de Servicio</h1>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Nuevo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Crear Nueva Linea de Servicio</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <FormCreateCustomer setOpenModalCreate={setOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
