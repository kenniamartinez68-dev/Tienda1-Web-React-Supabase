import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  guardarOrden,
  obtenerAllOrdenes,
  eliminarOrden,
  editarOrden,
} from "../data/supabaseOrden";

const AdminPedidoContext = createContext();
const AdminPedidoProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [producto, setProducto] = useState([{ nombre: "", cantidad: 1, precio: "", IVA: "0", subTotal: 0 }]);

  useEffect(() => {
    fetchPedidos();
  }, []);
  const clearErrores = () => {
    setErrores([]);
  };
  const addPedido = async ({ nombre_orden, fecha, productos, total }) => {
    clearErrores();
    setLoading(true); // Puedes usar loading si quieres indicar visualmente que hay una acción en proceso

    try {
      const response = await guardarOrden(
        nombre_orden,
        fecha,
        productos,
        total
      );
      if (response.success) {
        fetchPedidos();
        toast.success("Pedido agregado con éxito");
        setPedidos([...pedidos, { nombre_orden, fecha, productos, total }]);
      } else {
        setErrores([response.message]);
        toast.error("Error al agregar el pedido");
      }
    } catch (error) {
      setErrores(["Error al procesar el pedido"]);
      toast.error("Error al procesar el pedido");
    }
  };
  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await obtenerAllOrdenes();
    if (response.success) {
      setPedidos(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []);
  const removePedidos = async (id) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await eliminarOrden(id);
    if (response.success) {
      setPedidos(pedidos.filter((pedido) => pedido.id !== id)); // Actualizar la lista
      toast.success("Pedido eliminado con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al eliminar el pedido");
    }
  };
  const agregarProducto = () => {
    setProducto([...producto, { nombre: "", cantidad: 1, precio: "", IVA: "0", subTotal: 0 }]);
  };
  const manejarCambio = (index, e) => {
    const { name, value } = e.target;
    const nuevosProductos = [...producto];
    nuevosProductos[index][name] = value;

    // Cálculo de subtotal en base a precio, IVA y cantidad
    if (name === "precio" || name === "IVA" || name === "cantidad") {
      const precio = parseFloat(nuevosProductos[index].precio || 0);
      const IVA = parseFloat(nuevosProductos[index].IVA || 0);
      const cantidad = parseInt(nuevosProductos[index].cantidad || 1);

      // Cálculo de subtotal (precio + IVA) * cantidad
      const subTotal = (precio + precio * (IVA / 100)) * cantidad;
      nuevosProductos[index].subTotal = subTotal.toFixed(2); // Redondeamos a 2 decimales
    }

    setProducto(nuevosProductos);
  };
  const manejarCambioCantidad = (index, cantidad) => {
    const nuevosProductos = [...producto];
    nuevosProductos[index].cantidad = cantidad;
    // Recalcular subtotal para la cantidad
    const precio = parseFloat(nuevosProductos[index].precio || 0);
    const IVA = parseFloat(nuevosProductos[index].IVA || 0);
    const subTotal = (precio + precio * (IVA / 100)) * cantidad;
    nuevosProductos[index].subTotal = subTotal.toFixed(2);

    setProducto(nuevosProductos);
  };
  const eliminarProducto = (index) => {
    const nuevosProductos = producto.filter((_, i) => i !== index);
    setProducto(nuevosProductos);
  };
  const calcularTotal = () => {
    return producto.reduce((acc, prod) => acc + parseFloat(prod.subTotal || 0), 0).toFixed(2);
  };
  const editPedido = async ({editarPedido,nombre_orden, fecha, productos, total}) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await editarOrden(
      editarPedido,
      nombre_orden,
      fecha,
      productos,
      total
    );

    if (response.success) {
      fetchPedidos(); // Actualizar lista después de editar

      toast.success("Pedido actualizado con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al actualizar el pedido");
    }
  };
  const limpiarProducto = () => {
    setProducto([{ nombre: "", cantidad: 1, precio: "", IVA: "0", subTotal: 0 }]);
  };
  const cargarProducto = (pedido) => {
    setProducto(pedido.productos.map(p => ({
      nombre: p.nombre,
      cantidad: p.cantidad,
      precio: p.precio,
      IVA: p.IVA,
      subTotal: p.subtotal // Asegúrate que esto coincide con tus propiedades
    })));
  };
  return (
    <AdminPedidoContext.Provider
      value={{
        limpiarProducto,
        agregarProducto,
        manejarCambio,
        cargarProducto,
        manejarCambioCantidad,
        eliminarProducto,
        calcularTotal,
        producto,
        addPedido,
        errores,
        loading,
        pedidos,
        removePedidos,
        editPedido,
      }}
    >
      {children}
    </AdminPedidoContext.Provider>
  );
};

export { AdminPedidoProvider };
export default AdminPedidoContext;
