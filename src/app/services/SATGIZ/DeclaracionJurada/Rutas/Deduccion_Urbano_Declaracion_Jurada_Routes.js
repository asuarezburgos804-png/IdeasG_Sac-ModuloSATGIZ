import { Router } from "express";
import { validarToken } from "../../middlewares/auth.js";
import { DeduccionUrbanoDeclaracionJuradaController } from "../../controllers/DeclaracionJurada/Deduccion_Urbano_Declaracion_Jurada_Controllers.js";

export const createDeduccionUrbanoDeclaracionJuradaRouter = () => {
  const deduccionRouter = Router();
  const deduccionController = new DeduccionUrbanoDeclaracionJuradaController();

  // ✅ Rutas principales
  deduccionRouter.get("/", deduccionController.getDeducciones);
  deduccionRouter.get("/search_by_id/:id", deduccionController.getDeduccionById);
  deduccionRouter.get("/descripcion/:descripcion", deduccionController.getDeduccionByDescripcion);

  // ✅ Consulta personalizada (conteo de autorizadas y no autorizadas)
  deduccionRouter.get("/consulta/conteo", deduccionController.getConsultas);

  // ✅ CRUD
  deduccionRouter.post("/", deduccionController.postDeduccion);
  deduccionRouter.put("/:id", deduccionController.putDeduccionById);
  deduccionRouter.delete("/:id", deduccionController.deleteDeduccionById);

  return deduccionRouter;
};
