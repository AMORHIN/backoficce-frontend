"use client"
import { ArrowDown, MoreHorizontal, Pencil, CheckCircle } from "lucide-react"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"


import type { UsuarioList } from "./colums.types";

export const getColumns = (
  onEdit: (usuario: UsuarioList) => void,
  onActivate: (usuario: UsuarioList) => void
): ColumnDef<UsuarioList>[] => [
  {
    id: "numero",
    header: () => <div className="text-center">N°</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "usuario",
    header: ({column}) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
                Usuario
                <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
        )
    },
  },
  {
    accessorKey: "gmail",
    header: "EMAIL",
  },
  {
    accessorKey: "rol",
    header: "ROL",
  },
  
  {
    id: "actions",
    header: "Acciones",
    cell : ({row}) =>{
        const usuario = row.original;
        return(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-4 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(usuario)}>
                        <Pencil className="w-4 h-4 mr-2"/>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onActivate(usuario)}>
                        <CheckCircle className="w-4 h-4 mr-2"/>
                        Asignar Rol
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
];
