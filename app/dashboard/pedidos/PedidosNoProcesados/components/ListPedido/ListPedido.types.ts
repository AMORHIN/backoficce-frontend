// Tipos básicos para ListPedido

export interface Pedido {
  id: string;
  cliente?: string;
  fecha?: string;
  estado?: string;
  total?: number;
  providerOrderIdentifier: string;
  body: string;
  createDate: string;
  estadoSharf?: string;
  message?: string;
  eventTypeName?: string;
}

export interface ListPedidoProps {
  pedidos: Pedido[];
  onSelectPedido?: (pedido: Pedido) => void;
}
