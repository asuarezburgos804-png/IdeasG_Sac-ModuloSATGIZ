import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

/**
 * Servicio para gestionar contribuyentes
 */
export class ContribuyenteService {
  
  /**
   * Obtener todos los contribuyentes
   * @returns {Promise<Array>} Lista de contribuyentes
   */
  static async obtenerTodos() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/contribuyentes`);
      if (!response.ok) {
        throw new Error(`Error al obtener contribuyentes: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      throw error;
    }
  }

  /**
   * Obtener contribuyente por número de documento
   * @param {string} numeroDocumento - Número de documento del contribuyente
   * @returns {Promise<Object>} Datos del contribuyente
   */
  static async obtenerPorDocumento(numeroDocumento) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/contribuyentes/search_by_id/${numeroDocumento}`);
      if (!response.ok) {
        throw new Error(`Error al obtener contribuyente: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorDocumento:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo contribuyente
   * @param {Object} contribuyenteData - Datos del contribuyente
   * @returns {Promise<Object>} Contribuyente creado
   */
  static async crear(contribuyenteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/contribuyentes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contribuyenteData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear contribuyente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  }

  /**
   * Actualizar contribuyente existente
   * @param {string} numeroDocumento - Número de documento del contribuyente a actualizar
   * @param {Object} contribuyenteData - Datos actualizados del contribuyente
   * @returns {Promise<Object>} Contribuyente actualizado
   */
  static async actualizar(numeroDocumento, contribuyenteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/contribuyentes/${numeroDocumento}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contribuyenteData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar contribuyente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  }

  /**
   * Eliminar contribuyente
   * @param {string} numeroDocumento - Número de documento del contribuyente a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async eliminar(numeroDocumento) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/contribuyentes/${numeroDocumento}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar contribuyente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  }

  /**
   * Validar datos del contribuyente antes de enviar
   * @param {Object} data - Datos del contribuyente a validar
   * @returns {Object} Objeto con isValid y errors
   */
  static validarContribuyente(data) {
    const errors = {};

    // Validar campos obligatorios
    if (!data.c_num_documento || data.c_num_documento.trim() === '') {
      errors.c_num_documento = 'El número de documento es obligatorio';
    } else if (data.c_num_documento.length > 15) {
      errors.c_num_documento = 'El número de documento no puede exceder 15 caracteres';
    }

    if (!data.c_tipo_documento || data.c_tipo_documento.trim() === '') {
      errors.c_tipo_documento = 'El tipo de documento es obligatorio';
    } else if (data.c_tipo_documento.length > 10) {
      errors.c_tipo_documento = 'El tipo de documento no puede exceder 10 caracteres';
    }

    if (!data.c_tipo_contribuyente || data.c_tipo_contribuyente.trim() === '') {
      errors.c_tipo_contribuyente = 'El tipo de contribuyente es obligatorio';
    } else if (data.c_tipo_contribuyente.length > 50) {
      errors.c_tipo_contribuyente = 'El tipo de contribuyente no puede exceder 50 caracteres';
    }

    if (!data.c_nombre || data.c_nombre.trim() === '') {
      errors.c_nombre = 'El nombre es obligatorio';
    } else if (data.c_nombre.length > 100) {
      errors.c_nombre = 'El nombre no puede exceder 100 caracteres';
    }

    // Validar campos opcionales
    if (data.c_condicion_especial && data.c_condicion_especial.length > 50) {
      errors.c_condicion_especial = 'La condición especial no puede exceder 50 caracteres';
    }

    if (data.c_telefono && data.c_telefono.length > 20) {
      errors.c_telefono = 'El teléfono no puede exceder 20 caracteres';
    }

    if (data.c_correo_electronico && data.c_correo_electronico.length > 100) {
      errors.c_correo_electronico = 'El correo electrónico no puede exceder 100 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default ContribuyenteService;