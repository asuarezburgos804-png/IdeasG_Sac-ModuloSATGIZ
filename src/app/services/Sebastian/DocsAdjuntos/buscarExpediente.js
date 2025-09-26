const expedientesMock = [
  {
    id: 1,
    expediente: "2417",
    dni: "19353934",
    nombre_completo: "PACHECO NAUPARI, EVER",
    fecha_registro: "2018-05-12",
  },
  {
    id: 2,
    expediente: "2620",
    dni: "29300138",
    nombre_completo: "HINOJOSA NAVARRO, MARIBEL",
    fecha_registro: "2018-05-12",
  },
  {
    id: 3,
    expediente: "5739",
    dni: "21441106",
    nombre_completo: "EULOGIO MARTINEZ, TEODORO",
    fecha_registro: "2018-05-12",
  },
];

// Función de búsqueda
export function buscarExpediente(query) {
  return expedientesMock.filter(
    (exp) =>
      exp.dni.includes(query) ||
      exp.nombre_completo.toLowerCase().includes(query.toLowerCase())
  );
}