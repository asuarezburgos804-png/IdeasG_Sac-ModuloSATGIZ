import { Router } from "express";
import { validarToken } from "../../middlewares/auth.js"; // opcional si usas autenticación
import { DatosUrbanoDeclaracionJuradaController } from "../../controllers/DeclaracionJurada/Datos_Urbano_Declaracion_Jurada_Controllers.js";

export const createDatosUrbanoDeclaracionJuradaRouter = () => {
  const router = Router();
  const controller = new DatosUrbanoDeclaracionJuradaController();

  // ✅ Listar todos los registros
  router.get("/", controller.getDatosUrbano);

  // ✅ Obtener un registro por ID
  router.get("/id/:id", controller.getDatoUrbanoById);

  // ✅ Buscar por uso del predio urbano (vivienda, comercio, etc.)
  router.get("/uso/:c_uso_predio_urbano", controller.getDatoUrbanoByUso);

  // ✅ Crear un nuevo registro
  router.post("/", controller.postDatoUrbano);

  // ✅ Actualizar un registro por ID
  router.put("/:id", controller.putDatoUrbanoById);

  // ✅ Eliminar un registro por ID
  router.delete("/:id", controller.deleteDatoUrbanoById);

  // ✅ Obtener promedio del área total (opcional)
  router.get("/consulta/promedio", controller.getPromedioAreaTotal);

  return router;
};
