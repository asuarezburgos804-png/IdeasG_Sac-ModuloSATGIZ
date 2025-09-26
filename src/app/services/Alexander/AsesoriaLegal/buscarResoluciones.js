import environment from "@/config/enviroment";
const API_BASE_URL = environment.url_backend;

export const buscarResoluciones = async (terminoBusqueda, setResoluciones, setErrorMessage, setError) => {
  try {
    const url = terminoBusqueda
      ? `${API_BASE_URL}/urbano/asesoria-legal/buscar-resoluciones?search=${encodeURIComponent(terminoBusqueda)}`
      : `${API_BASE_URL}/urbano/asesoria-legal/resoluciones`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", response.status, errorText);
      throw new Error(`Error del servidor: ${response.status}`);
    }
    
    const data = await response.json();
    
    
    
    if (data.success) {
      const resolucionesMapeadas = data.data.map(resolucion => ({
        id_resolucion: resolucion.id_resolucion,
        id_expediente: resolucion.id_expediente,
        nro_expediente: resolucion.nro_expediente || resolucion.numero_expediente,
        numero_resolucion: resolucion.numero_resolucion,
        fecha_resolucion: resolucion.d_fecha_resolucion || resolucion.fecha_resolucion,
        dni: resolucion.dni,
        nombre_completo: resolucion.nombre_completo,
        tiene_pdf: resolucion.tiene_pdf
      }));
      
      setResoluciones(resolucionesMapeadas);
      return resolucionesMapeadas;
    } else {
      const errorMsg = data.message || "Error al buscar resoluciones";
      setErrorMessage(errorMsg);
      setError(true);
      console.error("Error del backend:", errorMsg);
      return null;
    }
  } catch (error) {
    console.error("Error buscando resoluciones:", error);
    
    let errorMsg = "Error de conexión con el servidor backend";
    if (error.message.includes('servidor')) {
      errorMsg = "Error interno del servidor backend. Contacte al administrador del sistema.";
    } else if (error.message.includes('JSON')) {
      errorMsg = "Error en el formato de respuesta del servidor";
    }
    
    setErrorMessage(errorMsg);
    setError(true);
    return null;
  }
};