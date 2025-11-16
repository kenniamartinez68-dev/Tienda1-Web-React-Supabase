import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout"
import AuthLayout from "./layouts/AuthLayout";
import Inicio from "./views/Inicio"
import Login from "./views/Login"
import Registro from "./views/Registro"
import AdminLayout from "./layouts/AdminLayout";
import Ordenes from "./views/Ordenes";
import Productos from "./views/Productos";
import ProtectedRoute from "./components/ProtectedRoute";
import Categorias from "./views/Categorias";
import Compras from "./views/Compras"
import Cuentas from "./views/Cuentas";
import Pedidos from "./views/Pedidos";
import Reportes from "./views/Reportes";
import Usuarios from "./views/Usuarios";
import Historico from "./views/Historico";
import DetalleCuentas from "./views/DetalleCuentas";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthLayout />,
        children:[
            {
                index: true,
                element: <Login /> 
            },
            {
                path:'/registro',
                element: <Registro /> 
            }
        ]
      
    },
    {
        path: '/admin',
        element: <ProtectedRoute requiredRole={1} />, // Usamos ProtectedRoute para proteger las rutas de admin
        children: [
            {
                path: '',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Ordenes /> 
                    },
                    {
                        path: '/admin/productos',
                        element: <Productos /> 
                    },
                    {
                        path: '/admin/categorias',
                        element: <Categorias /> 
                    },
                    {
                        path: '/admin/compras',
                        element: <Compras /> 
                    },
                    {
                        path: '/admin/pedidos',
                        element: <Pedidos /> 
                    },
                    {
                        path: '/admin/cuentas',
                        element: <Cuentas /> 
                    },
                    {
                        path: '/admin/detalleCuentas',
                        element: <DetalleCuentas /> 
                    },
                    {
                        path: '/admin/usuarios',
                        element: <Usuarios /> 
                    },
                    {
                        path: '/admin/reportes',
                        element: <Reportes /> 
                    }

                ]
            }
        ]
    },
    {
        path: '/usuario',
        element: <ProtectedRoute requiredRole={2} />,  // Usamos ProtectedRoute para proteger las rutas de admin
    
        children: [
            {
                path: '',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Inicio /> 
                    },
                    {
                        path: '/usuario/historico',
                        element: <Historico /> 
                    }
                ]
            }
        ]
        
    }
])

export default router