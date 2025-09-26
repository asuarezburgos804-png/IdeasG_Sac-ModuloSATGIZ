import axios from "axios";
import environment from "@/config/enviroment";

const BASE_URL = `${environment.url_backend}/urbano/tecnico`;

/**
 * Servicio para la gestión de requisitos técnicos
 */
export const requisitosService = {
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
   * Obtener requisitos técnicos de un expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Object>} Datos de requisitos técnicos
   */
  async obtenerRequisitos(idExpediente) {
    try {
      const response = await axios.get(`${BASE_URL}/requisitos/${idExpediente}`);

      if (response.status >= 200 && response.status < 300) {
        // La respuesta ahora tiene estructura { success, data, message }
        if (response.data.success) {
          return response.data.data; // Devolver solo los datos
        } else {
          // Si no existe, devolver null (no es un error)
          return null;
        }
      }
      return null;
    } catch (error) {
      // Si es error 404 (no encontrado), es normal, devolver null
      if (error.response && error.response.status === 404) {
        console.log('Requisitos no encontrados para el expediente:', idExpediente);
        return null;
      }
      console.error('Error al obtener requisitos:', error);
      throw error;
    }
  },

  /**
   * Crear o actualizar requisitos técnicos
   * @param {string} idExpediente - ID del expediente
   * @param {Object} datos - Datos de requisitos técnicos
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async guardarRequisitos(idExpediente, datos) {
    try {
      const response = await axios.post(
        `${BASE_URL}/requisitos/${idExpediente}`,
        datos
      );

      if (response.status >= 200 && response.status < 300) {
        // La respuesta ahora tiene estructura { success, data, message }
        if (response.data.success) {
          return response.data;
        } else {
          throw new Error(response.data.message || 'Error al guardar requisitos');
        }
      }
      throw new Error(response.data.message || 'Error al guardar requisitos');
    } catch (error) {
      console.error('Error al guardar requisitos:', error);
      throw error;
    }
  },

  /**
   * Mapear requisitos locales a estructura de API
   * @param {Array} requisitos - Requisitos del formulario
   * @param {string} tipoFormulario - Tipo de formulario (FUE/FUHU)
   * @param {number} idTecnico - ID del técnico verificador
   * @returns {Object} Datos estructurados para la API
   */
  mapearDatosParaAPI(requisitos, tipoFormulario, idTecnico) {
    // Mapeo de requisitos según la documentación
    const requisitosMapeados = {
      // Requisito 1: Fue/Fuhu (tipo de formulario)
      tipoFormulario: tipoFormulario,
      
      // Requisito 2: Copia literal de dominio
      2: {
        b_copia_literal_dominio: this.obtenerEstadoBooleano(requisitos, 2),
        c_observaciones_copia_literal: this.obtenerObservacion(requisitos, 2)
      },
      
      // Requisito 3: Propietario
      3: {
        b_propietario: this.obtenerEstadoBooleano(requisitos, 3),
        c_observaciones_propietario: this.obtenerObservacion(requisitos, 3)
      },
      
      // Requisito 4: Documento que acredite el derecho para edificar
      4: {
        b_documento_derecho_edificar: this.obtenerEstadoBooleano(requisitos, 4),
        c_observaciones_documento_derecho: this.obtenerObservacion(requisitos, 4)
      },
      
      // Requisito 5: Poder de representación
      5: {
        b_poder_representacion: this.obtenerEstadoBooleano(requisitos, 5),
        c_observaciones_poder_representacion: this.obtenerObservacion(requisitos, 5)
      },
      
      // Requisito 6: Boleta de habilidad profesional
      6: {
        b_boleta_habilidad_profesional: this.obtenerEstadoBooleano(requisitos, 6),
        c_observaciones_boleta_habilidad: this.obtenerObservacion(requisitos, 6)
      }
    };

    return {
      c_tipo_formulario: requisitosMapeados.tipoFormulario,
      ...requisitosMapeados[2],
      ...requisitosMapeados[3],
      ...requisitosMapeados[4],
      ...requisitosMapeados[5],
      ...requisitosMapeados[6],
      d_fecha_verificacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      id_tecnico_verificador: idTecnico
    };
  },

  /**
   * Mapear datos de API a requisitos locales
   * @param {Object} datosAPI - Datos de la API
   * @returns {Object} Requisitos en formato local
   */
  mapearDatosDesdeAPI(datosAPI) {
    if (!datosAPI) return null;

    return {
      tipoFormulario: datosAPI.c_tipo_formulario || 'FUE',
      requisitos: [
        {
          id: 1,
          nombre: "Fue",
          estado: datosAPI.c_tipo_formulario === 'FUE' ? 'Si cumple' : 'No cumple',
          observacion: ''
        },
        {
          id: 2,
          nombre: "Copia literal de dominio expedida por la SUNARP",
          estado: datosAPI.b_copia_literal_dominio ? 'Si cumple' : 'No cumple',
          observacion: datosAPI.c_observaciones_copia_literal || ''
        },
        {
          id: 3,
          nombre: "Propietario",
          estado: datosAPI.b_propietario ? 'Si cumple' : 'No cumple',
          observacion: datosAPI.c_observaciones_propietario || ''
        },
        {
          id: 4,
          nombre: "Documento que acredite el derecho para edificar",
          estado: datosAPI.b_documento_derecho_edificar ? 'Si cumple' : 'No cumple',
          observacion: datosAPI.c_observaciones_documento_derecho || ''
        },
        {
          id: 5,
          nombre: "Poder de representación en caso de Personas Jurídicas",
          estado: datosAPI.b_poder_representacion ? 'Si cumple' : 'No cumple',
          observacion: datosAPI.c_observaciones_poder_representacion || ''
        },
        {
          id: 6,
          nombre: "Boleta de habilidad profesional (declaraciones juradas)",
          estado: datosAPI.b_boleta_habilidad_profesional ? 'Si cumple' : 'No cumple',
          observacion: datosAPI.c_observaciones_boleta_habilidad || ''
        }
      ]
    };
  },

  /**
   * Obtener estado booleano de un requisito
   * @param {Array} requisitos - Lista de requisitos
   * @param {number} id - ID del requisito
   * @returns {boolean} Estado booleano
   */
  obtenerEstadoBooleano(requisitos, id) {
    const requisito = requisitos.find(req => req.id === id);
    if (!requisito) return false;
    
    return requisito.estado === 'Si cumple';
  },

  /**
   * Obtener observación de un requisito
   * @param {Array} requisitos - Lista de requisitos
   * @param {number} id - ID del requisito
   * @returns {string} Observación
   */
  obtenerObservacion(requisitos, id) {
    const requisito = requisitos.find(req => req.id === id);
    return requisito?.observacion || '';
  },

  /**
   * Validar que todos los requisitos estén completos
   * @param {Array} requisitos - Lista de requisitos
   * @returns {Object} Resultado de la validación
   */
  validarRequisitos(requisitos) {
    const errores = [];

    if (!requisitos || requisitos.length === 0) {
      errores.push('No hay requisitos para validar');
      return { valido: false, errores };
    }

    requisitos.forEach(requisito => {
      if (requisito.estado === '' || requisito.estado === '-') {
        errores.push(`El requisito "${requisito.nombre}" no está completo`);
      }
    });

    return {
      valido: errores.length === 0,
      errores
    };
  },

  /**
   * Determinar el tipo de formulario basado en los requisitos
   * @param {Array} requisitos - Lista de requisitos
   * @returns {string} Tipo de formulario (FUE/FUHU)
   */
  determinarTipoFormulario(requisitos) {
    // Por defecto FUE, pero se puede implementar lógica específica
    return 'FUE';
  },

  /**
   * Generar resumen de verificación
   * @param {Array} requisitos - Lista de requisitos
   * @returns {Object} Resumen de la verificación
   */
  generarResumen(requisitos) {
    const total = requisitos.length;
    const cumplidos = requisitos.filter(req => req.estado === 'Si cumple').length;
    const noCumplidos = requisitos.filter(req => req.estado === 'No cumple').length;
    const pendientes = requisitos.filter(req => req.estado === '' || req.estado === '-').length;

    return {
      total,
      cumplidos,
      noCumplidos,
      pendientes,
      porcentajeCumplimiento: total > 0 ? Math.round((cumplidos / total) * 100) : 0
    };
  }
};

export default requisitosService;