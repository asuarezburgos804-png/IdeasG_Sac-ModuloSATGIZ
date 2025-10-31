import { Router } from "express";
import { validarToken } from "../../middlewares/auth.js";
import { UbicacionUrbanoDeclaracionJuradaController } from "../../controllers/DeclaracionJurada/Ubicacion_Urbano_Declaracion_Jurada_Controllers.js";

export const createUbicacionUrbanoDeclaracionJuradaRouter = () => {
  const ubicacionRouter = Router();
  const ubicacionController = new UbicacionUrbanoDeclaracionJuradaController();

  // ✅ Obtener todas las ubicaciones
  ubicacionRouter.get("/", ubicacionController.getUbicaciones);

  // ✅ Obtener una ubicación por ID
  ubicacionRouter.get("/search_by_id/:id", ubicacionController.getUbicacionById);

  // ✅ Buscar ubicación por distrito
  ubicacionRouter.get("/distrito/:distrito", ubicacionController.getUbicacionByDistrito);

  // ✅ Consulta personalizada (conteo de registros)
  ubicacionRouter.get("/consulta/conteo", ubicacionController.getConsultas);

  // ✅ Crear una nueva ubicación
  ubicacionRouter.post("/", ubicacionController.postUbicacion);

  // ✅ Actualizar ubicación por ID
  ubicacionRouter.put("/:id", ubicacionController.putUbicacionById);

  // ✅ Eliminar ubicación por ID
  ubicacionRouter.delete("/:id", ubicacionController.deleteUbicacionById);

  return ubicacionRouter;
};
