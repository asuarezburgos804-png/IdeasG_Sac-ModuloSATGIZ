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
import mantenimientoContribuyenteService from "@/app/services/Sebastian/MantenimientoContribuyente/MantenimientoContribuyenteService";

export default function MantenimientoContribuyente() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] = useState(null);
  const [modo, setModo] = useState("lista");
  const [cargando, setCargando] = useState(false);

  // Búsqueda progresiva
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (busqueda.trim() === "") {
        setResultados([]);
        return;
      }

      try {
        setCargando(true);
        const contribuyentes = await mantenimientoContribuyenteService.buscarContribuyentes(busqueda);
        setResultados(contribuyentes);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // Manejar selección de contribuyente
  const handleSeleccionarContribuyente = async (contribuyente) => {
    try {
      setCargando(true);
      const datosCompletos = await mantenimientoContribuyenteService.obtenerContribuyentePorId(contribuyente.id);
      setContribuyenteSeleccionado(datosCompletos);
      setModo("edicion");
    } catch (error) {
      console.error("Error al cargar datos del contribuyente:", error);
    } finally {
      setCargando(false);
    }
  };

  // Manejar actualización de contribuyente
  const handleActualizarContribuyente = async (datosActualizados) => {
    try {
      setCargando(true);
      const resultado = await mantenimientoContribuyenteService.actualizarContribuyente(datosActualizados);
      
      if (resultado.success) {
        setModo("exito");
        const contribuyentes = await mantenimientoContribuyenteService.buscarContribuyentes(busqueda);
        setResultados(contribuyentes);
      }
    } catch (error) {
      console.error("Error al actualizar contribuyente:", error);
      alert("Error al actualizar el contribuyente. Por favor, intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Volver atrás
  const handleVolverAtras = () => {
    if (modo === "edicion") {
      setModo("lista");
      setContribuyenteSeleccionado(null);
    } else if (modo === "exito") {
      setModo("lista");
      setContribuyenteSeleccionado(null);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Mantenimiento del Contribuyente</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {modo === "lista" && (
            <>
              <div className="flex gap-2 mb-4">
                <Input
                  label="Ingrese Nombre/Razón Social o Nro Doc/RUC"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-grow"
                  placeholder="Buscar contribuyente..."
                />
                <Button color="primary" className="mt-2">
                  Buscar
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-#d1d5dc">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-#d1d5dc p-2 text-left">Tipo Contribuyente</th>
                      <th className="border border-#d1d5dc p-2 text-left">Nombre/Razón Social</th>
                      <th className="border border-#d1d5dc p-2 text-left">Nro. Doc./RUC</th>
                      <th className="border border-#d1d5dc p-2 text-left">Estado</th>
                      <th className="border border-#d1d5dc p-2 text-left">Registro</th>
                      <th className="border border-#d1d5dc p-2 text-left">Editar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center">
                          Buscando...
                        </td>
                      </tr>
                    ) : resultados.length > 0 ? (
                      resultados.map((contribuyente) => (
                        <tr key={contribuyente.id} className="border-b hover:bg-#eff6ff">
                          <td className="p-2 border border-#d1d5dc">{contribuyente.tipoContribuyente}</td>
                          <td className="p-2 border border-#d1d5dc">{contribuyente.nombre}</td>
                          <td className="p-2 border border-#d1d5dc">{contribuyente.documento}</td>
                          <td className="p-2 border border-#d1d5dc">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              contribuyente.estado === "ACTIVO" 
                                ? "bg-#016630 text-#016630" 
                                : "bg-#ffe2e2 text-#9f0712"
                            }`}>
                              {contribuyente.estado}
                            </span>
                          </td>
                          <td className="p-2 border border-#d1d5dc text-center">
                            {contribuyente.registrado ? (
                              <span className="text-#00a63e font-bold text-xl">✓</span>
                            ) : (
                              <span className="text-#e7000b font-bold text-xl">✗</span>
                            )}
                          </td>
                          <td className="p-2 border border-#d1d5dc">
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => handleSeleccionarContribuyente(contribuyente)}
                            >
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-#6a7282">
                          {busqueda ? "No se encontraron resultados" : "Ingrese un término de búsqueda"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {modo === "edicion" && contribuyenteSeleccionado && (
            <FormularioEdicion
              contribuyente={contribuyenteSeleccionado}
              onActualizar={handleActualizarContribuyente}
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

              <div className="bg-#dcfce7 border border-#05df72 text-#008236 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">
                  Los datos del contribuyente fueron actualizados exitosamente.
                </span>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Componente de formulario
function FormularioEdicion({ contribuyente, onActualizar, onVolver, cargando }) {
  const [formData, setFormData] = useState(contribuyente);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onActualizar(formData);
  };

  const tiposDocumento = [
    { value: "DNI", label: "DNI" },
    { value: "RUC", label: "RUC" },
    { value: "CE", label: "Carnet de Extranjería" }
  ];

  const tiposContribuyente = [
    { value: "PERSONA NATURAL", label: "Persona Natural" },
    { value: "PERSONA JURIDICA", label: "Persona Jurídica" }
  ];

  const departamentos = [
    { value: "CUSCO", label: "Cusco" }
  ];

  const provincias = [
    { value: "LA CONVENCIÓN", label: "La Convención" }
  ];

  const distritos = [
    { value: "KIMBIRI", label: "Kimbiri" }
  ];

  const tiposVia = [
    { value: "AVENIDA", label: "Avenida" },
    { value: "JIRON", label: "Jirón" },
    { value: "CALLE", label: "Calle" },
    { value: "PASAJE", label: "Pasaje" }
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

      <h3 className="text-lg font-semibold mb-4">Datos del Contribuyente</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.tipoDocumento}
              onChange={(e) => handleChange("tipoDocumento", e.target.value)}
            >
              <option value="">Seleccionar Tipo Documento</option>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Número de Documento"
            value={formData.numeroDocumento}
            onChange={(e) => handleChange("numeroDocumento", e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Contribuyente</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.tipoContribuyente}
              onChange={(e) => handleChange("tipoContribuyente", e.target.value)}
            >
              <option value="">Seleccionar Tipo Contribuyente</option>
              {tiposContribuyente.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Contribuyente"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            required
          />

          <Input
            label="Condición Especial"
            value={formData.condicionEspecial}
            onChange={(e) => handleChange("condicionEspecial", e.target.value)}
          />

          <Input
            label="Teléfono / Celular"
            value={formData.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="md:col-span-2"
          />

          {/* NUEVO CAMPO REGISTRADO */}
          <div className="md:col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="registrado"
              checked={formData.registrado}
              onChange={(e) => handleChange("registrado", e.target.checked)}
              className="h-5 w-5 rounded border-#d1d5dc text-#0084d1 focus:ring-#615fff"
            />
            <label htmlFor="registrado" className="text-sm font-medium text-#4a5565">
              Contribuyente Registrado
            </label>
          </div>
        </div>

        <Divider className="my-6" />

        <h4 className="text-md font-semibold mb-4">Ubicación del Contribuyente</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.departamento}
              onChange={(e) => handleChange("departamento", e.target.value)}
            >
              <option value="">Seleccionar Departamento</option>
              {departamentos.map((depto) => (
                <option key={depto.value} value={depto.value}>
                  {depto.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Provincia</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.provincia}
              onChange={(e) => handleChange("provincia", e.target.value)}
            >
              <option value="">Seleccionar Provincia</option>
              {provincias.map((prov) => (
                <option key={prov.value} value={prov.value}>
                  {prov.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Distrito</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.distrito}
              onChange={(e) => handleChange("distrito", e.target.value)}
            >
              <option value="">Seleccionar Distrito</option>
              {distritos.map((dist) => (
                <option key={dist.value} value={dist.value}>
                  {dist.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Zona donde se encuentra el predio rural"
            value={formData.zonaPredioRural}
            onChange={(e) => handleChange("zonaPredioRural", e.target.value)}
            className="md:col-span-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            label="Código de Vía"
            value={formData.codVia}
            onChange={(e) => handleChange("codVia", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Vía</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.tipoVia}
              onChange={(e) => handleChange("tipoVia", e.target.value)}
            >
              <option value="">Seleccionar Tipo Vía</option>
              {tiposVia.map((via) => (
                <option key={via.value} value={via.value}>
                  {via.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nombre de Vía"
            value={formData.nombreVia}
            onChange={(e) => handleChange("nombreVia", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Código H.U."
            value={formData.codHU}
            onChange={(e) => handleChange("codHU", e.target.value)}
          />

          <Input
            label="Nombre de Habilitación"
            value={formData.nombreHabilitacion}
            onChange={(e) => handleChange("nombreHabilitacion", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            label="Nro. Municipal"
            value={formData.nroMunicipal}
            onChange={(e) => handleChange("nroMunicipal", e.target.value)}
          />

          <Input
            label="Nombre de Edificación"
            value={formData.nombreEdificacion}
            onChange={(e) => handleChange("nombreEdificacion", e.target.value)}
          />

          <Input
            label="Nro. Interior"
            value={formData.nroInterior}
            onChange={(e) => handleChange("nroInterior", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Input
            label="Sector"
            value={formData.sector}
            onChange={(e) => handleChange("sector", e.target.value)}
          />

          <Input
            label="Manzana"
            value={formData.manzana}
            onChange={(e) => handleChange("manzana", e.target.value)}
          />

          <Input
            label="Lote"
            value={formData.lote}
            onChange={(e) => handleChange("lote", e.target.value)}
          />

          <Input
            label="Sub Lote"
            value={formData.subLote}
            onChange={(e) => handleChange("subLote", e.target.value)}
          />

          <Input
            label="Grupo Residencial"
            value={formData.grupoResidencial}
            onChange={(e) => handleChange("grupoResidencial", e.target.value)}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button onPress={onVolver} variant="flat">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            isLoading={cargando}
            isDisabled={cargando}
          >
            {cargando ? "Actualizando..." : "Actualizar Contribuyente"}
          </Button>
        </div>
      </form>
    </>
  );
}