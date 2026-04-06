export interface cubicadoraList{
    orderWeightDetailId: number;
  providerOrderIdentifier: string;
  trakingNumber : string;
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
}

export interface ListCubicadoraProps {
    cubicadoras: cubicadoraList[];
    onSelectCubicadora?: (cubicadora: cubicadoraList) => void;
}