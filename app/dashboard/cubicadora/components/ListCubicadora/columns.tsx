
import { ArrowDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { cubicadoraList } from "./ListCubicadora.types"

// Función auxiliar para formatear números
const formatNumber = (value: unknown) => {
    const num = Number(value);
    if (isNaN(num)) return String(value ?? "");
    return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(num);
};

export const getColumns = (): ColumnDef<cubicadoraList>[] => [
  {
    id: "numero",
    header: () => <div className="text-center">N°</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "providerOrderIdentifier",
    header: "Provider OrderIdentifier",
  },
  {
    accessorKey: "cantidadPedido",
    header: "#",
  },
  {
    accessorKey: "trakingNumber",
    header: "Traking Number",
  },
  {
    accessorKey: "lineaServicio",
    header: "L. Servicio",
  },
  {
    accessorKey: "fechaPesaje",
    header: "F. Pesaje",
  },
  { accessorKey: "clientCode", header: "C. Cliente", },
  {
    accessorKey: "nombreCliente",
    header: "Cliente",
  },
  //{ accessorKey: "ideq", header: "IDEQ", },
  // {
  //   accessorKey: "idSKU",
  //   header: "IdSKU",
  // },
  { 
    accessorKey: "pesoKG", 
    header: "Peso (KG)",
    cell: ({ row }) => <div className="text-right">{formatNumber(row.getValue("pesoKG"))}</div>
  },
  { 
    accessorKey: "altoCM", 
    header: "Alto (CM)", 
    cell: ({ row }) => <div className="text-right">{formatNumber(row.getValue("altoCM"))}</div>
  },
  { 
    accessorKey: "anchoCM", 
    header: "Ancho (CM)", 
    cell: ({ row }) => <div className="text-right">{formatNumber(row.getValue("anchoCM"))}</div>
  },
  { 
    accessorKey: "largoCM", 
    header: "Largo (CM)", 
    cell: ({ row }) => <div className="text-right">{formatNumber(row.getValue("largoCM"))}</div>
  },
  { 
    accessorKey: "volumenCM3", 
    header: "Vol. (CM³)", 
    cell: ({ row }) => <div className="text-right">{formatNumber(row.getValue("volumenCM3"))}</div>
  },
  { 
    accessorKey: "pesoVolumetricoKG", 
    header: "P. Vol. (KG)", 
    cell: ({ row }) => <div className="text-right">{formatNumber(row.getValue("pesoVolumetricoKG"))}</div>
  }
];
