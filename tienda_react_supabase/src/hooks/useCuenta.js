import { useContext } from 'react';
import AdminCuentaContext from '../context/AdminCuentaProvider';

const useCuenta = () => {
  return useContext(AdminCuentaContext);
};

export default useCuenta;