import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllProduct,
  guardarCompra,
  getAllCompras,
  eliminarCompra,
} from "../data/supabaseCompra";

const AdminCompraContext = createContext();
const AdminCompraProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compras, setCompras] = useState([]);
  const [sugerencias, setSugerencias] = useState([]); 
  const [producto, setProducto] = useState([{ producto_id: "", nombre: "", cantidad: 1 }]);
  useEffect(() => {
    fetchProductos();
    fetchCompras();
  }, []);
  const clearErrores = () => {
    setErrores([]);
  };
  // Obtener productos con useCallback para prevenir ciclos infinitos
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getAllProduct();
    if (response.success) {
      setProductos(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []); // Dependencia vacía para evitar recrear la función
  const fetchCompras = useCallback(async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getAllCompras();
    if (response.success) {
      setCompras(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []);
  // Registrar una nueva compra
  const addCompra = async ({ nombre_comprador, productos,pago,descuento,total,vuelto }) => {
    clearErrores();
    const response = await guardarCompra(nombre_comprador, productos,pago,descuento,total,vuelto);
    if (response.success) {
      fetchCompras();
      toast.success("Compra agregada con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al agregar la compra");
    }
  };
  const removeCompra = async (id) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await eliminarCompra(id);
    if (response.success) {
      setCompras(compras.filter((compra) => compra.id !== id)); // Actualizar la lista
      toast.success("Compra eliminada con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al eliminar la compra");
    }
  };
  const manejarCambio = (index, e) => {
    const { name, value } = e.target;
    const nuevosProductos = [...producto];
    nuevosProductos[index][name] = value;
    setProducto(nuevosProductos);

    if (name === "nombre") {
      if (value === "") {
        // Si el campo está vacío, limpia las sugerencias
        setSugerencias([]);
      } else {
        const sugerenciasFiltradas = productos.filter((prod) =>
          prod.nombre.toLowerCase().includes(value.toLowerCase())
        );
        const nuevasSugerencias = [...sugerencias];
        nuevasSugerencias[index] = sugerenciasFiltradas;
        setSugerencias(nuevasSugerencias);
      }
    }
  };
  const agregarProducto = () => {
    setProducto([...producto, { producto_id: "", nombre: "", cantidad: 1 }]);
  };
  const seleccionarSugerencia = (index, productoId, nombre) => {
    const nuevosProductos = [...producto];
    nuevosProductos[index].producto_id = productoId;
    nuevosProductos[index].nombre = nombre; // Guardar también el nombre
    setProducto(nuevosProductos);
    // Limpiar las sugerencias del índice actual
    const nuevasSugerencias = [...sugerencias];
    nuevasSugerencias[index] = [];
    setSugerencias(nuevasSugerencias);
  };
  const eliminarProducto = (index) => {
    const nuevosProductos = producto.filter((_, i) => i !== index);
    setProducto(nuevosProductos);
  };
  const manejarCambioCantidad = (index, cantidad) => {
    const nuevosProductos = [...producto];
    nuevosProductos[index].cantidad = cantidad;
    setProducto(nuevosProductos);
  };
  const limpiarProducto = () => {
    setProducto([{ producto_id: "", nombre: "", cantidad: 1 }]); // Resetea productos
  };
  const calcularTotal = () => {
    return producto.reduce((acc, prod) => {
      const productoInfo = productos.find((p) => p.id === prod.producto_id);
      const precio = productoInfo ? productoInfo.precio : 0; // Si no se encuentra, usar 0
      return acc + (precio * prod.cantidad);
    }, 0).toFixed(2);
  };
  const calcularVuelto = (total,descuento,pago) => {
    const totalConDescuento = total - descuento;
    return (pago - totalConDescuento).toFixed(2);
  };
  return (
    <AdminCompraContext.Provider
      value={{
        eliminarProducto,
        calcularVuelto,
        manejarCambioCantidad,
        manejarCambio,
        seleccionarSugerencia,
        agregarProducto,
        limpiarProducto,
        calcularTotal,
        producto,
        sugerencias,
        productos,
        errores,
        loading,
        addCompra,
        compras,
        removeCompra,
      }}
    >
      {children}
    </AdminCompraContext.Provider>
  );
};

export { AdminCompraProvider };
export default AdminCompraContext;
