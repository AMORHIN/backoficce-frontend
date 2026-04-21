export interface cubicadoraList{
  orderWeightDetailId: number;
  providerOrderIdentifier: string;
  cantidadPedido: number;
  trakingNumber : string;
  lineaServicio : string;
  fechaPesaje : string;
  clientCode: string;
  //idUser : string;
  ideq : string;
  //idSKU : string;
  pesoKG : number;
  altoCM : number;
  anchoCM : number;
  largoCM : number;
  volumenCM3 : number;
  pesoVolumetricoKG: number;
  nombreCliente : string;
  idUser: string
}

export interface ListCubicadoraProps {
    cubicadoras: cubicadoraList[];
    onSelectCubicadora?: (cubicadora: cubicadoraList) => void;
}