import { Router } from "express";
import { validarToken } from "../../middlewares/auth.js";
import { DeclaracionJuradaController } from "../../controllers/DeclaracionJurada/Declaracion_Jurada_Controllers.js";

export const createDeclaracionJuradaRouter = () => {
  const declaracionJuradaRouter = Router();
  const declaracionJuradaController = new DeclaracionJuradaController();

  // ✅ Rutas CRUD principales
  declaracionJuradaRouter.get("/", declaracionJuradaController.getDeclaraciones);
  declaracionJuradaRouter.get("/search_by_id/:id", declaracionJuradaController.getDeclaracionById);
  declaracionJuradaRouter.post("/", declaracionJuradaController.postDeclaracion);
  declaracionJuradaRouter.put("/:id", declaracionJuradaController.putDeclaracionById);
  declaracionJuradaRouter.delete("/:id", declaracionJuradaController.deleteDeclaracionById);

  // ✅ Rutas de búsqueda personalizadas
  declaracionJuradaRouter.get("/contribuyente/:nombre", declaracionJuradaController.getDeclaracionByContribuyente);
  declaracionJuradaRouter.get("/tipo_predio/:tipo", declaracionJuradaController.getDeclaracionByTipoPredio);

  // ✅ Ruta de consulta personalizada
  declaracionJuradaRouter.get("/consulta/conteo", declaracionJuradaController.getConsultasPersonalizadas);

  return declaracionJuradaRouter;
};
