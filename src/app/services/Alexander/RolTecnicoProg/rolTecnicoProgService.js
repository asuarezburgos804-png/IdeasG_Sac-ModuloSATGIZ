import axios from "axios";
import environment from "@/config/enviroment";

// Usar la URL del backend desde environment.js
const BASE_URL = `${environment.url_backend}/urbano/tecnico`;

/**
 * Servicio para la programación de técnicos verificadores
 */
export const rolTecnicoProgService = {
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
      
      
      
      // Verificar diferentes estructuras de respuesta
      if (response.data?.success && Array.isArray(response.data.data)) {
        console.log('Datos encontrados en response.data.data:', response.data.data.length);
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        console.log('Respuesta es un array directo:', response.data.length);
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        console.log('Datos en propiedad data:', response.data.data.length);
        return response.data.data;
      } else {
        console.log('Estructura de respuesta no reconocida, retornando array vacío');
        return [];
      }
    } catch (error) {
      console.error('Error al buscar expedientes:', error);
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return [];
    }
  },

  /**
   * Programar verificación técnica
   * @param {string} idExpediente - ID del expediente
   * @param {Object} datosProgramacion - Datos de programación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  /**
   * Crear nueva programación de verificación técnica
   * @param {Object} datosProgramacion - Datos de la programación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async crearProgramacion(datosProgramacion) {
    try {
      
      const response = await axios.post(
        `${BASE_URL}/programacion`,
        datosProgramacion
      );
      
      
      
      // Si la respuesta tiene status 201 (Created), consideramos éxito
      if (response.status === 201) {
        return response.data;
      }
      
      // Si no hay success en la respuesta pero el status es 200-299, también es éxito
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Error al crear programación');
    } catch (error) {
      console.error('Error al crear programación:', error);
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  /**
   * Obtener todas las programaciones
   * @returns {Promise<Array>} Lista de programaciones
   */
  async obtenerTodasProgramaciones() {
    try {
      const response = await axios.get(`${BASE_URL}/programacion`);
      
      if (response.status >= 200 && response.status < 300) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error al obtener programaciones:', error);
      return [];
    }
  },

  /**
   * Obtener programaciones por técnico
   * @param {number} idTecnico - ID del técnico
   * @returns {Promise<Array>} Lista de programaciones del técnico
   */
  async obtenerProgramacionesPorTecnico(idTecnico) {
    try {
      const response = await axios.get(`${BASE_URL}/programacion/tecnico/${idTecnico}`);
      
      if (response.status >= 200 && response.status < 300) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error al obtener programaciones del técnico:', error);
      return [];
    }
  },

  /**
   * Actualizar programación existente
   * @param {number} idProgramacion - ID de la programación
   * @param {Object} datosActualizados - Datos a actualizar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async actualizarProgramacion(idProgramacion, datosActualizados) {
    try {
      const response = await axios.put(
        `${BASE_URL}/programacion/${idProgramacion}`,
        datosActualizados
      );
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al actualizar programación');
    } catch (error) {
      console.error('Error al actualizar programación:', error);
      throw error;
    }
  },

  /**
   * Eliminar programación (eliminación lógica)
   * @param {number} idProgramacion - ID de la programación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async eliminarProgramacion(idProgramacion) {
    try {
      const response = await axios.delete(`${BASE_URL}/programacion/${idProgramacion}`);
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al eliminar programación');
    } catch (error) {
      console.error('Error al eliminar programación:', error);
      throw error;
    }
  },

  /**
   * Programar verificación (método legacy - mantener compatibilidad)
   * @param {string} idExpediente - ID del expediente
   * @param {Object} datosProgramacion - Datos de programación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async programarVerificacion(idExpediente, datosProgramacion) {
    try {
      // Usar el nuevo endpoint de creación con los datos mapeados
      const datosNuevos = {
        id_expediente: idExpediente,
        id_tecnico: datosProgramacion.id_tecnico_programador,
        d_fecha_verificacion: datosProgramacion.d_fecha_programacion,
        t_hora_verificacion: datosProgramacion.c_hora_programacion + ':00' // Agregar segundos
      };
      
      return await this.crearProgramacion(datosNuevos);
    } catch (error) {
      console.error('Error al programar verificación:', error);
      throw error;
    }
  },

  /**
   * Obtener programaciones existentes de un expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Array>} Lista de programaciones
   */
  /**
   * Obtener programaciones por expediente (método legacy - mantener compatibilidad)
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Array>} Lista de programaciones
   */
  async obtenerProgramaciones(idExpediente) {
    try {
      // Obtener todas las programaciones y filtrar por expediente
      const todasProgramaciones = await this.obtenerTodasProgramaciones();
      return todasProgramaciones.filter(prog => prog.id_expediente === idExpediente);
    } catch (error) {
      console.error('Error al obtener programaciones:', error);
      return [];
    }
  },

  /**
   * Mapear datos de expediente API a formato local
   * @param {Array} expedientesAPI - Expedientes de la API
   * @returns {Array} Expedientes en formato local
   */
  mapearExpedientesDesdeAPI(expedientesAPI) {
    
    
    if (!expedientesAPI || !Array.isArray(expedientesAPI)) {
      
      return [];
    }

    const mapeados = expedientesAPI.map(exp => {
      const expedienteMapeado = {
        id: exp.id_expediente || exp.id || '',
        nroExp: exp.expediente || exp.nroExp || '',
        dni: exp.dni || '',
        administrado: exp.administrado || exp.nombre_completo || '',
        fecha_registro: exp.fecha_registro || '',
        // Estos campos vendrían de programaciones adicionales
        estadoVerif: exp.estadoVerif || "", // Por defecto vacío
        fechaVerificacion: exp.fechaVerificacion || "" // Por defecto vacío
      };
      
      
      return expedienteMapeado;
    });

    
    return mapeados;
  },

  /**
   * Mapear datos de programación para API
   * @param {string} fecha - Fecha de programación (YYYY-MM-DD)
   * @param {string} hora - Hora de programación (HH:MM)
   * @param {number} idTecnico - ID del técnico
   * @param {string} observaciones - Observaciones opcionales
   * @returns {Object} Datos estructurados para la API
   */
  mapearProgramacionParaAPI(fecha, hora, idTecnico, observaciones = '') {
    return {
      d_fecha_programacion: fecha,
      c_hora_programacion: hora,
      id_tecnico_programador: idTecnico,
      c_observaciones: observaciones,
      d_fecha_creacion: new Date().toISOString()
    };
  },

  /**
   * Validar datos de programación
   * @param {string} fecha - Fecha de programación
   * @param {string} hora - Hora de programación
   * @returns {Object} Resultado de la validación
   */
  validarProgramacion(fecha, hora) {
    const errores = [];

    if (!fecha) {
      errores.push('La fecha es obligatoria');
    } else {
      const fechaProgramacion = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaProgramacion < hoy) {
        errores.push('La fecha no puede ser anterior al día actual');
      }
    }

    if (!hora) {
      errores.push('La hora es obligatoria');
    } else {
      const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horaRegex.test(hora)) {
        errores.push('El formato de hora debe ser HH:MM');
      }
    }

    return {
      valido: errores.length === 0,
      errores
    };
  },

  /**
   * Formatear fecha para mostrar en la interfaz
   * @param {string} fechaISO - Fecha en formato ISO
   * @returns {string} Fecha formateada (DD/MM/YYYY)
   */
  formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    
    return `${dia}/${mes}/${año}`;
  },

  /**
   * Obtener programaciones activas del técnico
   * @param {number} idTecnico - ID del técnico
   * @returns {Promise<Array>} Lista de programaciones activas
   */
  /**
   * Obtener programaciones por técnico (método legacy - mantener compatibilidad)
   * @param {number} idTecnico - ID del técnico
   * @returns {Promise<Array>} Lista de programaciones
   */
  async obtenerProgramacionesTecnico(idTecnico) {
    try {
      return await this.obtenerProgramacionesPorTecnico(idTecnico);
    } catch (error) {
      console.error('Error al obtener programaciones del técnico:', error);
      return [];
    }
  },

  /**
   * Cancelar programación
   * @param {string} idProgramacion - ID de la programación
   * @param {string} motivo - Motivo de la cancelación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  /**
   * Cancelar programación (método legacy - mantener compatibilidad)
   * @param {number} idProgramacion - ID de la programación
   * @param {string} motivo - Motivo de la cancelación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async cancelarProgramacion(idProgramacion, motivo) {
    try {
      // Usar eliminación lógica o actualizar estado a inactivo
      const datosActualizados = {
        b_activo: false
      };
      
      return await this.actualizarProgramacion(idProgramacion, datosActualizados);
    } catch (error) {
      console.error('Error al cancelar programación:', error);
      throw error;
    }
  },

  /**
   * Mapear programación para API según nueva estructura
   * @param {string} fecha - Fecha de programación (YYYY-MM-DD)
   * @param {string} hora - Hora de programación (HH:MM)
   * @param {number} idTecnico - ID del técnico
   * @param {string} observaciones - Observaciones opcionales
   * @returns {Object} Datos estructurados para la API
   */
  mapearProgramacionParaAPI(fecha, hora, idTecnico, observaciones = '') {
    return {
      id_expediente: '', // Debe ser proporcionado por el componente
      id_tecnico: idTecnico,
      d_fecha_verificacion: fecha,
      t_hora_verificacion: hora + ':00', // Agregar segundos al formato HH:MM:SS
      observaciones: observaciones
    };
  },

  /**
   * Mapear datos de programación desde API a formato local
   * @param {Object} programacionAPI - Datos de la API
   * @returns {Object} Programación en formato local
   */
  mapearProgramacionDesdeAPI(programacionAPI) {
    if (!programacionAPI) return null;

    return {
      id: programacionAPI.id_programacion,
      id_expediente: programacionAPI.id_expediente,
      id_tecnico: programacionAPI.id_tecnico,
      fecha_verificacion: programacionAPI.d_fecha_verificacion,
      hora_verificacion: programacionAPI.t_hora_verificacion?.substring(0, 5) || '', // HH:MM
      fecha_creacion: programacionAPI.d_fecha_creacion,
      activo: programacionAPI.b_activo,
      expediente: programacionAPI.tu_expediente,
      tecnico: programacionAPI.tecnicoProgramacion
    };
  },

  /**
   * Validar datos de programación según nueva estructura
   * @param {string} idExpediente - ID del expediente
   * @param {string} fecha - Fecha de programación
   * @param {string} hora - Hora de programación
   * @param {number} idTecnico - ID del técnico
   * @returns {Object} Resultado de la validación
   */
  validarProgramacionCompleta(idExpediente, fecha, hora, idTecnico) {
    const errores = [];

    if (!idExpediente) {
      errores.push('El ID del expediente es obligatorio');
    }

    if (!fecha) {
      errores.push('La fecha es obligatoria');
    } else {
      const fechaProgramacion = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaProgramacion < hoy) {
        errores.push('La fecha no puede ser anterior al día actual');
      }
    }

    if (!hora) {
      errores.push('La hora es obligatoria');
    } else {
      const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horaRegex.test(hora)) {
        errores.push('El formato de hora debe ser HH:MM');
      }
    }

    if (!idTecnico) {
      errores.push('El ID del técnico es obligatorio');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }
};

export default rolTecnicoProgService;