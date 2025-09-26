import axios from "axios";
import environment from "@/config/enviroment";

const BASE_URL = `${environment.url_backend}/urbano/tecnico`;

/**
 * Servicio para la gestión de parámetros urbanísticos y edificatorios
 */
export const parametrosUrbanisticosService = {
  /**
   * Obtener parámetros urbanísticos por expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Object>} Datos de parámetros urbanísticos
   */
  async obtenerParametros(idExpediente) {
    try {
      
      const response = await axios.get(`${BASE_URL}/parametros-urbanisticos/${idExpediente}`);

      

      if (response.status >= 200 && response.status < 300) {
        // Si la respuesta es exitosa, devolver los datos
        return response.data;
      }
      return null; // Si no existe, retornar null
    } catch (error) {
      // Si es error 404 (no encontrado), es normal, devolver null
      if (error.response && error.response.status === 404) {
        
        return null;
      }
      console.error('Error al obtener parámetros urbanísticos:', error);
      if (error.response) {
        console.error('Status del error:', error.response.status);
        console.error('Datos del error:', error.response.data);
      }
      return null;
    }
  },

  /**
   * Crear o actualizar parámetros urbanísticos
   * @param {string} idExpediente - ID del expediente
   * @param {Object} datos - Datos de parámetros urbanísticos
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async guardarParametros(idExpediente, datos) {
    try {
      

      const response = await axios.post(
        `${BASE_URL}/parametros-urbanisticos/${idExpediente}`,
        datos
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al guardar parámetros');
    } catch (error) {
      console.error('Error al guardar parámetros urbanísticos:', error);
      if (error.response) {
        console.error('Status del error:', error.response.status);
        console.error('Datos del error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Mapear datos locales a estructura de API para parámetros urbanísticos
   * @param {Object} datosFrontend - Datos del formulario frontend
   * @param {number} idTecnico - ID del técnico verificador
   * @returns {Object} Datos estructurados para la API
   */
  mapearDatosParaAPI(datosFrontend, idTecnico) {
    return {
      b_es_urbanistico: datosFrontend.b_es_urbanistico !== undefined ? datosFrontend.b_es_urbanistico : true,
      n_area_territorial: parseFloat(datosFrontend.areaTerritorial) || 0,
      n_area_act_urb: parseFloat(datosFrontend.areaActUrb) || 0,
      c_area_territorial: datosFrontend.areaTerritorial || '',
      c_area_act_urb: datosFrontend.areaActUrb || '',
      c_zonificacion: datosFrontend.zonificacion || '',
      n_area_lote_normativo: parseFloat(datosFrontend.areaLoteNormativo) || 0,
      // Campos para parámetros edificatorios
      c_usos_permisibles_normado: datosFrontend.usosPermisiblesNormado || '',
      c_usos_permisibles_proyecto: datosFrontend.usosPermisiblesProyecto || '',
      c_usos_permisibles_anotaciones: datosFrontend.usosPermisiblesAnotaciones || '',
      n_coeficiente_edif_normado: parseFloat(datosFrontend.coeficienteEdifNormado) || 0,
      n_coeficiente_edif_proyecto: parseFloat(datosFrontend.coeficienteEdifProyecto) || 0,
      c_coeficiente_edif_normado: datosFrontend.coeficienteEdifNormado || '',
      c_coeficiente_edif_proyecto: datosFrontend.coeficienteEdifProyecto || '',
      c_coeficiente_edif_anotaciones: datosFrontend.coeficienteEdifAnotaciones || '',
      n_porcentaje_area_libre_normado: parseFloat(datosFrontend.porcentajeAreaLibreNormado) || 0,
      n_porcentaje_area_libre_proyecto: parseFloat(datosFrontend.porcentajeAreaLibreProyecto) || 0,
      c_porcentaje_area_libre_normado: datosFrontend.porcentajeAreaLibreNormado || '',
      c_porcentaje_area_libre_proyecto: datosFrontend.porcentajeAreaLibreProyecto || '',
      c_porcentaje_area_libre_anotaciones: datosFrontend.porcentajeAreaLibreAnotaciones || '',
      n_altura_edificacion_normado: parseFloat(datosFrontend.alturaEdificacionNormado) || 0,
      n_altura_edificacion_proyecto: parseFloat(datosFrontend.alturaEdificacionProyecto) || 0,
      c_altura_edificacion_normado: datosFrontend.alturaEdificacionNormado || '',
      c_altura_edificacion_proyecto: datosFrontend.alturaEdificacionProyecto || '',
      c_altura_edificacion_anotaciones: datosFrontend.alturaEdificacionAnotaciones || '',
      n_retiro_minimo_frontal_normado: parseFloat(datosFrontend.retiroMinimoFrontalNormado) || 0,
      n_retiro_minimo_frontal_proyecto: parseFloat(datosFrontend.retiroMinimoFrontalProyecto) || 0,
      c_retiro_minimo_frontal_normado: datosFrontend.retiroMinimoFrontalNormado || '',
      c_retiro_minimo_frontal_proyecto: datosFrontend.retiroMinimoFrontalProyecto || '',
      c_retiro_minimo_frontal_anotaciones: datosFrontend.retiroMinimoFrontalAnotaciones || '',
      c_alineamiento_normado: datosFrontend.alineamientoNormado || '',
      c_alineamiento_proyecto: datosFrontend.alineamientoProyecto || '',
      c_alineamiento_anotaciones: datosFrontend.alineamientoAnotaciones || '',
      n_estacionamiento_normado: parseFloat(datosFrontend.estacionamientoNormado) || 0,
      n_estacionamiento_proyecto: parseFloat(datosFrontend.estacionamientoProyecto) || 0,
      c_estacionamiento_normado: datosFrontend.estacionamientoNormado || '',
      c_estacionamiento_proyecto: datosFrontend.estacionamientoProyecto || '',
      c_estacionamiento_anotaciones: datosFrontend.estacionamientoAnotaciones || '',
      id_tecnico_verificador: idTecnico
    };
  },

  /**
   * Mapear datos de API a estructura local
   * @param {Object} datosAPI - Datos de la API
   * @returns {Object} Datos en formato local
   */
  mapearDatosDesdeAPI(datosAPI) {
    if (!datosAPI) return null;

    

    return {
      areaTerritorial: datosAPI.c_area_territorial || (datosAPI.n_area_territorial || 0).toString(),
      areaActUrb: datosAPI.c_area_act_urb || (datosAPI.n_area_act_urb || 0).toString(),
      zonificacion: datosAPI.c_zonificacion || '',
      areaLoteNormativo: (datosAPI.n_area_lote_normativo || 0).toString(),
      // Campos para parámetros edificatorios
      usosPermisiblesNormado: datosAPI.c_usos_permisibles_normado || '',
      usosPermisiblesProyecto: datosAPI.c_usos_permisibles_proyecto || '',
      usosPermisiblesAnotaciones: datosAPI.c_usos_permisibles_anotaciones || '',
      coeficienteEdifNormado: datosAPI.c_coeficiente_edif_normado || (datosAPI.n_coeficiente_edif_normado || 0).toString(),
      coeficienteEdifProyecto: datosAPI.c_coeficiente_edif_proyecto || (datosAPI.n_coeficiente_edif_proyecto || 0).toString(),
      coeficienteEdifAnotaciones: datosAPI.c_coeficiente_edif_anotaciones || '',
      porcentajeAreaLibreNormado: datosAPI.c_porcentaje_area_libre_normado || (datosAPI.n_porcentaje_area_libre_normado || 0).toString(),
      porcentajeAreaLibreProyecto: datosAPI.c_porcentaje_area_libre_proyecto || (datosAPI.n_porcentaje_area_libre_proyecto || 0).toString(),
      porcentajeAreaLibreAnotaciones: datosAPI.c_porcentaje_area_libre_anotaciones || '',
      alturaEdificacionNormado: datosAPI.c_altura_edificacion_normado || (datosAPI.n_altura_edificacion_normado || 0).toString(),
      alturaEdificacionProyecto: datosAPI.c_altura_edificacion_proyecto || (datosAPI.n_altura_edificacion_proyecto || 0).toString(),
      alturaEdificacionAnotaciones: datosAPI.c_altura_edificacion_anotaciones || '',
      retiroMinimoFrontalNormado: datosAPI.c_retiro_minimo_frontal_normado || (datosAPI.n_retiro_minimo_frontal_normado || 0).toString(),
      retiroMinimoFrontalProyecto: datosAPI.c_retiro_minimo_frontal_proyecto || (datosAPI.n_retiro_minimo_frontal_proyecto || 0).toString(),
      retiroMinimoFrontalAnotaciones: datosAPI.c_retiro_minimo_frontal_anotaciones || '',
      alineamientoNormado: datosAPI.c_alineamiento_normado || '',
      alineamientoProyecto: datosAPI.c_alineamiento_proyecto || '',
      alineamientoAnotaciones: datosAPI.c_alineamiento_anotaciones || '',
      estacionamientoNormado: datosAPI.c_estacionamiento_normado || (datosAPI.n_estacionamiento_normado || 0).toString(),
      estacionamientoProyecto: datosAPI.c_estacionamiento_proyecto || (datosAPI.n_estacionamiento_proyecto || 0).toString(),
      estacionamientoAnotaciones: datosAPI.c_estacionamiento_anotaciones || ''
    };
  },

  /**
   * Validar datos antes de enviar
   * @param {Object} datos - Datos a validar
   * @returns {Object} Resultado de la validación
   */
  validarDatos(datos) {
    const errores = [];

    // Validar que los campos numéricos sean números válidos
    const camposNumericos = ['areaTerritorial', 'areaActUrb', 'areaLoteNormativo'];
    
    camposNumericos.forEach(campo => {
      const valor = datos[campo];
      if (valor && isNaN(parseFloat(valor))) {
        errores.push(`El campo "${campo}" debe ser un número válido`);
      }
      
      if (valor && parseFloat(valor) < 0) {
        errores.push(`El campo "${campo}" no puede ser negativo`);
      }
    });

    // Validar que la zonificación no esté vacía
    if (!datos.zonificacion || datos.zonificacion.trim() === '') {
      errores.push('La zonificación es requerida');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  },

  /**
   * Formatear datos para mostrar en el frontend
   * @param {Object} datos - Datos numéricos
   * @returns {Object} Datos formateados con unidades
   */
  formatearDatosParaVisualizacion(datos) {
    if (!datos) return null;

    return {
      // Parámetros urbanísticos básicos
      areaTerritorial: `${datos.areaTerritorial || '0'} m²`,
      areaActUrb: `${datos.areaActUrb || '0'} m²`,
      zonificacion: datos.zonificacion || '',
      areaLoteNormativo: `${datos.areaLoteNormativo || '0'} m²`,
      
      // Parámetros edificatorios
      usosPermisiblesNormado: datos.usosPermisiblesNormado || '',
      usosPermisiblesProyecto: datos.usosPermisiblesProyecto || '',
      usosPermisiblesAnotaciones: datos.usosPermisiblesAnotaciones || '',
      coeficienteEdifNormado: datos.coeficienteEdifNormado || '',
      coeficienteEdifProyecto: datos.coeficienteEdifProyecto || '',
      coeficienteEdifAnotaciones: datos.coeficienteEdifAnotaciones || '',
      porcentajeAreaLibreNormado: datos.porcentajeAreaLibreNormado || '',
      porcentajeAreaLibreProyecto: datos.porcentajeAreaLibreProyecto || '',
      porcentajeAreaLibreAnotaciones: datos.porcentajeAreaLibreAnotaciones || '',
      alturaEdificacionNormado: datos.alturaEdificacionNormado || '',
      alturaEdificacionProyecto: datos.alturaEdificacionProyecto || '',
      alturaEdificacionAnotaciones: datos.alturaEdificacionAnotaciones || '',
      retiroMinimoFrontalNormado: datos.retiroMinimoFrontalNormado || '',
      retiroMinimoFrontalProyecto: datos.retiroMinimoFrontalProyecto || '',
      retiroMinimoFrontalAnotaciones: datos.retiroMinimoFrontalAnotaciones || '',
      alineamientoNormado: datos.alineamientoNormado || '',
      alineamientoProyecto: datos.alineamientoProyecto || '',
      alineamientoAnotaciones: datos.alineamientoAnotaciones || '',
      estacionamientoNormado: datos.estacionamientoNormado || '',
      estacionamientoProyecto: datos.estacionamientoProyecto || '',
      estacionamientoAnotaciones: datos.estacionamientoAnotaciones || '',
      
      // Campo tipo
      b_es_urbanistico: datos.b_es_urbanistico !== undefined ? datos.b_es_urbanistico : true
    };
  },

  /**
   * Limpiar formato de datos (quitar unidades)
   * @param {Object} datos - Datos con unidades
   * @returns {Object} Datos sin unidades
   */
  limpiarFormatoDatos(datos) {
    if (!datos) return null;

    return {
      // Parámetros urbanísticos básicos (limpiar unidades)
      areaTerritorial: datos.areaTerritorial?.replace(' m²', '') || '',
      areaActUrb: datos.areaActUrb?.replace(' m²', '') || '',
      zonificacion: datos.zonificacion || '',
      areaLoteNormativo: datos.areaLoteNormativo?.replace(' m²', '') || '',
      
      // Parámetros edificatorios (mantener como están)
      usosPermisiblesNormado: datos.usosPermisiblesNormado || '',
      usosPermisiblesProyecto: datos.usosPermisiblesProyecto || '',
      usosPermisiblesAnotaciones: datos.usosPermisiblesAnotaciones || '',
      coeficienteEdifNormado: datos.coeficienteEdifNormado || '',
      coeficienteEdifProyecto: datos.coeficienteEdifProyecto || '',
      coeficienteEdifAnotaciones: datos.coeficienteEdifAnotaciones || '',
      porcentajeAreaLibreNormado: datos.porcentajeAreaLibreNormado || '',
      porcentajeAreaLibreProyecto: datos.porcentajeAreaLibreProyecto || '',
      porcentajeAreaLibreAnotaciones: datos.porcentajeAreaLibreAnotaciones || '',
      alturaEdificacionNormado: datos.alturaEdificacionNormado || '',
      alturaEdificacionProyecto: datos.alturaEdificacionProyecto || '',
      alturaEdificacionAnotaciones: datos.alturaEdificacionAnotaciones || '',
      retiroMinimoFrontalNormado: datos.retiroMinimoFrontalNormado || '',
      retiroMinimoFrontalProyecto: datos.retiroMinimoFrontalProyecto || '',
      retiroMinimoFrontalAnotaciones: datos.retiroMinimoFrontalAnotaciones || '',
      alineamientoNormado: datos.alineamientoNormado || '',
      alineamientoProyecto: datos.alineamientoProyecto || '',
      alineamientoAnotaciones: datos.alineamientoAnotaciones || '',
      estacionamientoNormado: datos.estacionamientoNormado || '',
      estacionamientoProyecto: datos.estacionamientoProyecto || '',
      estacionamientoAnotaciones: datos.estacionamientoAnotaciones || '',
      
      // Campo tipo
      b_es_urbanistico: datos.b_es_urbanistico !== undefined ? datos.b_es_urbanistico : true
    };
  },

  /**
   * Extraer solo valores numéricos de los datos
   * @param {Object} datos - Datos con formato
   * @returns {Object} Datos numéricos
   */
  extraerValoresNumericos(datos) {
    if (!datos) return null;

    return {
      areaTerritorial: parseFloat(datos.areaTerritorial?.replace(' m²', '')) || 0,
      areaActUrb: parseFloat(datos.areaActUrb?.replace(' m²', '')) || 0,
      zonificacion: datos.zonificacion || '',
      areaLoteNormativo: parseFloat(datos.areaLoteNormativo?.replace(' m²', '')) || 0
    };
  }
};

export default parametrosUrbanisticosService;