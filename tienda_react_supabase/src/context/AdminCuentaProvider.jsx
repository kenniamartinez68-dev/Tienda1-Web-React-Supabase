import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { guardarCuenta,obtenerCuentas,obtenerDetalleCuenta } from "../data/supabaseCuenta";

const AdminCuentaContext = createContext();
const AdminCuentaProvider = ({ children }) => {
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cuentas, setCuentas] = useState([]);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    fetchCuentas(); // Obtener categorías al cargar el componente
  }, []);
  const fetchDetalles = useCallback(async (idCuenta) => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await obtenerDetalleCuenta(idCuenta);
    if (response.success) {
      setDetalles(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []); // Nota: Esta función es ahora estable y no se recreará en cada render
  // Obtener todas las categorías
  const fetchCuentas = async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await obtenerCuentas();
    if (response.success) {
      setCuentas(response.data);
      console.log(cuentas)
    } else {
      throw new Error(response.message || "Error al obtener cuentas");
    }
    setLoading(false);
  };
  const clearErrores = () => {
    setErrores([]);
  };
  const addCuenta = async ({
    id_cliente,
    nombre_cliente,
    fechaInicio,
    fechaFinal,
    saldo,
    producto,
    total,
  }) => {
    clearErrores();
    const response = await guardarCuenta(
      id_cliente,
      nombre_cliente,
      fechaInicio,
      fechaFinal,
      saldo,
      producto,
      total
    );
    if (response.success) {
      toast.success("Cuenta agregada con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al agregar la cuenta");
    }
  };
  return (
    <AdminCuentaContext.Provider
      value={{
        fetchDetalles,
        detalles,
        cuentas,
        addCuenta,
        errores,
      }}
    >
      {children}
    </AdminCuentaContext.Provider>
  );
};

export { AdminCuentaProvider };
export default AdminCuentaContext;
