import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, getUserRole } from "../data/supabaseAuth"; // Ajusta la ruta según tu estructura

const ProtectedRoute = ({ requiredRole }) => {
  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { user } = await getUser();
      
      if (user) {
        // Obtenemos el rol del usuario
        const { data: roleData } = await getUserRole(user.email);
        setAuth(true);
        setRole(roleData?.rol); // Asignamos el rol del usuario desde la base de datos
        console.log(user)
      } else {
        setAuth(false);
      }
    };
    
    checkSession();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // Mostrar carga mientras se verifica la autenticación
  }

  if (!auth) {
    return <Navigate to="/" />; // Redirigir si no está autenticado
  }

  // Si el usuario está autenticado, pero el rol no coincide con el requerido
  if (requiredRole && role !== requiredRole) {
    if (role === 1) {
      return <Navigate to="/admin" />; // Redirigir a admin si es rol de administrador
    } else if (role === 2) {
      return <Navigate to="/usuario" />; // Redirigir a usuario si es rol de usuario regular
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
