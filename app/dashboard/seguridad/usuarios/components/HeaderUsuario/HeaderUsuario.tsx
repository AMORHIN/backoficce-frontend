"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
// ...existing code...
// ...existing code...
import { FormCreateUsuario } from "../FormCreateUsuario/FormCreateUsuario";


export default function HeaderUsuario({ onUserCreated }: { onUserCreated?: () => void }) {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Usuario</h1>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Nuevo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <FormCreateUsuario setOpenModalCreate={setOpenModalCreate} onSuccess={onUserCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
