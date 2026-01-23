import { LineaServicio } from "../ListLineaServicio/columns";

export interface FormEditLineaServicioProps {
  lineaServicio: LineaServicio;
  setOpenModalEdit: (open: boolean) => void;
  onSuccess?: () => void;
}
