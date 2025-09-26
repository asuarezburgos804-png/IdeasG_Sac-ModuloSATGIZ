    // Datos de ejemplo para los pisos
export const datosPisosEjemplo = [
  {
    id: 1,
    numero: 1,
    existente: "100",
    ampliacion: "20",
    nuevo: "120",
    demolicion: "0",
    remodelacion: "0",
    observacion: ""
  },
  {
    id: 2,
    numero: 2,
    existente: "80",
    ampliacion: "40",
    nuevo: "120",
    demolicion: "10",
    remodelacion: "5",
    observacion: "Ampliación aprobada"
  }
];

// Función para obtener pisos por expediente
export const obtenerPisosPorExpediente = (expedienteId) => {
  // Simulamos una llamada a API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(datosPisosEjemplo);
    }, 500);
  });
};

// Función para guardar pisos
export const guardarPisos = (pisos) => {
  // Simulamos el guardado
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Datos guardados exitosamente" });
    }, 500);
  });
};