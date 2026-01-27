export interface pedidoVinculado {
  chutePedidoId: number;
  providerOrderIdentifier: string;
  trakingNumber: string;
  numeroChute: string;
  routingZoneCode: string;
  lineaServicio: string;
  chutePedidoDetalleId: number;
  estadoSharf: string;
  qty: number;
  weight: number;
  createDate: string;
}

export interface ListPedidoVinculadoProps {
  pedidosVinculados: pedidoVinculado[];
  onSelectPedidoVinculado?: (pedidoVinculado: pedidoVinculado) => void;
}