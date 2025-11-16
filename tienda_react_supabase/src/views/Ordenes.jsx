import { useEffect } from "react";
import { formatearDinero } from "../helpers"
import useProducto from "../hooks/useProducto";

export default function Ordenes() {
 
  const { pedidos,obtenerPedidos,handleClickCompletarPedido } = useProducto();

  useEffect(() => {
    obtenerPedidos();
  }, [obtenerPedidos]);

  return (
    <div>  
        <h1 className="text-4xl font-black">Ordenes</h1>
        <p className="text-2xl my-10">
          Administra las ordenes de tus clientes desde esta sección
        </p>

        <div className="grid grid-cols-3 gap-5">
        {pedidos.length === 0 ? (
          <p>No tienes pedidos guardados</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white shadow-md p-4 rounded">
              <h2 className="text-2xl font-bold">Pedido #{pedido.id}</h2>
              <p>Cliente: {pedido.usuario?.nombre || "Cliente desconocido"}</p>
              <p>Total: {formatearDinero(pedido.total)}</p>
              <p>Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
              <h3 className="text-xl font-semibold mt-4">Detalles del Pedido:</h3>
              <ul>
                {JSON.parse(pedido.pedido).map((producto) => (
                  <li key={producto.id}>{producto.nombre} - Cantidad: {producto.cantidad}</li>
                ))}
              </ul>
              <button type="submit"
                  className='bg-green-600 hover:bg-green-800 mx-7 px-5 py-2 rounded uppercase font-bold text-white text-center w-40 cursor-pointer'
                  onClick={()=>handleClickCompletarPedido(pedido.id,2)}
                > Completar</button>
                <button type="submit"
                  className='bg-red-600 hover:bg-red-800 my-3 px-5 py-2 rounded uppercase font-bold text-white text-center w-40 cursor-pointer'
                  onClick={()=>handleClickCompletarPedido(pedido.id,0)}
                > Rechazar</button>
            </div>
            
          ))
        )}
        </div>

    </div>
  )
}
