import { useEffect, useState } from "react";
import useCuenta from "../hooks/useCuenta";

export default function DetalleCuentas() {
  const { cuentas,fetchDetalles,detalles } = useCuenta();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(0);

  useEffect(() => {
    fetchDetalles(usuarioSeleccionado);
  }, [usuarioSeleccionado]);
  const handleUsuarioChange = (idCuenta) => {
    setUsuarioSeleccionado(idCuenta); // Actualizar estado
    fetchDetalles(idCuenta); // Llamar al método para filtrar productos por categoría
  }; 
  return (
    <div><ul className="flex space-x-4 mt-5 border-b-2 pb-2">
    {cuentas.map((cuenta) => (
      <li key={cuenta.id} className={`group relative cursor-pointer ${
          cuenta.id === usuarioSeleccionado ? "text-green-600 font-bold" : "text-gray-700"}`}
        onClick={() => handleUsuarioChange(cuenta.id)}>
        <a className="inline-block py-2 px-4 font-semibold group-hover:bg-green-200 transition-colors duration-300">
          {cuenta.nombre_cliente}
        </a>
        <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-700 transition-transform duration-300 
    ${cuenta.id === usuarioSeleccionado ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
      </li>
    ))}
  </ul>
      {/* Saldo pendiente */}
      <div className="mt-5">
        <h1 className="text-2xl font-black mb-3">Lista de productos</h1>
        {detalles.length > 0 && (
          <div className="flex justify-start items-center space-x-4">
            <h2 className="text-lg font-bold">Saldo pendiente: {detalles[0].cuenta.saldo}</h2>
            <button className="bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
              &times;
            </button>
          </div>
        )}
      </div>
  {/* Lista de productos */}
  <div className="grid grid-cols-4 gap-4 mt-5">
    {detalles.map((detalle) => (
      <div key={detalle.id} className="bg-white shadow-md p-3 rounded-md flex justify-between items-center mt-2">
        <span className="text-gray-700">{detalle.producto.nombre}: {detalle.cantidad} -------- Precio: {detalle.precio_unitario}</span>
        <button className="bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
          &times;
        </button>
      </div>
    ))}

    {/* Botón para agregar productos */}
    <div className="col-span-4 flex mt-5">
      <button className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-md">
        Agregar producto
      </button>
    </div>
      </div>
    </div>
  );
}
