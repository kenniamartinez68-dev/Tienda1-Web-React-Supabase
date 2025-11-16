import useUsuario from "../hooks/useUsuario";

export default function Usuarios() {
  const { usuarios } = useUsuario();

  return (
    <div>
      <h1 className="text-4xl font-black">Usuarios</h1>
      <p className="text-2xl my-5">
        Administra a tus clientes desde esta sección
      </p>
      {usuarios && usuarios.length > 0 ? (
        <div className="bg-white shadow-md rounded-md p-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Nombre</th>
                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                <th className="py-2 px-4 border-b border-gray-200">Rol</th>
                <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios
                .filter((usuario) => usuario.rol === 2)
                .map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      {usuario.nombre}
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      {usuario.email}
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      {usuario.rol}
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-red-700">
                        Eliminar
                      </button>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                        Ver cuenta
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xl">No hay usuarios registrados</p>
      )}
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">1</span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">100</span>{" "}
          Entries
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
          <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg
              className="w-3.5 h-3.5 me-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path stroke="currentColor" d="M13 5H1m0 0 4 4M1 5l4-4" />
            </svg>
            Prev
          </button>
          <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path stroke="currentColor" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </button>
        </div>
      </div>
      <h1 className="text-4xl my-4 font-black">Mi usuario</h1>
      <p className="text-2xl my-5">Administra a tu perfil desde esta sección</p>
      {usuarios && usuarios.length > 0 ? (
        <div className="bg-white shadow-md rounded-md p-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Nombre</th>
                <th className="py-2 px-4 border-b border-gray-200">Email</th>
                <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios
                .filter((usuario) => usuario.rol === 1)
                .map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      {usuario.nombre}
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      {usuario.email}
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200">
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-red-700">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xl">No hay usuarios registrados</p>
      )}
    </div>
  );
}
