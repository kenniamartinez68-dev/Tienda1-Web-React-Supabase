
import Producto from "../components/Producto"
import AdminProductoContext from "../context/AdminProductoProvider";
import AdminCategoriaContext from "../context/AdminCategoriaProvider";
import { useContext,useEffect} from "react";

export default function Inicio() {
  const {categoriaActual} = useContext(AdminCategoriaContext);
  const { productos,fetchProductos } = useContext(AdminProductoContext);
  // Usar useEffect para llamar fetchProductos solo cuando categoriaActual cambie
  useEffect(() => {
    if (categoriaActual?.id) { // Asegurarse de que categoriaActual no sea null o undefined
      fetchProductos(categoriaActual.id);
    }
  }, [categoriaActual, fetchProductos]);
  return (
    <>
    <h1 className="text-4xl font-black">
      {categoriaActual ? categoriaActual.nombre : "Selecciona una categoría"}
    </h1>
    <p className="text-2xl my-10">
      Elige y personaliza tu pedido a continuación.
    </p>

    {productos.length === 0 ? (
      <p className="text-center text-xl">
        {categoriaActual
          ? "No hay productos disponibles en esta categoría."
          : "Selecciona una categoría para ver productos."}
      </p>
    ) : (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {productos.map((producto) => (
          <Producto key={producto.id} producto={producto} />
        ))}
      </div>
    )}
  </>
  )
}
