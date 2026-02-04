import { ColumnDef } from '@tanstack/react-table';
import { pedidoSorteado } from './ListPedidoSorteado.types';
import { Eye, MoreHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


export const getColumns = (
	onShowJson: (json: string, providerOrder: string) => void,
	onReprocesar?: (providerOrderId: string) => void
): ColumnDef<pedidoSorteado>[] => [
	{
		accessorKey: "chutePedidoId",
		header: "N°",
		cell: ({ row }) => row.index + 1,
		size: 40,
		enableColumnFilter: false,
	},
	{
		accessorKey: "chutePedidoDetalleId",
		header: () => null,
		cell: () => null,
		enableColumnFilter: false,
		size: 1,
	},
	{
		accessorKey: "providerOrderIdentifier",
		header: "Provider Order",
	},
	{
		accessorKey: "trakingNumber",
		header: "Traking Number",
	},
	{
		accessorKey: "numeroChute",
		header: "Número Chute",
	},
	{
		accessorKey: "routingZoneCode",
		header: "C. zona de ruteo",
	},
	{
		accessorKey: "lineaServicio",
		header: "L. de Servicio",
	},
    {
		accessorKey: "estadoSharf",
		header: "Estado",
	},
    {
		accessorKey: "qty",
		header: "Cantidad",
	},
	{
		accessorKey: "weight",
		header: "Peso",
		cell: ({ getValue }) => {
			const value = getValue();
			if (typeof value !== 'number' && typeof value !== 'string') return '';
			const num = Number(value);
			if (isNaN(num)) return value;
			// Formato: x,xx.xx (miles y decimales)
			return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		},
	},
    {
		accessorKey: "fechaSorteado",
		header: "F. Sorteado",
	},
    {
		accessorKey: "horaSorteado",
		header: "H. Sorteado",
	},
	{
		id: "acciones",
		header: "Opc.",
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
