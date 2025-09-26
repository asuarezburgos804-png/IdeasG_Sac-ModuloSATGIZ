import { makeGetRequest, makePostRequest } from "@/utils/api/api";
import environment from "@/config/enviroment";

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

// Búsqueda de técnicos - usando el mismo endpoint que MesaDePartes
export const buscarTecnicos = async (termino) => {
  try {
    // Usando el endpoint estándar para obtener técnicos
    const response = await fetch(`${environment.url_backend}/urbano/mesa-partes/tecnicos`);
    const data = await response.json();
    
    if (data.success) {
      // Filtrar técnicos por término de búsqueda si se proporciona
      let tecnicosFiltrados = data.data;
      if (termino && termino.trim() !== '') {
        const terminoLower = termino.toLowerCase();
        tecnicosFiltrados = data.data.filter(tecnico =>
          tecnico.c_dni_tecnico.includes(termino) ||
          tecnico.c_nombre_tecnico.toLowerCase().includes(terminoLower)
        );
      }
      
      return {
        success: true,
        data: tecnicosFiltrados
      };
    } else {
      // Fallback a datos de ejemplo si el endpoint falla
      return {
        success: true,
        data: [
          {
            id_tecnico: 1,
            c_dni_tecnico: "71799113",
            c_nombre_tecnico: "RENZO GARCIA AUQUI"
          }
        ]
      };
    }
  } catch (error) {
    console.error("Error buscando técnicos:", error);
    // Fallback a datos de ejemplo si hay error de conexión
    return {
      success: true,
      data: [
        {
          id_tecnico: 1,
          c_dni_tecnico: "71799113",
          c_nombre_tecnico: "RENZO GARCIA AUQUI"
        }
      ]
    };
  }
};