import { supabase } from "../data/supabaseClient";

export const guardarOrden = async (nombreOrden, fecha, productos, total) => {
  try {
    console.log(productos);
    // Insertar el pedido en la tabla "orden"
    const { data: ordenData, error: ordenError } = await supabase
      .from("orden")
      .insert([
        {
          titulo: nombreOrden,
          fecha: fecha,
          total: total,
        },
      ])
      .select("id"); // Obtener el ID del pedido insertado

    if (ordenError) {
      console.error("Error al insertar la orden:", ordenError);
      return { success: false, error: "Error al insertar la orden." };
    }

    const ordenId = ordenData[0].id;

    // Insertar los detalles del pedido en la tabla "producto_orden"
    const detalles = productos.map((producto) => ({
      id_orden: ordenId,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: parseFloat(producto.precio),
      IVA: parseFloat(producto.IVA),
      subtotal: parseFloat(producto.subTotal),
    }));

    const { error: detalleError } = await supabase.from("producto_orden").insert(detalles);
    
    // Si hay un error al insertar los detalles, eliminar la orden
    if (detalleError) {
      console.error("Error al insertar los detalles de la orden:", detalleError);
      await supabase.from("orden").delete().eq("id", ordenId); // Revertir la inserción de la orden
      return { success: false, error: "Error al insertar los detalles de la orden." };
    }

    console.log("Orden guardado con éxito");
    return { success: true, message: "Orden guardado con éxito" };
  } catch (error) {
    console.error("Error inesperado al guardar la orden:", error);
    return { success: false, error: error.message };
  }
};
// Método para obtener todas las órdenes con sus productos asociados
export const obtenerAllOrdenes = async () => {
  try {
    // Primer paso: Obtener todas las órdenes
    const { data: ordenesData, error: ordenesError } = await supabase
      .from("orden")
      .select("*"); // Selecciona todas las columnas de la tabla "orden"

    if (ordenesError) {
      throw new Error(`Error obteniendo las ordenes: ${ordenesError.message}`);
    }
    // Segundo paso: Para cada orden, obtener los productos correspondientes
    const ordenesConProductos = await Promise.all(
      ordenesData.map(async (orden) => {
        // Consultar productos asociados a la orden actual
        const { data: productosData, error: productosError } = await supabase
          .from("producto_orden")
          .select("*")
          .eq("id_orden", orden.id); // Filtra por el ID de la orden actual

        if (productosError) throw productosError;

        // Retorna la orden junto con sus productos
        return {
          ...orden,
          productos: productosData,
        };
      })
    );

    return { success: true, data: ordenesConProductos };
  } catch (error) {
    console.error("Error al obtener las órdenes y productos:", error);
    return { success: false, error: error.message };
  }
};
export const eliminarOrden = async (ordenId) => {
  try {
    // Primero, eliminar los productos asociados a la orden
    const { error: detalleError } = await supabase
      .from("producto_orden")
      .delete()
      .eq("id_orden", ordenId);

    if (detalleError) {
      throw new Error(`Error al eliminar los detalles de la orden: ${detalleError.message}`);
    }

    // Después, eliminar la orden en la tabla "orden"
    const { error: ordenError } = await supabase
      .from("orden")
      .delete()
      .eq("id", ordenId);

    if (ordenError) {
      throw new Error(`Error al eliminar la orden: ${ordenError.message}`);
    }

    console.log("Orden eliminada con éxito");
    return { success: true, message: "Orden eliminada con éxito" };
  } catch (error) {
    console.error("Error al eliminar la orden y sus productos:", error);
    return { success: false, error: error.message };
  }
};
export const editarOrden = async (ordenId, nombreOrden, fecha, productos, total) => {
  try {
    // Actualizar la orden en la tabla "orden"
    const { error: ordenError } = await supabase
      .from("orden")
      .update({
        titulo: nombreOrden,
        fecha: fecha,
        total: total,
      })
      .eq("id", ordenId);

    if (ordenError) {
      throw new Error(`Error al actualizar la orden: ${ordenError.message}`);
    }

    // Eliminar los productos antiguos asociados a la orden
    const { error: detalleError } = await supabase
      .from("producto_orden")
      .delete()
      .eq("id_orden", ordenId);

    if (detalleError) {
      throw new Error(`Error al eliminar productos antiguos de la orden: ${detalleError.message}`);
    }

    // Insertar los productos actualizados en la tabla "producto_orden"
    const detallesActualizados = productos.map((producto) => ({
      id_orden: ordenId,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: parseFloat(producto.precio),
      IVA: parseFloat(producto.IVA),
      subtotal: parseFloat(producto.subTotal),
    }));

    const { error: insertarError } = await supabase
      .from("producto_orden")
      .insert(detallesActualizados);

    if (insertarError) {
      throw new Error(`Error al insertar los productos actualizados: ${insertarError.message}`);
    }

    console.log("Orden y productos actualizados con éxito");
    return { success: true, message: "Orden y productos actualizados con éxito" };
  } catch (error) {
    console.error("Error al actualizar la orden y sus productos:", error);
    return { success: false, error: error.message };
  }
};
