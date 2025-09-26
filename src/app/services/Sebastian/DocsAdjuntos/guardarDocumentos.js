let documentosGuardados = {};

export async function guardarDocumentos(expedienteId, generales = [], espaciales = []) {
  if (!documentosGuardados[expedienteId]) {
    documentosGuardados[expedienteId] = { generales: [], espaciales: [] };
  }

  documentosGuardados[expedienteId].generales.push(...generales);
  documentosGuardados[expedienteId].espaciales.push(...espaciales);

  

  // Simulación de espera de red
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mensaje: "Documentos guardados con éxito (simulado)",
        data: documentosGuardados[expedienteId],
      });
    }, 500);
  });
}

// Función para obtener documentos de un expediente
export async function obtenerDocumentos(expedienteId) {
  return documentosGuardados[expedienteId] || { generales: [], espaciales: [] };
}