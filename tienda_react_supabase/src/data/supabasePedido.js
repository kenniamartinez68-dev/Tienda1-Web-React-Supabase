import { supabase } from "../data/supabaseClient";

export const saveOrder = async (pedido, total, userId) => {
    try {
      const { data, error } = await supabase
        .from('pedido')  // Asegúrate de que esta sea la tabla correcta
        .insert([
          {
            pedido: JSON.stringify(pedido),  // Guardar el pedido como JSON
            total: total,
            user_id: userId, // Guardar el id del usuario
            fecha: new Date().toISOString(),
          },
        ]);
  
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al guardar el pedido:', error.message);
      return { success: false, message: error.message };
    }
  };
  export const getOrdersByUserId = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('pedido')  // Asegúrate de que esta sea la tabla correcta
        .select('*')
        .eq('user_id', userId)
        .order('fecha', { ascending: false });  // Ordenar por fecha, de más reciente a más antiguo
  
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener los pedidos:', error.message);
      return { success: false, message: error.message };
    }
  };
  export const getAllOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('pedido')
        .select(`
          *,
          usuario:user_id (nombre) 
        `) 
        .eq('estado', 1)
        .order('fecha', { ascending: false });  // Ordenar por fecha, de más reciente a más antiguo
  
      if (error) throw error;
  
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener todos los pedidos:', error.message);
      return { success: false, message: error.message };
    }
  };

  // Método para actualizar el estado del pedido
export const updateOrderStatus = async (orderId, estado) => {
  try {
    const { data, error } = await supabase
      .from('pedido')  // Asegúrate de que esta sea la tabla correcta
      .update({ estado: estado })  // Actualiza el estado a 2
      .eq('id', orderId);  // Filtrar por el ID del pedido que se va a actualizar

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error.message);
    return { success: false, message: error.message };
  }
};

