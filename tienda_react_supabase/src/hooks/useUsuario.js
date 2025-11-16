import { useContext } from 'react';
import AdminUsuarioContext from '../context/AdminUsuarioProvider';

const useUsuario = () => {
  return useContext(AdminUsuarioContext);
};

export default useUsuario;