import { useState} from "react";
import Alerta from "../components/Alerta";
import { formatearDinero } from "../helpers"
import { useNavigate } from "react-router-dom";
import usePedido from "../hooks/usePedido";

export default function Pedidos() {
  const { addPedido,pedidos,removePedidos,editPedido,agregarProducto, manejarCambio, manejarCambioCantidad,
    eliminarProducto, calcularTotal, producto,limpiarProducto,cargarProducto } = usePedido();
  const [errores, setErrores] = useState([]);
  const navigate = useNavigate();
  const [nombrePedido, setNombrePedido] = useState("");
  const [fecha, setFecha] = useState("");
  const [editarPedidos, setEditarPedidos] = useState(null); // Estado para el pedido a editar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]);

    // Validación de campos
    const erroresTemp = [];
    if (!nombrePedido || !fecha) {
      erroresTemp.push("El nombre del pedido y la fecha son obligatorios.");
    }
    if (producto.some(p => !p.nombre || !p.precio)) {
      erroresTemp.push("Todos los campos de los productos son obligatorios.");
    }
    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);
      return;
    }
    
  // Asegurarse de que IVA esté definido
  const productosConIVA = producto.map(p => ({
    ...p,
    IVA: p.IVA ? parseFloat(p.IVA) : 0, // Si IVA está vacío o es 0, establece 0 como predeterminado
  }));
  if (editarPedidos) {
    console.log(editarPedidos)
    const total = parseFloat(calcularTotal());
    await editPedido({ editarPedidos,nombre_orden: nombrePedido,
      fecha: fecha,
      productos: productosConIVA,
      total: total, });
    setEditarPedidos(null);
  } else {
    const total = parseFloat(calcularTotal());

  // Envía los datos necesarios a addPedido
  await addPedido({
    nombre_orden: nombrePedido,
    fecha: fecha,
    productos: productosConIVA,
    total: total,
  });
  }

    limpiarFormulario(),
    navigate("/admin/pedidos");
  };
  const limpiarFormulario = () => {
    setErrores([]);
    setNombrePedido("");
    setFecha("");
    limpiarProducto()
    setEditarPedidos(null)
  };
   const cargarPedido = (pedido) => {
    setNombrePedido(pedido.titulo);
    setFecha(pedido.fecha);
    cargarProducto(pedido)
    setEditarPedidos(pedido.id); 
  };
  return (
    <>
      <h1 className="text-2xl font-black">Administrar Pedidos</h1>
      <div className="bg-white shadow-md rounded-md mt-5 px-3 py-5">
        <form onSubmit={handleSubmit}>
        {errores.length > 0 &&
          errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}
        <div className="flex gap-2 mt-1 mb-3">
          <div className="flex items-center">
            <label className="text-slate-800 mr-2" htmlFor="nombre_pedido">
              Pedido de:
            </label>
            <input type="text" id="nombre_pedido" name="nombre_pedido" value={nombrePedido} onChange={(e) => setNombrePedido(e.target.value)}
              className="w-48 p-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Nombre del pedido"
            />
          </div>
          <div className="flex items-center">
            <label className="text-slate-800 mr-2" htmlFor="fecha">
              Fecha
            </label>
            <input type="date" id="fecha" name="fecha" value={fecha}
                onChange={(e) => setFecha(e.target.value)} className="w-36 p-2 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
          {producto.map((producto, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-center mb-3">
              <div className="col-span-6 flex items-center space-x-2">
                <label className="text-slate-800" htmlFor={`producto-${index}`}>
                  Producto {index + 1}:
                </label>
                <input type="text" id={`producto-${index}`} name="nombre" value={producto.nombre}
                  onChange={(e) => manejarCambio(index, e)} className="mt-1 w-64 p-2 bg-gray-50 border border-gray-300 rounded-lg"
                  placeholder="Nombre del producto" autoComplete="off"/>
                <button type="button" onClick={() => {if (producto.cantidad <= 1) return;
                    manejarCambioCantidad(index, producto.cantidad - 1);}}
                  className="bg-gray-200 p-1 rounded-full hover:bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9" />
                  </svg>
                </button>
                <p className="text-xl font-bold">{producto.cantidad}</p>
                <button type="button" onClick={() => {if (producto.cantidad >= 20) return;
                    manejarCambioCantidad(index, producto.cantidad + 1);}}
                  className="bg-gray-200 p-1 rounded-full hover:bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
                  </svg>
                </button>
                <label className="text-slate-800 col-span-1" htmlFor={`precio-${index}`}>
                  Precio
                </label>
                <input type="number" id={`precio-${index}`} name="precio" value={producto.precio}
                  onChange={(e) => manejarCambio(index, e)} className="mt-1 w-40 p-2 bg-gray-50 border border-gray-300 rounded-lg"
                  placeholder="Precio del producto" autoComplete="off"
                />
                <label className="text-slate-800 col-span-1" htmlFor={`iva-${index}`}>
                  IVA (%)
                </label>
                <input type="number" id={`iva-${index}`} name="IVA" value={producto.IVA}
                  onChange={(e) => manejarCambio(index, e)}  className="mt-1 w-36 p-2 bg-gray-50 border border-gray-300 rounded-lg"
                  placeholder="IVA del producto" autoComplete="off"
                />
                <label className="text-slate-800 col-span-1" htmlFor={`subTotal-${index}`}>
                  SubTotal
                </label>
                <input type="text" id={`subTotal-${index}`} name="subTotal"
                  value={producto.subTotal} className="mt-1 w-36 p-2 bg-gray-50 border border-gray-300 rounded-lg"
                  placeholder="SubTotal del producto" autoComplete="off" readOnly
                />
                <button type="button" onClick={() => eliminarProducto(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full font-bold flex items-center justify-center w-8 h-8"
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={agregarProducto}
            className="bg-green-300 hover:bg-green-500 text-black px-4 py-2 flex items-center space-x-2 rounded-lg font-bold cursor-pointer mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Producto</span>
          </button>
          <div className="flex justify-end mt-4 mr-32">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <label className="text-slate-800 font-semibold text-lg">
                Total: <span className="text-green-600">${calcularTotal()}</span>
              </label>
            </div>
          </div>
          <div className="flex justify-center mt-3 space-x-2">
            <input type="submit" value={editarPedidos ? "Actualizar Pedido" : "Agregar Pedido"}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 uppercase font-bold cursor-pointer"
            />
            <button type="button"
              className="bg-red-600 hover:bg-red-700 text-white px-20 py-2 uppercase font-bold cursor-pointer"
                onClick={limpiarFormulario}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <div className="mt-5">
        <h2 className="text-2xl font-black">Listado de Pedidos</h2>
        <div className="grid grid-cols-3 gap-5">
          {pedidos.length === 0 ? (
            <p>No tienes pedidos guardados</p>
          ) : (
            pedidos.map((pedido) => (
              <div key={`pedido-${pedido.id}`} className="relative bg-white shadow-md p-4 rounded">
                <div className="absolute top-2 right-2 flex gap-2">
                <button className="bg-amber-600 hover:bg-amber-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => cargarPedido(pedido)}
                >
                    ✎
                  </button>
                  <button className="bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => removePedidos(pedido.id)}>
                    &times;
                  </button>
                </div>
                <h2 className="text-2xl font-bold">Pedido #{pedido.id}</h2>
                <p>Pedido de: {pedido.titulo || "Cliente desconocido"}</p>
                <p>Total: {formatearDinero(pedido.total)}</p>
                <p>Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
                <h3 className="text-xl font-semibold mt-4">Detalles del Pedido:</h3>
                    {pedido.productos.map((detalle,index) => (
                      <div  key={`${pedido.id}-${detalle.id_orden}-${index}`} className="mb-4">
                        <div className="flex justify-between">
                          <p>{detalle.nombre} - Cantidad: {detalle.cantidad}</p>
                          <p>IVA: {formatearDinero(detalle.IVA)}</p>
                          <p>{formatearDinero(detalle.precio * detalle.cantidad)}</p>
                        </div>
                      </div>
                    ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
