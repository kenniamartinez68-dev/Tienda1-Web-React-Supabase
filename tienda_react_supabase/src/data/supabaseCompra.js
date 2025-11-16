import { supabase } from "../data/supabaseClient";

export const guardarCompra = async (nombre_comprador, productos,pago,descuento,total,vuelto) => {
  try {
    // Insertar la compra en la tabla 'compra'
    const { data: compra, error: errorCompra } = await supabase
      .from("compra")
      .insert([
        {
          nombre_comprador: nombre_comprador,
          fecha: new Date(),
          total: total,
          pago:pago,
          descuento:descuento,
          vuelto:vuelto,
        },
      ])
      .select();

    if (errorCompra) {
      console.error("Error al insertar la compra:", errorCompra);
      throw new Error("Error al registrar la compra.");
    }

    const compraId = compra[0].id; // Obtener el ID de la compra insertada

    // Insertar cada producto con su cantidad en la tabla 'detalle_compra'
    for (const producto of productos) {
      const { error: errorDetalleCompra } = await supabase
        .from("detalle_compra")
        .insert([
          {
            id_compra: compraId,
            id_producto: producto.producto_id,
            cantidad: producto.cantidad,
          },
        ]);

      if (errorDetalleCompra) {
        console.error("Error al insertar el detalle de compra:", errorDetalleCompra);
        throw new Error("Error al registrar el detalle de la compra.");
      }
    }

    console.log("Compra y detalles de compra guardados correctamente.");
    return { success: true, message: "Compra guardada con éxito." };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getAllProduct = async () => {
  try {
    // Hacer una consulta a la tabla 'producto' filtrando por 'idCategoria'
    const { data, error } = await supabase
      .from("producto") // Nombre de la tabla donde están almacenados los datos
      .select("id, nombre, precio"); // Filtramos por la categoría

    if (error) {
      throw new Error(`Error obteniendo los productos: ${error.message}`);
    }

    return { success: true, data }; // Retornamos los productos filtrados
  } catch (error) {
    console.error("Error en getProduct:", error.message);
    return { success: false, message: error.message }; // Retornamos el error en caso de que ocurra
  }
};
export const getAllCompras = async () => {
  try {
    // Obtener todas las compras
    const { data: compras, error: errorCompras } = await supabase
      .from("compra")
      .select("id, nombre_comprador, fecha, total,pago,descuento,vuelto")
      .order('fecha', { ascending: false }); 

    if (errorCompras) {
      throw new Error(`Error obteniendo las compras: ${errorCompras.message}`);
    }

    // Obtener detalles de cada compra
    const comprasConDetalles = await Promise.all(compras.map(async (compra) => {
      // Obtener detalles de compra
      const { data: detalles, error: errorDetalles } = await supabase
        .from("detalle_compra")
        .select("cantidad, id_producto")
        .eq("id_compra", compra.id); // Filtrar por el ID de la compra

      if (errorDetalles) {
        console.error(`Error obteniendo detalles de compra ${compra.id}:`, errorDetalles);
        return { ...compra, detalles: [] }; // Retornar la compra sin detalles en caso de error
      }

      // Obtener información de productos asociados a los detalles
      const detallesConProductos = await Promise.all(detalles.map(async (detalle) => {
        const { data: producto, error: errorProducto } = await supabase
          .from("producto")
          .select("nombre, precio")
          .eq("id", detalle.id_producto)
          .single(); // Obtener solo un producto por ID

        if (errorProducto) {
          console.error(`Error obteniendo producto ${detalle.id_producto}:`, errorProducto);
          return { cantidad: detalle.cantidad, nombre: null, precio: null }; // Retornar detalles sin producto
        }

        return { cantidad: detalle.cantidad, nombre: producto.nombre, precio: producto.precio };
      }));

      // Retornar la compra con sus detalles
      return { ...compra, detalles: detallesConProductos };
    }));

    return { success: true, data: comprasConDetalles }; // Retornar las compras con detalles
  } catch (error) {
    console.error("Error en getAllCompras:", error.message);
    return { success: false, message: error.message }; // Retornar el error en caso de que ocurra
  }
};
export const eliminarCompra = async (compraId) => {
  try {
    // Eliminar los detalles de la compra en 'detalle_compra' usando el ID de la compra
    const { error: errorEliminarDetalles } = await supabase
      .from("detalle_compra")
      .delete()
      .eq("id_compra", compraId);

    if (errorEliminarDetalles) {
      console.error("Error al eliminar los detalles de la compra:", errorEliminarDetalles);
      throw new Error("Error al eliminar los detalles de la compra.");
    }

    // Eliminar la compra en 'compra' usando el ID de la compra
    const { error: errorEliminarCompra } = await supabase
      .from("compra")
      .delete()
      .eq("id", compraId);

    if (errorEliminarCompra) {
      console.error("Error al eliminar la compra:", errorEliminarCompra);
      throw new Error("Error al eliminar la compra.");
    }

    console.log("Compra y detalles eliminados correctamente.");
    return { success: true, message: "Compra eliminada con éxito." };
    
  } catch (error) {
    console.error("Error en eliminarCompra:", error.message);
    return { success: false, message: error.message };
  }
};

