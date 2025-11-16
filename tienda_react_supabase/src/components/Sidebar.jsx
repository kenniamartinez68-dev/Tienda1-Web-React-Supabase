import Categoria from "./Categoria"
import { signOut } from "../data/supabaseAuth";
import { useState,useContext } from "react";
import {  useNavigate } from "react-router-dom";
import AdminCategoriaContext from "../context/AdminCategoriaProvider";

export default function Sidebar() {
    const {categorias} = useContext(AdminCategoriaContext);
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error.message);
      } else {
        // Redirigir al usuario a la página de login
        navigate("/");
      }
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <aside className="md:w-72">
        <div className="p-4">
            <img
                className="w-40"
                src="/img/logo.svg"
            />
        </div>

        <div className="mt-10">
            {categorias.map( categoria => (
                <Categoria
                    key={categoria.id}
                    categoria={categoria}
                />
            ))}
        </div>

        <div className="my-5 px-5">
            <button
                type="button"
                className="text-center bg-red-500 w-full p-3 font-bold text-white 
                truncate"
                onClick={handleSignOut}
          disabled={loading}
            >
                {loading ? "Cancelando Orden..." : "Cancelar Orden"}
            </button>
        </div>
    </aside>
  )
}
