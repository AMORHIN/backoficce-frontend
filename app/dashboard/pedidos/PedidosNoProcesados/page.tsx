import {ListPedido} from "./components/ListPedido";
import HeaderPedido from "./components/HeaderPedido";

export default function PedidosNoProcesados() {
  return (
    <div className="space-y-6">
      <HeaderPedido />
      <ListPedido />
    </div>
  )
}
