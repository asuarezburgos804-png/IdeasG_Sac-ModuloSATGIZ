import { Router } from "express";
import { validarToken } from "../../middlewares/auth.js"; // Si usas autenticación
import { DatosComplementariosUrbanoDeclaracionJuradaController } from "../../controllers/DeclaracionJurada/Datos_Complementarios_Urbano_Declaracion_Jurada_Controllers.js";

export const createDatosComplementariosRouter = () => {
  const router = Router();
  const controller = new DatosComplementariosUrbanoDeclaracionJuradaController();

  // ✅ Obtener todos los registros
  router.get("/", /*validarToken,*/ (req, res) => controller.getDatosComplementarios(req, res));

  // ✅ Obtener un registro por ID
  router.get("/id/:id", /*validarToken,*/ (req, res) => controller.getDatoComplementarioById(req, res));

  // ✅ Buscar registros por tipo de servicio (agua, luz, desagüe)
  router.get("/servicio/:servicio/:valor", /*validarToken,*/ (req, res) => controller.getDatosByServicio(req, res));

  // ✅ Crear un nuevo registro
  router.post("/", /*validarToken,*/ (req, res) => controller.postDatoComplementario(req, res));

  // ✅ Actualizar un registro por ID
  router.put("/:id", /*validarToken,*/ (req, res) => controller.putDatoComplementarioById(req, res));

  // ✅ Eliminar un registro por ID
  router.delete("/:id", /*validarToken,*/ (req, res) => controller.deleteDatoComplementarioById(req, res));

  // ✅ (Opcional) Obtener conteo de servicios
  router.get("/consulta/conteo", /*validarToken,*/ (req, res) => controller.getConteoServicios(req, res));

  return router;
};
