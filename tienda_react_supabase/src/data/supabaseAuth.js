import { supabase } from "../data/supabaseClient";

// Función para obtener el rol del usuario después de iniciar sesión
export const getUserRole = async (email) => {
  const { data, error } = await supabase
    .from('usuario')
    .select('rol')
    .eq('email', email)
    .single(); // Obtener solo un resultado
  return { data, error };
};

export const signInWithEmail = async (email, password) => {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) return { data: null, error: signInError };

  // Obtener el rol del usuario después de iniciar sesión
  const { data: roleData, error: roleError } = await getUserRole(email);
  
  if (roleError) return { data: null, error: roleError };

  // Devolver el rol junto con los datos de inicio de sesión
  return { data: { ...signInData, role: roleData.rol }, error: null };
};
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user };
};
export const signOut = async () => {
  const result = await supabase.auth.signOut();
  return result;
};
// Método para registrar al usuario
export const registerUser = async (
  nombre,
  email,
  password
) => {
  // Verificar si el correo electrónico ya existe
  const { data: existingUserEmail, error: emailError } = await supabase
    .from("usuario")
    .select("email")
    .eq("email", email)
    .single();

  if (emailError && emailError.code !== "PGRST116") {
    // Manejar cualquier error inesperado
    throw new Error(emailError.message);
  }

  if (existingUserEmail) {
    throw new Error("Este correo electrónico ya está registrado.");
  }

  // Verificar si el nombre de usuario ya existe
  const { data: existingUserName, error: nameError } = await supabase
    .from("usuario")
    .select("nombre")
    .eq("nombre", nombre)
    .single();

  if (nameError && nameError.code !== "PGRST116") {
    // Manejar cualquier error inesperado
    throw new Error(nameError.message);
  }

  if (existingUserName) {
    throw new Error("Este nombre de usuario ya está en uso.");
  }

  // Registrar al usuario en Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Error al registrar el usuario en Auth:", error.message);
    throw new Error(error.message);
  }

  // Almacenar la información adicional en la tabla `usuario`
  const { user } = data;
  const rol= 2;
  const { error: dbError } = await supabase.from("usuario").insert([
    {
      id: user.id,
      nombre,
      rol,
      email,
    },
  ]);

  if (dbError) {
    console.error(
      "Error al guardar la información del usuario en la base de datos:",
      dbError.message
    );
    throw new Error(dbError.message);
  }

  return { user };
};
export const getUserName = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No user is logged in");
  }

  // Consultar la tabla `usuario` para obtener el nombre del usuario
  const { data, error } = await supabase
    .from("usuario")
    .select("nombre")
    .eq("id", user.id)
    .single(); // Usamos .single() para asegurarnos de que solo se devuelva un registro

  if (error) {
    console.error("Error al obtener el nombre del usuario:", error.message);
    throw new Error(error.message);
  }

  return data?.nombre; // Retorna el nombre del usuario
};
