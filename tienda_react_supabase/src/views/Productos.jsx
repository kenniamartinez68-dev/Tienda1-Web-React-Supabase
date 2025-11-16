import { useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import { useRef, useEffect, useState } from "react";
import useCategoria from "../hooks/useCategoria";
import useProducto from "../hooks/useProducto";

export default function Productos() {
  const { productos, addProducto, removeProducto, editProducto, loading, fetchProductos} = useProducto();
  const { categorias } = useCategoria();
  const [editandoId, setEditandoId] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(7);
  const [errores, setErrores] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [producto, setProducto] = useState({categoria: "", nombre: "", precio: "", imagen: null, estado: ""});

  useEffect(() => {
    fetchProductos(categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProducto((prevProducto) => ({
      ...prevProducto,
      imagen: file,
    }));
  };
  const handleCheckChange = (e) => {
    setProducto({
      ...producto,
      estado: e.target.checked ? "1" : "0", // Actualiza el estado a "1" o "0"
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]);
    const erroresTemp = [];
    if (!producto.nombre || !producto.precio || !producto.categoria) {
      erroresTemp.push("Los campos son obligatorios");
    }
    if (!editandoId && !producto.imagen) {
      erroresTemp.push("La imagen es obligatoria");
    }
    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);
      return;
    }
    if (editandoId) {
      await editProducto({ editandoId, ...producto });
      setEditandoId(null);
    } else {
      await addProducto(producto);
    }
    setProducto({
      categoria: "",
      nombre: "",
      precio: "",
      imagen: null,
    });
    e.target.reset();
    // Volver a obtener los productos actualizados
    await fetchProductos(categoriaSeleccionada);
    navigate("/admin/productos");
  };
  const handleEdit = (producto) => {
    setProducto({
      categoria: producto.idCategoria,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: null, // Puedes manejar el caso de imagen
      estado: producto.estado.toString(),
    });
    setEditandoId(producto.id);
  };
  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };
  const handleCategoriaChange = (idCategoria) => {
    setCategoriaSeleccionada(idCategoria); // Actualizar estado
    fetchProductos(idCategoria); // Llamar al método para filtrar productos por categoría
  }; 
  const limpiarFormulario = () => {
    setErrores([]);
    setProducto({
      categoria: "",
      nombre: "",
      precio: "",
      imagen: "",
      estado: "0" // Asignar estado inicial
    });
    setEditandoId(null)

    // Limpiar el input de tipo file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpia el input de archivo
    }
  };
  return (
    <>
      <h1 className="text-2xl font-black">Agregar un producto</h1>
      <p>Agregar un producto llenando el formulario</p>
      <div className="bg-white shadow-md rounded-md mt-5 px-3 py-5">
        <form onSubmit={handleSubmit}>
          {errores.length > 0 && errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}
          <div className="grid grid-cols-2 gap-4 mt-1 mb-3">
            <div>
              <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Seleccione una categoría
              </label>
              <select id="categoria" name="categoria" value={producto.categoria}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" disabled>
                  Seleccione la categoría
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-800" htmlFor="name">
                Nombre:
              </label>
              <input type="text" id="name" name="nombre" value={producto.nombre}
                onChange={handleChange} className="mt-1 w-full p-2 bg-gray-50"
                placeholder="Nombre del producto"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5 mb-3">
            <div>
              <label className="text-slate-800" htmlFor="precio">
                Precio:
              </label>
              <input type="text" id="precio" name="precio" value={producto.precio}
                onChange={handleChange} className="mt-1 w-full p-2 bg-gray-50"
                placeholder="Precio del producto"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white" htmlFor="imagen">
                Imagen:
              </label>
              <input type="file" id="imagen" name="imagen" onChange={handleImageChange} ref={fileInputRef}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input id="estado" name="estado" type="checkbox" checked={producto.estado === "1"} // Aquí validamos si es igual a "1"
              onChange={handleCheckChange} className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-400 focus:ring-2"
            />
            <label htmlFor="estado" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
              ¿Producto agotado?
            </label>
          </div>
          <div className="flex justify-center mt-3 space-x-2">
            <input type="submit" value={editandoId ? "Actualizar producto" : "Agregar producto"}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 uppercase font-bold cursor-pointer"
              disabled={loading}/>
            <button type="button" onClick={limpiarFormulario} // Llama a la función para limpiar el formulario
              className="bg-red-600 hover:bg-red-700 text-white px-20 py-2 uppercase font-bold cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <ul className="flex space-x-4 mt-5 border-b-2 pb-2">
        {categorias.map((categoria) => (
          <li key={categoria.id} className={`group relative cursor-pointer ${
              categoria.id === categoriaSeleccionada ? "text-green-600 font-bold" : "text-gray-700"}`}
            onClick={() => handleCategoriaChange(categoria.id)}>
            <a className="inline-block py-2 px-4 font-semibold group-hover:bg-green-200 transition-colors duration-300">
              {categoria.nombre}
            </a>
            <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-700 transition-transform duration-300 
        ${categoria.id === categoriaSeleccionada ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <h1 className="text-2xl font-black">Lista de productos</h1>
        {productos.length === 0 && <p>No hay productos aún</p>}
        <div className="grid grid-cols-4 gap-4 mt-5">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white shadow-md p-3 rounded-md">
              <div className="flex items-center justify-between">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={`Imagen del producto ${producto.nombre}`}
                    className="w-35 h-32 ml-10 object-cover rounded-md"/>
                ) : (
                  <div className="w-35 h-32 ml-10 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                )}
                <div className="flex flex-col ml-3">
                  <button className="bg-red-600 text-white font-bold p-3 rounded-md mb-2"
                    type="button" onClick={() => removeProducto(producto.id)}>
                    Eliminar
                  </button>
                  <button className="bg-amber-500 text-white font-bold p-3 rounded-md mb-2"
                    type="button" onClick={() => handleEdit(producto)}>
                    Editar
                  </button>
                </div>
              </div>
              <h2 className="text-lg font-bold mt-2 text-center">
                {producto.id}. {producto.nombre}: {producto.precio}
              </h2>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
}
