import {Link,useNavigate} from "react-router-dom"
import { registerUser } from "../data/supabaseAuth";
import Alerta from '../components/Alerta';
import { useState} from 'react'

export default function Registro() {
   // Estado para almacenar los valores del formulario
   const [nombre, setNombre] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirmation, setPasswordConfirmation] = useState('');
   const [errores, setErrores] = useState([]);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setErrores([]);

    // Validación simple del formulario
    let erroresTemp = [];
    if (nombre === '') erroresTemp.push("El nombre es obligatorio");
    if (email === '') erroresTemp.push("El email es obligatorio");
    if (password === '') erroresTemp.push("La contraseña es obligatoria");
    if (password !== passwordConfirmation) {
      erroresTemp.push("Las contraseñas no coinciden");
    }

    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);
      return;
    }

    setLoading(true);

    try {
      // Llamada al método registerUser para registrar el usuario
      const { user } = await registerUser(nombre, email, password);
      if (user) {
        console.log('Usuario registrado exitosamente:', user);
        // Redirigir al usuario a la página de inicio de sesión después de registrarse
        navigate('/');
      }
    } catch (error) {
      // Manejar los errores que puedan ocurrir al registrar el usuario
      setErrores([error.message]);
      console.error("Error al registrar el usuario:", error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <h1 className="text-4xl font-black">Crea tu cuenta</h1>
      <p>Crea tu cuenta llenando el formulario</p>

      <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
      <form onSubmit={handleSubmit}>
        {errores ? errores.map((error,i) => <Alerta key={i}>{error}</Alerta>) : null}
          <div className="mb-4">
            <label className="text-slate-800" htmlFor="name">
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 w-full p-3 bg-gray-50"
              name="name"
              placeholder="Tu Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-slate-800" htmlFor="email">
              Email:
            </label>
            <input
              type="text"
              id="email"
              className="mt-2 w-full p-3 bg-gray-50"
              name="email"
              placeholder="Tu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-slate-800" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full p-3 bg-gray-50"
              name="password"
              placeholder="Tu Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-slate-800" htmlFor="password_confirmation">
              Repetir Password:
            </label>
            <input
              type="password"
              id="password_confirmation"
              className="mt-2 w-full p-3 bg-gray-50"
              name="password_confirmation"
              placeholder="Repetir Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value={loading ? "Creando cuenta..." : "Crear Cuenta"}
            className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
            disabled={loading}
          />
        </form>
      </div>
      <nav className="mt-5">
        <Link to="/">
        ¿Ya tienes cuenta? Inicia Sesión
        </Link>
      </nav>
    </>
  );
}
