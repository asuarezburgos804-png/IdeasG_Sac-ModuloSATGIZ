import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

export class DatosComplementariosUrbanoDeclaracionJuradaService {
  // ✅ Obtener todos los registros
  async getDatosComplementarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada`);
      if (!response.ok) {
        throw new Error(`Error al obtener datos complementarios urbanos: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getDatosComplementarios:', error);
      throw error;
    }
  }

  // ✅ Obtener registro por ID
  async getDatoComplementarioById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada/search_by_id/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener dato complementario: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getDatoComplementarioById:', error);
      throw error;
    }
  }

  // ✅ Buscar por tipo de servicio (agua, luz, desagüe)
  async getDatosByServicio(servicio, valor) {
    try {
      if (!["c_agua", "c_luz", "c_desague"].includes(servicio)) {
        throw new Error("Servicio no válido. Use 'c_agua', 'c_luz' o 'c_desague'.");
      }

      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada/servicio/${servicio}/${valor}`);
      if (!response.ok) {
        throw new Error(`Error al buscar datos por servicio: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getDatosByServicio:', error);
      throw error;
    }
  }

  // ✅ Crear nuevo registro
  async postDatoComplementario({
    c_agua,
    c_num_suministro_agua,
    c_luz,
    c_num_suministro_luz,
    c_desague,
    c_num_suministro_desague,
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          c_agua,
          c_num_suministro_agua,
          c_luz,
          c_num_suministro_luz,
          c_desague,
          c_num_suministro_desague,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear dato complementario: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en postDatoComplementario:', error);
      throw error;
    }
  }

  // ✅ Actualizar registro por ID
  async putDatoComplementarioById(id, {
    c_agua,
    c_num_suministro_agua,
    c_luz,
    c_num_suministro_luz,
    c_desague,
    c_num_suministro_desague,
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          c_agua,
          c_num_suministro_agua,
          c_luz,
          c_num_suministro_luz,
          c_desague,
          c_num_suministro_desague,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar dato complementario: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en putDatoComplementarioById:', error);
      throw error;
    }
  }

  // ✅ Eliminar registro por ID
  async deleteDatoComplementarioById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar dato complementario: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en deleteDatoComplementarioById:', error);
      throw error;
    }
  }

  // (Opcional) ✅ Contar cuántos predios tienen agua/luz/desagüe
  async getConteoServicios() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_complementarios_urbano_declaracion_jurada/consulta/conteo_servicios`);
      if (!response.ok) {
        throw new Error(`Error al obtener conteo de servicios: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getConteoServicios:', error);
      throw error;
    }
  }
}
