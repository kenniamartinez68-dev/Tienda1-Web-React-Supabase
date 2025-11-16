import { useContext, useEffect } from "react";
import AdminProductoContext from "../context/AdminProductoProvider";
import { formatearDinero } from "../helpers";
import { getUser } from "../data/supabaseAuth"; // Ajusta la ruta según tu estructura
import { Link } from "react-router-dom";

export default function Historico() {
  const { pedidos, obtenerPedidosUsuario } = useContext(AdminProductoContext);

  useEffect(() => {
    // Función asincrónica dentro del useEffect
    const fetchPedidos = async () => {
      const { user } = await getUser();
      if (user) {
        obtenerPedidosUsuario(user.id); // Obtener los pedidos del usuario
      }
    };

    fetchPedidos(); // Llamar a la función asíncrona
  }, [obtenerPedidosUsuario]);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black">Pedidos</h1>
        <Link
          to="/usuario"
          className="bg-green-600 text-white w-40 block p-2 rounded uppercase font-bold text-center"
        >
          Volver
        </Link>
      </div>
      <p className="text-2xl my-10">
          Todos tus pedidos (ROJO: Rechazado, VERDE: Completado, BLANCO: Sin
          Completar)
        </p>
      <div className="grid grid-cols-3 gap-5">
        {pedidos.length === 0 ? (
          <p>No tienes pedidos guardados</p>
        ) : (
          pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className={`shadow-md p-4 rounded ${
                pedido.estado === 1
                  ? "bg-white"
                  : pedido.estado === 0
                  ? "bg-red-500"
                  : pedido.estado === 2
                  ? "bg-green-500"
                  : ""
              }`}
            >
              <h2 className="text-2xl font-bold">Pedido #{pedido.id}</h2>
              <p>Total: {formatearDinero(pedido.total)}</p>
              <p>Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
              <h3 className="text-xl font-semibold mt-4">
                Detalles del Pedido:
              </h3>
              <ul>
                {JSON.parse(pedido.pedido).map((producto) => (
                  <li key={producto.id}>
                    {producto.nombre} - Cantidad: {producto.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
