"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import verificacionCuadroAreaService from "@/app/services/Alexander/VerificacionCuadroAreas/verificacionCuadroAreaService";

export default function VerificacionCuadroAreas({
  expediente: expedienteProp,
  onBack,
}) {
  const [pisos, setPisos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  // Función para sessionStorage
  const debugSessionStorage = () => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
    }
  };

  // Obtener datos del expediente de sessionStorage o parámetros
  const [expediente, setExpediente] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        // Si no hay expediente en props, intentar obtener de sessionStorage
        let expedienteData = expedienteProp;

        if (!expedienteData) {
          const expedienteGuardado = sessionStorage.getItem("expediente");
          if (expedienteGuardado) {
            expedienteData = JSON.parse(expedienteGuardado);
          }
        }

        if (
          expedienteData &&
          (expedienteData.expediente ||
            expedienteData.id_expediente ||
            expedienteData.id_solicitud)
        ) {
          // Usar el número de expediente como ID del expediente (ya que son lo mismo)
          const idExpediente =
            expedienteData.expediente ||
            expedienteData.id_expediente ||
            expedienteData.id_solicitud;

          // Estructura normalizada del expediente
          const expedienteNormalizado = {
            numero: expedienteData.expediente || idExpediente || "",
            administrado:
              expedienteData.nombre_completo ||
              expedienteData.administrado ||
              "",
            id_expediente: idExpediente || "",
            dni: expedienteData.dni || "",
          };

          setExpediente(expedienteNormalizado);

          // Cargar datos de verificación de cuadro de área

          const datosVerificacion =
            await verificacionCuadroAreaService.obtenerVerificacion(
              idExpediente
            );

          if (
            datosVerificacion &&
            (datosVerificacion.id_verificacion_cuadro ||
              datosVerificacion.detallesPisos)
          ) {
            const datosMapeados =
              verificacionCuadroAreaService.mapearDatosDesdeAPI(
                datosVerificacion
              );

            setPisos(datosMapeados?.pisos || []);
          } else {
            setPisos([]);
          }
        } else {
          console.error("Expediente no válido o sin ID:", expedienteData);
          setExpediente(null);
          setPisos([]);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setExpediente(null);
        setPisos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [expedienteProp]);

  // Manejar cambios en los campos de los pisos
  const handleCambioPiso = (id, campo, valor) => {
    setPisos((prevPisos) =>
      prevPisos.map((piso) =>
        piso.id === id ? { ...piso, [campo]: valor } : piso
      )
    );
  };

  // Agregar nuevo piso
  const handleAgregarPiso = () => {
    const nuevoNumero =
      pisos.length > 0 ? Math.max(...pisos.map((p) => p.numero)) + 1 : 1;
    const nuevoPiso = {
      id: Date.now(),
      numero: nuevoNumero,
      existente: "",
      ampliacion: "",
      nuevo: "",
      demolicion: "",
      remodelacion: "",
      observacion: "",
    };
    setPisos([...pisos, nuevoPiso]);
  };

  // Guardar cambios
  const handleGuardar = async () => {
    if (!expediente) {
      alert("No hay expediente cargado. Por favor, recargue la página.");
      return;
    }

    // Validar pisos antes de guardar
    const validacion = verificacionCuadroAreaService.validarPisos(pisos);
    if (!validacion.valido) {
      alert(`Errores de validación:\n${validacion.errores.join("\n")}`);
      return;
    }

    setCargando(true);
    try {
      // ID del técnico (debería venir del contexto de autenticación)
      const idTecnico = 1; // Temporal - reemplazar con valor real

      const datosAPI = verificacionCuadroAreaService.mapearDatosParaAPI(
        pisos,
        idTecnico,
        ""
      );

      const resultado = await verificacionCuadroAreaService.guardarVerificacion(
        expediente.id_expediente,
        datosAPI
      );

      if (resultado.success) {
        setMensajeExito(
          "Verificación de cuadro de áreas guardada exitosamente"
        );
        setModoEdicion(false);
        setTimeout(() => setMensajeExito(""), 3000);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la verificación. Por favor, intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Cancelar edición
  const handleCancelar = () => {
    setModoEdicion(false);
    // Recargar los datos originales desde la API
    const cargarDatosOriginales = async () => {
      if (!expediente) return;

      setCargando(true);
      try {
        const datosVerificacion =
          await verificacionCuadroAreaService.obtenerVerificacion(
            expediente.id_expediente
          );

        if (datosVerificacion) {
          const datosMapeados =
            verificacionCuadroAreaService.mapearDatosDesdeAPI(
              datosVerificacion
            );
          setPisos(datosMapeados.pisos || []);
        } else {
          setPisos([]);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setPisos([]);
      } finally {
        setCargando(false);
      }
    };
    cargarDatosOriginales();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Técnico verificador</h2>
          {/* Botón volver atrás - MODIFICADO */}
          <Button size="sm" variant="light" onPress={onBack}>
            &lt;&lt; Volver atrás
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          {/* Mostrar estado de carga */}
          {cargando && !expediente && (
            <div className="text-center py-8">
              Cargando información del expediente...
            </div>
          )}

          {/* Mostrar error si no se pudo cargar el expediente */}
          {!cargando && !expediente && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              No se pudo cargar la información del expediente. Por favor,
              verifique que haya seleccionado un expediente válido.
            </div>
          )}

          {/* Información del expediente - solo mostrar cuando esté cargado */}
          {expediente && (
            <div className="mb-6">
              <div className="mb-2">
                <strong>N° de expediente:</strong> {expediente.numero}
              </div>
              <div className="mb-2">
                <strong>Administrado:</strong> {expediente.administrado}
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {mensajeExito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {mensajeExito}
            </div>
          )}

          {/* Encabezado con botón de edición - solo mostrar si hay expediente */}
          {expediente && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Verificación cuadro de áreas:
              </h3>
              {!modoEdicion ? (
                <span
                  className="text-blue-600 cursor-pointer underline text-sm"
                  onClick={() => setModoEdicion(true)}
                >
                  Editar pisos
                </span>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    onPress={handleGuardar}
                    isLoading={cargando}
                  >
                    Guardar
                  </Button>
                  <Button size="sm" variant="flat" onPress={handleCancelar}>
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Lista de pisos en modo compacto - solo mostrar si hay expediente */}
          {expediente && (
            <>
              {cargando && pisos.length === 0 ? (
                <div className="text-center py-8">
                  Cargando datos de verificación...
                </div>
              ) : pisos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay elementos. Sé el primero en añadir uno!
                </div>
              ) : (
                <div className="space-y-4">
                  {pisos.map((piso) => (
                    <div
                      key={piso.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <h4 className="font-semibold mb-3">
                        Piso {piso.numero}:
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Existente (m²)
                          </label>
                          {modoEdicion ? (
                            <Input
                              size="sm"
                              value={piso.existente}
                              onChange={(e) =>
                                handleCambioPiso(
                                  piso.id,
                                  "existente",
                                  e.target.value
                                )
                              }
                              type="number"
                              min="0"
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm">
                              {piso.existente || "0"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ampliación (m²)
                          </label>
                          {modoEdicion ? (
                            <Input
                              size="sm"
                              value={piso.ampliacion}
                              onChange={(e) =>
                                handleCambioPiso(
                                  piso.id,
                                  "ampliacion",
                                  e.target.value
                                )
                              }
                              type="number"
                              min="0"
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm">
                              {piso.ampliacion || "0"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nuevo (m²)
                          </label>
                          {modoEdicion ? (
                            <Input
                              size="sm"
                              value={piso.nuevo}
                              onChange={(e) =>
                                handleCambioPiso(
                                  piso.id,
                                  "nuevo",
                                  e.target.value
                                )
                              }
                              type="number"
                              min="0"
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm">{piso.nuevo || "0"}</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Demolición (m²)
                          </label>
                          {modoEdicion ? (
                            <Input
                              size="sm"
                              value={piso.demolicion}
                              onChange={(e) =>
                                handleCambioPiso(
                                  piso.id,
                                  "demolicion",
                                  e.target.value
                                )
                              }
                              type="number"
                              min="0"
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm">
                              {piso.demolicion || "0"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remodelación (m²)
                          </label>
                          {modoEdicion ? (
                            <Input
                              size="sm"
                              value={piso.remodelacion}
                              onChange={(e) =>
                                handleCambioPiso(
                                  piso.id,
                                  "remodelacion",
                                  e.target.value
                                )
                              }
                              type="number"
                              min="0"
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm">
                              {piso.remodelacion || "0"}
                            </div>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observación
                          </label>
                          {modoEdicion ? (
                            <Textarea
                              size="sm"
                              value={piso.observacion}
                              onChange={(e) =>
                                handleCambioPiso(
                                  piso.id,
                                  "observacion",
                                  e.target.value
                                )
                              }
                              minRows={1}
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm">
                              {piso.observacion || "-"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Botón para agregar más pisos en modo edición - solo mostrar si hay expediente */}
          {expediente && modoEdicion && (
            <div className="mt-4">
              <span
                className="text-blue-600 cursor-pointer underline text-sm"
                onClick={handleAgregarPiso}
              >
                Agregar más pisos
              </span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
