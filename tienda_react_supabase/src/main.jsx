import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QuioscoProvider } from "./context/QuioscoProvider.jsx";
import { AdminCategoriaProvider } from "./context/AdminCategoriaProvider.jsx";
import { AdminProductoProvider } from "./context/AdminProductoProvider.jsx";
import { AdminCompraProvider } from "./context/AdminCompraProvider.jsx";
import {AdminPedidoProvider} from "./context/AdminPedidoProvider.jsx";
import { AdminUsuarioProvider } from "./context/AdminUsuarioProvider.jsx";
import { AdminCuentaProvider } from "./context/AdminCuentaProvider.jsx";
import router from "./router.jsx";
import "react-toastify/dist/ReactToastify.css"; // Importa los estilos

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AdminCategoriaProvider>
        <AdminCuentaProvider>
        <AdminUsuarioProvider>
        <AdminPedidoProvider>
      <AdminCompraProvider>
      <AdminProductoProvider>
        
        <QuioscoProvider>
          <RouterProvider router={router} />
        </QuioscoProvider>
        
        </AdminProductoProvider>
        </AdminCompraProvider>
        </AdminPedidoProvider>
        </AdminUsuarioProvider>
        </AdminCuentaProvider>
      </AdminCategoriaProvider>
  </StrictMode>
);
