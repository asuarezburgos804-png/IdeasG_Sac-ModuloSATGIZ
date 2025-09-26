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
import docsAdjuntosService from "@/app/services/Sebastian/DocsAdjuntos/docsAdjuntosService";
import rolTecnicoProgService from "@/app/services/Alexander/RolTecnicoProg/rolTecnicoProgService";
import CustomFileUpload from "@/components/custom/custom_Sebastian/CustomDocsAdjuntos/customFileUpload";
import SuccessModal from "@/components/custom/custom_Sebastian/CustomDocsAdjuntos/successModal";
import ErrorModal from "@/components/custom/custom_Sebastian/CustomDocsAdjuntos/errorModal";

export default function DocumentosAdjuntos({ expediente, onBack }) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [expedienteNum, setExpedienteNum] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [archivosNuevos, setArchivosNuevos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Función para normalizar el objeto expediente
  const normalizarExpediente = (exp) => {
    if (!exp) return null;

    // Usar id_solicitud como id_expediente si existe
    // Si no, usar expediente como id_expediente
    const idExpediente =
      exp.id_solicitud || exp.expediente || exp.id_expediente;

    return {
      ...exp,
      id_expediente: idExpediente,
      expediente: exp.expediente || exp.id_solicitud || "",
      administrado: exp.administrado || exp.nombre_completo || "",
    };
  };

  // Función para cargar documentos
  const cargarDocumentos = async (idExpediente) => {
    try {
      const documentosExistentes = await docsAdjuntosService.obtenerDocumentos(
        idExpediente
      );

      const documentosMapeados =
        docsAdjuntosService.mapearDocumentosDesdeAPI(documentosExistentes);

      setDocumentos(documentosMapeados);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      setDocumentos([]);
    }
  };

  // Si recibimos un expediente por props, lo establecemos como seleccionado
  useEffect(() => {
    if (expediente) {
      const expedienteNormalizado = normalizarExpediente(expediente);

      setSeleccionado(expedienteNormalizado);
      setExpedienteNum(expedienteNormalizado.expediente);

      // Cargar documentos inmediatamente cuando llegue el expediente por props
      cargarDocumentos(expedienteNormalizado.id_expediente);
    } else {
    }
  }, [expediente]);

  // Búsqueda progresiva
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (busqueda.trim().length > 0) {
        try {
          const resultadosFiltrados =
            await rolTecnicoProgService.buscarExpedientes(busqueda);

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

  // Seleccionar expediente
  const handleSeleccionar = async (item) => {
    const expedienteNormalizado = normalizarExpediente(item);
    setSeleccionado(expedienteNormalizado);
    setExpedienteNum(expedienteNormalizado.expediente);

    // Cargar documentos existentes del expediente
    try {
      const documentosExistentes = await docsAdjuntosService.obtenerDocumentos(
        expedienteNormalizado.id_expediente
      );

      const documentosMapeados =
        docsAdjuntosService.mapearDocumentosDesdeAPI(documentosExistentes);

      setDocumentos(documentosMapeados);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      setDocumentos([]);
    }
  };

  // Guardar documentos
  const handleGuardar = async () => {
    if (archivosNuevos.length === 0) {
      setShowError(true);
      return;
    }

    // Validar que el expediente esté seleccionado y tenga ID
    if (!seleccionado || !seleccionado.id_expediente) {
      alert(
        "Error: No se ha seleccionado un expediente válido. Por favor, seleccione un expediente primero."
      );
      return;
    }

    // Validar archivos antes de subir
    const validacion = docsAdjuntosService.prepararArchivos(archivosNuevos);
    if (validacion.tieneErrores) {
      alert(`Errores en los archivos:\n${validacion.errores.join("\n")}`);
      return;
    }

    try {
      // ID del técnico hardcodeado temporalmente para probar (debería venir del contexto de usuario)
      const idTecnicoSubio = 1;

      await docsAdjuntosService.subirDocumentos(
        seleccionado.id_expediente,
        validacion.archivosValidos,
        idTecnicoSubio
      );

      // Actualizar lista de documentos
      const documentosExistentes = await docsAdjuntosService.obtenerDocumentos(
        seleccionado.id_expediente
      );
      const documentosMapeados =
        docsAdjuntosService.mapearDocumentosDesdeAPI(documentosExistentes);
      setDocumentos(documentosMapeados);

      setArchivosNuevos([]);
      setModoEdicion(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error al guardar documentos:", error);
      alert(
        `Error al guardar documentos: ${error.message}\n\nVerifique que el expediente exista en el sistema.`
      );
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Documentos Adjuntos</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {!seleccionado ? (
            <>
              {/* Búsqueda */}
              <Input
                label="Ingrese nombre o DNI"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="mb-2"
                placeholder="Ej: 19922134 o MAMANI CHINO"
              />
              <div className="max-h-48 overflow-y-auto border rounded">
                {resultados.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2">DNI</th>
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Expediente</th>
                        <th className="text-left p-2">Fecha Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((a, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-blue-100 cursor-pointer"
                          onClick={() => handleSeleccionar(a)}
                        >
                          <td className="p-2">{a.dni}</td>
                          <td className="p-2">
                            {a.administrado || a.nombre_completo}
                          </td>
                          <td className="p-2">
                            {a.expediente || a.id_solicitud}
                          </td>
                          <td className="p-2">{a.fecha_registro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-2 text-gray-500">
                    {busqueda.trim().length > 0
                      ? "Sin resultados"
                      : "Ingrese DNI o nombre para buscar expedientes"}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Volver */}
              <Button
                size="sm"
                variant="light"
                onPress={() => {
                  setSeleccionado(null);
                  setDocumentos([]);
                  if (onBack) onBack();
                }}
                className="mb-2"
              >
                ← Volver a búsqueda
              </Button>

              {/* Datos del expediente */}
              <div className="mb-2 p-3 bg-blue-50 rounded">
                <div>
                  <strong>N° de Expediente:</strong> {expedienteNum}
                </div>
                <div>
                  <strong>Administrado:</strong>{" "}
                  {seleccionado.administrado || seleccionado.nombre_completo}
                </div>
                <div>
                  <strong>DNI:</strong> {seleccionado.dni}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  <strong>ID Expediente:</strong> {seleccionado.id_expediente}
                </div>
              </div>

              {/* Si no hay documentos */}
              {documentos.length === 0 && !modoEdicion && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-700 mb-2">
                    No hay documentos adjuntos para este expediente.
                  </p>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => setModoEdicion(true)}
                  >
                    + Agregar documentos
                  </Button>
                </div>
              )}

              {/* Si ya hay documentos */}
              {documentos.length > 0 && !modoEdicion && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Documentos Adjuntos ({documentos.length}):
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {documentos.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{doc.nombre}</span>
                        <span className="text-xs text-gray-500">
                          {doc.tamañoFormateado}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => setModoEdicion(true)}
                    className="mt-2"
                  >
                    ✏️ Agregar más documentos
                  </Button>
                </div>
              )}

              {/* Debug: Mostrar información de documentos en consola */}
              {console.log("Estado actual de documentos:", documentos)}
              {console.log("Número de documentos:", documentos.length)}
              {documentos.length > 0 &&
                console.log("Primer documento:", documentos[0])}

              {/* Modo edición */}
              {modoEdicion && (
                <div className="space-y-3">
                  <CustomFileUpload
                    files={archivosNuevos}
                    onFilesChange={(files) => setArchivosNuevos(files)}
                  />
                  <div className="flex gap-3">
                    <Button color="primary" onPress={handleGuardar}>
                      📁 Guardar documentos
                    </Button>
                    <Button
                      variant="flat"
                      onPress={() => setModoEdicion(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                  {archivosNuevos.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Listo para subir {archivosNuevos.length} documento(s)
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Modales */}
      {showSuccess && (
        <SuccessModal
          title="Éxito"
          message="Los documentos se guardaron correctamente."
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorModal
          title="Error"
          message="Debe adjuntar al menos un documento antes de guardar."
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
