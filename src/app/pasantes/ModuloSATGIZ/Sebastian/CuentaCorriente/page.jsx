"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Divider, Input, Button } from "@nextui-org/react";
import CuentaCorrienteService from "@/app/services/Sebastian/CuentaCorriente/CuentaCorrienteService";

export default function CuentaCorriente() {
  const [busqueda, setBusqueda] = useState("");
  const [contribuyentes, setContribuyentes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [predios, setPredios] = useState([]);
  const [cuenta, setCuenta] = useState(null);

  const handleBuscar = async () => {
    const resultados = await CuentaCorrienteService.buscarContribuyente(busqueda);
    setContribuyentes(resultados);
  };

  const handleSeleccionar = async (c) => {
    setSeleccionado(c);
    const data = await CuentaCorrienteService.obtenerPrediosPorContribuyente(c.documento);
    setPredios(data);
  };

  const handleGenerarCuenta = async () => {
    const nuevaCuenta = await CuentaCorrienteService.generarCuentaCorriente(seleccionado, "2024");
    setCuenta(nuevaCuenta);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Generación de Cuenta Corriente</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {!seleccionado ? (
            <>
              <Input
                label="Buscar contribuyente (DNI o nombre)"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="mb-3"
              />
              <Button color="primary" onPress={handleBuscar}>
                Buscar
              </Button>

              {contribuyentes.length > 0 && (
                <ul className="mt-3 border rounded p-2">
                  {contribuyentes.map((c) => (
                    <li
                      key={c.documento}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSeleccionar(c)}
                    >
                      {c.nombre} — {c.documento}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <Button size="sm" variant="light" onPress={() => setSeleccionado(null)}>
                &lt;&lt; Volver
              </Button>
              <h3 className="mt-3 font-semibold">Predios del contribuyente</h3>
              <table className="min-w-full mt-2 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Código</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Valor (S/)</th>
                  </tr>
                </thead>
                <tbody>
                  {predios.map((p) => (
                    <tr key={p.codigo} className="border-b">
                      <td className="p-2">{p.codigo}</td>
                      <td className="p-2">{p.tipo}</td>
                      <td className="p-2">{p.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-4">
                <Button color="primary" onPress={handleGenerarCuenta}>
                  Generar Cuenta Corriente
                </Button>
              </div>

              {cuenta && (
                <div className="mt-6 bg-green-50 border rounded p-4">
                  <h4 className="font-bold text-green-700 mb-2">
                    ✅ Cuenta Corriente Generada ({cuenta.periodo})
                  </h4>
                  <p><strong>Total:</strong> S/ {cuenta.total}</p>
                  <p><strong>Fecha:</strong> {cuenta.fecha}</p>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

