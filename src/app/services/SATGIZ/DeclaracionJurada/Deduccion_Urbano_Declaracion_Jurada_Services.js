import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

/**
 * Servicio para gestionar deducciones urbanas de declaraciones juradas
 */
export class DeduccionUrbanoDeclaracionJuradaService {

  /**
   * Obtener todas las deducciones urbanas
   * @returns {Promise<Array>} Lista de deducciones urbanas
   */
  static async obtenerTodas() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada`);
      if (!response.ok) {
        throw new Error(`Error al obtener deducciones urbanas: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      throw error;
    }
  }

  /**
   * Obtener deducción urbana por ID
   * @param {number} id - ID de la deducción urbana
   * @returns {Promise<Object>} Datos de la deducción urbana
   */
  static async obtenerPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada/search_by_id/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener deducción urbana: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  }

  /**
   * Buscar deducción urbana por descripción
   * @param {string} descripcion - Descripción de la deducción
   * @returns {Promise<Object>} Datos de la deducción urbana
   */
  static async obtenerPorDescripcion(descripcion) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada/descripcion/${descripcion}`);
      if (!response.ok) {
        throw new Error(`Error al buscar deducción por descripción: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorDescripcion:', error);
      throw error;
    }
  }

  /**
   * Obtener conteo de deducciones autorizadas y no autorizadas
   * @returns {Promise<Object>} Conteo de deducciones
   */
  static async obtenerConteoAutorizadas() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada/consulta/conteo`);
      if (!response.ok) {
        throw new Error(`Error al obtener conteo de deducciones: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerConteoAutorizadas:', error);
      throw error;
    }
  }

  /**
   * Crear nueva deducción urbana
   * @param {Object} deduccionData - Datos de la deducción urbana
   * @returns {Promise<Object>} Deducción urbana creada
   */
  static async crearDeduccion(deduccionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deduccionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear deducción urbana: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  }

  /**
   * Actualizar deducción urbana existente
   * @param {number} id - ID de la deducción urbana a actualizar
   * @param {Object} deduccionData - Datos actualizados de la deducción urbana
   * @returns {Promise<Object>} Deducción urbana actualizada
   */
  static async actualizarDeduccion(id, deduccionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deduccionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar deducción urbana: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  }

  /**
   * Eliminar deducción urbana
   * @param {number} id - ID de la deducción urbana a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async eliminarDeduccion(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/deduccion_urbano_declaracion_jurada/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar deducción urbana: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  }

  /**
   * Validar datos de la deducción urbana antes de enviar
   * @param {Object} data - Datos de la deducción urbana a validar
   * @returns {Object} Objeto con isValid y errors
   */
  static validarDeduccionUrbana(data) {
    const errors = {};

    // Validar campos obligatorios
    if (data.c_autorizado === undefined || data.c_autorizado === null) {
      errors.c_autorizado = 'El estado de autorización es obligatorio';
    }

    if (data.c_descripcion_deduccion && data.c_descripcion_deduccion.length > 200) {
      errors.c_descripcion_deduccion = 'La descripción de la deducción no puede exceder 200 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default DeduccionUrbanoDeclaracionJuradaService;
