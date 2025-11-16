import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getAllUsers } from "../data/supabaseUsuario";

const AdminUsuarioContext = createContext();
const AdminUsuarioProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState([]);
  useEffect(() => {
    fetchUsuarios(); // Obtener categorías al cargar el componente
  }, []);
  // Limpiar errores
  const clearErrores = () => {
    setErrores([]);
  };
  // Obtener todas las categorías
  const fetchUsuarios = async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getAllUsers();
    if (response.success) {
      setUsuarios(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  };
  return (
    <AdminUsuarioContext.Provider
      value={{
        usuarios,
        loading,
        errores,
      }}
    >
      {children}
    </AdminUsuarioContext.Provider>
  );
};

export { AdminUsuarioProvider };
export default AdminUsuarioContext;
