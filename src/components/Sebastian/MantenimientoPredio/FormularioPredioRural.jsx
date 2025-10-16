"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Divider, Select, SelectItem, Spinner } from "@nextui-org/react";
import mantenimientoPredioService from "@/app/services/Sebastian/MantenimientoPredio/mantenimientoPredioService";

export default function FormularioPredioRural({ formData, onChange, onSave, loading }) {
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
      {/* SECCIÓN 1: UBICACIÓN DEL PREDIO RURAL */}
      <div>
        <h4 className="text-md font-semibold mb-4">Ubicación del Predio Rural</h4>

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
            {mantenimientoPredioService.departamentos.map((depto) => (
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
            label="Zona donde se encuentra el predio rural"
            value={formData.zonaPredioRural}
            onChange={(e) => handleChange("zonaPredioRural", e.target.value)}
            className="md:col-span-2"
          />

          <Input
            label="Nombre del predio"
            value={formData.nombrePredio}
            onChange={(e) => handleChange("nombrePredio", e.target.value)}
            className="md:col-span-2"
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
            label="Uso del Predio Rural"
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
            label="Área Total del Terreno (HA)"
            value={formData.areaTotalTerreno || ""}
            onChange={(e) => onChange("areaTotalTerreno", e.target.value)}
            type="number"
            required
          />

          <Select
            label="Grupo de Tierras"
            value={formData.grupoTierras || ""}
            onChange={(e) => onChange("grupoTierras", e.target.value)}
            required
          >
            {mantenimientoPredioService.grupoTierras.map((tierras) => (
              <SelectItem key={tierras.value} value={tierras.value}>
                {tierras.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Rango de Altitud"
            value={formData.rangoAltitud || ""}
            onChange={(e) => onChange("rangoAltitud", e.target.value)}
            required
          >
            {mantenimientoPredioService.rangoAltitud.map((rango) => (
              <SelectItem key={rango.value} value={rango.value}>
                {rango.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Calidad Agrícola"
            value={formData.calidadAgricola || ""}
            onChange={(e) => onChange("calidadAgricola", e.target.value)}
            required
          >
            {mantenimientoPredioService.calidadAgricola.map((calidad) => (
              <SelectItem key={calidad.value} value={calidad.value}>
                {calidad.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Valor por Categoría"
            value={formData.valorCategoria || ""}
            onChange={(e) => onChange("valorCategoria", e.target.value)}
            type="number"
            required
          />
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="flex justify-end pt-4">
        <Button 
          color="primary" 
          onPress={onSave}
          isLoading={loading}
          isDisabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Predio Rural"}
        </Button>
      </div>
    </div>
  );
}