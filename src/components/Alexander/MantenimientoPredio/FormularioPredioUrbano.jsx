"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Divider, Select, SelectItem, Spinner } from "@nextui-org/react";
import mantenimientoPredioService from "@/app/services/Alexander/MantenimientoPredio/mantenimientoPredioService";

export default function FormularioPredioUrbano({ formData, onChange, onSave, loading }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [tiposVia, setTiposVia] = useState([]);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState("");

  // Cargar datos iniciales de ubicación
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargandoUbicacion(true);
        setErrorUbicacion("");
        
        const [deptosData, viasData] = await Promise.all([
          mantenimientoPredioService.obtenerDepartamentosApi(),
          mantenimientoPredioService.obtenerTiposViaApi()
        ]);
        
        setDepartamentos(deptosData);
        setTiposVia(viasData);
      } catch (error) {
        console.error("Error al cargar datos de ubicación:", error);
        setErrorUbicacion("Error al cargar datos de ubicación. Usando datos de respaldo.");
        
        // Usar datos de respaldo
        setDepartamentos(mantenimientoPredioService.departamentosBackup || []);
        setTiposVia(mantenimientoPredioService.tiposViaBackup || []);
      } finally {
        setCargandoUbicacion(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Cargar provincias cuando cambie el departamento
  useEffect(() => {
    const cargarProvincias = async () => {
      if (formData.departamento) {
        try {
          setCargandoUbicacion(true);
          setErrorUbicacion("");
          const nuevasProvincias = await mantenimientoPredioService.obtenerProvinciasApi(formData.departamento);
          setProvincias(nuevasProvincias);
          // Reset provincia y distrito si cambia el departamento
          onChange("provincia", "");
          onChange("distrito", "");
        } catch (error) {
          console.error("Error al cargar provincias:", error);
          setErrorUbicacion("Error al cargar provincias. Usando datos de respaldo.");
          // Usar método de respaldo
          const provinciasRespaldo = mantenimientoPredioService.obtenerProvinciasPorDepartamento(formData.departamento);
          setProvincias(provinciasRespaldo);
        } finally {
          setCargandoUbicacion(false);
        }
      } else {
        setProvincias([]);
        setDistritos([]);
      }
    };

    cargarProvincias();
  }, [formData.departamento, onChange]);

  // Cargar distritos cuando cambie la provincia
  useEffect(() => {
    const cargarDistritos = async () => {
      if (formData.provincia) {
        try {
          setCargandoUbicacion(true);
          setErrorUbicacion("");
          const nuevosDistritos = await mantenimientoPredioService.obtenerDistritosApi(formData.provincia);
          setDistritos(nuevosDistritos);
          // Reset distrito si cambia la provincia
          onChange("distrito", "");
        } catch (error) {
          console.error("Error al cargar distritos:", error);
          setErrorUbicacion("Error al cargar distritos. Usando datos de respaldo.");
          // Usar método de respaldo
          const distritosRespaldo = mantenimientoPredioService.obtenerDistritosPorProvincia(formData.provincia);
          setDistritos(distritosRespaldo);
        } finally {
          setCargandoUbicacion(false);
        }
      } else {
        setDistritos([]);
      }
    };

    cargarDistritos();
  }, [formData.provincia, onChange]);

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: UBICACIÓN DEL PREDIO URBANO */}
      <div>
        <h4 className="text-md font-semibold mb-4">Ubicación del Predio Urbano</h4>
        
        {errorUbicacion && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {errorUbicacion}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Departamento"
            value={formData.departamento || ""}
            onChange={(e) => onChange("departamento", e.target.value)}
            isLoading={cargandoUbicacion}
            isDisabled={cargandoUbicacion}
            required
          >
            {departamentos.map((depto) => (
              <SelectItem key={depto.value} value={depto.value}>
                {depto.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Provincia"
            value={formData.provincia || ""}
            onChange={(e) => onChange("provincia", e.target.value)}
            isDisabled={!formData.departamento || cargandoUbicacion}
            isLoading={cargandoUbicacion}
            required
          >
            {provincias.map((prov) => (
              <SelectItem key={prov.value} value={prov.value}>
                {prov.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Distrito"
            value={formData.distrito || ""}
            onChange={(e) => onChange("distrito", e.target.value)}
            isDisabled={!formData.provincia || cargandoUbicacion}
            isLoading={cargandoUbicacion}
            required
          >
            {distritos.map((dist) => (
              <SelectItem key={dist.value} value={dist.value}>
                {dist.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Código de Vía"
            value={formData.codigoVia || ""}
            onChange={(e) => onChange("codigoVia", e.target.value)}
            required
          />

          <Select
            label="Tipo de Vía"
            value={formData.tipoVia || ""}
            onChange={(e) => onChange("tipoVia", e.target.value)}
            required
          >
            {tiposVia.map((via) => (
              <SelectItem key={via.value} value={via.value}>
                {via.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Nombre de Vía"
            value={formData.nombreVia || ""}
            onChange={(e) => onChange("nombreVia", e.target.value)}
            required
          />

          <Input
            label="Arancel"
            value={formData.arancel || ""}
            onChange={(e) => onChange("arancel", e.target.value)}
            placeholder="S/."
          />

          <Input
            label="Número Municipal"
            value={formData.numeroMunicipal || ""}
            onChange={(e) => onChange("numeroMunicipal", e.target.value)}
            required
          />

          <Input
            label="Manzana Urbana"
            value={formData.manzanaUrbana || ""}
            onChange={(e) => onChange("manzanaUrbana", e.target.value)}
            required
          />

          <Input
            label="Lote Urbano"
            value={formData.loteUrbano || ""}
            onChange={(e) => onChange("loteUrbano", e.target.value)}
            required
          />

          <Select
            label="Tipo de Denominación Urbana"
            value={formData.tipoDenominacionUrbana || ""}
            onChange={(e) => onChange("tipoDenominacionUrbana", e.target.value)}
          >
            {mantenimientoPredioService.denominacionesUrbanas.map((denom) => (
              <SelectItem key={denom.value} value={denom.value}>
                {denom.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Nombre de Denominación Urbana"
            value={formData.nombreDenominacionUrbana || ""}
            onChange={(e) => onChange("nombreDenominacionUrbana", e.target.value)}
          />
        </div>

        {cargandoUbicacion && (
          <div className="flex items-center justify-center p-2">
            <Spinner size="sm" className="mr-2" />
            <span className="text-sm text-gray-600">Cargando datos de ubicación...</span>
          </div>
        )}
      </div>

      <Divider />

      {/* SECCIÓN 2: DEDUCCIÓN DEL PREDIO */}
      <div>
        <h4 className="text-md font-semibold mb-4">Deducción del Predio</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.autorizaDeduccion || false}
                onChange={(e) => onChange("autorizaDeduccion", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                ¿Se autoriza la deducción?
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Marque esta casilla si autoriza la deducción aplicable al predio
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* SECCIÓN 3: DATOS DEL PREDIO */}
      <div>
        <h4 className="text-md font-semibold mb-4">Datos del Predio</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Uso del Predio Urbano"
            value={formData.usoPredio || ""}
            onChange={(e) => onChange("usoPredio", e.target.value)}
            required
          >
            {mantenimientoPredioService.usosPredio.map((uso) => (
              <SelectItem key={uso.value} value={uso.value}>
                {uso.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Estado del Predio"
            value={formData.estadoPredio || ""}
            onChange={(e) => onChange("estadoPredio", e.target.value)}
            required
          >
            {mantenimientoPredioService.estadosPredio.map((estado) => (
              <SelectItem key={estado.value} value={estado.value}>
                {estado.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tipo de Predio"
            value={formData.tipoPredio || ""}
            onChange={(e) => onChange("tipoPredio", e.target.value)}
            required
          >
            {mantenimientoPredioService.tiposPredio.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Condición del Predio"
            value={formData.condicionPredio || ""}
            onChange={(e) => onChange("condicionPredio", e.target.value)}
            required
          >
            {mantenimientoPredioService.condicionesPredio.map((condicion) => (
              <SelectItem key={condicion.value} value={condicion.value}>
                {condicion.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Área Total del Terreno (m²)"
            value={formData.areaTotalTerreno || ""}
            onChange={(e) => onChange("areaTotalTerreno", e.target.value)}
            type="number"
            required
          />

          {/* Servicios Básicos */}
          <div className="md:col-span-2">
            <h5 className="font-medium mb-3">Servicios Básicos</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Agua */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.tieneAgua || false}
                    onChange={(e) => onChange("tieneAgua", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Agua</span>
                </label>
                <Input
                  label="N° de Suministro de Agua"
                  value={formData.numeroSuministroAgua || ""}
                  onChange={(e) => onChange("numeroSuministroAgua", e.target.value)}
                  isDisabled={!formData.tieneAgua}
                  size="sm"
                />
              </div>

              {/* Luz */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.tieneLuz || false}
                    onChange={(e) => onChange("tieneLuz", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Luz</span>
                </label>
                <Input
                  label="N° de Suministro de Luz"
                  value={formData.numeroSuministroLuz || ""}
                  onChange={(e) => onChange("numeroSuministroLuz", e.target.value)}
                  isDisabled={!formData.tieneLuz}
                  size="sm"
                />
              </div>

              {/* Desagüe */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.tieneDesague || false}
                    onChange={(e) => onChange("tieneDesague", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Desagüe</span>
                </label>
                <Input
                  label="N° de Suministro de Desagüe"
                  value={formData.numeroSuministroDesague || ""}
                  onChange={(e) => onChange("numeroSuministroDesague", e.target.value)}
                  isDisabled={!formData.tieneDesague}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="flex justify-end pt-4">
        <Button 
          color="primary" 
          onPress={onSave}
          isLoading={loading}
          isDisabled={loading}
          size="lg"
        >
          {loading ? "Guardando..." : "Guardar Predio Urbano"}
        </Button>
      </div>
    </div>
  );
}