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
import rolTecnicoProgService from "@/app/services/Alexander/RolTecnicoProg/rolTecnicoProgService";

export default function Programacion({ onVerificacionTecnica }) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const [modo, setModo] = useState("lista");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar expedientes al inicio
  useEffect(() => {
    const cargarExpedientesIniciales = async () => {
      try {
        const expedientesAPI = await rolTecnicoProgService.buscarExpedientes(
          ""
        );
        const expedientesMapeados =
          rolTecnicoProgService.mapearExpedientesDesdeAPI(expedientesAPI);
        setResultados(expedientesMapeados);
      } catch (error) {
        console.error("Error al cargar expedientes iniciales:", error);
        setResultados([]);
      }
    };

    cargarExpedientesIniciales();
  }, []);

  // Efecto para búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        const expedientesAPI = await rolTecnicoProgService.buscarExpedientes(
          busqueda
        );

        const expedientesMapeados =
          rolTecnicoProgService.mapearExpedientesDesdeAPI(expedientesAPI);

        setResultados(expedientesMapeados);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResultados([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // Función para manejar la selección de un expediente
  const handleSeleccionarExpediente = (expediente) => {
    setExpedienteSeleccionado(expediente);
    setModo("seleccionAccion");
  };

  // Función para seleccionar programación
  const handleSeleccionarProgramacion = () => {
    setModo("programacion");
  };

  // Función para redirigir a verificación técnica con datos
  const handleRedirigirVerificacionTecnica = () => {
    // Convertir nuestros datos al formato que espera el componente de verificación técnica
    const datosVerificacion = {
      id_solicitud: expedienteSeleccionado.id,
      expediente: expedienteSeleccionado.nroExp,
      dni: expedienteSeleccionado.dni,
      nombre_completo: expedienteSeleccionado.administrado,
      fecha_registro: new Date().toISOString().split("T")[0], // Fecha actual como ejemplo
    };

    // Llamar a la función del padre para cambiar a la vista de verificación técnica
    onVerificacionTecnica(
      "verificacion-tecnica",
      datosVerificacion,
      "tecnicoVerificador"
    );
  };

  // Función para programar verificación
  const handleProgramarVerificacion = async () => {
    // Validar datos de programación con la nueva validación completa
    const validacion = rolTecnicoProgService.validarProgramacionCompleta(
      expedienteSeleccionado?.id,
      fecha,
      hora,
      1 // ID del técnico temporal
    );

    if (!validacion.valido) {
      alert(`Errores de validación:\n${validacion.errores.join("\n")}`);
      return;
    }

    setCargando(true);

    try {
      // Crear datos de programación según la nueva estructura
      const datosProgramacion = {
        id_expediente: expedienteSeleccionado.id,
        id_tecnico: 1, // Temporal - reemplazar con valor real
        d_fecha_verificacion: fecha,
        t_hora_verificacion: hora + ":00", // Agregar segundos al formato HH:MM:SS
      };

      const resultado = await rolTecnicoProgService.crearProgramacion(
        datosProgramacion
      );

      // Actualizar la lista de resultados con datos reales
      const expedientesAPI = await rolTecnicoProgService.buscarExpedientes(
        busqueda
      );
      const expedientesMapeados =
        rolTecnicoProgService.mapearExpedientesDesdeAPI(expedientesAPI);
      setResultados(expedientesMapeados);

      setModo("exito");
    } catch (error) {
      console.error("Error al programar verificación:", error);
      alert(
        `Error al programar la verificación: ${error.message}. Por favor, intente nuevamente.`
      );
    } finally {
      setCargando(false);
    }
  };

  // Función para volver atrás
  const handleVolverAtras = () => {
    if (modo === "seleccionAccion") {
      setModo("lista");
      setExpedienteSeleccionado(null);
    } else if (modo === "programacion") {
      setModo("seleccionAccion");
      setFecha("");
      setHora("");
    } else if (modo === "exito") {
      setModo("lista");
      setExpedienteSeleccionado(null);
      setFecha("");
      setHora("");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Técnico verificador</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {modo === "lista" && (
            <>
              <div className="flex gap-2 mb-4">
                <Input
                  label="Ingrese el dni o nombre del administrado"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-grow"
                />
                <Button color="primary" className="mt-2">
                  Buscar
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-[#d1d5dc]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-[#d1d5dc] p-2 text-left">
                        N° de exp.
                      </th>
                      <th className="border border-[#d1d5dc] p-2 text-left">
                        DNI
                      </th>
                      <th className="border border-[#d1d5dc] p-2 text-left">
                        Administrado
                      </th>
                      <th className="border border-[#d1d5dc] p-2 text-left">
                        Fecha de verif
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.length > 0 ? (
                      resultados.map((exp) => (
                        <tr
                          key={exp.id}
                          className="border-b hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleSeleccionarExpediente(exp)}
                        >
                          <td className="p-2 border border-[#d1d5dc]">
                            {exp.nroExp}
                          </td>
                          <td className="p-2 border border-[#d1d5dc]">
                            {exp.dni}
                          </td>
                          <td className="p-2 border border-[#d1d5dc]">
                            {exp.administrado}
                          </td>
                          <td className="p-2 border border-[#d1d5dc]">
                            {exp.fechaVerificacion ? (
                              exp.fechaVerificacion
                            ) : (
                              <span className="text-[#d1d5dc]">☐</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-gray-500"
                        >
                          No se encontraron resultados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {modo === "seleccionAccion" && expedienteSeleccionado && (
            <>
              <Button
                size="sm"
                variant="light"
                onPress={handleVolverAtras}
                className="mb-4"
              >
                &lt;&lt; Volver atrás
              </Button>

              <div className="mb-4 flex items-center">
                <strong className="mr-2">Expediente:</strong>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => console.log("Visualizar expediente")}
                >
                  Visualizar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>N° de expediente:</strong>{" "}
                  {expedienteSeleccionado.nroExp}
                </div>
                <div>
                  <strong>Administrado:</strong>{" "}
                  {expedienteSeleccionado.administrado}
                </div>
                <div>
                  <strong>DNI:</strong> {expedienteSeleccionado.dni}
                </div>
              </div>

              <Divider className="my-4" />

              <h3 className="text-lg font-semibold mb-4">
                Seleccione una acción:
              </h3>

              <div className="flex gap-4 mb-6">
                <Button
                  color="primary"
                  onPress={handleSeleccionarProgramacion}
                  className="flex-1"
                >
                  Programación
                </Button>
                <Button
                  color="secondary"
                  onPress={handleRedirigirVerificacionTecnica}
                  className="flex-1"
                >
                  Verificación Técnica
                </Button>
              </div>
            </>
          )}

          {modo === "programacion" && expedienteSeleccionado && (
            <>
              <Button
                size="sm"
                variant="light"
                onPress={handleVolverAtras}
                className="mb-4"
              >
                &lt;&lt; Volver atrás
              </Button>

              <div className="mb-4 flex items-center">
                <strong className="mr-2">Expediente:</strong>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => console.log("Visualizar expediente")}
                >
                  Visualizar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>N° de expediente:</strong>{" "}
                  {expedienteSeleccionado.nroExp}
                </div>
                <div>
                  <strong>Administrado:</strong>{" "}
                  {expedienteSeleccionado.administrado}
                </div>
                <div>
                  <strong>DNI:</strong> {expedienteSeleccionado.dni}
                </div>
              </div>

              <Divider className="my-4" />

              <h3 className="text-lg font-semibold mb-4">Programación</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  placeholder="dd/mm/aaaa"
                />
                <Input
                  type="time"
                  label="Hora"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  placeholder="--:-- --"
                />
              </div>

              <Button
                color="primary"
                onPress={handleProgramarVerificacion}
                isDisabled={!fecha || !hora || cargando}
                isLoading={cargando}
              >
                {cargando ? "Procesando..." : "Registrar"}
              </Button>
            </>
          )}

          {modo === "exito" && (
            <>
              <Button
                size="sm"
                variant="light"
                onPress={handleVolverAtras}
                className="mb-4"
              >
                &lt;&lt; Volver atrás
              </Button>

              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">
                  Los datos fueron guardados exitosamente.
                </span>
                <button
                  className="absolute top-0 right-0 p-2"
                  onClick={() => setModo("lista")}
                >
                  &times;
                </button>
              </div>

              <div className="mb-4 flex items-center">
                <strong className="mr-2">Expediente:</strong>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => console.log("Visualizar expediente")}
                >
                  Visualizar
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
