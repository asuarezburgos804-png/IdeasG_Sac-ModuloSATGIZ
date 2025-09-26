// Función para programar verificación (simulada)
export const programarVerificacion = async (datosProgramacion) => {
  // Simulamos una llamada a API con un retardo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: "Los datos fueron guardados exitosamente." 
      });
    }, 1000);
  });
};