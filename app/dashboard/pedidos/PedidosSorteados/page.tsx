import {ListPedidoSorteado} from './components/ListPedidoSorteado';
import { HeaderPedidoSorteado } from './components/HeaderPedidoSorteado';

export default function Pedidossorteados() {
  return (
    
    <div className='space-y-6'>
        <HeaderPedidoSorteado/>
        <ListPedidoSorteado/>
    </div>
  )
}
