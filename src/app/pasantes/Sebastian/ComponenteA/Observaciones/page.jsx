"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";

import observacionesService from "@/app/services/Sebastian/Observaciones/observacionesService";
import ObservacionItem from "@/components/custom/custom_Sebastian/CustomObservaciones/ObservacionItem";
import ObservacionInput from "@/components/custom/custom_Sebastian/CustomObservaciones/ObservacionInput";
import SuccessModal from "@/components/custom/custom_Sebastian/CustomObservaciones/successModal";
import ErrorModal from "@/components/custom/custom_Sebastian/CustomObservaciones/errorModal";

export default function Observaciones({ expediente, onBack }) {
  const [observaciones, setObservaciones] = useState([]); // lista de obs guardadas
  const [modoEdicion, setModoEdicion] = useState(false);
  const [observacionesEditadas, setObservacionesEditadas] = useState([]); // todas las obs en  edición
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  // Cargar observaciones al montar el componente o cuando cambie el expediente
  useEffect(() => {
    const cargarObservaciones = async () => {
      if (!expediente) return;

      try {
        setCargando(true);

        // Obtener ID del expediente
        const idExpediente = expediente.expediente || expediente.id_expediente;

        if (!idExpediente) {
          console.error("No se pudo determinar el ID del expediente");
          return;
        }

        // Obtener observaciones existentes desde la API
        const observacionesAPI =
          await observacionesService.obtenerObservaciones(idExpediente);

        setObservaciones(observacionesAPI);
      } catch (error) {
        console.error("Error al cargar observaciones:", error);
        setMensajeError("Error al cargar observaciones existentes");
        setShowError(true);
      } finally {
        setCargando(false);
      }
    };

    cargarObservaciones();
  }, [expediente]);

  // Inicializar observaciones editadas cuando entramos en modo edición
  useEffect(() => {
    if (modoEdicion) {
      setObservacionesEditadas([...observaciones]);
    }
  }, [modoEdicion, observaciones]);

  // Agregar nueva observación vacía
  const handleAgregar = () => {
    setObservacionesEditadas([...observacionesEditadas, ""]);
  };

  // Editar observación en edición
  const handleEditarObs = (index, value) => {
    const updated = [...observacionesEditadas];
    updated[index] = value;
    setObservacionesEditadas(updated);
  };

  // Eliminar observación en edición
  const handleEliminarObs = (index) => {
    const updated = observacionesEditadas.filter((_, i) => i !== index);
    setObservacionesEditadas(updated);
  };

  // Cancelar edición - vuelve al estado inicial
  const handleCancelar = () => {
    setModoEdicion(false);
  };

  // Guardar cambios
  const handleGuardar = async () => {
    // Filtrar observaciones vacías
    const observacionesValidas = observacionesEditadas.filter(
      (obs) => obs.trim() !== ""
    );

    try {
      setCargando(true);

      // Obtener ID del expediente
      const idExpediente = expediente.expediente || expediente.id_expediente;

      if (!idExpediente) {
        throw new Error("No se pudo determinar el ID del expediente");
      }

      // ID del técnico (debería venir del contexto de autenticación)
      const idTecnico = 1; // Temporal - reemplazar con valor real

      // Guardar observaciones en el backend
      const resultado = await observacionesService.guardarObservaciones(
        idExpediente,
        idTecnico,
        observacionesValidas
      );

      if (resultado.success) {
        // Actualizar estado local con las observaciones guardadas
        setObservaciones(observacionesValidas);
        setModoEdicion(false);
        setShowSuccess(true);
      } else {
        throw new Error(resultado.message || "Error al guardar observaciones");
      }
    } catch (error) {
      console.error("Error al guardar observaciones:", error);
      setMensajeError(error.message || "Error al guardar observaciones");
      setShowError(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Observaciones</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Button size="sm" variant="light" onPress={onBack} className="mb-3">
            &lt;&lt; Volver atrás
          </Button>

          <div className="mb-2">
            <strong>N° de expediente:</strong> {expediente?.expediente}
          </div>
          <div className="mb-4">
            <strong>Administrado:</strong> {expediente?.nombre_completo}
          </div>

          {cargando && (
            <div className="p-3 bg-blue-50 border rounded">
              <p className="text-blue-700">Cargando observaciones...</p>
            </div>
          )}

          {/* Si no hay observaciones y no está en edición */}
          {!cargando && observaciones.length === 0 && !modoEdicion && (
            <div className="p-3 bg-blue-50 border rounded">
              <p className="text-blue-700">
                Todavía no hay ninguna observación registrada.
              </p>
              <Button
                size="sm"
                variant="flat"
                onPress={() => setModoEdicion(true)}
              >
                + Agregar observaciones
              </Button>
            </div>
          )}

          {/* Mostrar lista de observaciones guardadas (modo visualización) */}
          {!cargando && observaciones.length > 0 && !modoEdicion && (
            <div>
              <h3 className="font-semibold mb-2">Observaciones:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {observaciones.map((obs, idx) => (
                  <ObservacionItem key={idx} texto={obs} />
                ))}
              </ul>
              <Button
                size="sm"
                variant="flat"
                className="mt-2"
                onPress={() => setModoEdicion(true)}
              >
                ✏️ Editar observaciones
              </Button>
            </div>
          )}

          {/* Modo edición - mostrar TODAS las observaciones */}
          {modoEdicion && (
            <div className="space-y-3">
              {observacionesEditadas.map((obs, idx) => (
                <ObservacionInput
                  key={idx}
                  value={obs}
                  onChange={(val) => handleEditarObs(idx, val)}
                  onDelete={() => handleEliminarObs(idx)}
                />
              ))}

              <Button size="sm" variant="flat" onPress={handleAgregar}>
                + Agregar más observaciones
              </Button>

              <div className="flex gap-3 mt-4">
                <Button
                  color="primary"
                  onPress={handleGuardar}
                  disabled={cargando}
                >
                  {cargando ? "Guardando..." : "Guardar observaciones"}
                </Button>
                <Button
                  variant="flat"
                  onPress={handleCancelar}
                  disabled={cargando}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modales */}
      {showSuccess && (
        <SuccessModal
          title="Éxito"
          message={
            observaciones.length === 0
              ? "Todas las observaciones han sido eliminadas."
              : "Las observaciones se guardaron correctamente."
          }
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorModal
          title="Error"
          message={
            mensajeError || "Debe ingresar al menos una observación válida."
          }
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
