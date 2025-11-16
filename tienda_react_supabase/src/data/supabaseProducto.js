import { supabase } from "../data/supabaseClient";

export const registerProduct = async (idCategoria, nombre, precio, imagenFile, estado) => {
    try {
      // Subir la imagen a Supabase Storage
      const fileName = `${Date.now()}-${imagenFile.name}`; // Nombre único para evitar colisiones
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from("categorias") // Bucket donde almacenarás la imagen
        .upload(`imagenes/${fileName}`, imagenFile);
  
      if (storageError) {
        throw new Error(`Error subiendo la imagen: ${storageError.message}`);
      }
  
      // Obtener la URL pública de la imagen subida
      const { data: publicData, error: urlError } = supabase
        .storage
        .from("categorias")
        .getPublicUrl(`imagenes/${fileName}`);
  
      if (urlError) {
        throw new Error(`Error obteniendo la URL pública: ${urlError.message}`);
      }
  
      const publicURL = publicData.publicUrl;
  
      // Insertar los datos del producto en la base de datos
      const { data: insertData, error: dbError } = await supabase
        .from("producto") // Tabla de productos
        .insert([
          {
            idCategoria,
            nombre,
            precio,
            imagen: publicURL, // Guardamos la URL pública de la imagen
            estado,
          },
        ]);
  
      if (dbError) {
        throw new Error(
          `Error insertando en la base de datos: ${dbError.message || "Error desconocido"}`
        );
      }
  
      return { success: true }; // Éxito al subir el producto
    } catch (error) {
      console.error("Error en registerProduct:", error.message);
      return { success: false, message: error.message }; // Retornar el error
    }
  };
  
  export const getProduct = async (idCategoria) => {
    try {
      // Hacer una consulta a la tabla 'producto' filtrando por 'idCategoria'
      const { data, error } = await supabase
        .from("producto") // Nombre de la tabla donde están almacenados los datos
        .select("id, idCategoria, nombre, precio, imagen, estado") // Seleccionamos las columnas que necesitamos
        .eq("idCategoria", idCategoria); // Filtramos por la categoría
  
      if (error) {
        throw new Error(`Error obteniendo los productos: ${error.message}`);
      }
  
      return { success: true, data }; // Retornamos los productos filtrados
    } catch (error) {
      console.error("Error en getProduct:", error.message);
      return { success: false, message: error.message }; // Retornamos el error en caso de que ocurra
    }
  };
  
  

  export const deleteProduct = async (id) => {
    try {
      // Obtener el registro del producto para obtener la imagen
      const { data: producto, error: fetchError } = await supabase
        .from("producto")
        .select("imagen")
        .eq("id", id)
        .single();
  
      if (fetchError) {
        throw new Error(`Error obteniendo el producto: ${fetchError.message}`);
      }
  
      const imagePath = producto.imagen.split("/").pop(); // Obtener el nombre del archivo
  
      // Eliminar la imagen del bucket
      const { error: storageError } = await supabase.storage
        .from("categorias")
        .remove([`imagenes/${imagePath}`]);
  
      if (storageError) {
        throw new Error(`Error eliminando la imagen del bucket: ${storageError.message}`);
      }
  
      // Eliminar el producto de la base de datos
      const { error: dbError } = await supabase
        .from("producto")
        .delete()
        .eq("id", id);
  
      if (dbError) {
        throw new Error(`Error eliminando de la base de datos: ${dbError.message}`);
      }
  
      return { success: true }; // Éxito al eliminar el producto y la imagen
    } catch (error) {
      console.error("Error en deleteProduct:", error.message);
      return { success: false, message: error.message }; // Retornar el error
    }
  };
  
  export const updateProduct = async (id, idCategoria, nuevoNombre, nuevoPrecio, nuevaImagenFile, estado) => {
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
          throw new Error(`Error subiendo la nueva imagen: ${storageError.message}`);
        }
  
        // Obtener la URL pública de la nueva imagen subida
        const { data: publicData, error: urlError } = supabase.storage
          .from("categorias")
          .getPublicUrl(`imagenes/${fileName}`);
  
        if (urlError) {
          throw new Error(`Error obteniendo la URL pública de la nueva imagen: ${urlError.message}`);
        }
  
        publicURL = publicData.publicUrl;
  
        // Eliminar la imagen anterior
        const { data: producto, error: fetchError } = await supabase
          .from("producto")
          .select("imagen")
          .eq("id", id)
          .single();
  
        if (fetchError) {
          throw new Error(`Error obteniendo el producto: ${fetchError.message}`);
        }
  
        const oldImagePath = producto.imagen.split("/").pop(); // Obtener el nombre del archivo
        await supabase.storage
          .from("categorias")
          .remove([`imagenes/${oldImagePath}`]);
      }
  
      // Actualizar el producto en la base de datos
      const { error: dbError } = await supabase
        .from("producto")
        .update({
          idCategoria,
          nombre: nuevoNombre,
          precio: nuevoPrecio,
          ...(publicURL && { imagen: publicURL }), // Solo actualiza la imagen si se proporciona una nueva
          estado:estado
        })
        .eq("id", id);
  
      if (dbError) {
        throw new Error(`Error actualizando en la base de datos: ${dbError.message}`);
      }
  
      return { success: true }; // Éxito al actualizar el producto
    } catch (error) {
      console.error("Error en updateProduct:", error.message);
      console.log(id)
      return { success: false, message: error.message }; // Retornar el error
    }
  };

  export const getCategoriasSinImagen = async () => {
    try {
      // Hacer una consulta a la tabla 'categoria' para obtener los registros
      const { data, error } = await supabase
        .from("categoria") // Nombre de la tabla donde están almacenados los datos
        .select("id, nombre"); // Seleccionamos únicamente las columnas 'id' y 'nombre'
  
      if (error) {
        throw new Error(`Error obteniendo las categorías: ${error.message}`);
      }
  
      return { success: true, data }; // Retornamos los datos obtenidos (id y nombre)
    } catch (error) {
      console.error("Error en getCategorias:", error.message);
      return { success: false, message: error.message }; // Retornamos el error en caso de que ocurra
    }
  };
  
  