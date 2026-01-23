import { ColumnDef } from "@tanstack/react-table";
import { Pedido } from "./ListPedido.types";
import { Input } from "@/components/ui/input";
import { Eye, MoreHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const getColumns = (
	onShowJson: (json: string, providerOrder: string) => void,
	onReprocesar?: (providerOrderId: string) => void
): ColumnDef<Pedido>[] => [
	{
		accessorKey: "id",
		header: "N°",
		cell: ({ row }) => row.index + 1,
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorKey: "providerOrderIdentifier",
		header: "Provider Order",
	},
	{
		accessorKey: "body",
		header: "Body",
		cell: ({ row }) => (
			<span
				className="flex items-center gap-1 text-primary cursor-pointer select-none"
				onClick={() => onShowJson(row.original.body, row.original.providerOrderIdentifier)}
				title="Ver JSON"
			>
				<Eye size={18} className="inline-block" />
				Ver JSON
			</span>
		),
		enableColumnFilter: false,
	},
	{
		accessorKey: "estadoSharf",
		header: "Estado Sharf",
	},
	{
		accessorKey: "message",
		header: "Mensaje Error",
	},
	{
		accessorKey: "eventTypeName",
		header: "Nombre Evento",
	},
	{
		accessorKey: "createDate",
		header: "Fecha Creación",
	},
	{
		id: "acciones",
		header: "Acciones",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontal size={18} />
					</Button>
				</DropdownMenuTrigger>
				   <DropdownMenuContent align="end">
					   {onReprocesar && (
						   <DropdownMenuItem onClick={() => onReprocesar(row.original.providerOrderIdentifier)}>
							   <RotateCcw size={16} className="mr-2" /> Reprocesar
						   </DropdownMenuItem>
					   )}
				   </DropdownMenuContent>
			</DropdownMenu>
		),
		enableColumnFilter: false,
	},
];
