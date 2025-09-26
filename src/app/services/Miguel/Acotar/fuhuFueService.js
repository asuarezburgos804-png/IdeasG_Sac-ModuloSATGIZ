import { makeGetRequest } from "@/utils/api/api";

const BASE_URL = "/urbano/fuhu-fue";

// Búsqueda de expedientes por DNI o nombre
export const buscarExpedientes = async (dni, nombre) => {
  const params = new URLSearchParams();
  if (dni) params.append("dni", dni);
  if (nombre) params.append("nombre", nombre);

  try {
    const response = await makeGetRequest(`${BASE_URL}/buscar-expedientes?${params}`);
    return response;
  } catch (error) {
    console.error("Error buscando expedientes:", error);
    throw error;
  }
};

// Obtener datos completos de un expediente
export const obtenerExpediente = async (idExpediente) => {
  try {
    const response = await makeGetRequest(`${BASE_URL}/expediente/${idExpediente}`);
    return response;
  } catch (error) {
    console.error("Error obteniendo expediente:", error);
    throw error;
  }
};