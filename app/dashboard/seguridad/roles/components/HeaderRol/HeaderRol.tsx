"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { FormCreateRol } from "../FormCreateRol/FormCreateRol";

export default function HeaderRol({ onRolCreated }: { onRolCreated?: () => void }) {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Roles</h1>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Nuevo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <FormCreateRol setOpenModalCreate={setOpenModalCreate} onSuccess={onRolCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
