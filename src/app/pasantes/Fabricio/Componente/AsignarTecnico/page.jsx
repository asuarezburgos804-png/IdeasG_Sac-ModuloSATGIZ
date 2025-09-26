"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import {
  buscarExpedientes,
  asignarTecnico,
  obtenerTecnicoAsignado,
  buscarTecnicos,
  obtenerExpediente,
} from "@/app/services/Fabricio/AsignarTecnico/fuhuFueService";

export default function AsignarTecnico() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [tecnicoAsignado, setTecnicoAsignado] = useState(null);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [modalTecnicos, setModalTecnicos] = useState(false);
  const [busquedaTecnico, setBusquedaTecnico] = useState("");
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTecnicos, setLoadingTecnicos] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalExpediente, setModalExpediente] = useState(false);
  const [expedienteData, setExpedienteData] = useState(null);
  const [loadingExpediente, setLoadingExpediente] = useState(false);

  // Efecto para búsqueda progresiva de expedientes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (busqueda.trim().length > 0) {
        handleBuscarExpedientes();
      } else {
        setResultados([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // Efecto para cargar técnico asignado cuando se selecciona un expediente
  useEffect(() => {
    if (seleccionado) {
      cargarTecnicoAsignado();
    }
  }, [seleccionado]);

  const handleBuscarExpedientes = async () => {
    setLoading(true);
    try {
      const response = await buscarExpedientes(busqueda, busqueda);
      if (response.success) {
        setResultados(response.data);
      } else {
        setResultados([]);
      }
    } catch (error) {
      console.error("Error buscando expedientes:", error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarTecnicoAsignado = async () => {
    try {
      const response = await obtenerTecnicoAsignado(seleccionado.id_expediente);
      if (response.success && response.data) {
        setTecnicoAsignado(response.data);
      } else {
        setTecnicoAsignado(null);
      }
    } catch (error) {
      console.error("Error obteniendo técnico asignado:", error);
      setTecnicoAsignado(null);
    }
  };

  const handleBuscarTecnicos = async () => {
    setLoadingTecnicos(true);
    try {
      const response = await buscarTecnicos(busquedaTecnico);
      if (response.success) {
        setTecnicos(response.data);
      } else {
        setTecnicos([]);
      }
    } catch (error) {
      console.error("Error buscando técnicos:", error);
      setTecnicos([]);
    } finally {
      setLoadingTecnicos(false);
    }
  };

  const handleVisualizarExpediente = async () => {
    setLoadingExpediente(true);
    try {
      const response = await obtenerExpediente(seleccionado.id_expediente);
      if (response.success) {
        setExpedienteData(response.data);
        setModalExpediente(true);
      }
    } catch (error) {
      console.error("Error obteniendo expediente:", error);
    } finally {
      setLoadingExpediente(false);
    }
  };

  const handleAsignarTecnico = async (tecnico) => {
    try {
      const response = await asignarTecnico(
        seleccionado.id_expediente,
        tecnico.c_dni_tecnico,
        tecnico.c_nombre_tecnico
      );

      if (response.success) {
        setSuccessMessage("Los datos fueron guardados exitosamente");
        setTecnicoAsignado(response.data);
        setModalTecnicos(false);
      }
    } catch (error) {
      console.error("Error asignando técnico:", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Asignar Técnico</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {!seleccionado ? (
            <>
              <Input
                label="Ingrese el dni o nombre del administrado"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="mb-4"
              />

              <div className="max-h-48 overflow-y-auto border rounded">
                {loading ? (
                  <div className="p-4 text-center">
                    <Spinner />
                  </div>
                ) : resultados.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2">N° de expediente</th>
                        <th className="text-left p-2">DNI</th>
                        <th className="text-left p-2">Administrado</th>
                        <th className="text-left p-2">Fecha de reg.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((expediente) => (
                        <tr
                          key={expediente.id_expediente}
                          className="border-b hover:bg-blue-100 cursor-pointer"
                          onClick={() => setSeleccionado(expediente)}
                        >
                          <td className="p-2">{expediente.id_expediente}</td>
                          <td className="p-2">{expediente.dni}</td>
                          <td className="p-2">{expediente.administrado}</td>
                          <td className="p-2">{expediente.fecha_registro}</td>
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
                onPress={() => {
                  setSeleccionado(null);
                  setTecnicoAsignado(null);
                  setSuccessMessage("");
                }}
                className="mb-4"
              >
                &lt;&lt; Volver atrás
              </Button>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Técnico:</strong>{" "}
                    {tecnicoAsignado ? (
                      <span className="text-blue-600">
                        {tecnicoAsignado.c_nombre_tecnico}
                        <span
                          className="text-blue-600 cursor-pointer ml-2"
                          onClick={() => setModalTecnicos(true)}
                        >
                          ✏️
                        </span>
                      </span>
                    ) : (
                      <span
                        className="text-blue-600 underline cursor-pointer"
                        onClick={() => setModalTecnicos(true)}
                      >
                        Asignar
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <strong>Expediente:</strong>{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={handleVisualizarExpediente}
                  >
                    Visualizar
                  </span>
                </div>

                <div>
                  <strong>N° de expediente:</strong>{" "}
                  {seleccionado.id_expediente}
                </div>
                <div>
                  <strong>Administrado:</strong> {seleccionado.administrado}
                </div>
                <div>
                  <strong>DNI:</strong> {seleccionado.dni}
                </div>
                <div>
                  <strong>Fecha de solic:</strong> {seleccionado.fecha_registro}
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Modal para seleccionar técnico */}
      <Modal
        isOpen={modalTecnicos}
        onOpenChange={setModalTecnicos}
        onOpen={() => {
          setBusquedaTecnico("");
          setTecnicos([]);
        }}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Asignar Técnico</ModalHeader>
              <ModalBody>
                <Input
                  label="Buscar por el dni o nombre"
                  value={busquedaTecnico}
                  onChange={(e) => setBusquedaTecnico(e.target.value)}
                  className="mb-4"
                />

                <Button
                  color="primary"
                  onPress={handleBuscarTecnicos}
                  className="mb-4"
                >
                  Buscar
                </Button>

                {loadingTecnicos ? (
                  <div className="text-center py-4">
                    <Spinner />
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {tecnicos.length > 0 ? (
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-2">DNI</th>
                            <th className="text-left p-2">Nombre</th>
                            <th className="text-left p-2">Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tecnicos.map((tecnico) => (
                            <tr key={tecnico.id_tecnico} className="border-b">
                              <td className="p-2">{tecnico.c_dni_tecnico}</td>
                              <td className="p-2">
                                {tecnico.c_nombre_tecnico}
                              </td>
                              <td className="p-2">
                                <Button
                                  size="sm"
                                  color="primary"
                                  onPress={() => {
                                    handleAsignarTecnico(tecnico);
                                    onClose();
                                  }}
                                >
                                  Seleccionar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-gray-500 text-center py-4">
                        {busquedaTecnico.trim().length > 0
                          ? "No se encontraron técnicos"
                          : "Ingrese texto para buscar técnicos"}
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancelar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para visualizar expediente */}
      <Modal
        isOpen={modalExpediente}
        onClose={() => setModalExpediente(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="font-bold">
            Formulario Unico de Edificaciones
          </ModalHeader>
          <ModalBody>
            {loadingExpediente ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : expedienteData ? (
              <div className="text-sm">
                <div className="mb-4">
                  <strong>Solicitud</strong>
                  <hr className="my-2" />
                  <div>
                    <strong>Propietario:</strong> SI
                  </div>
                  <hr className="my-2" />
                </div>

                <div className="mb-4">
                  <strong>Tipo de persona:</strong> Persona Natural
                  <hr className="my-2" />
                </div>

                <div className="mb-4">
                  <strong>Datos de Persona</strong>
                  <hr className="my-2" />
                  <div className="ml-4">
                    <div>
                      <strong>DNI:</strong>{" "}
                      {expedienteData.propietario?.c_num_doc || "N/A"}
                    </div>
                    <div>
                      <strong>Apellido pat:</strong>{" "}
                      {expedienteData.propietario?.c_appat_per || "N/A"}
                    </div>
                    <div>
                      <strong>Apellido mat:</strong>{" "}
                      {expedienteData.propietario?.c_apmat_per || "N/A"}
                    </div>
                    <div>
                      <strong>Nombres:</strong>{" "}
                      {expedienteData.propietario?.c_nomb_per || "N/A"}
                    </div>
                    <div>
                      <strong>Correo elect:</strong>{" "}
                      {expedienteData.propietario?.c_correo || "N/A"}
                    </div>
                    <div>
                      <strong>Teléfono:</strong>{" "}
                      {expedienteData.propietario?.c_telefono || "N/A"}
                    </div>
                    <div>
                      <strong>Estado civil:</strong>{" "}
                      {expedienteData.propietario?.cod_est_civil || "N/A"}
                    </div>
                  </div>
                  <hr className="my-2" />
                </div>

                <div className="mb-4">
                  <strong>Domicilio</strong>
                  <hr className="my-2" />
                  <div className="ml-4">
                    <div>
                      <strong>Departamento:</strong>{" "}
                      {expedienteData.domicilio?.c_ubigeo_dep || "N/A"}
                    </div>
                    <div>
                      <strong>Provincia:</strong>{" "}
                      {expedienteData.domicilio?.c_ubigeo_prov || "N/A"}
                    </div>
                    <div>
                      <strong>Distrito:</strong>{" "}
                      {expedienteData.domicilio?.c_ubigeo_dist || "N/A"}
                    </div>
                    <div>
                      <strong>Urbanizacion:</strong>{" "}
                      {expedienteData.domicilio?.c_direccion || "N/A"}
                    </div>
                    <div>
                      <strong>Lote:</strong>{" "}
                      {expedienteData.domicilio?.c_lote || "N/A"}
                    </div>
                    <div>
                      <strong>Sublote:</strong>{" "}
                      {expedienteData.domicilio?.c_sublote || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No hay datos disponibles
              </div>
            )}

            <Button
              onPress={() => setModalExpediente(false)}
              className="mt-4"
              color="primary"
            >
              Cerrar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
