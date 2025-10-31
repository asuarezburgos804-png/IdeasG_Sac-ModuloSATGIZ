import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

export class UbicacionUrbanoDeclaracionJuradaService {
  
  // ✅ Obtener todas las ubicaciones
  async getUbicaciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada`);
      if (!response.ok) {
        throw new Error(`Error al obtener ubicaciones urbanas: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getUbicaciones:', error);
      throw error;
    }
  }

  // ✅ Obtener una ubicación por ID
  async getUbicacionById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada/search_by_id/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener ubicación urbana: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getUbicacionById:', error);
      throw error;
    }
  }

  // ✅ Buscar ubicación por distrito (ejemplo de búsqueda personalizada)
  async getUbicacionByDistrito(distrito) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada/distrito/${distrito}`);
      if (!response.ok) {
        throw new Error(`Error al buscar ubicación por distrito: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getUbicacionByDistrito:', error);
      throw error;
    }
  }

  // ✅ Consulta personalizada (ejemplo: conteo de registros)
  async getConsultas() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada/consulta/conteo`);
      if (!response.ok) {
        throw new Error(`Error en consulta personalizada: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getConsultas:', error);
      throw error;
    }
  }

  // ✅ Registrar nueva ubicación urbana
  async postUbicacion({
    c_departamento,
    c_provincia,
    c_distrito,
    c_cod_via,
    c_tipo_via,
    c_nombre_via,
    c_arancel,
    c_num_municipal,
    c_manzana_urbana,
    c_lote_urbano,
    c_tipo_denom_urbana,
    c_nombre_denom_urbana,
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          c_departamento,
          c_provincia,
          c_distrito,
          c_cod_via,
          c_tipo_via,
          c_nombre_via,
          c_arancel,
          c_num_municipal,
          c_manzana_urbana,
          c_lote_urbano,
          c_tipo_denom_urbana,
          c_nombre_denom_urbana,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear ubicación urbana: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en postUbicacion:', error);
      throw error;
    }
  }

  // ✅ Actualizar una ubicación urbana por ID
  async putUbicacionById(id, {
    c_departamento,
    c_provincia,
    c_distrito,
    c_cod_via,
    c_tipo_via,
    c_nombre_via,
    c_arancel,
    c_num_municipal,
    c_manzana_urbana,
    c_lote_urbano,
    c_tipo_denom_urbana,
    c_nombre_denom_urbana,
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          c_departamento,
          c_provincia,
          c_distrito,
          c_cod_via,
          c_tipo_via,
          c_nombre_via,
          c_arancel,
          c_num_municipal,
          c_manzana_urbana,
          c_lote_urbano,
          c_tipo_denom_urbana,
          c_nombre_denom_urbana,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar ubicación urbana: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en putUbicacionById:', error);
      throw error;
    }
  }

  // ✅ Eliminar una ubicación urbana por ID
  async deleteUbicacionById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_urbano_declaracion_jurada/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar ubicación urbana: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en deleteUbicacionById:', error);
      throw error;
    }
  }
}
