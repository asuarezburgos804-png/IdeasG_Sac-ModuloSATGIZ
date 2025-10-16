"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Input,
  Spinner,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
} from "@nextui-org/react";
import DeclaracionJuradaService from "@/app/services/Alexander/DeclaracionJurada/DeclaracionJuradaService";

export default function DeclaracionJurada() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  // Estados para las fases
  const [fase, setFase] = useState(1); // 1: Búsqueda, 2: Declaraciones, 3: Nueva DJ
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] = useState(null);
  const [declaraciones, setDeclaraciones] = useState([]);
  const [cargandoDeclaraciones, setCargandoDeclaraciones] = useState(false);

  // Estados para el formulario de nueva declaración
  const [formData, setFormData] = useState({
    // Datos básicos
    tipo_predio: "URBANO",
    periodo: new Date().getFullYear().toString(),
    
    // Datos del predio urbano
    codigo_via: "",
    tipo_via: "",
    nombre_via: "",
    numero_municipal: "",
    manzana: "",
    lote: "",
    area_terreno: "",
    
    // Datos del predio rural
    zona_rural: "",
    area_terreno_rural: "",
    
    // Características de construcción
    piso: "",
    seccion: "",
    fecha_construccion: "",
    nivel_piso: "",
    estado_conservacion_estructura: "",
    estado_conservacion_acabados: "",
    numero_pisos: "",
    tipo_construccion: "",
    porcentaje_incremento: "",
    precio_unitario: "",
    revestimiento: "",
    banios: "",
    instalaciones_electricas: "",
    area_construida: "",
    unidad_medida_construccion: "",
    
    // Otras instalaciones
    otras_instalaciones: []
  });

  const [nuevaInstalacion, setNuevaInstalacion] = useState({
    codigo: "",
    descripcion: "",
    uso: "",
    fecha_construccion: "",
    nivel_piso: "",
    estado_conservacion_estructura: "",
    estado_conservacion_acabados: "",
    largo: "",
    ancho: "",
    alto: "",
    total: "",
    unidad_medida: "",
    valor_unitario: ""
  });

  // Búsqueda progresiva - FASE 1
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (busqueda.trim() === "") {
        setResultados([]);
        return;
      }

      try {
        setCargando(true);
        const contribuyentesFiltrados = await DeclaracionJuradaService.buscarContribuyentes(busqueda);

        const resultadosMapeados = contribuyentesFiltrados.map((contribuyente) => ({
          id: contribuyente.c_num_documento,
          codigo: contribuyente.c_codigo,
          tipoContribuyente: contribuyente.c_tipo_contribuyente,
          nombre: contribuyente.c_nombre,
          documento: contribuyente.c_num_documento,
          estado: contribuyente.c_estado
        }));

        setResultados(resultadosMapeados);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // Manejar selección de contribuyente - Transición a FASE 2
  const handleSeleccionarContribuyente = async (contribuyente) => {
    setContribuyenteSeleccionado(contribuyente);
    setCargandoDeclaraciones(true);
    
    try {
      const declaracionesContribuyente = await DeclaracionJuradaService.obtenerDeclaracionesPorContribuyente(contribuyente.documento);
      setDeclaraciones(declaracionesContribuyente);
      setFase(2);
    } catch (error) {
      console.error("Error al obtener declaraciones:", error);
    } finally {
      setCargandoDeclaraciones(false);
    }
  };

  // Manejar ver declaración existente
  const handleVerDeclaracion = (declaracion) => {
    console.log("Ver declaración:", declaracion);
    // Aquí podrías abrir el PDF o mostrar los detalles
  };

  // Manejar nueva declaración jurada - Transición a FASE 3
  const handleNuevaDeclaracion = () => {
    setFase(3);
    // Inicializar datos del formulario
    setFormData({
      ...formData,
      periodo: new Date().getFullYear().toString()
    });
  };

  // Volver a fase anterior
  const handleVolver = () => {
    if (fase === 2) {
      setFase(1);
      setContribuyenteSeleccionado(null);
      setDeclaraciones([]);
    } else if (fase === 3) {
      setFase(2);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar cambios en nueva instalación
  const handleInstalacionChange = (field, value) => {
    setNuevaInstalacion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Agregar nueva instalación
  const agregarInstalacion = () => {
    if (nuevaInstalacion.descripcion) {
      setFormData(prev => ({
        ...prev,
        otras_instalaciones: [...prev.otras_instalaciones, { ...nuevaInstalacion }]
      }));
      setNuevaInstalacion({
        codigo: "",
        descripcion: "",
        uso: "",
        fecha_construccion: "",
        nivel_piso: "",
        estado_conservacion_estructura: "",
        estado_conservacion_acabados: "",
        largo: "",
        ancho: "",
        alto: "",
        total: "",
        unidad_medida: "",
        valor_unitario: ""
      });
    }
  };

  // Eliminar instalación
  const eliminarInstalacion = (index) => {
    setFormData(prev => ({
      ...prev,
      otras_instalaciones: prev.otras_instalaciones.filter((_, i) => i !== index)
    }));
  };

  // Guardar declaración jurada
  const guardarDeclaracion = async () => {
    try {
      const datosCompletos = {
        ...formData,
        contribuyente_documento: contribuyenteSeleccionado.documento,
        codigo: `DJ-${contribuyenteSeleccionado.documento}-${formData.periodo}`,
        ubicacion: formData.tipo_predio === "URBANO" 
          ? `${formData.tipo_via} ${formData.nombre_via} ${formData.numero_municipal}`
          : formData.zona_rural,
        area_terreno: formData.tipo_predio === "URBANO" ? formData.area_terreno : formData.area_terreno_rural,
        deduccion: "NO" // Por defecto, se puede cambiar según lógica de negocio
      };

      const resultado = await DeclaracionJuradaService.crearDeclaracionJurada(datosCompletos);
      console.log("Declaración guardada:", resultado);
      
      // Volver a la fase 2 y actualizar lista
      const declaracionesActualizadas = await DeclaracionJuradaService.obtenerDeclaracionesPorContribuyente(contribuyenteSeleccionado.documento);
      setDeclaraciones(declaracionesActualizadas);
      setFase(2);
      
    } catch (error) {
      console.error("Error al guardar declaración:", error);
    }
  };

  // Renderizar FASE 1: Búsqueda de contribuyentes
  const renderFaseBusqueda = () => (
    <div>
      {/* Barra de búsqueda */}
      <div className="flex gap-2 mb-6">
        <Input
          label="Buscar contribuyentes"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-grow"
          placeholder="Ingrese código, tipo contribuyente, nombre/razón social o nro. doc./RUC..."
          description="La búsqueda se realiza automáticamente mientras escribe"
        />
      </div>

      {/* Tabla de resultados */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Tipo Contribuyente</th>
              <th className="border border-gray-300 p-2 text-left">Nombre/Razón Social</th>
              <th className="border border-gray-300 p-2 text-left">Nro. Doc./RUC</th>
              <th className="border border-gray-300 p-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    Buscando contribuyentes...
                  </div>
                </td>
              </tr>
            ) : resultados.length > 0 ? (
              resultados.map((contribuyente, index) => (
                <tr
                  key={contribuyente.id}
                  className="border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="p-2 border border-gray-300 font-mono text-sm">
                    {index + 1}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      contribuyente.tipoContribuyente === "PERSONA NATURAL" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {contribuyente.tipoContribuyente}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300 font-medium">
                    {contribuyente.nombre}
                  </td>
                  <td className="p-2 border border-gray-300 font-mono text-sm">
                    {contribuyente.documento}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <Button
                      size="sm"
                      color="primary"
                      onPress={() => handleSeleccionarContribuyente(contribuyente)}
                    >
                      Seleccionar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500"
                >
                  {busqueda
                    ? "No se encontraron contribuyentes con esos criterios"
                    : "Ingrese un término de búsqueda para ver los contribuyentes"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Renderizar FASE 2: Declaraciones del contribuyente
  const renderFaseDeclaraciones = () => (
    <div>
      {/* Información del contribuyente seleccionado */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Contribuyente Seleccionado</h3>
        <p><strong>Nombre:</strong> {contribuyenteSeleccionado.nombre}</p>
        <p><strong>Documento:</strong> {contribuyenteSeleccionado.documento}</p>
        <p><strong>Tipo:</strong> {contribuyenteSeleccionado.tipoContribuyente}</p>
      </div>

      {/* Botón para nueva declaración */}
      <div className="mb-4">
        <Button
          color="success"
          onPress={handleNuevaDeclaracion}
          className="mb-4"
        >
          + Nueva Declaración Jurada
        </Button>
      </div>

      {/* Tabla de declaraciones existentes */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Código</th>
              <th className="border border-gray-300 p-2 text-left">Tipo Predio</th>
              <th className="border border-gray-300 p-2 text-left">Ubicación</th>
              <th className="border border-gray-300 p-2 text-left">Deducción</th>
              <th className="border border-gray-300 p-2 text-left">Área Terreno</th>
              <th className="border border-gray-300 p-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {cargandoDeclaraciones ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    Cargando declaraciones...
                  </div>
                </td>
              </tr>
            ) : declaraciones.length > 0 ? (
              declaraciones.map((declaracion, index) => (
                <tr
                  key={declaracion.id}
                  className="border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="p-2 border border-gray-300">{index + 1}</td>
                  <td className="p-2 border border-gray-300 font-mono text-sm">
                    {declaracion.codigo || "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {declaracion.tipo_predio || "URBANO"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {declaracion.ubicacion || "Sin ubicación"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {declaracion.deduccion || "NO"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {declaracion.area_terreno || "0 m²"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <Button
                      size="sm"
                      color="primary"
                      onPress={() => handleVerDeclaracion(declaracion)}
                    >
                      Ver Declaración
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-8 text-center text-gray-500"
                >
                  No se encontraron declaraciones juradas para este contribuyente
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Renderizar FASE 3: Formulario de nueva declaración jurada
  const renderFaseNuevaDeclaracion = () => (
    <div>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Nueva Declaración Jurada</h3>
        <p><strong>Contribuyente:</strong> {contribuyenteSeleccionado.nombre}</p>
        <p><strong>Documento:</strong> {contribuyenteSeleccionado.documento}</p>
        <p><strong>Periodo:</strong> {formData.periodo}</p>
      </div>

      {/* Selección de tipo de predio */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Tipo de Predio *</label>
        <div className="flex gap-4">
          <Button
            color={formData.tipo_predio === "URBANO" ? "primary" : "default"}
            onPress={() => handleInputChange("tipo_predio", "URBANO")}
          >
            PREDIO URBANO
          </Button>
          <Button
            color={formData.tipo_predio === "RURAL" ? "primary" : "default"}
            onPress={() => handleInputChange("tipo_predio", "RURAL")}
          >
            PREDIO RURAL
          </Button>
        </div>
      </div>

      {/* Formulario según tipo de predio */}
      {formData.tipo_predio === "URBANO" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h4 className="font-bold">a) PREDIO URBANO</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Código de Vía"
                  value={formData.codigo_via}
                  onChange={(e) => handleInputChange("codigo_via", e.target.value)}
                />
                <Input
                  label="Tipo de Vía"
                  value={formData.tipo_via}
                  onChange={(e) => handleInputChange("tipo_via", e.target.value)}
                />
                <Input
                  label="Nombre de Vía"
                  value={formData.nombre_via}
                  onChange={(e) => handleInputChange("nombre_via", e.target.value)}
                />
                <Input
                  label="Número Municipal"
                  value={formData.numero_municipal}
                  onChange={(e) => handleInputChange("numero_municipal", e.target.value)}
                />
                <Input
                  label="Manzana"
                  value={formData.manzana}
                  onChange={(e) => handleInputChange("manzana", e.target.value)}
                />
                <Input
                  label="Lote"
                  value={formData.lote}
                  onChange={(e) => handleInputChange("lote", e.target.value)}
                />
                <Input
                  label="Área del Terreno (m²)"
                  type="number"
                  value={formData.area_terreno}
                  onChange={(e) => handleInputChange("area_terreno", e.target.value)}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h4 className="font-bold">b) PREDIO RURAL</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Zona Rural"
                  value={formData.zona_rural}
                  onChange={(e) => handleInputChange("zona_rural", e.target.value)}
                />
                <Input
                  label="Área del Terreno (ha)"
                  type="number"
                  value={formData.area_terreno_rural}
                  onChange={(e) => handleInputChange("area_terreno_rural", e.target.value)}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Características de construcción */}
      <Card className="mt-6">
        <CardHeader>
          <h4 className="font-bold">Características de Construcción</h4>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Piso"
              value={formData.piso}
              onChange={(e) => handleInputChange("piso", e.target.value)}
            />
            <Input
              label="Sección"
              value={formData.seccion}
              onChange={(e) => handleInputChange("seccion", e.target.value)}
            />
            <Input
              label="Fecha de Construcción"
              type="date"
              value={formData.fecha_construccion}
              onChange={(e) => handleInputChange("fecha_construccion", e.target.value)}
            />
            <Input
              label="Nivel de Piso (NEP)"
              value={formData.nivel_piso}
              onChange={(e) => handleInputChange("nivel_piso", e.target.value)}
            />
            <Input
              label="Estado Conservación Estructura (ECS)"
              value={formData.estado_conservacion_estructura}
              onChange={(e) => handleInputChange("estado_conservacion_estructura", e.target.value)}
            />
            <Input
              label="Estado Conservación Acabados (ECC)"
              value={formData.estado_conservacion_acabados}
              onChange={(e) => handleInputChange("estado_conservacion_acabados", e.target.value)}
            />
            <Input
              label="Número de Pisos (NC)"
              value={formData.numero_pisos}
              onChange={(e) => handleInputChange("numero_pisos", e.target.value)}
            />
            <Input
              label="Tipo de Construcción (T)"
              value={formData.tipo_construccion}
              onChange={(e) => handleInputChange("tipo_construccion", e.target.value)}
            />
            <Input
              label="Porcentaje de Incremento (PI)"
              value={formData.porcentaje_incremento}
              onChange={(e) => handleInputChange("porcentaje_incremento", e.target.value)}
            />
            <Input
              label="Precio Unitario (PU)"
              value={formData.precio_unitario}
              onChange={(e) => handleInputChange("precio_unitario", e.target.value)}
            />
            <Input
              label="Revestimiento (RV)"
              value={formData.revestimiento}
              onChange={(e) => handleInputChange("revestimiento", e.target.value)}
            />
            <Input
              label="Baños (B)"
              value={formData.banios}
              onChange={(e) => handleInputChange("banios", e.target.value)}
            />
            <Input
              label="Instalaciones Eléctricas (IE)"
              value={formData.instalaciones_electricas}
              onChange={(e) => handleInputChange("instalaciones_electricas", e.target.value)}
            />
            <Input
              label="Área Construida"
              value={formData.area_construida}
              onChange={(e) => handleInputChange("area_construida", e.target.value)}
            />
            <Input
              label="Unidad de Medida Construcción (UCA)"
              value={formData.unidad_medida_construccion}
              onChange={(e) => handleInputChange("unidad_medida_construccion", e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Otras instalaciones */}
      <Card className="mt-6">
        <CardHeader>
          <h4 className="font-bold">Otras Instalaciones</h4>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Formulario para agregar nueva instalación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Código"
                value={nuevaInstalacion.codigo}
                onChange={(e) => handleInstalacionChange("codigo", e.target.value)}
              />
              <Input
                label="Descripción"
                value={nuevaInstalacion.descripcion}
                onChange={(e) => handleInstalacionChange("descripcion", e.target.value)}
              />
              <Input
                label="Uso"
                value={nuevaInstalacion.uso}
                onChange={(e) => handleInstalacionChange("uso", e.target.value)}
              />
              <Input
                label="Fecha Construcción"
                type="date"
                value={nuevaInstalacion.fecha_construccion}
                onChange={(e) => handleInstalacionChange("fecha_construccion", e.target.value)}
              />
              <Input
                label="Nivel Piso (NEP)"
                value={nuevaInstalacion.nivel_piso}
                onChange={(e) => handleInstalacionChange("nivel_piso", e.target.value)}
              />
              <Input
                label="ECS"
                value={nuevaInstalacion.estado_conservacion_estructura}
                onChange={(e) => handleInstalacionChange("estado_conservacion_estructura", e.target.value)}
              />
              <Input
                label="ECC"
                value={nuevaInstalacion.estado_conservacion_acabados}
                onChange={(e) => handleInstalacionChange("estado_conservacion_acabados", e.target.value)}
              />
              <Input
                label="Largo"
                value={nuevaInstalacion.largo}
                onChange={(e) => handleInstalacionChange("largo", e.target.value)}
              />
              <Input
                label="Ancho"
                value={nuevaInstalacion.ancho}
                onChange={(e) => handleInstalacionChange("ancho", e.target.value)}
              />
              <Input
                label="Alto"
                value={nuevaInstalacion.alto}
                onChange={(e) => handleInstalacionChange("alto", e.target.value)}
              />
              <Input
                label="Total"
                value={nuevaInstalacion.total}
                onChange={(e) => handleInstalacionChange("total", e.target.value)}
              />
              <Input
                label="Unidad de Medida"
                value={nuevaInstalacion.unidad_medida}
                onChange={(e) => handleInstalacionChange("unidad_medida", e.target.value)}
              />
              <Input
                label="Valor Unitario"
                value={nuevaInstalacion.valor_unitario}
                onChange={(e) => handleInstalacionChange("valor_unitario", e.target.value)}
              />
              <div className="md:col-span-3">
                <Button onPress={agregarInstalacion} color="primary">
                  Agregar Instalación
                </Button>
              </div>
            </div>

            {/* Lista de instalaciones agregadas */}
            {formData.otras_instalaciones.length > 0 && (
              <div className="mt-4">
                <h5 className="font-bold mb-2">Instalaciones Agregadas</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Código</th>
                        <th className="border border-gray-300 p-2 text-left">Descripción</th>
                        <th className="border border-gray-300 p-2 text-left">Uso</th>
                        <th className="border border-gray-300 p-2 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.otras_instalaciones.map((instalacion, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">{instalacion.codigo}</td>
                          <td className="border border-gray-300 p-2">{instalacion.descripcion}</td>
                          <td className="border border-gray-300 p-2">{instalacion.uso}</td>
                          <td className="border border-gray-300 p-2">
                            <Button
                              size="sm"
                              color="danger"
                              onPress={() => eliminarInstalacion(index)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-6">
        <Button onPress={handleVolver} color="default">
          Volver
        </Button>
        <Button onPress={guardarDeclaracion} color="success">
          Guardar Declaración Jurada
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="flex justify-between items-center w-full">
            <div>
              <h2 className="text-xl font-bold">Declaración Jurada</h2>
              <p className="text-sm text-gray-600 mt-1">
                {fase === 1 && "Búsqueda de contribuyentes"}
                {fase === 2 && `Declaraciones de ${contribuyenteSeleccionado?.nombre}`}
                {fase === 3 && "Nueva Declaración Jurada"}
              </p>
            </div>
            
            {fase > 1 && (
              <Button onPress={handleVolver} color="default" size="sm">
                Volver
              </Button>
            )}
          </div>
        </CardHeader>
        
        <Divider />
        
        <CardBody>
          {fase === 1 && renderFaseBusqueda()}
          {fase === 2 && renderFaseDeclaraciones()}
          {fase === 3 && renderFaseNuevaDeclaracion()}
        </CardBody>
      </Card>
    </div>
  );
}