import { useContext } from 'react';
import AdminProductoContext from '../context/AdminProductoProvider';

const useProducto = () => {
  return useContext(AdminProductoContext);
};

export default useProducto;