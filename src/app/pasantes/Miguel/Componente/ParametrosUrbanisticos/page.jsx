"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
} from "@nextui-org/react";
import parametrosUrbanisticosService from "@/app/services/Miguel/ParametrosUrbanisticos/parametrosUrbanisticosService";

export default function ParametrosUrbanisticos({ expediente, onBack }) {
  const [tab, setTab] = useState("urbanisticos");
  const [modalMensaje, setModalMensaje] = useState({
    open: false,
    tipo: "",
    texto: "",
  });
  const [cargando, setCargando] = useState(false);

  // Estado único para los parámetros cargados
  const [parametros, setParametros] = useState({
    // Parámetros urbanísticos
    areaTerritorial: "0 m²",
    areaActUrb: "0 m²",
    zonificacion: "",
    areaLoteNormativo: "0 m²",

    // Parámetros edificatorios - campos individuales planos
    usosPermisiblesNormado: "",
    usosPermisiblesProyecto: "",
    usosPermisiblesAnotaciones: "",
    coeficienteEdifNormado: "",
    coeficienteEdifProyecto: "",
    coeficienteEdifAnotaciones: "",
    porcentajeAreaLibreNormado: "",
    porcentajeAreaLibreProyecto: "",
    porcentajeAreaLibreAnotaciones: "",
    alturaEdificacionNormado: "",
    alturaEdificacionProyecto: "",
    alturaEdificacionAnotaciones: "",
    retiroMinimoFrontalNormado: "",
    retiroMinimoFrontalProyecto: "",
    retiroMinimoFrontalAnotaciones: "",
    alineamientoNormado: "",
    alineamientoProyecto: "",
    alineamientoAnotaciones: "",
    estacionamientoNormado: "",
    estacionamientoProyecto: "",
    estacionamientoAnotaciones: "",

    // Campo para determinar el tipo
    b_es_urbanistico: true,
  });

  // Estado para edición
  const [parametrosEdit, setParametrosEdit] = useState({
    // Parámetros urbanísticos
    areaTerritorial: "",
    areaActUrb: "",
    zonificacion: "",
    areaLoteNormativo: "",

    // Parámetros edificatorios - campos individuales planos
    usosPermisiblesNormado: "",
    usosPermisiblesProyecto: "",
    usosPermisiblesAnotaciones: "",
    coeficienteEdifNormado: "",
    coeficienteEdifProyecto: "",
    coeficienteEdifAnotaciones: "",
    porcentajeAreaLibreNormado: "",
    porcentajeAreaLibreProyecto: "",
    porcentajeAreaLibreAnotaciones: "",
    alturaEdificacionNormado: "",
    alturaEdificacionProyecto: "",
    alturaEdificacionAnotaciones: "",
    retiroMinimoFrontalNormado: "",
    retiroMinimoFrontalProyecto: "",
    retiroMinimoFrontalAnotaciones: "",
    alineamientoNormado: "",
    alineamientoProyecto: "",
    alineamientoAnotaciones: "",
    estacionamientoNormado: "",
    estacionamientoProyecto: "",
    estacionamientoAnotaciones: "",

    // Campo para determinar el tipo
    b_es_urbanistico: true,
  });

  // Estado para controlar qué pestaña está en modo edición
  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar parámetros urbanísticos al montar el componente
  useEffect(() => {
    const cargarParametrosUrbanisticos = async () => {
      if (!expediente) return;

      try {
        setCargando(true);

        // Obtener ID del expediente
        const idExpediente = expediente.expediente || expediente.id_expediente;

        if (!idExpediente) {
          console.error("No se pudo determinar el ID del expediente");
          return;
        }

        // Obtener parámetros existentes desde la API
        const parametrosAPI =
          await parametrosUrbanisticosService.obtenerParametros(idExpediente);

        if (parametrosAPI) {
          // Mapear datos de API a formato local
          const datosMapeados =
            parametrosUrbanisticosService.mapearDatosDesdeAPI(parametrosAPI);

          // Formatear datos para visualización
          const datosFormateados =
            parametrosUrbanisticosService.formatearDatosParaVisualizacion(
              datosMapeados
            );

          setParametros(datosFormateados);
        } else {
          console.log("No se encontraron parámetros urbanísticos existentes");
        }
      } catch (error) {
        console.error("Error al cargar parámetros urbanísticos:", error);
        setModalMensaje({
          open: true,
          tipo: "error",
          texto: "Error al cargar parámetros urbanísticos existentes",
        });
      } finally {
        setCargando(false);
      }
    };

    cargarParametrosUrbanisticos();
  }, [expediente]);

  // Inicializar valores de edición cuando se entra en modo edición
  const iniciarEdicion = () => {
    // Limpiar formato de datos para edición
    const datosLimpios =
      parametrosUrbanisticosService.limpiarFormatoDatos(parametros);
    setParametrosEdit({
      ...datosLimpios,
      b_es_urbanistico: parametros.b_es_urbanistico,
    });
    setModoEdicion(true);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
  };

  const handleGuardar = async () => {
    // Validar campos básicos según el tipo
    if (parametrosEdit.b_es_urbanistico) {
      // Validar campos urbanísticos
      if (
        !parametrosEdit.areaTerritorial ||
        !parametrosEdit.areaActUrb ||
        !parametrosEdit.zonificacion ||
        !parametrosEdit.areaLoteNormativo
      ) {
        setModalMensaje({
          open: true,
          tipo: "error",
          texto: "Todos los campos urbanísticos son obligatorios",
        });
        return;
      }
    } else {
      // Validar campos edificatorios básicos
      if (
        !parametrosEdit.areaTerritorial ||
        !parametrosEdit.areaActUrb ||
        !parametrosEdit.zonificacion ||
        !parametrosEdit.areaLoteNormativo
      ) {
        setModalMensaje({
          open: true,
          tipo: "error",
          texto: "Todos los campos básicos edificatorios son obligatorios",
        });
        return;
      }
    }

    // Validar datos numéricos
    const validacion =
      parametrosUrbanisticosService.validarDatos(parametrosEdit);
    if (!validacion.valido) {
      setModalMensaje({
        open: true,
        tipo: "error",
        texto: `Errores de validación: ${validacion.errores.join(", ")}`,
      });
      return;
    }

    try {
      setCargando(true);

      // Obtener ID del expediente
      const idExpediente = expediente.expediente || expediente.id_expediente;

      if (!idExpediente) {
        throw new Error("No se pudo determinar el ID del expediente");
      }

      // ID del técnico (debería venir del contexto de autenticación)
      const idTecnico = 1; // Temporal - reemplazar con valor real

      // Mapear datos locales a estructura de API
      const datosParaAPI = parametrosUrbanisticosService.mapearDatosParaAPI(
        parametrosEdit,
        idTecnico
      );

      // Guardar parámetros en el backend
      const resultado = await parametrosUrbanisticosService.guardarParametros(
        idExpediente,
        datosParaAPI
      );

      if (resultado.id_parametro) {
        // Actualizar estado local con los parámetros guardados
        const nuevosParametros =
          parametrosUrbanisticosService.formatearDatosParaVisualizacion({
            ...parametrosEdit,
            areaTerritorial: parametrosEdit.areaTerritorial,
            areaActUrb: parametrosEdit.areaActUrb,
            areaLoteNormativo: parametrosEdit.areaLoteNormativo,
            zonificacion: parametrosEdit.zonificacion,
            b_es_urbanistico: parametrosEdit.b_es_urbanistico,
          });

        setParametros(nuevosParametros);

        // Salir del modo edición
        setModoEdicion(false);

        setModalMensaje({
          open: true,
          tipo: "exito",
          texto: `¡Parámetros ${
            parametrosEdit.b_es_urbanistico ? "urbanísticos" : "edificatorios"
          } guardados correctamente!`,
        });
      } else {
        throw new Error("No se recibió confirmación del servidor");
      }
    } catch (error) {
      console.error("Error al guardar parámetros urbanísticos:", error);
      setModalMensaje({
        open: true,
        tipo: "error",
        texto: error.message || "Error al guardar parámetros urbanísticos",
      });
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setParametrosEdit({
      ...parametrosEdit,
      [campo]: valor,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Botón volver */}
      <Button size="sm" variant="flat" onPress={onBack} className="mb-6">
        ⬅ Volver atrás
      </Button>

      {/* Expediente - AHORA USA LA PROP DIRECTAMENTE */}
      <Card className="p-5 mb-6 shadow-md rounded-xl border border-gray-200">
        <div className="text-gray-600">N° de expediente</div>
        <div className="text-blue-600 text-lg font-semibold">
          {expediente?.expediente || "----"}
        </div>
        <div className="text-gray-600 mt-2">Administrado</div>
        <div className="text-gray-900 font-semibold">
          {expediente?.nombre_completo || "----"}
        </div>
      </Card>

      {/* Indicador de carga */}
      {cargando && (
        <div className="p-3 bg-blue-50 border rounded mb-6">
          <p className="text-blue-700">Cargando parámetros urbanísticos...</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={tab === "urbanisticos" ? "solid" : "flat"}
          color="primary"
          onPress={() => setTab("urbanisticos")}
          className="flex-1"
        >
          Urbanísticos
        </Button>
        <Button
          variant={tab === "edificatorios" ? "solid" : "flat"}
          color="primary"
          onPress={() => setTab("edificatorios")}
          className="flex-1"
        >
          Edificatorios
        </Button>
      </div>

      {/* Contenido - Urbanísticos */}
      {tab === "urbanisticos" && (
        <Card className="p-6 shadow-sm rounded-xl border border-gray-200 space-y-3">
          {!modoEdicion ? (
            // MODO VISUALIZACIÓN
            <>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Área territorial
                </span>
                <span className="text-gray-900 font-semibold">
                  {parametros.areaTerritorial}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Área de Act. Urb
                </span>
                <span className="text-gray-900 font-semibold">
                  {parametros.areaActUrb}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Zonificación</span>
                <span className="text-gray-900 font-semibold">
                  {parametros.zonificacion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Área de lote normativo
                </span>
                <span className="text-gray-900 font-semibold">
                  {parametros.areaLoteNormativo}
                </span>
              </div>

              <Button
                color="primary"
                onPress={iniciarEdicion}
                className="mt-4"
                disabled={cargando}
              >
                {cargando ? "Cargando..." : "✏️ Editar Parámetros"}
              </Button>
            </>
          ) : (
            // MODO EDICIÓN
            <>
              <Input
                label="Área Territorial (m²)"
                placeholder="Escribe el área"
                value={parametrosEdit.areaTerritorial}
                onChange={(e) =>
                  handleInputChange("areaTerritorial", e.target.value)
                }
                disabled={cargando}
              />
              <Input
                label="Área de Act. Urb (m²)"
                placeholder="Escribe el área"
                value={parametrosEdit.areaActUrb}
                onChange={(e) =>
                  handleInputChange("areaActUrb", e.target.value)
                }
                disabled={cargando}
              />
              <Input
                label="Zonificación"
                placeholder="Ej: RDM-2"
                value={parametrosEdit.zonificacion}
                onChange={(e) =>
                  handleInputChange("zonificacion", e.target.value)
                }
                disabled={cargando}
              />
              <Input
                label="Área de lote normativo (m²)"
                placeholder="Escribe el área"
                value={parametrosEdit.areaLoteNormativo}
                onChange={(e) =>
                  handleInputChange("areaLoteNormativo", e.target.value)
                }
                disabled={cargando}
              />

              {/* Botones */}
              <div className="flex gap-4 pt-2">
                <Button
                  color="primary"
                  onPress={handleGuardar}
                  className="flex-1"
                  disabled={cargando}
                >
                  {cargando ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="flat"
                  onPress={cancelarEdicion}
                  className="flex-1"
                  disabled={cargando}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Contenido - Edificatorios */}
      {tab === "edificatorios" && (
        <Card className="p-6 shadow-sm rounded-xl border border-gray-200 space-y-3">
          {!modoEdicion ? (
            // MODO VISUALIZACIÓN
            <>
              {/* Parámetros básicos */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Área territorial
                </span>
                <span className="text-gray-900 font-semibold">
                  {parametros.areaTerritorial}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Área de Act. Urb
                </span>
                <span className="text-gray-900 font-semibold">
                  {parametros.areaActUrb}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Zonificación</span>
                <span className="text-gray-900 font-semibold">
                  {parametros.zonificacion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Área de lote normativo
                </span>
                <span className="text-gray-900 font-semibold">
                  {parametros.areaLoteNormativo}
                </span>
              </div>

              {/* Parámetros edificatorios */}
              <div className="border-t pt-3 mt-3">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Parámetros Edificatorios
                </h4>

                {/* Usos Permisibles */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Usos Permisibles Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.usosPermisiblesNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Usos Permisibles Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.usosPermisiblesProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.usosPermisiblesAnotaciones || "-"}
                    </div>
                  </div>
                </div>

                {/* Coeficiente Edificatorio */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Coeficiente Edif. Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.coeficienteEdifNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Coeficiente Edif. Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.coeficienteEdifProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.coeficienteEdifAnotaciones || "-"}
                    </div>
                  </div>
                </div>

                {/* Porcentaje Área Libre */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      % Área Libre Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.porcentajeAreaLibreNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      % Área Libre Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.porcentajeAreaLibreProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.porcentajeAreaLibreAnotaciones || "-"}
                    </div>
                  </div>
                </div>

                {/* Altura Edificación */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Altura Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.alturaEdificacionNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Altura Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.alturaEdificacionProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.alturaEdificacionAnotaciones || "-"}
                    </div>
                  </div>
                </div>

                {/* Retiro Mínimo Frontal */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Retiro Frontal Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.retiroMinimoFrontalNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Retiro Frontal Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.retiroMinimoFrontalProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.retiroMinimoFrontalAnotaciones || "-"}
                    </div>
                  </div>
                </div>

                {/* Alineamiento */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Alineamiento Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.alineamientoNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Alineamiento Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.alineamientoProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.alineamientoAnotaciones || "-"}
                    </div>
                  </div>
                </div>

                {/* Estacionamiento */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Estacionamiento Normado
                    </span>
                    <div className="text-gray-900">
                      {parametros.estacionamientoNormado || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Estacionamiento Proyecto
                    </span>
                    <div className="text-gray-900">
                      {parametros.estacionamientoProyecto || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-sm">
                      Anotaciones
                    </span>
                    <div className="text-gray-900">
                      {parametros.estacionamientoAnotaciones || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                color="primary"
                onPress={iniciarEdicion}
                className="mt-4"
                disabled={cargando}
              >
                {cargando ? "Cargando..." : "✏️ Editar Parámetros"}
              </Button>
            </>
          ) : (
            // MODO EDICIÓN
            <>
              {/* Parámetros básicos */}
              <Input
                label="Área Territorial (m²)"
                placeholder="Escribe el área"
                value={parametrosEdit.areaTerritorial}
                onChange={(e) =>
                  handleInputChange("areaTerritorial", e.target.value)
                }
                disabled={cargando}
              />
              <Input
                label="Área de Act. Urb (m²)"
                placeholder="Escribe el área"
                value={parametrosEdit.areaActUrb}
                onChange={(e) =>
                  handleInputChange("areaActUrb", e.target.value)
                }
                disabled={cargando}
              />
              <Input
                label="Zonificación"
                placeholder="Ej: RDM-2"
                value={parametrosEdit.zonificacion}
                onChange={(e) =>
                  handleInputChange("zonificacion", e.target.value)
                }
                disabled={cargando}
              />
              <Input
                label="Área de lote normativo (m²)"
                placeholder="Escribe el área"
                value={parametrosEdit.areaLoteNormativo}
                onChange={(e) =>
                  handleInputChange("areaLoteNormativo", e.target.value)
                }
                disabled={cargando}
              />

              {/* Parámetros edificatorios */}
              <div className="border-t pt-3 mt-3">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Parámetros Edificatorios
                </h4>

                {/* Usos Permisibles */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Usos Permisibles Normado"
                    placeholder="Normado"
                    value={parametrosEdit.usosPermisiblesNormado}
                    onChange={(e) =>
                      handleInputChange(
                        "usosPermisiblesNormado",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Usos Permisibles Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.usosPermisiblesProyecto}
                    onChange={(e) =>
                      handleInputChange(
                        "usosPermisiblesProyecto",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.usosPermisiblesAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "usosPermisiblesAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>

                {/* Coeficiente Edificatorio */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Coeficiente Edif. Normado"
                    placeholder="Normado"
                    value={parametrosEdit.coeficienteEdifNormado}
                    onChange={(e) =>
                      handleInputChange(
                        "coeficienteEdifNormado",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Coeficiente Edif. Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.coeficienteEdifProyecto}
                    onChange={(e) =>
                      handleInputChange(
                        "coeficienteEdifProyecto",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.coeficienteEdifAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "coeficienteEdifAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>

                {/* Porcentaje Área Libre */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="% Área Libre Normado"
                    placeholder="Normado"
                    value={parametrosEdit.porcentajeAreaLibreNormado}
                    onChange={(e) =>
                      handleInputChange(
                        "porcentajeAreaLibreNormado",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="% Área Libre Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.porcentajeAreaLibreProyecto}
                    onChange={(e) =>
                      handleInputChange(
                        "porcentajeAreaLibreProyecto",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.porcentajeAreaLibreAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "porcentajeAreaLibreAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>

                {/* Altura Edificación */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Altura Normado"
                    placeholder="Normado"
                    value={parametrosEdit.alturaEdificacionNormado}
                    onChange={(e) =>
                      handleInputChange(
                        "alturaEdificacionNormado",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Altura Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.alturaEdificacionProyecto}
                    onChange={(e) =>
                      handleInputChange(
                        "alturaEdificacionProyecto",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.alturaEdificacionAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "alturaEdificacionAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>

                {/* Retiro Mínimo Frontal */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Retiro Frontal Normado"
                    placeholder="Normado"
                    value={parametrosEdit.retiroMinimoFrontalNormado}
                    onChange={(e) =>
                      handleInputChange(
                        "retiroMinimoFrontalNormado",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Retiro Frontal Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.retiroMinimoFrontalProyecto}
                    onChange={(e) =>
                      handleInputChange(
                        "retiroMinimoFrontalProyecto",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.retiroMinimoFrontalAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "retiroMinimoFrontalAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>

                {/* Alineamiento */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Alineamiento Normado"
                    placeholder="Normado"
                    value={parametrosEdit.alineamientoNormado}
                    onChange={(e) =>
                      handleInputChange("alineamientoNormado", e.target.value)
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Alineamiento Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.alineamientoProyecto}
                    onChange={(e) =>
                      handleInputChange("alineamientoProyecto", e.target.value)
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.alineamientoAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "alineamientoAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>

                {/* Estacionamiento */}
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Estacionamiento Normado"
                    placeholder="Normado"
                    value={parametrosEdit.estacionamientoNormado}
                    onChange={(e) =>
                      handleInputChange(
                        "estacionamientoNormado",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Estacionamiento Proyecto"
                    placeholder="Proyecto"
                    value={parametrosEdit.estacionamientoProyecto}
                    onChange={(e) =>
                      handleInputChange(
                        "estacionamientoProyecto",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                  <Input
                    label="Anotaciones"
                    placeholder="Anotaciones"
                    value={parametrosEdit.estacionamientoAnotaciones}
                    onChange={(e) =>
                      handleInputChange(
                        "estacionamientoAnotaciones",
                        e.target.value
                      )
                    }
                    disabled={cargando}
                  />
                </div>
              </div>

              {/* Campo para determinar el tipo */}
              <div className="border-t pt-3 mt-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={parametrosEdit.b_es_urbanistico}
                    onChange={(e) =>
                      handleInputChange("b_es_urbanistico", e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="text-gray-700">
                    Es parámetro urbanístico
                  </span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-2">
                <Button
                  color="primary"
                  onPress={handleGuardar}
                  className="flex-1"
                  disabled={cargando}
                >
                  {cargando ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="flat"
                  onPress={cancelarEdicion}
                  className="flex-1"
                  disabled={cargando}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalMensaje.open}
        onClose={() => setModalMensaje({ ...modalMensaje, open: false })}
      >
        <ModalContent>
          <ModalHeader
            className={`font-bold ${
              modalMensaje.tipo === "exito" ? "text-green-600" : "text-red-600"
            }`}
          >
            {modalMensaje.tipo === "exito" ? "✅ Éxito" : "❌ Error"}
          </ModalHeader>
          <ModalBody>
            <p>{modalMensaje.texto}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
