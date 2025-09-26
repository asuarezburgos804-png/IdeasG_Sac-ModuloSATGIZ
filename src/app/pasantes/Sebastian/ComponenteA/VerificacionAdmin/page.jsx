"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Input,
} from "@nextui-org/react";
import verificacionAdminService from "@/app/services/Sebastian/VerificacionAdmin/verificacionAdminService";
import SuccessModal from "@/components/custom/custom_Sebastian/CustomVerificadorAdmin/successModal";
import ErrorModal from "@/components/custom/custom_Sebastian/CustomVerificadorAdmin/errorModal";

export default function VerificacionAdministrativa({ expediente, onBack }) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [criterios, setCriterios] = useState([
    {
      id: 1,
      criterio:
        "Área, linderos y medidas perimétricas según documentos de propiedad",
      cumple: false,
      observacion: "",
    },
    {
      id: 2,
      criterio: "Normas de Diseño del R.N.E.",
      cumple: false,
      observacion: "",
    },
    {
      id: 3,
      criterio: "Normas Urbanísticas y/o Edificatorias vigentes",
      cumple: false,
      observacion: "",
    },
    {
      id: 4,
      criterio: "Otros requisitos administrativos establecidos",
      cumple: false,
      observacion: "",
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Si recibimos un expediente por props, lo establecemos como seleccionado
  useEffect(() => {
    if (expediente) {
      setSeleccionado(expediente);
    }
  }, [expediente]);

  // Cargar verificación administrativa existente cuando se selecciona un expediente
  useEffect(() => {
    const cargarVerificacionExistente = async () => {
      if (!seleccionado) return;

      try {
        setCargando(true);

        // Obtener ID del expediente
        const idExpediente =
          seleccionado.id_expediente || seleccionado.expediente;

        if (!idExpediente) {
          console.error("No se pudo determinar el ID del expediente");
          return;
        }

        // Obtener verificación existente
        const verificacionExistente =
          await verificacionAdminService.obtenerVerificacion(idExpediente);

        if (verificacionExistente) {
          // Mapear datos de la API al formato local
          const criteriosMapeados =
            verificacionAdminService.mapearDatosDesdeAPI(verificacionExistente);

          if (criteriosMapeados && criteriosMapeados.length > 0) {
            setCriterios(criteriosMapeados);
          }
        } else {
          // Restablecer a valores por defecto si no hay datos
          setCriterios([
            {
              id: 1,
              criterio:
                "Área, linderos y medidas perimétricas según documentos de propiedad",
              cumple: false,
              observacion: "",
            },
            {
              id: 2,
              criterio: "Normas de Diseño del R.N.E.",
              cumple: false,
              observacion: "",
            },
            {
              id: 3,
              criterio: "Normas Urbanísticas y/o Edificatorias vigentes",
              cumple: false,
              observacion: "",
            },
            {
              id: 4,
              criterio: "Otros requisitos administrativos establecidos",
              cumple: false,
              observacion: "",
            },
          ]);
        }
      } catch (error) {
        console.error("Error al cargar verificación administrativa:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarVerificacionExistente();
  }, [seleccionado]);

  // Búsqueda con debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (busqueda.trim().length > 0) {
        try {
          const resultadosFiltrados =
            await verificacionAdminService.buscarExpedientes(busqueda);
          setResultados(resultadosFiltrados);
        } catch (error) {
          console.error("Error en búsqueda:", error);
          setResultados([]);
        }
      } else {
        setResultados([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  const handleSeleccionar = (item) => {
    console.log("Item seleccionado:", item); // DEBUG
    setSeleccionado(item);
  };

  const handleCumpleChange = (id, checked) => {
    setCriterios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, cumple: checked } : c))
    );
  };

  const handleObservacionChange = (id, value) => {
    setCriterios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, observacion: value } : c))
    );
  };

  const handleGuardar = async () => {
    // Validar que hay un expediente seleccionado
    if (
      !seleccionado ||
      (!seleccionado.id_expediente && !seleccionado.expediente)
    ) {
      console.error(
        "No hay expediente seleccionado o ID inválido",
        seleccionado
      );
      setShowError(true);
      return;
    }

    const algunSeleccionado = criterios.some(
      (c) => c.cumple || c.observacion !== ""
    );

    if (!algunSeleccionado) {
      setShowError(true);
      return;
    }

    try {
      // ID del técnico (debería venir del contexto de autenticación)
      const idTecnico = 1; // Temporal - reemplazar con valor real

      const datosAPI = verificacionAdminService.mapearDatosParaAPI(
        criterios,
        idTecnico
      );

      // Usar id_expediente si existe, sino usar expediente
      const idExpediente =
        seleccionado.id_expediente || seleccionado.expediente;

      console.log("Enviando datos:", {
        // DEBUG
        idExpediente: idExpediente,
        datos: datosAPI,
        seleccionado: seleccionado,
      });

      await verificacionAdminService.guardarVerificacion(
        idExpediente,
        datosAPI
      );

      setShowSuccess(true);
    } catch (error) {
      console.error("Error al guardar verificación:", error);
      setShowError(true);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Verificación administrativa</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {!seleccionado ? (
            <>
              <Input
                label="Ingrese nombre o DNI"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-48 overflow-y-auto border rounded">
                {resultados.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2">DNI</th>
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Fecha Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((a) => (
                        <tr
                          key={a.id_expediente} // Cambiar de id_solicitud a id_expediente
                          className="border-b hover:bg-blue-100 cursor-pointer"
                          onClick={() => handleSeleccionar(a)}
                        >
                          <td className="p-2">{a.dni}</td>
                          <td className="p-2">{a.administrado}</td>{" "}
                          {/* Cambiar nombre_completo a administrado */}
                          <td className="p-2">{a.fecha_registro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-2 text-gray-500">
                    {busqueda.trim().length > 0
                      ? "Sin resultados"
                      : "Ingrese texto para buscar"}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="light"
                onPress={onBack}
                className="mb-4"
              >
                &lt;&lt; Volver atrás
              </Button>

              <div className="mb-2">
                <strong>N° de expediente:</strong> {seleccionado.expediente}
              </div>
              <div className="mb-4">
                <strong>Administrado:</strong> {seleccionado.administrado}{" "}
                {/* Cambiar nombre_completo a administrado */}
              </div>

              {/* Tabla de criterios administrativos */}
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">Criterio</th>
                    <th className="border px-2 py-1">Cumple</th>
                    <th className="border px-2 py-1">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {criterios.map((c) => (
                    <tr key={c.id}>
                      <td className="border px-2 py-1">{c.criterio}</td>
                      <td className="border text-center">
                        <input
                          type="checkbox"
                          checked={c.cumple}
                          onChange={(e) =>
                            handleCumpleChange(c.id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          value={c.observacion}
                          onChange={(e) =>
                            handleObservacionChange(c.id, e.target.value)
                          }
                          placeholder="Ingrese observación..."
                          disabled={c.cumple}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button color="primary" className="mt-4" onPress={handleGuardar}>
                Guardar Verificación
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      {/* Modales */}
      {showSuccess && (
        <SuccessModal
          title="Éxito"
          message="La verificación administrativa se guardó correctamente."
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorModal
          title="Error"
          message="Debe marcar al menos un criterio o agregar una observación."
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
