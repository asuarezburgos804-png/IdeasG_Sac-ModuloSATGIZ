import axios from "axios";
import environment from "@/config/enviroment";

const BASE_URL = `${environment.url_backend}/urbano/tecnico`;

/**
 * Servicio para la verificación de cuadro de áreas
 */
export const verificacionCuadroAreaService = {
  /**
   * Obtener expediente por número de expediente
   * @param {string} numeroExpediente - Número de expediente (ej: "2011")
   * @returns {Promise<Object>} Datos del expediente con ID
   */
  async obtenerExpedientePorNumero(numeroExpediente) {
    try {
      const response = await axios.get(`${BASE_URL}/expediente-por-numero/${numeroExpediente}`);
      
      if (response.status >= 200 && response.status < 300) {
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Expediente no encontrado');
        }
      }
      throw new Error('Error al obtener expediente');
    } catch (error) {
      console.error('Error al obtener expediente por número:', error);
      throw error;
    }
  },

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
   * Obtener verificación de cuadro de área de un expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Object>} Datos de verificación de cuadro de área
   */
  async obtenerVerificacion(idExpediente) {
    try {
      const response = await axios.get(`${BASE_URL}/verificacion-cuadro-area/${idExpediente}`);

      if (response.status >= 200 && response.status < 300) {
        // Devolver la respuesta completa, sin verificar success
        return response.data;
      }
      return null;
    } catch (error) {
      // Si es error 404 (no encontrado), es normal, devolver null
      if (error.response && error.response.status === 404) {
        
        return null;
      }
      console.error('Error al obtener verificación de cuadro de área:', error);
      throw error;
    }
  },

  /**
   * Obtener solo detalles de pisos
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Array>} Lista de detalles de pisos
   */
  async obtenerDetallesPisos(idExpediente) {
    try {
      const response = await axios.get(`${BASE_URL}/verificacion-cuadro-area/${idExpediente}/detalles-pisos`);
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      return []; // Si no existe, retorna array vacío
    } catch (error) {
      console.error('Error al obtener detalles de pisos:', error);
      return [];
    }
  },

  /**
   * Crear o actualizar verificación de cuadro de área
   * @param {string} idExpediente - ID del expediente
   * @param {Object} datos - Datos de verificación de cuadro de área
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async guardarVerificacion(idExpediente, datos) {
    try {
      const response = await axios.post(
        `${BASE_URL}/verificacion-cuadro-area/${idExpediente}`,
        datos
      );
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al guardar verificación');
    } catch (error) {
      console.error('Error al guardar verificación de cuadro de área:', error);
      throw error;
    }
  },

  /**
   * Mapear datos locales a estructura de API para cuadro de áreas
   * @param {Array} pisos - Pisos del formulario
   * @param {number} idTecnico - ID del técnico verificador
   * @param {string} observacionesGenerales - Observaciones generales
   * @returns {Object} Datos estructurados para la API
   */
  mapearDatosParaAPI(pisos, idTecnico, observacionesGenerales = '') {
    // Calcular totales
    const totales = {
      n_area_existente_total: 0,
      n_area_ampliacion_total: 0,
      n_area_nueva_total: 0,
      n_area_demolicion_total: 0,
      n_area_remodelacion_total: 0
    };

    // Mapear detalles de pisos
    const detallesPisos = pisos.map(piso => {
      const existente = parseFloat(piso.existente) || 0;
      const ampliacion = parseFloat(piso.ampliacion) || 0;
      const nuevo = parseFloat(piso.nuevo) || 0;
      const demolicion = parseFloat(piso.demolicion) || 0;
      const remodelacion = parseFloat(piso.remodelacion) || 0;

      // Acumular totales
      totales.n_area_existente_total += existente;
      totales.n_area_ampliacion_total += ampliacion;
      totales.n_area_nueva_total += nuevo;
      totales.n_area_demolicion_total += demolicion;
      totales.n_area_remodelacion_total += remodelacion;

      return {
        c_numero_piso: `Piso ${piso.numero}`,
        n_area_existente: existente,
        n_area_ampliacion: ampliacion,
        n_area_nueva: nuevo,
        n_area_demolicion: demolicion,
        n_area_remodelacion: remodelacion,
        c_observaciones_piso: piso.observacion || ''
      };
    });

    return {
      ...totales,
      c_observaciones_generales: observacionesGenerales,
      d_fecha_verificacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      id_tecnico_verificador: idTecnico,
      detallesPisos
    };
  },

  /**
   * Mapear datos de API a estructura local
   * @param {Object} datosAPI - Datos de la API
   * @returns {Object} Datos en formato local
   */
  mapearDatosDesdeAPI(datosAPI) {
    if (!datosAPI) return null;

    // Verificar si la respuesta viene en data (estructura del backend)
    const datos = datosAPI.data || datosAPI;

    

    // Mapear detalles de pisos
    const pisos = datos.detallesPisos?.map((piso, index) => {
      
      return {
        id: piso.id_detalle || piso.id_detalle_cuadro_area || index + 1,
        numero: parseInt(piso.c_numero_piso?.replace('Piso ', '')) || index + 1,
        existente: (piso.n_existente_m2 || piso.n_area_existente || 0).toString(),
        ampliacion: (piso.n_ampliacion_m2 || piso.n_area_ampliacion || 0).toString(),
        nuevo: (piso.n_nuevo_m2 || piso.n_area_nueva || 0).toString(),
        demolicion: (piso.n_demolicion_m2 || piso.n_area_demolicion || 0).toString(),
        remodelacion: (piso.n_remodelacion_m2 || piso.n_area_remodelacion || 0).toString(),
        observacion: piso.c_observaciones || piso.c_observaciones_piso || ''
      };
    }) || [];

    

    return {
      totales: {
        existente: datos.n_total_existente || datos.n_area_existente_total || 0,
        ampliacion: datos.n_total_ampliacion || datos.n_area_ampliacion_total || 0,
        nuevo: datos.n_total_nuevo || datos.n_area_nueva_total || 0,
        demolicion: datos.n_total_demolicion || datos.n_area_demolicion_total || 0,
        remodelacion: datos.n_total_remodelacion || datos.n_area_remodelacion_total || 0
      },
      observacionesGenerales: datos.c_observaciones_generales || '',
      fechaVerificacion: datos.d_fecha_verificacion,
      idTecnico: datos.id_tecnico_verificador,
      pisos
    };
  },

  /**
   * Validar datos de pisos antes de enviar
   * @param {Array} pisos - Pisos a validar
   * @returns {Object} Resultado de la validación
   */
  validarPisos(pisos) {
    const errores = [];

    if (!pisos || pisos.length === 0) {
      errores.push('Debe agregar al menos un piso');
      return { valido: false, errores };
    }

    pisos.forEach((piso, index) => {
      const numeroPiso = piso.numero || index + 1;

      // Validar que los campos numéricos sean números válidos
      const camposNumericos = ['existente', 'ampliacion', 'nuevo', 'demolicion', 'remodelacion'];
      
      camposNumericos.forEach(campo => {
        const valor = piso[campo];
        if (valor && isNaN(parseFloat(valor))) {
          errores.push(`Piso ${numeroPiso}: El campo "${campo}" debe ser un número válido`);
        }
        
        if (valor && parseFloat(valor) < 0) {
          errores.push(`Piso ${numeroPiso}: El campo "${campo}" no puede ser negativo`);
        }
      });

      // Validar que al menos un área tenga valor mayor a 0
      const tieneAreas = camposNumericos.some(campo => {
        const valor = parseFloat(piso[campo]) || 0;
        return valor > 0;
      });

      if (!tieneAreas && !piso.observacion) {
        errores.push(`Piso ${numeroPiso}: Debe ingresar al menos un área o una observación`);
      }
    });

    return {
      valido: errores.length === 0,
      errores
    };
  },

  /**
   * Calcular totales de áreas
   * @param {Array} pisos - Pisos para calcular totales
   * @returns {Object} Totales calculados
   */
  calcularTotales(pisos) {
    const totales = {
      existente: 0,
      ampliacion: 0,
      nuevo: 0,
      demolicion: 0,
      remodelacion: 0
    };

    pisos.forEach(piso => {
      totales.existente += parseFloat(piso.existente) || 0;
      totales.ampliacion += parseFloat(piso.ampliacion) || 0;
      totales.nuevo += parseFloat(piso.nuevo) || 0;
      totales.demolicion += parseFloat(piso.demolicion) || 0;
      totales.remodelacion += parseFloat(piso.remodelacion) || 0;
    });

    return totales;
  }
};

export default verificacionCuadroAreaService;