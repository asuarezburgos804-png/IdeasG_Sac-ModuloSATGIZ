import axios from "axios";
import environment from "@/config/enviroment";

const BASE_URL = `${environment.url_backend}/urbano/tecnico`;

/**
 * Servicio para la verificación administrativa
 */
export const verificacionAdminService = {
  /**
   * Buscar expedientes para técnicos
   * @param {string} busqueda - DNI o nombre del administrado
   * @returns {Promise<Array>} Lista de expedientes
   */
  async buscarExpedientes(busqueda) {
    try {
      const response = await axios.get(`${BASE_URL}/expedientes-tecnico`, {
        params: { busqueda }
      });
      
      if (response.status >= 200 && response.status < 300) {
        // La respuesta tiene la forma { success, data, message }
        return response.data.data; // Devolver el array de expedientes
      }
      throw new Error(response.data.message || 'Error en la búsqueda');
    } catch (error) {
      console.error('Error al buscar expedientes:', error);
      throw error;
    }
  },

  /**
   * Obtener verificación administrativa de un expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Object>} Datos de verificación administrativa
   */
  async obtenerVerificacion(idExpediente) {
    try {
      const response = await axios.get(`${BASE_URL}/verificacion-administrativa/${idExpediente}`);
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      return null; // Si no existe, retorna null
    } catch (error) {
      console.error('Error al obtener verificación administrativa:', error);
      return null;
    }
  },

  /**
   * Crear o actualizar verificación administrativa
   * @param {string} idExpediente - ID del expediente
   * @param {Object} datos - Datos de verificación administrativa
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async guardarVerificacion(idExpediente, datos) {
    try {
      // VALIDACIÓN CRÍTICA: Verificar que idExpediente no sea undefined
      if (!idExpediente || idExpediente === 'undefined') {
        throw new Error('ID de expediente no válido');
      }

      // DEBUG: Verificar la URL que se está construyendo
      const url = `${BASE_URL}/verificacion-administrativa/${idExpediente}`;
      console.log('URL de la petición:', url);
      console.log('BASE_URL:', BASE_URL);
      console.log('Datos enviados:', datos);

      const response = await axios.post(url, datos);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al guardar verificación');
    } catch (error) {
      console.error('Error al guardar verificación administrativa:', error);
      console.error('Detalles del error:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      });
      throw error;
    }
  },

  /**
   * Mapear criterios locales a estructura de API
   * @param {Array} criterios - Criterios del formulario
   * @param {number} idTecnico - ID del técnico verificador
   * @returns {Object} Datos estructurados para la API
   */
  mapearDatosParaAPI(criterios, idTecnico) {
    // Mapeo de criterios según la documentación
    const criteriosMapeados = {
      // Criterio 1: Área, linderos y medidas perimétricas
      1: {
        b_cumple_area_linderos: criterios.find(c => c.id === 1)?.cumple || false,
        c_observaciones_area_linderos: criterios.find(c => c.id === 1)?.observacion || ''
      },
      // Criterio 2: Normas de Diseño del R.N.E.
      2: {
        b_cumple_normas_rne: criterios.find(c => c.id === 2)?.cumple || false,
        c_observaciones_normas_rne: criterios.find(c => c.id === 2)?.observacion || ''
      },
      // Criterio 3: Normas Urbanísticas y/o Edificatorias vigentes
      3: {
        b_cumple_normas_urbanisticas: criterios.find(c => c.id === 3)?.cumple || false,
        c_observaciones_normas_urbanisticas: criterios.find(c => c.id === 3)?.observacion || ''
      },
      // Criterio 4: Otros requisitos administrativos establecidos
      4: {
        b_cumple_otros_requisitos: criterios.find(c => c.id === 4)?.cumple || false,
        c_observaciones_otros_requisitos: criterios.find(c => c.id === 4)?.observacion || ''
      }
    };

    // Determinar si está completo (todos los criterios tienen observaciones o cumplen)
    const completo = criterios.every(c => c.cumple || c.observacion.trim() !== '');

    return {
      ...criteriosMapeados[1],
      ...criteriosMapeados[2],
      ...criteriosMapeados[3],
      ...criteriosMapeados[4],
      d_fecha_verificacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      id_tecnico_verificador: idTecnico,
      b_completo: completo
    };
  },

  /**
   * Mapear datos de API a criterios locales
   * @param {Object} datosAPI - Datos de la API
   * @returns {Array} Criterios en formato local
   */
  mapearDatosDesdeAPI(datosAPI) {
    if (!datosAPI) return null;

    return [
      {
        id: 1,
        criterio: "Área, linderos y medidas perimétricas según documentos de propiedad",
        cumple: datosAPI.b_cumple_area_linderos || false,
        observacion: datosAPI.c_observaciones_area_linderos || ''
      },
      {
        id: 2,
        criterio: "Normas de Diseño del R.N.E.",
        cumple: datosAPI.b_cumple_normas_rne || false,
        observacion: datosAPI.c_observaciones_normas_rne || ''
      },
      {
        id: 3,
        criterio: "Normas Urbanísticas y/o Edificatorias vigentes",
        cumple: datosAPI.b_cumple_normas_urbanisticas || false,
        observacion: datosAPI.c_observaciones_normas_urbanisticas || ''
      },
      {
        id: 4,
        criterio: "Otros requisitos administrativos establecidos",
        cumple: datosAPI.b_cumple_otros_requisitos || false,
        observacion: datosAPI.c_observaciones_otros_requisitos || ''
      }
    ];
  }
};

export default verificacionAdminService;