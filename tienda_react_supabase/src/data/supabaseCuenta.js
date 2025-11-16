import { supabase } from "../data/supabaseClient";

export const guardarCuenta = async (id_cliente,nombre_cliente, fechaInicio, fechaFinal, saldo, producto, total) => {
  try {
    // Iniciar la transacción para insertar en `cuenta` y `detalle_cuenta`
    const { data: cuenta, error: cuentaError } = await supabase
      .from("cuenta")
      .insert([
        { id_cliente:id_cliente,
          nombre_cliente:nombre_cliente, 
          fecha_inicio: fechaInicio, 
          fecha_final: fechaFinal, 
          saldo:saldo, 
          total:total,
          abono:0,
          estado:1
        }
      ])
      .select() // Usamos select para obtener el ID de la cuenta recién creada.
      .single(); // single() para obtener un único resultado en vez de un array

    // Verificar si hubo error al guardar la cuenta
    if (cuentaError) {
      throw new Error("Error al guardar la cuenta: " + cuentaError.message);
    }

    // Intentar guardar el detalle_cuenta
    const { error: detalleError } = await supabase
      .from("detalle_cuenta")
      .insert([
        {
          cuenta_id: cuenta.id, // Usa el ID de la cuenta recién creada
          producto_id: producto.producto_id,
          cantidad: producto.cantidad,
          precio_unitario: total // Asegúrate de pasar el precio unitario del producto aquí
        }
      ]);

    // Verificar si hubo error al guardar el detalle
    if (detalleError) {
      // Si hay un error al guardar detalle, lanzar error para deshacer la transacción
      throw new Error("Error al guardar el detalle de la cuenta: " + detalleError.message);
    }

    return { success: true, message: "Cuenta y detalle guardados exitosamente." };
  } catch (error) {
    // Manejo de errores
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const obtenerCuentas = async () => {
  try {
    const { data, error } = await supabase
      .from("cuenta")
      .select("*"); // Seleccionar todas las columnas de la tabla `cuenta`

      if (error) throw error;

    return { success: true, data };
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener todos los cuentas:', error.message);
    return { success: false, message: error.message };
  }
};

export const obtenerDetalleCuenta = async (cuentaId) => {
  try {
    const { data, error } = await supabase
      .from("detalle_cuenta")
      .select(`
        id,
        cuenta_id,
        cuenta(saldo),
        cantidad,
        precio_unitario,
        producto_id,
        producto (
          nombre
        )
      `)
      .eq("cuenta_id", cuentaId); // Filtrar por el ID de la cuenta

    if (error) {
      throw new Error("Error al obtener el detalle de la cuenta: " + error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener el detalle de la cuenta:", error.message);
    return { success: false, message: error.message };
  }
};
