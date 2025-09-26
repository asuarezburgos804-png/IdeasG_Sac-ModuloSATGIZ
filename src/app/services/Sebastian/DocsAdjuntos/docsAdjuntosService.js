import axios from "axios";
import environment from "@/config/enviroment";

const BASE_URL = `${environment.url_backend}/urbano/documentos-adjuntos`;

/**
 * Servicio para la gestión de documentos adjuntos según nueva documentación
 */
export const docsAdjuntosService = {
  /**
   * Subir documentos adjuntos a un expediente
   * @param {string} idExpediente - ID del expediente
   * @param {Array} archivos - Array de archivos a subir
   * @param {number} idTecnicoSubio - ID del técnico que sube los documentos
   * @returns {Promise<Object>} Respuesta del servidor con documentos subidos
   */
  async subirDocumentos(idExpediente, archivos, idTecnicoSubio) {
    try {
      

      // Validar que el ID del expediente no esté vacío
      if (!idExpediente || idExpediente === 'undefined' || idExpediente === 'null') {
        throw new Error('El ID del expediente está vacío o es inválido');
      }

      // Validar que sea string
      if (typeof idExpediente !== 'string') {
        idExpediente = String(idExpediente);
      }

      // Trim y validar longitud
      idExpediente = idExpediente.trim();
      if (idExpediente.length === 0) {
        throw new Error('El ID del expediente está vacío');
      }

      

      const formData = new FormData();
      
      // Agregar cada archivo al FormData con el nombre correcto "documentos"
      archivos.forEach((archivo) => {
        formData.append("documentos", archivo);
      });
      
      // Agregar ID del técnico
      formData.append("id_tecnico_subio", idTecnicoSubio);

      const url = `${BASE_URL}/${idExpediente}/subir`;
      

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
      return response.data;
    } catch (error) {
      console.error('Error al subir documentos:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Status del error:', error.response.status);
      }
      throw error;
    }
  },

  /**
   * Obtener documentos adjuntos de un expediente
   * @param {string} idExpediente - ID del expediente
   * @returns {Promise<Array>} Lista de documentos
   */
  async obtenerDocumentos(idExpediente) {
    try {
      
      const url = `${BASE_URL}/${idExpediente}`;
      

      const response = await axios.get(url);
      

      if (response.status >= 200 && response.status < 300) {
        // Log detallado de la estructura de datos
        if (Array.isArray(response.data)) {
          
          response.data.forEach((doc, index) => {
            console.log(`Documento ${index + 1}:`, {
              id: doc.id_documento_adjunto,
              nombre: doc.c_nombre_documento,
              tieneTecnico: !!doc.tecnicoDocumentos,
              tecnico: doc.tecnicoDocumentos
            });
          });
          return response.data;
        } else if (response.data && Array.isArray(response.data)) {
          
          return response.data;
        } else {
          
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      if (error.response) {
        console.error('Status del error:', error.response.status);
        console.error('Datos del error:', error.response.data);
      }
      return [];
    }
  },

  /**
   * Descargar un documento específico
   * @param {number} idDocumentoAdjunto - ID del documento adjunto
   * @returns {Promise<Blob>} Archivo descargado
   */
  async descargarDocumento(idDocumentoAdjunto) {
    try {
      
      const url = `${BASE_URL}/documento/${idDocumentoAdjunto}/descargar`;
      

      const response = await axios.get(url, {
        responseType: 'blob'
      });

      if (response.status >= 200 && response.status < 300) {
        // Obtener el nombre del archivo del header Content-Disposition
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'documento_descargado';
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        return {
          blob: response.data,
          filename: filename
        };
      }
      throw new Error('Error al descargar documento');
    } catch (error) {
      console.error('Error al descargar documento:', error);
      throw error;
    }
  },

  /**
   * Obtener información de un documento específico
   * @param {number} idDocumentoAdjunto - ID del documento adjunto
   * @returns {Promise<Object>} Información del documento
   */
  async obtenerInformacionDocumento(idDocumentoAdjunto) {
    try {
      
      const url = `${BASE_URL}/documento/${idDocumentoAdjunto}/info`;
      

      const response = await axios.get(url);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error('Error al obtener información del documento');
    } catch (error) {
      console.error('Error al obtener información del documento:', error);
      throw error;
    }
  },

  /**
   * Eliminar un documento (eliminación lógica)
   * @param {number} idDocumentoAdjunto - ID del documento adjunto
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async eliminarDocumento(idDocumentoAdjunto) {
    try {
      
      const url = `${BASE_URL}/documento/${idDocumentoAdjunto}`;
      

      const response = await axios.delete(url);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al eliminar documento');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      throw error;
    }
  },

  /**
   * Validar archivo antes de subir
   * @param {File} archivo - Archivo a validar
   * @returns {Object} Resultado de la validación
   */
  validarArchivo(archivo) {
    const tiposPermitidos = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!tiposPermitidos.includes(archivo.type)) {
      return { valido: false, error: "Tipo de archivo no permitido" };
    }

    if (archivo.size > maxSize) {
      return { valido: false, error: "Archivo demasiado grande (máximo 10MB)" };
    }

    return { valido: true };
  },

  /**
   * Preparar archivos para subida con validación
   * @param {Array} archivos - Array de archivos
   * @returns {Object} Resultado de la validación
   */
  prepararArchivos(archivos) {
    const archivosValidos = [];
    const errores = [];

    archivos.forEach((archivo) => {
      const validacion = this.validarArchivo(archivo);
      if (!validacion.valido) {
        errores.push(`"${archivo.name}": ${validacion.error}`);
        return;
      }

      archivosValidos.push(archivo);
    });

    return {
      archivosValidos,
      errores,
      tieneErrores: errores.length > 0
    };
  },

  /**
   * Formatear tamaño de archivo para mostrar al usuario
   * @param {number} bytes - Tamaño en bytes
   * @returns {string} Tamaño formateado
   */
  formatearTamanio(bytes) {
    const unidades = ["B", "KB", "MB", "GB"];
    let tamanio = bytes;
    let unidadIndex = 0;

    while (tamanio >= 1024 && unidadIndex < unidades.length - 1) {
      tamanio /= 1024;
      unidadIndex++;
    }

    return `${tamanio.toFixed(2)} ${unidades[unidadIndex]}`;
  },

  /**
   * Mapear documentos de la API al formato local
   * @param {Array} documentosAPI - Documentos de la API
   * @returns {Array} Documentos en formato local
   */
  mapearDocumentosDesdeAPI(documentosAPI) {
    if (!documentosAPI || !Array.isArray(documentosAPI)) {
      return [];
    }

    return documentosAPI.map(doc => ({
      id: doc.id_documento_adjunto,
      nombre: doc.c_nombre_documento,
      tipo: doc.c_tipo_documento,
      tamaño: doc.n_tamanio_bytes,
      tamañoFormateado: this.formatearTamanio(doc.n_tamanio_bytes),
      mimeType: doc.c_mime_type,
      fechaSubida: doc.d_fecha_subida,
      idTecnicoSubio: doc.id_tecnico_subio,
      activo: doc.b_activo,
      // CAMBIO: usar tecnicoDocumentos en lugar de tecnico
      tecnico: doc.tecnicoDocumentos ? {
        id: doc.tecnicoDocumentos.id_tecnico,
        nombre: doc.tecnicoDocumentos.c_nombre_tecnico
      } : null
    }));
  },

  /**
   * Función auxiliar para descargar archivo en el navegador
   * @param {Blob} blob - Archivo blob
   * @param {string} filename - Nombre del archivo
   */
  descargarArchivoEnNavegador(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Normalizar ID de expediente desde diferentes fuentes
   * @param {Object} expediente - Objeto expediente
   * @returns {string} ID normalizado
   */
  normalizarIdExpediente(expediente) {
    if (!expediente) return '';

    // Prioridad: id_expediente -> id_solicitud -> expediente
    return expediente.id_expediente || expediente.id_solicitud || expediente.expediente || '';
  },

  /**
   * Validar expediente antes de operaciones
   * @param {Object} expediente - Objeto expediente
   * @returns {Object} Resultado de validación
   */
  validarExpediente(expediente) {
    const idExpediente = this.normalizarIdExpediente(expediente);

    if (!idExpediente) {
      return {
        valido: false,
        error: 'El expediente no tiene un ID válido'
      };
    }

    if (idExpediente === 'undefined' || idExpediente === 'null') {
      return {
        valido: false,
        error: 'El ID del expediente es inválido'
      };
    }

    return {
      valido: true,
      idExpediente: idExpediente
    };
  }
};

export default docsAdjuntosService;