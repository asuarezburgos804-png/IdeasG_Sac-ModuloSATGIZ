import { datosTemporales } from "./DatosTemporales.js";

export const buscarSolicitudes = (termino) => {
    const terminoLower = termino.toLowerCase();
    return datosTemporales.filter(item => 
        item.dni.includes(termino) || 
        item.fecha_Solicitud.includes(termino) ||
        item.nombre_completo.toLowerCase().includes(terminoLower)

    );
  };