import { useContext } from 'react';
import AdminPedidoContext from '../context/AdminPedidoProvider';

const usePedido = () => {
  return useContext(AdminPedidoContext);
};

export default usePedido;