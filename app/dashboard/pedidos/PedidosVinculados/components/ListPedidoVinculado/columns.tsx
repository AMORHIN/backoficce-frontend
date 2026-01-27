import { ColumnDef } from '@tanstack/react-table';
import { pedidoVinculado } from './ListPedidoVinculado.types';

export const getColumns = (): ColumnDef<pedidoVinculado>[] => [
  { 
    accessorKey: "chutePedidoId", header: "N°",
    cell: ({ row }) => row.index + 1,
		size: 40,
		enableColumnFilter: false
},
  { accessorKey: "chutePedidoDetalleId", header: () => null, cell: () => null, size: 1 },
  { accessorKey: "providerOrderIdentifier", header: "Provider Order" },
  { accessorKey: "trakingNumber", header: "Traking Number" },
  { accessorKey: "numeroChute", header: "Número Chute" },
  { accessorKey: "routingZoneCode", header: "C. zona de ruteo" },
  { accessorKey: "lineaServicio", header: "L. de Servicio" },
  { accessorKey: "estadoSharf", header: "Estado" },
  { accessorKey: "qty", header: "Cantidad" },
  { accessorKey: "weight", header: "Peso" },
  { accessorKey: "createDate", header: "F. Vinculado" },
];
