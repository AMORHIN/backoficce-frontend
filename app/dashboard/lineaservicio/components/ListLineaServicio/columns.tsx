"use client"
import { ArrowDown, MoreHorizontal, Pencil, CheckCircle } from "lucide-react"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

// Tipo de datos de Línea de Servicio
export type LineaServicio = {
  lineaServicioId: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  estadoServicio: string;
  createUserId: number;
  createDate: string;
  updateUserId?: number;
  updateDate?: string;
}

export const getColumns = (
  onEdit: (lineaServicio: LineaServicio) => void,
  onActivate: (lineaServicio: LineaServicio) => void,
  listaCompleta: LineaServicio[]
): ColumnDef<LineaServicio>[] => [
  {
    id: "numero",
    header: () => <div className="text-center">N°</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "nombre",
    header: ({column}) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
                Nombre
                <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
        )
    },
  },
  {
    accessorKey: "codigo",
    header: "CODIGO",
  },
  {
    accessorKey: "estadoServicio",
    header: "ESTADO SERVICIO",
    cell: ({ row }) => {
      const estado = row.getValue("estadoServicio") as string;
      const isActivo = estado?.toLowerCase() === "activo";
      
      return (
        <span 
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            backgroundColor: isActivo ? '#dcfce7' : '#fee2e2',
            color: isActivo ? '#15803d' : '#991b1b',
          }}
        >
          {estado}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell : ({row}) =>{
        const lineaServicio = row.original;
        return(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-4 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(lineaServicio)}>
                        <Pencil className="w-4 h-4 mr-2"/>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onActivate(lineaServicio)}
                      disabled={
                        lineaServicio.estadoServicio !== "ACTIVO" &&
                        listaCompleta.filter((ls: LineaServicio) => ls.estadoServicio === "ACTIVO").length > 0
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2"/>
                      Activar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
];
