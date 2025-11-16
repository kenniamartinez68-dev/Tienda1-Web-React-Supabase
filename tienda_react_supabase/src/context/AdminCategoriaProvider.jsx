import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  registerCategorias,
  getCategorias,
  deleteCategorias,
  updateCategorias,
} from "../data/supabaseCategoria";

const AdminCategoriaContext = createContext();

const AdminCategoriaProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(null)

  useEffect(() => {
    fetchCategorias(); // Obtener categorías al cargar el componente
  }, []);
   // Limpiar errores
   const clearErrores = () => {
    setErrores([]);
  };
  const handleClickCategoria = id => {
    const categoria = categorias.filter(categoria => categoria.id === id)[0]
    setCategoriaActual(categoria)
  }
  // Obtener todas las categorías
  const fetchCategorias = async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getCategorias();
    if (response.success) {
      setCategorias(response.data);
      if (!categoriaActual) {
        setCategoriaActual(response.data[0]);  // Establecer el primer valor como categoría actual
      }
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  };
  // Registrar una nueva categoría
  const addCategoria = async (nombre, imagen) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await registerCategorias(nombre, imagen);
    if (response.success) {
      fetchCategorias(); // Actualizar la lista de categorías después de agregar
      toast.success("Categoría agregada con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al agregar la categoría");
    }
  };
  // Eliminar una categoría
  const removeCategoria = async (id) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await deleteCategorias(id);
    if (response.success) {
      setCategorias(categorias.filter((categoria) => categoria.id !== id)); // Actualizar la lista
      toast.success("Categoría eliminada con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al eliminar la categoría");
    }
  };
  // Actualizar una categoría existente
  const editCategoria = async (id, nombre, imagen) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await updateCategorias(id, nombre, imagen);
    if (response.success) {
      fetchCategorias(); // Actualizar lista después de editar
      toast.success("Categoría actualizada con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al actualizar la categoría");
    }
  };
  return (
    <AdminCategoriaContext.Provider
      value={{
        categorias,
        handleClickCategoria,
        categoriaActual,
        addCategoria,
        removeCategoria,
        editCategoria,
        loading,
        errores,
        clearErrores,  // Exponer la función para limpiar errores
      }}
    >
      {children}
    </AdminCategoriaContext.Provider>
  );
};

export { AdminCategoriaProvider };
export default AdminCategoriaContext;
