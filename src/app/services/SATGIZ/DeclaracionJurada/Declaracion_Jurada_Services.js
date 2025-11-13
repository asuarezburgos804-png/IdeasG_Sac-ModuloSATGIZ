import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

/**
 * Servicio para gestionar declaraciones juradas
 */
export class DeclaracionJuradaService {
  
  /**
   * Obtener todas las declaraciones juradas
   * @returns {Promise<Array>} Lista de declaraciones juradas
   */
  static async obtenerDeclaraciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada`);
      if (!response.ok) {
        throw new Error(`Error al obtener declaraciones juradas: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      throw error;
    }
  }

  /**
   * Obtener declaración jurada por ID
   * @param {number} id - ID de la declaración jurada
   * @returns {Promise<Object>} Datos de la declaración jurada
   */
  static async obtenerDeclaracionesPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada/search_by_id/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener declaración jurada: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  }

  /**
   * Buscar declaraciones juradas por nombre del contribuyente
   * @param {string} nombre - Nombre del contribuyente
   * @returns {Promise<Array>} Lista de declaraciones juradas del contribuyente
   */
  static async obtenerDeclaracionesPorContribuyente(nombre) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada/contribuyente/${nombre}`);
      if (!response.ok) {
        throw new Error(`Error al buscar declaraciones por contribuyente: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorContribuyente:', error);
      throw error;
    }
  }

  /**
   * Buscar declaraciones juradas por tipo de predio
   * @param {string} tipo - Tipo de predio (URBANO/RURAL)
   * @returns {Promise<Array>} Lista de declaraciones juradas del tipo de predio
   */
  static async obtenerDeclaracionesPorTipoPredio(tipo) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada/tipo_predio/${tipo}`);
      if (!response.ok) {
        throw new Error(`Error al buscar declaraciones por tipo de predio: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorTipoPredio:', error);
      throw error;
    }
  }

  /**
   * Crear nueva declaración jurada
   * @param {Object} declaracionData - Datos de la declaración jurada
   * @returns {Promise<Object>} Declaración jurada creada
   */
  static async crearNuevaDeclaracion(declaracionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(declaracionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear declaración jurada: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  }

  /**
   * Actualizar declaración jurada existente
   * @param {number} id - ID de la declaración jurada a actualizar
   * @param {Object} declaracionData - Datos actualizados de la declaración jurada
   * @returns {Promise<Object>} Declaración jurada actualizada
   */
  static async actualizarDeclaracion(id, declaracionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(declaracionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar declaración jurada: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  }

  /**
   * Eliminar declaración jurada
   * @param {number} id - ID de la declaración jurada a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async eliminarDeclaracion(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar declaración jurada: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  }

  /**
   * Obtener consultas personalizadas (conteo por tipo de predio)
   * @returns {Promise<Object>} Resultados de la consulta personalizada
   */
  static async obtenerConteoPorTipoPredio() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/declaracion_jurada/consulta/conteo`);
      if (!response.ok) {
        throw new Error(`Error al obtener consulta personalizada: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerConteoPorTipoPredio:', error);
      throw error;
    }
  }

  /**
   * Validar datos de la declaración jurada antes de enviar
   * @param {Object} data - Datos de la declaración jurada a validar
   * @returns {Object} Objeto con isValid y errors
   */
  static validarDeclaracionJurada(data) {
    const errors = {};

    // Validar campos obligatorios
    if (!data.c_anio_liquidacion || data.c_anio_liquidacion.trim() === '') {
      errors.c_anio_liquidacion = 'El año de liquidación es obligatorio';
    } else if (data.c_anio_liquidacion.length > 4) {
      errors.c_anio_liquidacion = 'El año de liquidación no puede exceder 4 caracteres';
    }

    if (!data.c_num_documento || data.c_num_documento.trim() === '') {
      errors.c_num_documento = 'El número de documento es obligatorio';
    } else if (data.c_num_documento.length > 8) {
      errors.c_num_documento = 'El número de documento no puede exceder 8 caracteres';
    }

    if (!data.c_contribuyente_principal || data.c_contribuyente_principal.trim() === '') {
      errors.c_contribuyente_principal = 'El contribuyente principal es obligatorio';
    } else if (data.c_contribuyente_principal.length > 100) {
      errors.c_contribuyente_principal = 'El contribuyente principal no puede exceder 100 caracteres';
    }

    if (!data.c_tipo_predio || data.c_tipo_predio.trim() === '') {
      errors.c_tipo_predio = 'El tipo de predio es obligatorio';
    } else if (data.c_tipo_predio.length > 20) {
      errors.c_tipo_predio = 'El tipo de predio no puede exceder 20 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default DeclaracionJuradaService;
