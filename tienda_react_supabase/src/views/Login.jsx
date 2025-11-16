import { Link,useNavigate  } from "react-router-dom";
import Alerta from '../components/Alerta';
import { createRef,useState} from 'react'
import { signInWithEmail } from "../data/supabaseAuth";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const navigate = useNavigate(); // Hook para redireccionar

  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores([]);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    let erroresTemp = [];
    if (email === '') {
      erroresTemp.push('El email es obligatorio');
    }
    if (password === '') {
      erroresTemp.push('La contraseña es obligatoria');
    }

    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        setErrores([error.message]);
      } else {
        const role = data.role;
        if (role === 1) {
          navigate('/admin'); // Redirigir a la página de admin si es administrador
        } else {
          navigate('/usuario'); // Redirigir a la página principal si es un usuario regular
        }
      }
    } catch (error) {
      setErrores([error.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-black">Iniciar Sesión</h1>
      <p>Para crear un pedido debes iniciar sesión</p>

      <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
      <form onSubmit={handleSubmit}>
        {errores ? errores.map((error,i) => <Alerta key={i}>{error}</Alerta>) : null}
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
              ref={emailRef}
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
              ref={passwordRef}
            />
          </div>
          <input
            type="submit"
            value={loading ? "Cargando..." : "Iniciar Sesión"}
            className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
            disabled={loading}
          />
        </form>
      </div>
      <nav className="mt-5">
        <Link to="/registro">¿No tienes cuenta? Crea una</Link>
      </nav>
    </>
  );
}
