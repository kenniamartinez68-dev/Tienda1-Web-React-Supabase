import { useContext } from 'react';
import AdminCompraContext from '../context/AdminCompraProvider';

const useCompra = () => {
  return useContext(AdminCompraContext);
};

export default useCompra;