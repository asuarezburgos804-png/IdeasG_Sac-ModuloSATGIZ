import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

/**
 * Servicio para gestionar datos urbanos de declaraciones juradas
 */
export class DatosUrbanoDeclaracionJuradaService {

  /**
   * Obtener todos los datos urbanos
   * @returns {Promise<Array>} Lista de datos urbanos
   */
  static async obtenerDatosUrbanos() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada`);
      if (!response.ok) {
        throw new Error(`Error al obtener datos urbanos: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      throw error;
    }
  }

  /**
   * Obtener dato urbano por ID
   * @param {number} id - ID del dato urbano
   * @returns {Promise<Object>} Datos del registro urbano
   */
  static async obtenerDatosUrbanosPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada/id/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener dato urbano: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  }

  /**
   * Buscar datos urbanos por uso del predio
   * @param {string} usoPredio - Uso del predio urbano
   * @returns {Promise<Array>} Lista de datos urbanos del uso especificado
   */
  static async obtenerPorUsoPredio(usoPredio) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada/uso/${usoPredio}`);
      if (!response.ok) {
        throw new Error(`Error al buscar por uso del predio: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorUsoPredio:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo dato urbano
   * @param {Object} datoUrbanoData - Datos del registro urbano
   * @returns {Promise<Object>} Dato urbano creado
   */
  static async crear(datoUrbanoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datoUrbanoData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear dato urbano: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  }

  /**
   * Actualizar dato urbano existente
   * @param {number} id - ID del dato urbano a actualizar
   * @param {Object} datoUrbanoData - Datos actualizados del registro urbano
   * @returns {Promise<Object>} Dato urbano actualizado
   */
  static async actualizar(id, datoUrbanoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datoUrbanoData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar dato urbano: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  }

  /**
   * Eliminar dato urbano
   * @param {number} id - ID del dato urbano a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async eliminar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar dato urbano: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  }

  /**
   * Obtener promedio del área total de terreno
   * @returns {Promise<Object>} Promedio del área total
   */
  static async obtenerPromedioAreaTotal() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/datos_urbano_declaracion_jurada/consulta/promedio_area`);
      if (!response.ok) {
        throw new Error(`Error al obtener promedio del área: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPromedioAreaTotal:', error);
      throw error;
    }
  }

  /**
   * Validar datos del registro urbano antes de enviar
   * @param {Object} data - Datos del registro urbano a validar
   * @returns {Object} Objeto con isValid y errors
   */
  static validarDatoUrbano(data) {
    const errors = {};

    // Validar campos obligatorios
    if (!data.c_uso_predio_urbano || data.c_uso_predio_urbano.trim() === '') {
      errors.c_uso_predio_urbano = 'El uso del predio urbano es obligatorio';
    } else if (data.c_uso_predio_urbano.length > 50) {
      errors.c_uso_predio_urbano = 'El uso del predio urbano no puede exceder 50 caracteres';
    }

    if (!data.c_estado_predio || data.c_estado_predio.trim() === '') {
      errors.c_estado_predio = 'El estado del predio es obligatorio';
    } else if (data.c_estado_predio.length > 50) {
      errors.c_estado_predio = 'El estado del predio no puede exceder 50 caracteres';
    }

    if (!data.c_tipo_predio || data.c_tipo_predio.trim() === '') {
      errors.c_tipo_predio = 'El tipo de predio es obligatorio';
    } else if (data.c_tipo_predio.length > 20) {
      errors.c_tipo_predio = 'El tipo de predio no puede exceder 20 caracteres';
    }

    if (!data.c_condicion_predio || data.c_condicion_predio.trim() === '') {
      errors.c_condicion_predio = 'La condición del predio es obligatoria';
    } else if (data.c_condicion_predio.length > 50) {
      errors.c_condicion_predio = 'La condición del predio no puede exceder 50 caracteres';
    }

    // Validar campos numéricos
    if (!data.n_area_total_terreno || data.n_area_total_terreno <= 0) {
      errors.n_area_total_terreno = 'El área total del terreno es obligatoria y debe ser mayor a 0';
    } else if (data.n_area_total_terreno > 999999.99) {
      errors.n_area_total_terreno = 'El área total del terreno no puede exceder 999999.99';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default DatosUrbanoDeclaracionJuradaService;
