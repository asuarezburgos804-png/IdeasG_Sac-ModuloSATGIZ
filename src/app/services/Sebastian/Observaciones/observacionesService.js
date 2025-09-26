import axios from "axios";
import environment from "@/config/enviroment";

const BASE_URL = `${environment.url_backend}/urbano/tecnico`;

/**
 * Servicio para la gestión de observaciones técnicas
 */
export const observacionesService = {
  /**
   * Obtener observaciones por expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Array>} Lista de observaciones
   */
  async obtenerObservaciones(idExpediente) {
    try {
      
      const response = await axios.get(`${BASE_URL}/observaciones/${idExpediente}`);

      

      if (response.status >= 200 && response.status < 300) {
        // El endpoint devuelve directamente un array de observaciones
        if (Array.isArray(response.data)) {
          
          // Extraer solo los textos de las observaciones para el frontend actual
          return response.data.map(obs => obs.c_descripcion_observacion);
        } else if (response.data && Array.isArray(response.data.data)) {
          // Si la respuesta tiene estructura { success, data, message }
          
          return response.data.data.map(obs => obs.c_descripcion_observacion);
        } else {
          console.log('Estructura de respuesta no reconocida, retornando array vacío');
          return [];
        }
      }
      return []; // Si no hay observaciones, retornar array vacío
    } catch (error) {
      // Si es error 404 (no encontrado), es normal, devolver array vacío
      if (error.response && error.response.status === 404) {
        
        return [];
      }
      console.error('Error al obtener observaciones:', error);
      if (error.response) {
        console.error('Status del error:', error.response.status);
        console.error('Datos del error:', error.response.data);
      }
      return [];
    }
  },

  /**
   * Obtener observaciones completas con toda la información
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Array>} Lista de observaciones completas
   */
  async obtenerObservacionesCompletas(idExpediente) {
    try {
      
      const response = await axios.get(`${BASE_URL}/observaciones/${idExpediente}`);

      

      if (response.status >= 200 && response.status < 300) {
        // El endpoint devuelve directamente un array de observaciones
        if (Array.isArray(response.data)) {
         
          return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          // Si la respuesta tiene estructura { success, data, message }
         
          return response.data.data;
        } else {
          console.log('Estructura de respuesta no reconocida, retornando array vacío');
          return [];
        }
      }
      return [];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No se encontraron observaciones para el expediente:', idExpediente);
        return [];
      }
      console.error('Error al obtener observaciones completas:', error);
      if (error.response) {
        console.error('Status del error:', error.response.status);
        console.error('Datos del error:', error.response.data);
      }
      return [];
    }
  },

  /**
   * Crear nueva observación
   * @param {Object} observacionData - Datos de la observación
   * @returns {Promise<Object>} Observación creada
   */
  async crearObservacion(observacionData) {
    try {
      const response = await axios.post(`${BASE_URL}/observaciones`, observacionData);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al crear observación');
    } catch (error) {
      console.error('Error al crear observación:', error);
      throw error;
    }
  },

  /**
   * Actualizar observación existente
   * @param {number} idObservacion - ID de la observación
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} Observación actualizada
   */
  async actualizarObservacion(idObservacion, updates) {
    try {
      const response = await axios.put(
        `${BASE_URL}/observaciones/${idObservacion}`,
        updates
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al actualizar observación');
    } catch (error) {
      console.error('Error al actualizar observación:', error);
      throw error;
    }
  },

  /**
   * Eliminar observación
   * @param {number} idObservacion - ID de la observación
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async eliminarObservacion(idObservacion) {
    try {
      const response = await axios.delete(`${BASE_URL}/observaciones/${idObservacion}`);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al eliminar observación');
    } catch (error) {
      console.error('Error al eliminar observación:', error);
      throw error;
    }
  },

  /**
   * Guardar múltiples observaciones (crear/actualizar/eliminar según corresponda)
   * @param {string} idExpediente - ID del expediente
   * @param {number} idTecnico - ID del técnico
   * @param {Array} observacionesTextos - Array de textos de observaciones
   * @returns {Promise<Object>} Resultado de la operación
   */
  async guardarObservaciones(idExpediente, idTecnico, observacionesTextos) {
    try {
      

      // Obtener observaciones existentes
      const observacionesExistentes = await this.obtenerObservacionesCompletas(idExpediente);
      

      // Filtrar observaciones válidas (no vacías)
      const observacionesValidas = observacionesTextos.filter(texto => texto.trim() !== '');
      
      if (observacionesValidas.length === 0) {
        // Si no hay observaciones válidas, eliminar todas las existentes
        
        const deletePromises = observacionesExistentes.map(obs => 
          this.eliminarObservacion(obs.id_observacion)
        );
        await Promise.all(deletePromises);
        
        return {
          success: true,
          message: 'Todas las observaciones han sido eliminadas'
        };
      }

      // Procesar cada observación
      const requests = [];

      // 1. Actualizar observaciones existentes que coincidan
      observacionesExistentes.forEach(obsExistente => {
        const textoIndex = observacionesValidas.findIndex(
          texto => texto === obsExistente.c_descripcion_observacion
        );

        if (textoIndex !== -1) {
          // La observación existe y coincide, mantenerla
          observacionesValidas.splice(textoIndex, 1); // Remover de la lista de nuevas
        } else {
          // La observación existente no está en las nuevas, eliminarla
          requests.push(this.eliminarObservacion(obsExistente.id_observacion));
        }
      });

      // 2. Crear nuevas observaciones para los textos restantes
      observacionesValidas.forEach(texto => {
        requests.push(
          this.crearObservacion({
            id_expediente: idExpediente,
            id_tecnico: idTecnico,
            c_tipo_observacion: 'GENERAL',
            c_descripcion_observacion: texto.trim(),
            c_seccion_aplicable: 'General'
          })
        );
      });

      // Ejecutar todas las operaciones
      await Promise.all(requests);

      return {
        success: true,
        message: 'Observaciones guardadas correctamente'
      };
    } catch (error) {
      console.error('❌ Error al guardar observaciones:', error);
      return {
        success: false,
        message: error.message || 'Error al guardar observaciones'
      };
    }
  },

  /**
   * Mapear observaciones de API a formato local
   * @param {Array} observacionesAPI - Observaciones de la API
   * @returns {Array} Observaciones en formato local
   */
  mapearObservacionesDesdeAPI(observacionesAPI) {
    if (!observacionesAPI || !Array.isArray(observacionesAPI)) {
      return [];
    }

    return observacionesAPI.map(obs => ({
      id: obs.id_observacion,
      texto: obs.c_descripcion_observacion,
      tipo: obs.c_tipo_observacion,
      seccion: obs.c_seccion_aplicable,
      estado: obs.c_estado_observacion,
      fechaCreacion: obs.d_fecha_creacion,
      fechaResolucion: obs.d_fecha_resolucion,
      tecnico: obs.tecnicoObservacion ? {
        id: obs.tecnicoObservacion.id_tecnico,
        nombre: obs.tecnicoObservacion.c_nombre_tecnico
      } : null
    }));
  },

  /**
   * Validar datos de observación antes de enviar
   * @param {Object} observacionData - Datos de la observación
   * @returns {Object} Resultado de la validación
   */
  validarObservacion(observacionData) {
    const errores = [];

    if (!observacionData.id_expediente) {
      errores.push('El ID del expediente es requerido');
    }

    if (!observacionData.id_tecnico) {
      errores.push('El ID del técnico es requerido');
    }

    if (!observacionData.c_descripcion_observacion || 
        observacionData.c_descripcion_observacion.trim() === '') {
      errores.push('La descripción de la observación es requerida');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }
};

export default observacionesService;