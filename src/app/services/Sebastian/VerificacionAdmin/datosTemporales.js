//Datos temporales para la simulacion de la base de datos
export const datosTemporales = [
  {
    id_solicitud: 1,
    dni: "10588376",
    nombre_completo: "GONZALO GUERRA, FERNANDO",
    fecha_registro: "2018-10-19",
    expediente: "175200",
    tipoTramite: "Regularización de licencia",
    propietario: "SI",
    tipoPersona: "Persona natural",
    persona: {
      dni: "20990670",
      apellidoPat: "Guerra",
      apellidoMat: "Fernandez",
      nombres: "Fernando Gonzalo",
      telefono: "999888777",
      correo: "fernando.guerra@mail.com",
      estadoCivil: "Soltero"
    },
    domicilio: {
      departamento: "Lima",
      provincia: "Lima",
      distrito: "Miraflores",
      urbanizacion: "La Aurora",
      mz: "B",
      lote: "12",
      sublote: "1"
    }
  },

  {
    id_solicitud: 2,
    dni: "12345678",
    nombre_completo: "PEREZ GARCIA, JUAN",
    fecha_registro: "2023-05-12",
    expediente: "175201",
    tipoTramite: "Licencia de funcionamiento",
    propietario: "NO",
    tipoPersona: "Persona natural",
    persona: {
      dni: "12345678",
      apellidoPat: "Perez",
      apellidoMat: "Garcia",
      nombres: "Juan Carlos",
      telefono: "988776655",
      correo: "juan.perez@mail.com",
      estadoCivil: "Casado"
    },
    domicilio: {
      departamento: "Lima",
      provincia: "Lima",
      distrito: "San Isidro",
      urbanizacion: "Orrantia",
      mz: "C",
      lote: "5",
      sublote: ""
    }
  },

  {
    id_solicitud: 3,
    dni: "87654321",
    nombre_completo: "LOPEZ MARTINEZ, MARIA",
    fecha_registro: "2023-07-22",
    expediente: "175202",
    tipoTramite: "Renovación de licencia",
    propietario: "SI",
    tipoPersona: "Persona natural",
    persona: {
      dni: "87654321",
      apellidoPat: "Lopez",
      apellidoMat: "Martinez",
      nombres: "Maria Isabel",
      telefono: "977665544",
      correo: "maria.lopez@mail.com",
      estadoCivil: "Soltera"
    },
    domicilio: {
      departamento: "Lima",
      provincia: "Callao",
      distrito: "La Perla",
      urbanizacion: "Costanera",
      mz: "D",
      lote: "20",
      sublote: "2"
    }
  }
];
