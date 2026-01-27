export  interface pedidoSorteado {
  chutePedidoId: number;
  providerOrderIdentifier: string;
  trakingNumber: string;
  numeroChute: string;
  routingZoneCode : string;
  lineaServicio : string;
  chutePedidoDetalleId : number;
  estadoSharf: string;
  qty: number;
  weight: number;
  fechaSorteado : string;
  horaSorteado : string;
}

export interface ListPedidoSorteadoProps {
  pedidosSorteados: pedidoSorteado[];
  onSelectPedidoSorteado?: (pedidoSorteado: pedidoSorteado) => void;
}