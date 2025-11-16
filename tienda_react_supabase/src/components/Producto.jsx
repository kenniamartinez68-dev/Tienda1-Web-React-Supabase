import { formatearDinero } from "../helpers";
import AdminProductoContext from "../context/AdminProductoProvider";
import { useContext} from "react";

export default function Producto({producto}) {
  
  const { handleClickModal, handleSetProducto } = useContext(AdminProductoContext);
  const { nombre, imagen, precio,estado } = producto;

  return (
    <div className="border p-3 shadow bg-white relative">
      {/* Mostrar etiqueta Agotado si estado es 1 */}
      {estado === 1 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg">
          Agotado
        </span>
      )}
      <img
        alt={`imagen ${nombre}`}
        className="w-full"
        src={imagen}
      />
      <div className="p-5">
        <h3 className="text-2xl font-bold">{nombre}</h3>
        <p className="mt-5 font-black text-4xl text-amber-500">{formatearDinero(precio)}</p>
        
        <button 
          type="button" 
          className={`bg-indigo-600 text-white w-full mt-5 p-3 uppercase font-bold ${estado === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={() => {
            handleClickModal(); 
            handleSetProducto(producto);
          }} 
          disabled={estado === 1} // Deshabilitar el botón si estado es 1
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
