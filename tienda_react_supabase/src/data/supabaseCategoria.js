import { supabase } from "../data/supabaseClient";

export const registerCategorias = async (nombre, imagenFile) => {
  try {
    // Subir la imagen a Supabase Storage
    const fileName = `${Date.now()}-${imagenFile.name}`; // Nombre único para evitar colisiones
    const { data: storageData, error: storageError } = await supabase.storage
      .from("categorias") // Bucket donde almacenarás la imagen
      .upload(`imagenes/${fileName}`, imagenFile);

    if (storageError) {
      throw new Error(`Error subiendo la imagen: ${storageError.message}`);
    }

    // Obtener la URL pública de la imagen subida
    const { data: publicData, error: urlError } = supabase.storage
      .from("categorias")
      .getPublicUrl(`imagenes/${fileName}`);

    if (urlError) {
      throw new Error(`Error obteniendo la URL pública: ${urlError.message}`);
    }

    const publicURL = publicData.publicUrl;

    // Insertar los datos en la tabla de imagen
    const { data: insertData, error: dbError } = await supabase
      .from("categoria")
      .insert([
        {
          nombre,
          imagen: publicURL, // Guardamos la URL pública de la imagen
        },
      ]);

    // Log para ver el error más detallado
    if (dbError) {
      console.error("Detalles del error de Supabase:", dbError);
      throw new Error(
        `Error insertando en la base de datos: ${
          dbError.message || "Error desconocido"
        }`
      );
    }

    return { success: true }; // Éxito al subir la imagen y guardar en la base de datos
  } catch (error) {
    console.error("Error en registerImage:", error.message);
    return { success: false, message: error.message }; // Retornar el error al componente
  }
};
export const getCategorias = async () => {
  try {
    // Hacer una consulta a la tabla 'categoria' para obtener los registros
    const { data, error } = await supabase
      .from("categoria") // Nombre de la tabla donde están almacenados los datos
      .select("id,nombre, imagen"); // Seleccionamos las columnas que necesitamos (nombre e imagen)

    if (error) {
      throw new Error(`Error obteniendo las imágenes: ${error.message}`);
    }

    return { success: true, data }; // Retornamos las imágenes obtenidas
  } catch (error) {
    console.error("Error en getImages:", error.message);
    return { success: false, message: error.message }; // Retornamos el error en caso de que ocurra
  }
};

export const deleteCategorias = async (id) => {
  try {
    // Obtener la categoría y su imagen
    const { data: categoria, error: fetchError } = await supabase
      .from("categoria")
      .select("imagen")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error(`Error obteniendo la categoría: ${fetchError.message}`);

    const imagePath = categoria.imagen.split("/").pop();

    // Eliminar los productos relacionados a esta categoría
    const { error: productError } = await supabase
      .from("producto")
      .delete()
      .eq("idCategoria", id);

    if (productError) throw new Error(`Error eliminando productos relacionados: ${productError.message}`);

    // Eliminar la imagen del bucket
    const { error: storageError } = await supabase.storage
      .from("categorias")
      .remove([`imagenes/${imagePath}`]);

    if (storageError) throw new Error(`Error eliminando la imagen del bucket: ${storageError.message}`);

    // Eliminar la categoría de la base de datos
    const { error: dbError } = await supabase
      .from("categoria")
      .delete()
      .eq("id", id);

    if (dbError) throw new Error(`Error eliminando de la base de datos: ${dbError.message}`);

    return { success: true };
  } catch (error) {
    console.error("Error en deleteCategorias:", error.message);
    return { success: false, message: error.message };
  }
};

export const updateCategorias = async (id, nuevoNombre, nuevaImagenFile) => {
  try {
    // Si se proporciona una nueva imagen, la subimos
    let publicURL = null;
    if (nuevaImagenFile) {
      // Generar un nombre único para la nueva imagen
      const fileName = `${Date.now()}-${nuevaImagenFile.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("categorias")
        .upload(`imagenes/${fileName}`, nuevaImagenFile);

      if (storageError) {
        throw new Error(
          `Error subiendo la nueva imagen: ${storageError.message}`
        );
      }

      // Obtener la URL pública de la nueva imagen subida
      const { data: publicData, error: urlError } = supabase.storage
        .from("categorias")
        .getPublicUrl(`imagenes/${fileName}`);

      if (urlError) {
        throw new Error(
          `Error obteniendo la URL pública de la nueva imagen: ${urlError.message}`
        );
      }

      publicURL = publicData.publicUrl;
    }

    // Actualizar la categoría en la base de datos
    const { error: dbError } = await supabase
      .from("categoria")
      .update({
        nombre: nuevoNombre,
        ...(publicURL && { imagen: publicURL }), // Solo actualiza la imagen si se proporciona una nueva
      })
      .eq("id", id);

    if (dbError) {
      throw new Error(
        `Error actualizando en la base de datos: ${dbError.message}`
      );
    }

    return { success: true }; // Éxito al editar la categoría
  } catch (error) {
    console.error("Error en editImage:", error.message);
    return { success: false, message: error.message }; // Retornar el error
  }
};
