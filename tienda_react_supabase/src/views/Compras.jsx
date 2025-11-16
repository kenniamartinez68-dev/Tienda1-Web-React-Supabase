import { useState } from "react";
import { formatearDinero } from "../helpers"
import Alerta from "../components/Alerta";
import useCompra from "../hooks/useCompra";

const Compras = () => {
  const [nombreComprador, setNombreComprador] = useState(""); 
  const { addCompra,compras,removeCompra,eliminarProducto, manejarCambioCantidad,manejarCambio,
    seleccionarSugerencia,agregarProducto,sugerencias,producto,limpiarProducto,calcularTotal,calcularVuelto } = useCompra();
  const [errores, setErrores] = useState([]);
  const [pago, setPago] = useState(0);
  const [descuento, setDescuento] = useState(0);

  const validarCampos = () => {
    const erroresTemp = [];
    if (producto.some((prod) => !prod.producto_id || prod.cantidad < 1)) {
      erroresTemp.push("Producto o cantidad inválidos");
    }
    if (!nombreComprador || !pago) {
      erroresTemp.push("Los campos de comprador y pago son obligatorios");
    }
    setErrores(erroresTemp);
    return erroresTemp.length === 0;
  };
  const agregarCompra = (e) => {
    e.preventDefault();
    setErrores([]);

    if (!validarCampos()) return;

    const total = calcularTotal();
    const vuelto = calcularVuelto(total,descuento,pago);
    addCompra({
      nombre_comprador: nombreComprador,
      productos: producto,
      pago: parseFloat(pago),
      descuento: parseFloat(descuento),
      total: parseFloat(total),
      vuelto: parseFloat(vuelto),
    });
    limpiarFormulario()
  };
  const limpiarFormulario = () => {
    setErrores([]);
    setNombreComprador("")
    limpiarProducto()
    setPago(0);
    setDescuento(0);
  };
  return (
    <>
      <h1 className="text-2xl font-black">Administrar Compras</h1>
      <div className="bg-white shadow-md rounded-md mt-5 px-3 py-5">
        <form>
        {errores.length > 0 && errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}
          <div className="grid grid-cols-2 gap-1 mt-1 mb-3">
            <label className="text-slate-800 col-span-1" htmlFor="nombre_comprador">
              Comprador
            </label>
            <input type="text" id="nombre_comprador" name="nombre_comprador"
            value={nombreComprador} onChange={(e) => setNombreComprador(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded-lg col-span-2"
              placeholder="Nombre del Comprador"
            />
          </div>
          {producto.map((producto, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-center mb-3">
              <label className="text-slate-800 col-span-1" htmlFor={`producto-${index}`}>
                Producto {index + 1}:
              </label>
              <div className="col-span-2 relative">
                <input type="text" id={`producto-${index}`}
                  name="nombre" value={producto.nombre}
                  onChange={(e) => manejarCambio(index, e)}
                  className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                  placeholder="Nombre del producto" autoComplete="off"/>
                {sugerencias[index]?.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-40 overflow-y-auto">
                    {sugerencias[index].map((prod, i) => (
                      <li key={`${prod.id}-${i}`} onClick={() => seleccionarSugerencia(index, prod.id, prod.nombre)}
                        className="p-2 cursor-pointer hover:bg-gray-200">
                        {prod.nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-span-2 flex items-center gap-2 mt-1">
                <button type="button"
                  onClick={() => {if (producto.cantidad <= 1) return;
                    manejarCambioCantidad(index, producto.cantidad - 1);}}
                  className="bg-gray-200 p-1 rounded-full hover:bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9"/>
                  </svg>
                </button>
                <p className="text-xl font-bold">{producto.cantidad}</p>
                <button type="button"
                  onClick={() => {if (producto.cantidad >= 20) return;
                    manejarCambioCantidad(index, producto.cantidad + 1);}}
                  className="bg-gray-200 p-1 rounded-full hover:bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9"/>
                  </svg>
                </button>
                <button type="button" onClick={() => eliminarProducto(index)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full font-bold flex items-center justify-center w-8 h-8">
                X
              </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={agregarProducto}
            className="bg-green-300 hover:bg-green-500 text-black px-4 py-2 flex items-center space-x-2 rounded-lg font-bold cursor-pointer mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Agregar Producto</span>
          </button>
          <div className="flex justify-center items-center mt-4 mr-32 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <label className="text-slate-800 font-semibold text-lg">
                Total: <span className="text-green-600">${calcularTotal()}</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 mr-2" htmlFor="pago">
                Paga con:
              </label>
              <input type="number" id="pago" name="pago" value={pago} onChange={(e) => setPago(Math.max(0, e.target.value))}
                className="w-24 p-2 bg-gray-50 border border-gray-300 rounded-lg" placeholder="Pago"
              />
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 mr-2" htmlFor="descuento">
                Descuento:
              </label>
              <input type="number" id="descuento" name="descuento"
               value={descuento} onChange={(e) => setDescuento(Math.max(0, e.target.value))}
                className="w-24 p-2 bg-gray-50 border border-gray-300 rounded-lg"
                placeholder="Descuento aplicado"
              />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <label className="text-slate-800 font-semibold text-lg">
                Vuelto: <span className="text-green-600">${calcularVuelto(calcularTotal(),descuento,pago)}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-3 space-x-2">
            <input type="submit" value="Agregar Compra" onClick={(e) => agregarCompra(e)}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 uppercase font-bold cursor-pointer"
            />
            <button type="button"
              className="bg-red-600 hover:bg-red-700 text-white px-20 py-2 uppercase font-bold cursor-pointer"
              onClick={limpiarFormulario} 
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <div className="mt-5">
        <h2 className="text-2xl font-black">Listado de Compras</h2>
        <div className="grid grid-cols-3 gap-5">
          {compras.length === 0 ? (
            <p>No tienes compras guardadas</p>
          ) : (
            compras.map((compra) => (
              <div key={compra.id} className="relative bg-white shadow-md p-4 rounded">
                <button
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => removeCompra(compra.id)}>
                  &times;
                </button>
                <h2 className="text-2xl font-bold">Compra #{compra.id}</h2>
                <p>Cliente: {compra.nombre_comprador || "Cliente desconocido"}</p>
                <p>Total: {formatearDinero(compra.total)}</p>
                <p>Fecha: {new Date(compra.fecha).toLocaleDateString()}</p>

                <h3 className="text-xl font-semibold mt-4">Detalles del Pedido:</h3>
                {compra.detalles.map((detalle,idx) => (
                  <div  key={`${detalle.id_producto}-${idx}`} className="flex justify-between">
                    <p>{detalle.nombre} - Cantidad: {detalle.cantidad}</p>
                    <p>{formatearDinero(detalle.precio * detalle.cantidad)}</p>
                  </div>
                ))}
                <p>Pago: {formatearDinero(compra.pago)}</p>
                <p>Descuento: {formatearDinero(compra.descuento)}</p>
                <p>Vuelto: {formatearDinero(compra.vuelto)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Compras;
