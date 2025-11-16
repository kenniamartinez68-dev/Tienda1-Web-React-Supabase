import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../data/supabaseAuth";
import { useState } from "react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("/admin"); // Estado para el enlace seleccionado

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

  const handleSelect = (link) => {
    setSelected(link); // Actualiza el enlace seleccionado
    navigate(link); // Navega a la nueva ruta
  };

  return (
    <aside className="md:w-72 h-screen">
      <div className="p-4 flex justify-center">
        <img src="/img/logo.svg" alt="imagen logotipo" className="w-48" />
      </div>

      <nav className="flex flex-col p-2">
        <Link
          to="/admin"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin" ? "bg-amber-400" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin")}
        >
          Ordenes
        </Link>
        <Link
          to="/admin/productos"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/productos" ? "bg-amber-400" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/productos")}
        >
          Productos
        </Link>
        <Link
          to="/admin/categorias"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/categorias" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/categorias")}
        >
          Categorias
        </Link>
        <Link
          to="/admin/compras"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/compras" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/compras")}
        >
          Compras
        </Link>
        <Link
          to="/admin/pedidos"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/pedidos" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/pedidos")}
        >
          Pedidos
        </Link>
        <Link
          to="/admin/cuentas"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/cuentas" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/cuentas")}
        >
          Cuentas
        </Link>
        <Link
          to="/admin/detalleCuentas"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/detalleCuentas" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/detalleCuentas")}
        >
          DetalleCuentas
        </Link>
        <Link
          to="/admin/usuarios"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/usuarios" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/usuarios")}
        >
          Usuarios
        </Link>
        <Link
          to="/admin/reportes"
          className={`text-lg font-bold flex items-center gap-4 border w-full p-3 cursor-pointer ${
            selected === "/admin/reportes" ? "bg-amber-500" : "bg-white"
          }`}
          onClick={() => handleSelect("/admin/reportes")}
        >
          Reportes
        </Link>
      </nav>
      <div className="my-5 px-5">
        <button
          type="button"
          className="text-center bg-red-600 w-full p-3 font-bold text-white truncate"
          onClick={handleSignOut}
          disabled={loading}
        >
          {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
        </button>
      </div>
    </aside>
  );
}
