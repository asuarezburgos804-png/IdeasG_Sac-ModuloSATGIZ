"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Divider, Select, SelectItem } from "@nextui-org/react";
import mantenimientoPredioService from "@/app/services/Alexander/MantenimientoPredio/mantenimientoPredioService";

export default function FormularioPredioUrbano({ formData, onChange, onSave, loading }) {
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Actualizar provincias cuando cambie el departamento
  useEffect(() => {
    if (formData.departamento) {
      const nuevasProvincias = mantenimientoPredioService.obtenerProvinciasPorDepartamento(formData.departamento);
      setProvincias(nuevasProvincias);
      // Reset provincia y distrito si cambia el departamento
      onChange("provincia", "");
      onChange("distrito", "");
    } else {
      setProvincias([]);
    }
  }, [formData.departamento]);

  // Actualizar distritos cuando cambie la provincia
  useEffect(() => {
    if (formData.provincia) {
      const nuevosDistritos = mantenimientoPredioService.obtenerDistritosPorProvincia(formData.provincia);
      setDistritos(nuevosDistritos);
      // Reset distrito si cambia la provincia
      onChange("distrito", "");
    } else {
      setDistritos([]);
    }
  }, [formData.provincia]);

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: UBICACIÓN DEL PREDIO URBANO */}
      <div>
        <h4 className="text-md font-semibold mb-4">Ubicación del Predio Urbano</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Departamento"
            value={formData.departamento || ""}
            onChange={(e) => onChange("departamento", e.target.value)}
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
            isDisabled={!formData.departamento}
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
            isDisabled={!formData.provincia}
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
            {mantenimientoPredioService.tiposVia.map((via) => (
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
        >
          {loading ? "Guardando..." : "Guardar Predio Urbano"}
        </Button>
      </div>
    </div>
  );
}