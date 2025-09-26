// Datos de ejemplo para simular la búsqueda - Actualizados con fecha de verificación
const expedientesEjemplo = [
  { 
    id: 1, 
    nroExp: "2011", 
    dni: "19921755", 
    administrado: "COLLAOMAGUA PEREZ, PERDO ANTENGRINES", 
    estadoVerif: "",
    fechaVerificacion: "" 
  },
  { 
    id: 2, 
    nroExp: "2047", 
    dni: "20700538", 
    administrado: "HINOSTROZA MARABIO, MARGEL", 
    estadoVerif: "Programación",
    fechaVerificacion: "15/10/2023" 
  },
  { 
    id: 3, 
    nroExp: "2471", 
    dni: "19853904", 
    administrado: "RICHIREDO BULINARI, ENER", 
    estadoVerif: "Verificación administrativa",
    fechaVerificacion: "22/10/2023" 
  },
  { 
    id: 4, 
    nroExp: "4586", 
    dni: "40325007", 
    administrado: "CARHUATOMPA HILARIO, MARINO", 
    estadoVerif: "",
    fechaVerificacion: "" 
  },
  { 
    id: 5, 
    nroExp: "95718", 
    dni: "45549537", 
    administrado: "LOPEZ MAITA, DIANA JANETNI", 
    estadoVerif: "",
    fechaVerificacion: "" 
  },
  { 
    id: 6, 
    nroExp: "5011", 
    dni: "20205275", 
    administrado: "GALONA RAMOS, MIGUEL AMOR", 
    estadoVerif: "",
    fechaVerificacion: "" 
  },
];

// Función para buscar expedientes
export const buscarExpedientes = (query) => {
  if (!query) return expedientesEjemplo;
  
  return expedientesEjemplo.filter(exp => 
    exp.nroExp.toLowerCase().includes(query.toLowerCase()) || 
    exp.dni.toLowerCase().includes(query.toLowerCase()) ||
    exp.administrado.toLowerCase().includes(query.toLowerCase())
  );
};

// Función para actualizar la fecha de verificación de un expediente
export const actualizarFechaVerificacion = (expedienteId, fecha) => {
  const expediente = expedientesEjemplo.find(exp => exp.id === expedienteId);
  if (expediente) {
    expediente.fechaVerificacion = fecha;
    expediente.estadoVerif = "Programación";
    return true;
  }
  return false;
};