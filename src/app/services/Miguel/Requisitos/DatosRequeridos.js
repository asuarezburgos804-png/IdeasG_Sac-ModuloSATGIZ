// Función para obtener requisitos guardados
export const obtenerRequisitosGuardados = () => {
  const requisitosGuardados = sessionStorage.getItem("requisitosGuardados");
  return requisitosGuardados ? JSON.parse(requisitosGuardados) : null;
};

// Función para limpiar requisitos guardados
export const limpiarRequisitosGuardados = () => {
  sessionStorage.removeItem("requisitosGuardados");
};