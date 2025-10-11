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
import mantenimientoPredioService from "@/app/services/Alexander/MantenimientoPredio/mantenimientoPredioService";
import FormularioPredioUrbano from "@/components/Alexander/MantenimientoPredio/FormularioPredioUrbano";

export default function MantenimientoPredio() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [modo, setModo] = useState("lista"); // "lista", "verificar", "registro", "exito"
  const [cargando, setCargando] = useState(false);
  const [tipoPredio, setTipoPredio] = useState(""); // "URBANO" o "RURAL"
  const [periodo, setPeriodo] = useState("2022");

  // Búsqueda progresiva
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        setCargando(true);
        const predios = await mantenimientoPredioService.buscarPredios(busqueda, periodo);
        setResultados(predios);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, periodo]);

  // Manejar verificación de predio
  const handleVerificarPredio = async (tipo) => {
    setTipoPredio(tipo);
    setModo("verificar");
  };

  // Manejar registro de predio
  const handleRegistrarPredio = async (datosPredio) => {
    try {
      setCargando(true);
      const resultado = await mantenimientoPredioService.registrarPredio(datosPredio, periodo);
      
      if (resultado.success) {
        setModo("exito");
        // Actualizar la lista de resultados
        const predios = await mantenimientoPredioService.buscarPredios(busqueda, periodo);
        setResultados(predios);
      }
    } catch (error) {
      console.error("Error al registrar predio:", error);
      alert("Error al registrar el predio. Por favor, intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Volver atrás
  const handleVolverAtras = () => {
    if (modo === "verificar" || modo === "registro") {
      setModo("lista");
      setTipoPredio("");
    } else if (modo === "exito") {
      setModo("lista");
      setTipoPredio("");
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Mantenimiento del Predio</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {modo === "lista" && (
            <>
              <div className="flex gap-2 mb-4">
                <Input
                  label="Buscar predios por código, ubicación, área, documento o nombre"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-grow"
                  placeholder="Ingrese código, ubicación, área, documento o nombre del contribuyente..."
                />
                <Button color="primary" className="mt-2">
                  Buscar
                </Button>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Periodo</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  >
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                
                <div className="flex gap-2 items-end">
                  <Button 
                    color="success" 
                    onPress={() => handleVerificarPredio("URBANO")}
                  >
                    Nuevo Predio Urbano
                  </Button>
                  <Button 
                    color="warning" 
                    onPress={() => handleVerificarPredio("RURAL")}
                  >
                    Nuevo Predio Rural
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Código</th>
                      <th className="border border-gray-300 p-2 text-left">Tipo</th>
                      <th className="border border-gray-300 p-2 text-left">Ubicación</th>
                      <th className="border border-gray-300 p-2 text-left">Área</th>
                      <th className="border border-gray-300 p-2 text-left">Condición</th>
                      <th className="border border-gray-300 p-2 text-left">Documento</th>
                      <th className="border border-gray-300 p-2 text-left">Nombre del Contribuyente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr>
                        <td colSpan="7" className="p-4 text-center">
                          Buscando...
                        </td>
                      </tr>
                    ) : resultados.length > 0 ? (
                      resultados.map((predio) => (
                        <tr key={predio.id} className="border-b hover:bg-blue-50">
                          <td className="p-2 border border-gray-300 font-mono">{predio.codigo}</td>
                          <td className="p-2 border border-gray-300">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              predio.tipo === "URBANO" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-green-100 text-green-800"
                            }`}>
                              {predio.tipo}
                            </span>
                          </td>
                          <td className="p-2 border border-gray-300">{predio.ubicacion}</td>
                          <td className="p-2 border border-gray-300">{predio.area}</td>
                          <td className="p-2 border border-gray-300">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              predio.condicion === "HABITADO" 
                                ? "bg-green-100 text-green-800" 
                                : predio.condicion === "PRODUCCION" 
                                ? "bg-yellow-100 text-yellow-800"
                                : predio.condicion === "CONSTRUCCION"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {predio.condicion}
                            </span>
                          </td>
                          <td className="p-2 border border-gray-300 font-mono">{predio.documento}</td>
                          <td className="p-2 border border-gray-300">{predio.nombreContribuyente}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          {busqueda ? "No se encontraron resultados" : "Ingrese un término de búsqueda o registre un nuevo predio"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {modo === "verificar" && (
            <VerificacionPredio
              tipoPredio={tipoPredio}
              onContinuarRegistro={() => setModo("registro")}
              onVolver={handleVolverAtras}
            />
          )}

          {modo === "registro" && (
            <FormularioRegistroPredio
              tipoPredio={tipoPredio}
              onRegistrar={handleRegistrarPredio}
              onVolver={handleVolverAtras}
              cargando={cargando}
            />
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
                  El predio fue registrado exitosamente.
                </span>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Componente de verificación
function VerificacionPredio({ tipoPredio, onContinuarRegistro, onVolver }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busquedaVerificar, setBusquedaVerificar] = useState("");
  const [resultadosVerificar, setResultadosVerificar] = useState([]);
  const [cargandoVerificar, setCargandoVerificar] = useState(false);

  // Búsqueda progresiva para el modal
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (busquedaVerificar.trim() === "") {
        setResultadosVerificar([]);
        return;
      }

      try {
        setCargandoVerificar(true);
        // Buscar en TODOS los períodos
        const predios = await mantenimientoPredioService.buscarPrediosGlobal(busquedaVerificar);
        setResultadosVerificar(predios);
      } catch (error) {
        console.error("Error en búsqueda de verificación:", error);
        setResultadosVerificar([]);
      } finally {
        setCargandoVerificar(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busquedaVerificar]);

  const abrirModal = () => {
    setMostrarModal(true);
    setBusquedaVerificar("");
    setResultadosVerificar([]);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setBusquedaVerificar("");
    setResultadosVerificar([]);
  };

  const continuarDesdeModal = () => {
    cerrarModal();
    onContinuarRegistro();
  };

  return (
    <>
      <Button
        size="sm"
        variant="light"
        onPress={onVolver}
        className="mb-4"
      >
        &lt;&lt; Volver atrás
      </Button>

      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">
          <strong>Verifique si el predio a registrar ya existe.</strong> Si no hay registro presione continuar!
        </span>
      </div>

      <div className="mb-4">
        <p>Está por registrar un predio de tipo: <strong>{tipoPredio}</strong></p>
      </div>

      <div className="flex gap-4">
        <Button color="warning" onPress={abrirModal}>
          Verificar
        </Button>
        <Button color="primary" onPress={onContinuarRegistro}>
          Continuar
        </Button>
      </div>

      {/* MODAL DE VERIFICACIÓN */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Verificar Predios Existentes</h3>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Busque predios existentes para evitar duplicados
              </p>
            </div>

            {/* Body del Modal */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Barra de búsqueda */}
              <div className="flex gap-2 mb-4">
                <Input
                  label="Buscar predios existentes"
                  value={busquedaVerificar}
                  onChange={(e) => setBusquedaVerificar(e.target.value)}
                  className="flex-grow"
                  placeholder="Ingrese código, ubicación, área, documento o nombre del contribuyente..."
                />
                <Button color="primary" className="mt-2">
                  Buscar
                </Button>
              </div>

              {/* Tabla de resultados */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Código</th>
                      <th className="border border-gray-300 p-2 text-left">Tipo</th>
                      <th className="border border-gray-300 p-2 text-left">Ubicación</th>
                      <th className="border border-gray-300 p-2 text-left">Área</th>
                      <th className="border border-gray-300 p-2 text-left">Condición</th>
                      <th className="border border-gray-300 p-2 text-left">Documento</th>
                      <th className="border border-gray-300 p-2 text-left">Nombre del Contribuyente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargandoVerificar ? (
                      <tr>
                        <td colSpan="7" className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                            Buscando predios existentes...
                          </div>
                        </td>
                      </tr>
                    ) : resultadosVerificar.length > 0 ? (
                      resultadosVerificar.map((predio) => (
                        <tr key={predio.id} className="border-b hover:bg-blue-50">
                          <td className="p-2 border border-gray-300 font-mono">{predio.codigo}</td>
                          <td className="p-2 border border-gray-300">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              predio.tipo === "URBANO" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-green-100 text-green-800"
                            }`}>
                              {predio.tipo}
                            </span>
                          </td>
                          <td className="p-2 border border-gray-300">{predio.ubicacion}</td>
                          <td className="p-2 border border-gray-300">{predio.area}</td>
                          <td className="p-2 border border-gray-300">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              predio.condicion === "HABITADO" 
                                ? "bg-green-100 text-green-800" 
                                : predio.condicion === "PRODUCCION" 
                                ? "bg-yellow-100 text-yellow-800"
                                : predio.condicion === "CONSTRUCCION"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {predio.condicion}
                            </span>
                          </td>
                          <td className="p-2 border border-gray-300 font-mono">{predio.documento}</td>
                          <td className="p-2 border border-gray-300">{predio.nombreContribuyente}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          {busquedaVerificar 
                            ? "No se encontraron predios existentes con esos criterios" 
                            : "Ingrese un término de búsqueda para verificar predios existentes"
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Información adicional */}
              {resultadosVerificar.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Se encontraron {resultadosVerificar.length} predio(s) existente(s).</strong> 
                    Si el predio que desea registrar ya aparece en la lista, considere no duplicarlo.
                  </p>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
              <Button 
                onPress={cerrarModal} 
                variant="flat"
                color="danger"
              >
                Cancelar
              </Button>
              <div className="flex gap-2">
                <Button 
                  onPress={cerrarModal} 
                  variant="flat"
                >
                  Volver a Verificación
                </Button>
                <Button 
                  color="primary" 
                  onPress={continuarDesdeModal}
                >
                  Continuar con el Registro
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// Componente de formulario de registro
function FormularioRegistroPredio({ tipoPredio, onRegistrar, onVolver, cargando }) {
  const [formData, setFormData] = useState({
    tipo: tipoPredio,
    ubicacion: "",
    area: "",
    condicion: "HABITADO",
    documento: "",
    nombreContribuyente: "",
    
    // Nuevos campos para predio urbano
    // Ubicación
    departamento: "",
    provincia: "",
    distrito: "",
    codigoVia: "",
    tipoVia: "",
    nombreVia: "",
    arancel: "",
    numeroMunicipal: "",
    manzanaUrbana: "",
    loteUrbano: "",
    tipoDenominacionUrbana: "",
    nombreDenominacionUrbana: "",
    
    // Deducción
    autorizaDeduccion: false,
    
    // Datos del predio
    usoPredio: "",
    estadoPredio: "",
    tipoPredio: "",
    condicionPredio: "",
    areaTotalTerreno: "",
    tieneAgua: false,
    numeroSuministroAgua: "",
    tieneLuz: false,
    numeroSuministroLuz: "",
    tieneDesague: false,
    numeroSuministroDesague: ""
  });

  const [contribuyentes] = useState(mantenimientoPredioService.obtenerContribuyentes());

  const handleChange = (field, value) => {
    const newData = {
      ...formData,
      [field]: value
    };

    // Si cambia el documento, buscar automáticamente el nombre del contribuyente
    if (field === "documento") {
      const contribuyente = mantenimientoPredioService.obtenerContribuyentePorDocumento(value);
      if (contribuyente) {
        newData.nombreContribuyente = contribuyente.nombre;
      } else {
        newData.nombreContribuyente = "";
      }
    }

    setFormData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un contribuyente válido
    if (!formData.documento || !formData.nombreContribuyente) {
      alert("Por favor, seleccione un contribuyente válido.");
      return;
    }

    onRegistrar(formData);
  };

  const condiciones = [
    { value: "HABITADO", label: "Habitado" },
    { value: "PRODUCCION", label: "En Producción" },
    { value: "VACIO", label: "Vacio" },
    { value: "CONSTRUCCION", label: "En Construcción" }
  ];

  return (
    <>
      <Button
        size="sm"
        variant="light"
        onPress={onVolver}
        className="mb-4"
      >
        &lt;&lt; Volver atrás
      </Button>

      <h3 className="text-lg font-semibold mb-4">Registro de Predio {tipoPredio}</h3>

      <form onSubmit={handleSubmit}>
        {/* Datos Básicos del Contribuyente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Documento del Contribuyente</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.documento}
              onChange={(e) => handleChange("documento", e.target.value)}
              required
            >
              <option value="">Seleccionar Documento</option>
              {contribuyentes.map((contribuyente) => (
                <option key={contribuyente.documento} value={contribuyente.documento}>
                  {contribuyente.documento} - {contribuyente.nombre}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nombre del Contribuyente"
            value={formData.nombreContribuyente}
            isReadOnly
            className="bg-gray-100"
            placeholder="Se autocompletará al seleccionar documento"
          />

          <Input
            label="Ubicación General"
            value={formData.ubicacion}
            onChange={(e) => handleChange("ubicacion", e.target.value)}
            className="md:col-span-2"
            placeholder="Dirección general o referencia"
          />

          <Input
            label="Área Total"
            value={formData.area}
            onChange={(e) => handleChange("area", e.target.value)}
            placeholder={tipoPredio === "URBANO" ? "Ej: 100.0 m2" : "Ej: 2.5 ha"}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">Condición General</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.condicion}
              onChange={(e) => handleChange("condicion", e.target.value)}
            >
              {condiciones.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formulario Específico por Tipo de Predio */}
        {tipoPredio === "URBANO" ? (
          <FormularioPredioUrbano
            formData={formData}
            onChange={handleChange}
            onSave={() => onRegistrar(formData)}
            loading={cargando}
          />
        ) : (
          // Para predio rural, mantener el formulario básico
          <div className="flex gap-4 justify-end">
            <Button onPress={onVolver} variant="flat">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              isLoading={cargando}
              isDisabled={cargando || !formData.documento || !formData.nombreContribuyente}
            >
              {cargando ? "Registrando..." : "Registrar Predio"}
            </Button>
          </div>
        )}
      </form>
    </>
  );
}