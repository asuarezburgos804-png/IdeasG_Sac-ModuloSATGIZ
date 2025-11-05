import { DeduccionUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Deduccion_Urbano_Declaracion_Jurada_Services";

/**
 * Servicio de deducciones para el módulo de Declaración Jurada de Sebastian
 * Utiliza los servicios de SATGIZ como base
 */
export class DeduccionService {
  
  /**
   * Obtener todas las deducciones disponibles
   * @returns {Promise<Array>} Lista de deducciones
   */
  static async obtenerTodas() {
    try {
      return await DeduccionUrbanoDeclaracionJuradaService.obtenerTodas();
    } catch (error) {
      console.error('Error al obtener deducciones:', error);
      // Fallback a datos estáticos si el servicio SATGIZ falla
      return [
        {
          id: 1,
          c_descripcion_deduccion: "20% Zona de Conservación y Reexención - ASES NO",
          c_autorizado: true,
          c_porcentaje: 20,
          c_tipo: "CONSERVACION"
        },
        {
          id: 2,
          c_descripcion_deduccion: "10% Zona Histórica",
          c_autorizado: true,
          c_porcentaje: 10,
          c_tipo: "HISTORICA"
        },
        {
          id: 3,
          c_descripcion_deduccion: "15% Zona Residencial Especial",
          c_autorizado: true,
          c_porcentaje: 15,
          c_tipo: "RESIDENCIAL"
        },
        {
          id: 4,
          c_descripcion_deduccion: "25% Zona Rural Protegida",
          c_autorizado: true,
          c_porcentaje: 25,
          c_tipo: "RURAL"
        },
        {
          id: 5,
          c_descripcion_deduccion: "NO",
          c_autorizado: false,
          c_porcentaje: 0,
          c_tipo: "NINGUNA"
        }
      ];
    }
  }

  /**
   * Obtener deducción por ID
   * @param {number} id - ID de la deducción
   * @returns {Promise<Object>} Datos de la deducción
   */
  static async obtenerPorId(id) {
    try {
      const deduccion = await DeduccionUrbanoDeclaracionJuradaService.obtenerPorId(id);
      return this.formatearDeduccionParaFrontend(deduccion);
    } catch (error) {
      console.error('Error al obtener deducción por ID:', error);
      // Fallback a datos estáticos
      const todasDeducciones = await this.obtenerTodas();
      return todasDeducciones.find(d => d.id === id) || this.obtenerDeduccionPorDefecto();
    }
  }

  /**
   * Buscar deducción por descripción
   * @param {string} descripcion - Descripción de la deducción
   * @returns {Promise<Object>} Datos de la deducción
   */
  static async obtenerPorDescripcion(descripcion) {
    try {
      const deduccion = await DeduccionUrbanoDeclaracionJuradaService.obtenerPorDescripcion(descripcion);
      return this.formatearDeduccionParaFrontend(deduccion);
    } catch (error) {
      console.error('Error al buscar deducción por descripción:', error);
      // Fallback a búsqueda local
      const todasDeducciones = await this.obtenerTodas();
      return todasDeducciones.find(d => 
        d.c_descripcion_deduccion?.toLowerCase().includes(descripcion.toLowerCase())
      ) || this.obtenerDeduccionPorDefecto();
    }
  }

  /**
   * Obtener opciones de autorización para el formulario
   * @returns {Array} Opciones de autorización
   */
  static obtenerOpcionesAutorizacion() {
    return [
      { id: "SI", nombre: "Sí" },
      { id: "NO", nombre: "No" }
    ];
  }

  /**
   * Obtener tipos de deducción para select
   * @returns {Promise<Array>} Tipos de deducción formateados para select
   */
  static async obtenerTiposDeduccion() {
    try {
      const deducciones = await this.obtenerTodas();
      return deducciones.map(deduccion => ({
        value: deduccion.id?.toString() || deduccion.c_descripcion_deduccion,
        label: deduccion.c_descripcion_deduccion || "Sin descripción",
        porcentaje: deduccion.c_porcentaje || 0,
        autorizado: deduccion.c_autorizado || false
      }));
    } catch (error) {
      console.error('Error al obtener tipos de deducción:', error);
      return [
        { value: "NO", label: "NO", porcentaje: 0, autorizado: false },
        { value: "20% Zona de Conservación", label: "20% Zona de Conservación y Reexención - ASES NO", porcentaje: 20, autorizado: true },
        { value: "10% Zona Histórica", label: "10% Zona Histórica", porcentaje: 10, autorizado: true },
        { value: "15% Zona Residencial", label: "15% Zona Residencial Especial", porcentaje: 15, autorizado: true },
        { value: "25% Zona Rural", label: "25% Zona Rural Protegida", porcentaje: 25, autorizado: true }
      ];
    }
  }

  /**
   * Validar datos de deducción
   * @param {Object} datosDeduccion - Datos a validar
   * @returns {Object} Resultado de validación
   */
  static validarDeduccion(datosDeduccion) {
    const errors = {};

    if (!datosDeduccion.tipo_deduccion) {
      errors.tipo_deduccion = 'El tipo de deducción es obligatorio';
    }

    if (datosDeduccion.autorizado === undefined || datosDeduccion.autorizado === null) {
      errors.autorizado = 'La autorización es obligatoria';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Formatear deducción para el frontend
   * @param {Object} deduccion - Deducción del servicio SATGIZ
   * @returns {Object} Deducción formateada
   */
  static formatearDeduccionParaFrontend(deduccion) {
    if (!deduccion) return this.obtenerDeduccionPorDefecto();

    return {
      ...deduccion,
      opcionesAutorizacion: this.obtenerOpcionesAutorizacion(),
      label: deduccion.c_descripcion_deduccion || "Sin descripción",
      value: deduccion.id?.toString() || deduccion.c_descripcion_deduccion,
      porcentaje: deduccion.c_porcentaje || 0
    };
  }

  /**
   * Obtener deducción por defecto (sin deducción)
   * @returns {Object} Deducción por defecto
   */
  static obtenerDeduccionPorDefecto() {
    return {
      id: 0,
      c_descripcion_deduccion: "NO",
      c_autorizado: false,
      c_porcentaje: 0,
      c_tipo: "NINGUNA",
      opcionesAutorizacion: this.obtenerOpcionesAutorizacion(),
      label: "NO",
      value: "NO"
    };
  }

  /**
   * Calcular monto con deducción aplicada
   * @param {number} montoBase - Monto base
   * @param {Object} deduccion - Datos de la deducción
   * @returns {number} Monto con deducción aplicada
   */
  static calcularMontoConDeduccion(montoBase, deduccion) {
    if (!deduccion || !deduccion.c_autorizado || !deduccion.c_porcentaje) {
      return montoBase;
    }

    const porcentaje = deduccion.c_porcentaje / 100;
    return montoBase * (1 - porcentaje);
  }
}

export default DeduccionService;