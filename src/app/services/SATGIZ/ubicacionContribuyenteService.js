import environment from "@/config/enviroment";

const API_BASE_URL = environment.url_backend;

/**
 * Servicio para gestionar ubicaciones de contribuyentes
 */
export class UbicacionContribuyenteService {
  
  /**
   * Obtener todas las ubicaciones
   * @returns {Promise<Array>} Lista de ubicaciones
   */
  static async obtenerTodas() {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_contribuyente`);
      if (!response.ok) {
        throw new Error(`Error al obtener ubicaciones: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      throw error;
    }
  }

  /**
   * Obtener ubicación por ID
   * @param {number} id - ID de la ubicación
   * @returns {Promise<Object>} Datos de la ubicación
   */
  static async obtenerPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_contribuyente/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener ubicación: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  }

  /**
   * Obtener ubicaciones por número de documento del contribuyente
   * @param {string} numeroDocumento - Número de documento del contribuyente
   * @returns {Promise<Array>} Lista de ubicaciones del contribuyente
   */
  static async obtenerPorContribuyente(numeroDocumento) {
    try {
      const todasLasUbicaciones = await this.obtenerTodas();
      return todasLasUbicaciones.filter(ubicacion => 
        ubicacion.c_num_documento === numeroDocumento
      );
    } catch (error) {
      console.error('Error en obtenerPorContribuyente:', error);
      throw error;
    }
  }

  /**
   * Crear nueva ubicación
   * @param {Object} ubicacionData - Datos de la ubicación
   * @returns {Promise<Object>} Ubicación creada
   */
  static async crear(ubicacionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_contribuyente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ubicacionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear ubicación: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  }

  /**
   * Actualizar ubicación existente
   * @param {number} id - ID de la ubicación a actualizar
   * @param {Object} ubicacionData - Datos actualizados de la ubicación
   * @returns {Promise<Object>} Ubicación actualizada
   */
  static async actualizar(id, ubicacionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_contribuyente/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ubicacionData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar ubicación: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  }

  /**
   * Eliminar ubicación
   * @param {number} id - ID de la ubicación a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async eliminar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/example/ubicacion_contribuyente/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar ubicación: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  }

  /**
   * Validar datos de la ubicación antes de enviar
   * @param {Object} data - Datos de la ubicación a validar
   * @returns {Object} Objeto con isValid y errors
   */
  static validarUbicacion(data) {
    const errors = {};

    // Validar campos obligatorios
    if (!data.c_num_documento || data.c_num_documento.trim() === '') {
      errors.c_num_documento = 'El número de documento es obligatorio';
    } else if (data.c_num_documento.length > 15) {
      errors.c_num_documento = 'El número de documento no puede exceder 15 caracteres';
    }

    if (!data.c_departamento || data.c_departamento.trim() === '') {
      errors.c_departamento = 'El departamento es obligatorio';
    } else if (data.c_departamento.length > 50) {
      errors.c_departamento = 'El departamento no puede exceder 50 caracteres';
    }

    if (!data.c_provincia || data.c_provincia.trim() === '') {
      errors.c_provincia = 'La provincia es obligatoria';
    } else if (data.c_provincia.length > 50) {
      errors.c_provincia = 'La provincia no puede exceder 50 caracteres';
    }

    if (!data.c_distrito || data.c_distrito.trim() === '') {
      errors.c_distrito = 'El distrito es obligatorio';
    } else if (data.c_distrito.length > 50) {
      errors.c_distrito = 'El distrito no puede exceder 50 caracteres';
    }

    // Validar campos opcionales
    if (data.c_codigo_via && data.c_codigo_via.length > 20) {
      errors.c_codigo_via = 'El código de vía no puede exceder 20 caracteres';
    }

    if (data.c_tipo_via && data.c_tipo_via.length > 50) {
      errors.c_tipo_via = 'El tipo de vía no puede exceder 50 caracteres';
    }

    if (data.c_nombre_via && data.c_nombre_via.length > 50) {
      errors.c_nombre_via = 'El nombre de la vía no puede exceder 50 caracteres';
    }

    if (data.c_nro_municipal && data.c_nro_municipal.length > 20) {
      errors.c_nro_municipal = 'El número municipal no puede exceder 20 caracteres';
    }

    if (data.c_manzana && data.c_manzana.length > 20) {
      errors.c_manzana = 'La manzana no puede exceder 20 caracteres';
    }

    if (data.c_lote && data.c_lote.length > 20) {
      errors.c_lote = 'El lote no puede exceder 20 caracteres';
    }

    if (data.c_sector && data.c_sector.length > 50) {
      errors.c_sector = 'El sector no puede exceder 50 caracteres';
    }

    if (data.c_ubicacion && data.c_ubicacion.length > 100) {
      errors.c_ubicacion = 'La ubicación no puede exceder 100 caracteres';
    }

    if (data.c_zona_predio && data.c_zona_predio.length > 100) {
      errors.c_zona_predio = 'La zona del predio no puede exceder 100 caracteres';
    }

    if (data.c_cod_hu && data.c_cod_hu.length > 20) {
      errors.c_cod_hu = 'El código HU no puede exceder 20 caracteres';
    }

    if (data.c_nombre_habilitacion && data.c_nombre_habilitacion.length > 100) {
      errors.c_nombre_habilitacion = 'El nombre de habilitación no puede exceder 100 caracteres';
    }

    if (data.c_nombre_edificacion && data.c_nombre_edificacion.length > 100) {
      errors.c_nombre_edificacion = 'El nombre de edificación no puede exceder 100 caracteres';
    }

    if (data.c_nro_interior && data.c_nro_interior.length > 20) {
      errors.c_nro_interior = 'El número interior no puede exceder 20 caracteres';
    }

    if (data.c_sub_lote && data.c_sub_lote.length > 20) {
      errors.c_sub_lote = 'El sub lote no puede exceder 20 caracteres';
    }

    if (data.c_grupo_residencial && data.c_grupo_residencial.length > 50) {
      errors.c_grupo_residencial = 'El grupo residencial no puede exceder 50 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Formatear datos de ubicación para mostrar en la interfaz
   * @param {Object} ubicacion - Datos de la ubicación
   * @returns {string} Dirección formateada
   */
  static formatearDireccion(ubicacion) {
    const partes = [];
    
    if (ubicacion.c_tipo_via && ubicacion.c_nombre_via) {
      partes.push(`${ubicacion.c_tipo_via} ${ubicacion.c_nombre_via}`);
    }
    
    if (ubicacion.c_nro_municipal) {
      partes.push(`N° ${ubicacion.c_nro_municipal}`);
    }
    
    if (ubicacion.c_distrito) {
      partes.push(ubicacion.c_distrito);
    }
    
    if (ubicacion.c_provincia) {
      partes.push(ubicacion.c_provincia);
    }
    
    if (ubicacion.c_departamento) {
      partes.push(ubicacion.c_departamento);
    }
    
    return partes.join(', ');
  }
}

export default UbicacionContribuyenteService;