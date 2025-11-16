import { useState } from "react";
import useCompra from "../hooks/useCompra";
import useUsuario from "../hooks/useUsuario";
import useCuenta from "../hooks/useCuenta";
import { useNavigate } from "react-router-dom";

export default function Cuentas() {
  const [sugerenciasProducto, setSugerenciasProducto] = useState([]);
  const [sugerenciasCliente, setSugerenciasCliente] = useState([]);
  const { usuarios } = useUsuario();
  const { productos } = useCompra();
  const { cuentas, addCuenta } = useCuenta();
  const [producto, setProducto] = useState({ producto_id: null, nombre: "", cantidad: 1 });
  const [cliente, setCliente] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [idCliente, setIdCliente] = useState(0);
  const [errores, setErrores] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]);
    const total = parseFloat(calcularTotal());

    await addCuenta({
      id_cliente: idCliente,
      nombre_cliente: cliente,
      fechaInicio,
      fechaFinal,
      saldo: saldo || 0,
      producto,
      total,
    });
    limpiarFormulario();
    navigate("/admin/cuentas");
  };
  const manejarCambioProducto = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
    if (name === "nombre") {
      setSugerenciasProducto(
        value === ""
          ? []
          : productos.filter((prod) =>
              prod.nombre.toLowerCase().includes(value.toLowerCase())
            )
      );
    }
  };
  const manejarCambioCliente = (e) => {
    const value = e.target.value;
    setCliente(value);

    if (value === "") {
      setIdCliente(0);
      setSugerenciasCliente([]);
    } else {
      const sugerenciasFiltradas = usuarios.filter(
        (user) =>
          user.rol === 2 && 
          user.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSugerenciasCliente(sugerenciasFiltradas);

      const clienteRegistrado = sugerenciasFiltradas.find(
        (user) => user.nombre.toLowerCase() === value.toLowerCase()
      );
      setIdCliente(clienteRegistrado ? clienteRegistrado.id : 0);
    }
  };
  const seleccionarSugerenciaProducto = (productoId, nombre) => {
    setProducto((prev) => ({ ...prev, producto_id: productoId, nombre }));
    setSugerenciasProducto([]);
  };
  const seleccionarSugerenciaCliente = (nombre, id) => {
    setCliente(nombre);
    setIdCliente(id);
    setSugerenciasCliente([]);
  };
  const manejarCambioCantidad = (nuevaCantidad) => {
    setProducto((prev) => ({ ...prev, cantidad: nuevaCantidad }));
  };
  const calcularTotal = () => {
    const productoSeleccionado = productos.find(
      (prod) => prod.id === producto.producto_id
    );
    return productoSeleccionado
      ? (productoSeleccionado.precio * producto.cantidad).toFixed(2)
      : "0.00";
  };
  const limpiarFormulario = () => {
    setErrores([]);
    setProducto({ producto_id: "", nombre: "", cantidad: 1 })
    setCliente("")
    setIdCliente(0);
    setFechaInicio("")
    setFechaFinal("")
    setSaldo(0)
  };
  return (
    <>
      <h1 className="text-2xl font-black">Agregar una cuenta</h1>
      <p>Agregar una cuenta llenando el formulario</p>
      <div className="bg-white shadow-md rounded-md mt-5 px-3 py-5">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-1 mb-3">
            <div>
            <label className="text-slate-800" htmlFor="cliente">Cliente:</label>
              <div className="relative">
                <input type="text" id="cliente" name="cliente" value={cliente} onChange={manejarCambioCliente}
                  className="mt-1 w-full p-2 bg-gray-50" placeholder="Nombre del cliente" autoComplete="off"
                />
                {sugerenciasCliente.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-40 overflow-y-auto">
                    {sugerenciasCliente.map((user, i) => (
                      <li key={`${user.id}-${i}`} onClick={() => seleccionarSugerenciaCliente(user.nombre, user.id)}
                        className="p-2 cursor-pointer hover:bg-gray-200">
                        {user.nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center mt-4 mx-2 space-x-4">
                
                <div className="flex flex-col ">
                  <label className="text-slate-800 mx-7" htmlFor="saldo">
                    Agregar saldo pendiente?
                  </label>
                  <input type="number" id="saldo" name="saldo" value={saldo} onChange={(e) => setSaldo(e.target.value)}
                    className="mt-1 w-full p-2 mx-7 bg-gray-50"
                  />
                </div>
              </div>

            </div>
            <div>
              <label className="text-slate-800" htmlFor="fechaInicio">Fecha Inicio:</label>
              <input type="date" id="fechaInicio" name="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="mt-1 w-full p-2 bg-gray-50" />
              <label className="text-slate-800" htmlFor="fechaFinal">Fecha final:</label>
              <input type="date" id="fechaFinal" name="fechaFinal" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} className="mt-1 w-full p-2 bg-gray-50" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 items-center mb-3">
            <label className="text-slate-800 col-span-1" htmlFor="producto">Producto:</label>
            <div className="col-span-2 relative">
              <input type="text" id="producto" name="nombre" value={producto.nombre}
                onChange={manejarCambioProducto} className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                placeholder="Nombre del producto" autoComplete="off"
              />
              {sugerenciasProducto.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-40 overflow-y-auto">
                  {sugerenciasProducto.map((prod, i) => (
                    <li key={`${prod.id}-${i}`} onClick={() => seleccionarSugerenciaProducto(prod.id, prod.nombre)}
                      className="p-2 cursor-pointer hover:bg-gray-200">
                      {prod.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-1">
              <button type="button" onClick={() => { if (producto.cantidad > 1) 
              manejarCambioCantidad(producto.cantidad - 1); }}
                className="bg-gray-200 p-1 rounded-full hover:bg-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9" />
                </svg>
              </button>
              <p className="text-xl font-bold">{producto.cantidad}</p>
              <button type="button" onClick={() => { if (producto.cantidad < 20) 
              manejarCambioCantidad(producto.cantidad + 1);}}
                className="bg-gray-200 p-1 rounded-full hover:bg-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
                </svg>
              </button>
            </div>
            <div className="flex justify-end mt-4 mr-28 bg-gray-100 p-4 rounded-lg shadow-md">
              <label className="text-slate-800 font-semibold text-lg">
                Total: <span className="text-green-600">${calcularTotal()}</span>
              </label>
            </div>
          </div>
          <div className="flex justify-center mt-3 space-x-2">
            <input type="submit" value="Crear cuenta" className="bg-green-600 hover:bg-green-700 text-white px-16 py-2 uppercase font-bold cursor-pointer" />
            <button type="button" onClick={limpiarFormulario} className="bg-red-600 hover:bg-red-700 text-white px-20 py-2 uppercase font-bold cursor-pointer">Cancelar</button>
          </div>
        </form>
      </div>
       {/* Tabla de cuentas */}
       <div className="mt-8">
        <h1 className="text-2xl font-black">Lista de Cuentas</h1>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Cliente</th>
                <th className="border border-gray-300 px-4 py-2">Fecha Inicio</th>
                <th className="border border-gray-300 px-4 py-2">Fecha Final</th>
                <th className="border border-gray-300 px-4 py-2">Saldo</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
                <th className="border border-gray-300 px-4 py-2">Abono</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((cuenta) => (
                <tr key={cuenta.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{cuenta.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{cuenta.nombre_cliente}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{cuenta.fecha_inicio}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{cuenta.fecha_final}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{cuenta.saldo}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{cuenta.total}</td>
                  <td
                  className={`border border-gray-300 px-4 py-2 text-center font-bold ${
                    cuenta.estado === 1
                      ? "bg-yellow-200 text-yellow-800"
                      : cuenta.estado === 2
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {cuenta.estado === 1
                    ? "Al Día"
                    : cuenta.estado === 2
                    ? "Cancelado"
                    : "Pendiente"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Abono con: {cuenta.abono} Saldo: {(cuenta.total - cuenta.abono).toFixed(2)}
                </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 mx-11 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M10 4h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                      />
                    </svg>
                  </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700">
                        Ver detalle
                    </button>
                    <button className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-red-700">
                        Abonar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
      </div>
    </>
  );
}
