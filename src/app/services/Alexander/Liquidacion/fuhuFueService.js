import { makeGetRequest, makePostRequest } from "@/utils/api/api";
import environment from "@/config/enviroment";

const BASE_URL = "/urbano/fuhu-fue";
const API_BASE_URL = environment.url_backend;

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

// Asignar técnico a un expediente
export const asignarTecnico = async (idExpediente, dniTecnico, nombreTecnico) => {
  try {
    const response = await makePostRequest(`${BASE_URL}/asignar-tecnico`, {
      id_expediente: idExpediente,
      dni_tecnico: dniTecnico,
      nombre_tecnico: nombreTecnico
    });
    return response;
  } catch (error) {
    console.error("Error asignando técnico:", error);
    throw error;
  }
};

// Obtener técnico asignado
export const obtenerTecnicoAsignado = async (idExpediente) => {
  try {
    const response = await makeGetRequest(`${BASE_URL}/tecnico-asignado/${idExpediente}`);
    return response;
  } catch (error) {
    console.error("Error obteniendo técnico asignado:", error);
    throw error;
  }
};

// Función para descargar liquidación
export const descargarLiquidacion = async (idExpediente) => {
  try {
    const response = await fetch(`${API_BASE_URL}/urbano/fuhu-fue/generar-liquidacion/${idExpediente}`);
    
    if (response.ok) {
      // Crear un blob del PDF y descargarlo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `liquidacion-${idExpediente}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } else {
      console.error("Error descargando liquidación");
      return false;
    }
  } catch (error) {
    console.error("Error descargando liquidación:", error);
    return false;
  }
};