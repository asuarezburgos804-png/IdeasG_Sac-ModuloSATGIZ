"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { buscarSolicitudes } from "@/app/services/Alexander/MesaDePartes/buscarSolicitudes";
import { obtenerTecnicos } from "@/app/services/Alexander/MesaDePartes/obtenerTecnicos";
import { handleRegistrar } from "@/app/services/Alexander/MesaDePartes/handleRegistrar";
import SuccessModal from "@/components/custom/custom_Alexander/CustomMesaDeParte/successModal";
import ErrorModal from "@/components/custom/custom_Alexander/CustomMesaDeParte/errorModal";

export default function MesaDePartesRol() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [expediente, setExpediente] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [tecnicosList, setTecnicosList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Estado para manejar las claves seleccionadas del Select
  const [selectedTecnicoKeys, setSelectedTecnicoKeys] = useState(new Set([]));

  // Efecto para búsqueda progresiva
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (busqueda.trim().length > 0) {
        buscarSolicitudes(busqueda, setResultados, setErrorMessage, setError);
      } else {
        setResultados([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // Cargar técnicos al montar el componente
  useEffect(() => {
    obtenerTecnicos(setTecnicosList, setErrorMessage, setError);
  }, []);

  // Efecto para sincronizar el estado del técnico con las claves seleccionadas
  useEffect(() => {
    if (tecnico) {
      setSelectedTecnicoKeys(new Set([tecnico]));
    } else {
      setSelectedTecnicoKeys(new Set([]));
    }
  }, [tecnico]);

  // Función para manejar la selección de técnico
  const handleTecnicoChange = (keys) => {
    const keysArray = Array.from(keys);
    if (keysArray.length > 0) {
      const selectedKey = keysArray[0];
      setTecnico(selectedKey);
      setSelectedTecnicoKeys(new Set([selectedKey]));
    } else {
      setTecnico("");
      setSelectedTecnicoKeys(new Set([]));
    }
  };

  // Función para obtener el nombre del técnico seleccionado
  const getNombreTecnicoSeleccionado = () => {
    if (!tecnico) return "";
    const tecnicoSeleccionado = tecnicosList.find(
      (t) => String(t.id_tecnico) === tecnico
    );
    return tecnicoSeleccionado
      ? `${tecnicoSeleccionado.c_nombre_tecnico} - ${tecnicoSeleccionado.c_dni_tecnico}`
      : "";
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Mesa de partes</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {!seleccionado ? (
            <>
              <Input
                label="Buscar por nombre o DNI"
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
                          key={a.id_solicitud}
                          className="border-b hover:bg-blue-100 cursor-pointer"
                          onClick={() => setSeleccionado(a)}
                        >
                          <td className="p-2">{a.dni}</td>
                          <td className="p-2">{a.nombre_completo}</td>
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
                onPress={() => {
                  setSeleccionado(null);
                  setExpediente("");
                  setTecnico("");
                  setSelectedTecnicoKeys(new Set([]));
                }}
                className="mb-2"
              >
                &lt;&lt; Volver atrás
              </Button>
              <div className="mb-2">
                <b>Expediente:</b> <span>Visualizar</span>
              </div>
              <div className="mb-2">
                <strong>Administrado:</strong> {seleccionado.nombre_completo}
              </div>
              <div className="mb-2">
                <strong>DNI:</strong> {seleccionado.dni}
              </div>
              <div className="mb-2">
                <strong>Fecha de reg.:</strong> {seleccionado.fecha_registro}
              </div>
              <Input
                label="N° de expediente"
                value={expediente}
                onChange={(e) => setExpediente(e.target.value)}
                className="mb-2"
              />

              {/* Select de técnico corregido */}
              <Select
                label="Técnico"
                placeholder="Seleccione un técnico"
                selectedKeys={selectedTecnicoKeys}
                onSelectionChange={handleTecnicoChange}
                className="mb-2 w-full"
                disallowEmptySelection
              >
                {tecnicosList.map((t) => (
                  <SelectItem
                    key={String(t.id_tecnico)}
                    value={String(t.id_tecnico)}
                    textValue={`${t.c_nombre_tecnico} - ${t.c_dni_tecnico}`}
                  >
                    {t.c_nombre_tecnico} - {t.c_dni_tecnico}
                  </SelectItem>
                ))}
              </Select>

              <Button
                color="primary"
                onPress={() =>
                  handleRegistrar(
                    seleccionado,
                    expediente,
                    tecnico,
                    setSuccess,
                    setErrorMessage,
                    setError,
                    setExpediente,
                    setTecnico,
                    setSeleccionado,
                    setResultados,
                    setBusqueda
                  )
                }
                isDisabled={!expediente || !tecnico}
              >
                Registrar
              </Button>
            </>
          )}
        </CardBody>
      </Card>
      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        message="Registro exitoso"
      />
      <ErrorModal
        isOpen={error}
        onClose={() => setError(false)}
        message={errorMessage || "Completa todos los campos"}
      />
    </div>
  );
}
