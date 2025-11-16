import { useContext } from 'react';
import AdminCategoriaContext from '../context/AdminCategoriaProvider';

const useCategoria = () => {
  return useContext(AdminCategoriaContext);
};

export default useCategoria;
