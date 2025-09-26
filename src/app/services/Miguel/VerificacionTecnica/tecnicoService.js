import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from "@/utils/api/api";

const BASE_URL = "/urbano/tecnico";

// Verificación Administrativa endpoints
export const crearVerificacionAdministrativa = async (idExpediente, verificacionData) => {
  try {
    const response = await makePostRequest(`${BASE_URL}/verificacion-administrativa/${idExpediente}`, verificacionData);
    return response;
  } catch (error) {
    console.error("Error creando verificación administrativa:", error);
    throw error;
  }
};

export const obtenerVerificacionAdministrativa = async (idExpediente) => {
  try {
    const response = await makeGetRequest(`${BASE_URL}/verificacion-administrativa/${idExpediente}`);
    return response;
  } catch (error) {
    console.error("Error obteniendo verificación administrativa:", error);
    return null; // Return null instead of throwing to prevent undefined access
  }
};

// Parámetros Urbanísticos endpoints
export const crearParametrosUrbanisticos = async (idExpediente, parametrosData) => {
  try {
    const response = await makePostRequest(`${BASE_URL}/parametros-urbanisticos/${idExpediente}`, parametrosData);
    return response;
  } catch (error) {
    console.error("Error creando parámetros urbanísticos:", error);
    throw error;
  }
};

export const obtenerParametrosUrbanisticos = async (idExpediente) => {
  try {
    const response = await makeGetRequest(`${BASE_URL}/parametros-urbanisticos/${idExpediente}`);
    return response;
  } catch (error) {
    console.error("Error obteniendo parámetros urbanísticos:", error);
    throw error;
  }
};

// Verificación de Cuadro de Área endpoints
export const crearVerificacionCuadroArea = async (idExpediente, cuadroAreaData) => {
  try {
    const response = await makePostRequest(`${BASE_URL}/verificacion-cuadro-area/${idExpediente}`, cuadroAreaData);
    return response;
  } catch (error) {
    console.error("Error creando verificación de cuadro de área:", error);
    throw error;
  }
};

export const obtenerVerificacionCuadroArea = async (idExpediente) => {
  try {
    const response = await makeGetRequest(`${BASE_URL}/verificacion-cuadro-area/${idExpediente}`);
    return response;
  } catch (error) {
    console.error("Error obteniendo verificación de cuadro de área:", error);
    throw error;
  }
};

// Observaciones endpoints
export const crearObservacion = async (observacionData) => {
  try {
    const response = await makePostRequest(`${BASE_URL}/observaciones`, observacionData);
    return response;
  } catch (error) {
    console.error("Error creando observación:", error);
    throw error;
  }
};

export const obtenerObservacionesPorExpediente = async (idExpediente) => {
  try {
    const response = await makeGetRequest(`${BASE_URL}/observaciones/${idExpediente}`);
    return response;
  } catch (error) {
    console.error("Error obteniendo observaciones:", error);
    throw error;
  }
};

export const actualizarObservacion = async (idObservacion, observacionData) => {
  try {
    const response = await makePutRequest(`${BASE_URL}/observaciones/${idObservacion}`, observacionData);
    return response;
  } catch (error) {
    console.error("Error actualizando observación:", error);
    throw error;
  }
};

export const eliminarObservacion = async (idObservacion) => {
  try {
    const response = await makeDeleteRequest(`${BASE_URL}/observaciones/${idObservacion}`);
    return response;
  } catch (error) {
    console.error("Error eliminando observación:", error);
    throw error;
  }
};

// Búsqueda de expedientes para técnico verificador
export const buscarExpedientesTecnico = async (query) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      params.append("busqueda", query);
    }

    const response = await makeGetRequest(`${BASE_URL}/expedientes-tecnico?${params}`);
    
    if (response.success) {
      return response.data;
    } else {
      console.error("Error en búsqueda de expedientes:", response.message);
      return [];
    }
  } catch (error) {
    console.error("Error buscando expedientes:", error);
    return []; // Devolver array vacío en lugar de datos de ejemplo
  }
};