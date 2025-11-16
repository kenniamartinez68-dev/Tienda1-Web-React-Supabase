import { supabase } from "../data/supabaseClient";
// Función para obtener todos los usuarios de la tabla `usuario`
export const getAllUsers = async () => {
    try {
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre, email, rol");
  
      if (error) {
        throw new Error(`Error obteniendo los productos: ${error.message}`);
      }
      return { success: true, data }; 
    } catch (error) {
      console.error("Error en getAllUsers:", error.message);
      return { success: false, message: error.message }; // Retornamos el error en caso de que ocurra
    }
  };
 