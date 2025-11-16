import { useState, useRef } from "react";
import Alerta from "../components/Alerta";
import { useNavigate } from "react-router-dom";
import useCategoria from "../hooks/useCategoria";

export default function Categorias() {
  const { categorias, addCategoria,removeCategoria, editCategoria,loading} = useCategoria();
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [errores, setErrores] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]); // Limpiar errores antes de validar

    const erroresTemp = [];

    if (!nombre) {
      erroresTemp.push("El nombre es obligatorio");
    }

    if (!editandoId && !imagen) {
      erroresTemp.push("La imagen es obligatoria");
    }

    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);  // Aquí actualizamos el estado de errores
      return;
    }

    if (editandoId) {
      await editCategoria(editandoId, nombre, imagen);
      setEditandoId(null); // Limpiar el ID de edición
    } else {
      await addCategoria(nombre, imagen);
    }

    setNombre("");
    setImagen(null);
    fileInputRef.current.value = ""; // Limpiar el input de archivo
    navigate("/admin/categorias");
  };
  const handleEdit = (categoria) => {
    setNombre(categoria.nombre);
    setEditandoId(categoria.id);
    setImagen(null); // Limpiar imagen seleccionada
  };
  const limpiarFormulario = () => {
    setErrores([]);
    setNombre("")
    setImagen(null);
    setEditandoId(null);
    // Limpiar el input de tipo file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpia el input de archivo
    }
  };
  return (
    <>
      <h1 className="text-2xl font-black">Administrar Categorías</h1>
      <div className="bg-white shadow-md rounded-md mt-5 px-3 py-5">
        <form onSubmit={handleSubmit}>
          {errores.length > 0 && errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}
          <div className="mb-3">
            <label className="text-slate-800" htmlFor="nombre">
              Nombre:
            </label>
            <input type="text" id="nombre" className="mt-1 w-full p-2 bg-gray-50"
              value={nombre} onChange={(e) => setNombre(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-900" htmlFor="imagen">
              Imagen:
            </label>
            <input type="file" id="imagen" className="block w-full text-sm text-gray-900 border rounded-lg"
              onChange={handleImageChange} ref={fileInputRef}/>
          </div>
          <div className="flex justify-center mt-3 space-x-2">
            <input type="submit" value={editandoId ? "Actualizar Categoría" : "Agregar Categoría"}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 uppercase font-bold cursor-pointer"
              disabled={loading} />
            <button type="button" onClick={limpiarFormulario} 
              className="bg-red-600 hover:bg-red-700 text-white px-20 py-2 uppercase font-bold cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-black">Listado de Categorías</h2>
        {categorias.length === 0 && <p>No hay categorías aún</p>}
        <div className="grid grid-cols-4 gap-4 mt-5">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="bg-white shadow-md p-3 rounded-md flex hover:bg-green-200">
              <div className="flex-grow flex flex-col items-center">
                <h2 className="text-lg font-bold text-center mb-2">
                  {categoria.nombre}
                </h2>
                <img src={categoria.imagen} alt={`Imagen de la categoría ${categoria.nombre}`}
                  className="w-35 h-32 object-cover rounded-md mb-2"/>
              </div>
              <div className="flex flex-col items-end justify-center ml-4">
                <button className="bg-red-600 text-white font-bold p-3 rounded-md mb-2 w-24"
                  onClick={() => removeCategoria(categoria.id)}>
                  Eliminar
                </button>
                <button className="bg-amber-500 text-white font-bold p-3 rounded-md mb-2 w-24"
                  onClick={() => handleEdit(categoria)}>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
