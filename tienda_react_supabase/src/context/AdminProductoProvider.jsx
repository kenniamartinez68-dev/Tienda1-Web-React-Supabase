import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  registerProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../data/supabaseProducto";
import { saveOrder,getAllOrders,updateOrderStatus,getOrdersByUserId } from '../data/supabasePedido';

const AdminProductoContext = createContext();

const AdminProductoProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [modal, setModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Producto en el modal
  

  useEffect(() => {
    const nuevoTotal = pedido.reduce(
      (total, producto) => producto.precio * producto.cantidad + total,
      0
    );
    setTotal(nuevoTotal);
  }, [pedido]);
  // Limpiar errores
  const clearErrores = () => {
    setErrores([]);
  };
  const handleClickModal = () => {
    setModal(!modal);
  };
  const handleSetProducto = (producto) => {
    setProductoSeleccionado(producto); // Asignar el producto seleccionado al estado para mostrar en el modal
  };
  const handleAgregarPedido = ({ categoria_id, ...producto }) => {
    if (pedido.some((pedidoState) => pedidoState.id === producto.id)) {
      const pedidoActualizado = pedido.map((pedidoState) =>
        pedidoState.id === producto.id ? producto : pedidoState
      );
      setPedido(pedidoActualizado);
      toast.success("Guardado Correctamente");
    } else {
      setPedido([...pedido, producto]);
      toast.success("Agregado al Pedido");
    }
  };
  const handleEditarCantidad = (id) => {
    const productoActualizar = pedido.find(
      (producto) => producto.id === id
    );
    setProductoSeleccionado(productoActualizar); // Actualizar el producto seleccionado
    setModal(true);
  };
  const handleEliminarProductoPedido = (id) => {
    const pedidoActualizado = pedido.filter((producto) => producto.id !== id);
    setPedido(pedidoActualizado);
    toast.success("Eliminado del Pedido");
  };
  // Obtener productos con useCallback para prevenir ciclos infinitos
  const fetchProductos = useCallback(async (idCategoria) => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getProduct(idCategoria);
    if (response.success) {
      setProductos(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []); // Nota: Esta función es ahora estable y no se recreará en cada render
  // Registrar unn nuevo producto
  const addProducto = async (producto) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    let tempEstado = producto.estado ? 1 : 0;
    const response = await registerProduct(
      producto.categoria,
      producto.nombre,
      producto.precio,
      producto.imagen,
      tempEstado
    );
    if (response.success) {
      fetchProductos()
       toast.success("Producto agregado con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al agregar el producto");
    }
  };
  // Eliminar un producto
  const removeProducto = async (id) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await deleteProduct(id);
    if (response.success) {
      setProductos(productos.filter((producto) => producto.id !== id)); // Actualizar la lista
      toast.success("Producto eliminado con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al eliminar el producto");
    }
  };
  // Actualizar un producto existente
  const editProducto = async ({ ...producto }) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await updateProduct(
      producto.editandoId,
      producto.categoria,
      producto.nombre,
      producto.precio,
      producto.imagen,
      producto.estado
    );

    if (response.success) {
      fetchProductos(); // Actualizar lista después de editar

      toast.success("producto actualizado con éxito");
    } else {
      setErrores([response.message]);
      console.log(producto);
      toast.error("Error al actualizar al producto");
    }
  };
  const handleSubmitNuevaOrden = async (userId) => {
    clearErrores(); // Limpiar errores antes de nueva solicitud

    const response = await saveOrder(pedido, total, userId);
  
    if (response.success) {
      setPedido([]); // Limpiar el pedido después de guardarlo
      setTotal(0);   // Restablecer el total
      toast.success("Pedido guardado con éxito");
    } else {
      setErrores([response.message]);
      toast.error("Error al guardar el pedido");
    }
  };
  const obtenerPedidos = useCallback(async () => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getAllOrders();
    if (response.success) {
      setPedidos(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []);
  const obtenerPedidosUsuario = useCallback(async (userId) => {
    setLoading(true);
    clearErrores(); // Limpiar errores antes de nueva solicitud
    const response = await getOrdersByUserId(userId);
    if (response.success) {
      setPedidos(response.data);
    } else {
      setErrores([response.message]);
    }
    setLoading(false);
  }, []);
  const handleClickCompletarPedido = async (orderId,estado) => {
    const response = await updateOrderStatus(orderId,estado);
    if (response.success) {
      obtenerPedidos();
    } else {
      setErrores([response.message]);
    }
  };
  return (
    <AdminProductoContext.Provider
      value={{
        productos,
        handleClickModal,
        handleSetProducto,
        pedido,
        modal,
        handleAgregarPedido,
        handleEditarCantidad,
        handleEliminarProductoPedido,
        total,
        addProducto,
        removeProducto,
        editProducto,
        loading,
        errores,
        clearErrores,
        fetchProductos,
        productoSeleccionado,
        handleSubmitNuevaOrden,
        pedidos,
        obtenerPedidos,
        handleClickCompletarPedido,
        obtenerPedidosUsuario,
      }}
    >
      {children}
    </AdminProductoContext.Provider>
  );
};

export { AdminProductoProvider };
export default AdminProductoContext;
