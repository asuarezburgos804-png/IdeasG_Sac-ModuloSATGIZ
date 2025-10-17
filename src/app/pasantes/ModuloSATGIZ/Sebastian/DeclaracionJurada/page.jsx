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
import DeclaracionJuradaService from "@/app/services/Sebastian/DeclaracionJurada/DeclaracionJuradaService";

export default function DeclaracionJurada() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [seccion, setSeccion] = useState([]);

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
    departamento: "",
    provincia: "",
    distrito: "",
    codigo_via: "",
    tipo_via: "",
    nombre_via: "",
    arancel: "",
    numero_municipal: "",
    manzana_urbana: "",
    lote_urbano: "",
    tipo_denominacion_urbana: "",
    nombre_denominacion_urbana: "",
    autoriza_deduccion: "",
    uso_predio_urbano: "",
    estado_predio: "",
    tipo_predio: "",
    condicion_predio: "",
    area_total_terreno: "",
    tiene_agua: "",
    numero_suministro_agua: "",
    tiene_luz: "",
    numero_suministro_luz: "",
    tiene_desague: "",
    numero_suministro_desague: "",
    
    // Datos del predio rural
    departamento: "",
    provincia: "",
    distrito: "",
    zona_predio_rural: "",
    nombre_predio: "",
    autoriza_deduccion: "",
    uso_predio_urbano: "",
    estado_predio: "",
    tipo_predio: "",
    condicion_predio: "",
    area_terreno_rural: "",
    grupo_tierras: "",
    rango_altitud: "",
    calidad_agricola: "",
    valor_categoria: "",

    // Características de construcción
    numero_piso: "",
    seccion_piso: "",
    fecha_construccion: "",
    material_estructural_predominante: "",
    estado_conservacion_estructura: "",
    estado_conservacion_acabados: "",
    unidad_medida_construccion: "",
    muros: "",
    techos: "",
    pisos: "",
    puertas: "",
    revestimiento: "",
    banios: "",
    instalaciones_electricas: "",
    area_construida_declarada: "",
    area_construida_verificada: "",
    valor_unitario: "",
    depreciacion: "",
    valor_unitario_depreciado: "",
    area_construida: "",
    valor_total_areas: "",
    valor_construccion_piso: "",
    valor_total_construccion: "",

    // Otras instalaciones
    otras_instalaciones: [],
  });

  const [nuevaInstalacion, setNuevaInstalacion] = useState({
    codigo: "",
    descripcion: "",
    uso: "",
    material_estructural_predominante: "",
    estado_conservacion_estructura: "",
    estado_conservacion_acabados: "",
    fecha_construccion: "",
    unidad_medida: "",
    unidad_medida_construccion: "",
    valor_bien_comun: "",
    largo: "",
    ancho: "",
    alto: "",
    total: "",
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
        const contribuyentesFiltrados =
          await DeclaracionJuradaService.buscarContribuyentes(busqueda);

        const resultadosMapeados = contribuyentesFiltrados.map(
          (contribuyente) => ({
            id: contribuyente.c_num_documento,
            codigo: contribuyente.c_codigo,
            tipoContribuyente: contribuyente.c_tipo_contribuyente,
            nombre: contribuyente.c_nombre,
            documento: contribuyente.c_num_documento,
            estado: contribuyente.c_estado,
          })
        );

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
      const declaracionesContribuyente =
        await DeclaracionJuradaService.obtenerDeclaracionesPorContribuyente(
          contribuyente.documento
        );
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
      periodo: new Date().getFullYear().toString(),
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejar cambios en nueva instalación
  const handleInstalacionChange = (field, value) => {
    setNuevaInstalacion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Agregar nueva instalación
  const agregarInstalacion = () => {
    if (nuevaInstalacion.descripcion) {
      setFormData((prev) => ({
        ...prev,
        otras_instalaciones: [
          ...prev.otras_instalaciones,
          { ...nuevaInstalacion },
        ],
      }));
      setNuevaInstalacion({
        codigo: "",
        descripcion: "",
        uso: "",
        material_estructural_predominante: "",
        estado_conservacion_estructura: "",
        estado_conservacion_acabados: "",
        fecha_construccion: "",
        unidad_medida: "",
        unidad_medida_construccion: "",
        valor_bien_comun: "",
        largo: "",
        ancho: "",
        alto: "",
        total: "",
      });
    }
  };

  // Eliminar instalación
  const eliminarInstalacion = (index) => {
    setFormData((prev) => ({
      ...prev,
      otras_instalaciones: prev.otras_instalaciones.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Guardar declaración jurada
  const guardarDeclaracion = async () => {
    try {
      const datosCompletos = {
        ...formData,
        contribuyente_documento: contribuyenteSeleccionado.documento,
        codigo: `DJ-${contribuyenteSeleccionado.documento}-${formData.periodo}`,
        ubicacion:
          formData.tipo_predio === "URBANO"
            ? `${formData.tipo_via} ${formData.nombre_via} ${formData.numero_municipal}`
            : formData.zona_rural,
        area_terreno:
          formData.tipo_predio === "URBANO"
            ? formData.area_terreno
            : formData.area_terreno_rural,
        deduccion: "NO", // Por defecto, se puede cambiar según lógica de negocio
      };

      const resultado = await DeclaracionJuradaService.crearDeclaracionJurada(
        datosCompletos
      );
      console.log("Declaración guardada:", resultado);

      // Volver a la fase 2 y actualizar lista
      const declaracionesActualizadas =
        await DeclaracionJuradaService.obtenerDeclaracionesPorContribuyente(
          contribuyenteSeleccionado.documento
        );
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
              <th className="border border-gray-300 p-2 text-left">
                Tipo Contribuyente
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Nombre/Razón Social
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Nro. Doc./RUC
              </th>
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        contribuyente.tipoContribuyente === "PERSONA NATURAL"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
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
                      onPress={() =>
                        handleSeleccionarContribuyente(contribuyente)
                      }
                    >
                      Seleccionar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
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
        <p>
          <strong>Nombre:</strong> {contribuyenteSeleccionado.nombre}
        </p>
        <p>
          <strong>Documento:</strong> {contribuyenteSeleccionado.documento}
        </p>
        <p>
          <strong>Tipo:</strong> {contribuyenteSeleccionado.tipoContribuyente}
        </p>
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
              <th className="border border-gray-300 p-2 text-left">
                Tipo Predio
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Ubicación
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Deducción
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Área Terreno
              </th>
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
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No se encontraron declaraciones juradas para este
                  contribuyente
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
        <p>
          <strong>Contribuyente:</strong> {contribuyenteSeleccionado.nombre}
        </p>
        <p>
          <strong>Documento:</strong> {contribuyenteSeleccionado.documento}
        </p>
        <p>
          <strong>Periodo:</strong> {formData.periodo}
        </p>
      </div>

      {/* Selección de tipo de predio */}
      <div className="mb-6">
        <Select
          label="Tipo de Predio a registrar"
          selectedKeys={[formData.tipo_predio]}
          onChange={(e) => handleInputChange("tipo_predio", e.target.value)}
          className="max-w-xs"
        >
          <SelectItem key="URBANO" value="URBANO">
            PREDIO URBANO
          </SelectItem>
          <SelectItem key="RURAL" value="RURAL">
            PREDIO RURAL
          </SelectItem>
        </Select>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-2 mb-6">
        <Button
          color={seccion === "predio" ? "primary" : "default"}
          onPress={() => setSeccion("predio")}
        >
          Datos del Predio
        </Button>
        <Button
          color={seccion === "construccion" ? "primary" : "default"}
          onPress={() => setSeccion("construccion")}
        >
          Características de la Construcción
        </Button>
        <Button
          color={seccion === "instalaciones" ? "primary" : "default"}
          onPress={() => setSeccion("instalaciones")}
        >
          Otras Instalaciones
        </Button>
      </div>

      {/* Formulario según tipo de predio */}
      {seccion === "predio" && (
        <>
          {formData.tipo_predio === "URBANO" ? (
            <div className="space-y-6">
          <Card>
            <CardHeader>
              <h4 className="font-bold">Ubicación del Predio Urbano</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Departamento"
                  value={formData.departamento}
                  onChange={(e) => handleInputChange("departamento", e.target.value)}
                />
                <Input
                  label="Provincia"
                  value={formData.provincia}
                  onChange={(e) => handleInputChange("provincia", e.target.value)}
                />
                <Input
                  label="Distrito"
                  value={formData.distrito}
                  onChange={(e) => handleInputChange("distrito", e.target.value)}
                />
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
                  label="Arancel"
                  value={formData.arancel}
                  onChange={(e) => handleInputChange("arancel", e.target.value)}
                  placeholder="S/."
                />
                <Input
                  label="Número Municipal"
                  value={formData.numero_municipal}
                  onChange={(e) => handleInputChange("numero_municipal", e.target.value)}
                />
                <Input
                  label="Manzana Urbana"
                  value={formData.manzana_urbana}
                  onChange={(e) => handleInputChange("manzana_urbana", e.target.value)}
                />
                <Input
                  label="Lote Urbana"
                  value={formData.lote_urbana}
                  onChange={(e) => handleInputChange("lote_urbana", e.target.value)}
                />
                <Input
                  label="Tipo de Denominación Urbana"
                  value={formData.tipo_denominacion_urbana}
                  onChange={(e) => handleInputChange("tipo_denominacion_urbana", e.target.value)}
                />
                <Input
                  label="Nombre de Denominación Urbana"
                  value={formData.nombre_denominacion_urbana}
                  onChange={(e) => handleInputChange("nombre_denominacion_urbana", e.target.value)}
                />
              </div>

              <Divider className="my-8"/>

              <div>
                <h4 className="text-md font-semibold mb-4">Deducción del Predio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.autoriza_deduccion || false}
                        onChange={(e) => handleInputChange("autoriza_deduccion", e.target.checked)}
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

              <Divider className="my-8"/>

              <div>
                <h4 className="text-md font-semibold mb-4">Datos del Predio (uso, estado, tipo)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Uso del Predio Urbano"
                    value={formData.uso_predio_urbano}
                    onChange={(e) => handleInputChange("uso_predio_urbano", e.target.value)}
                  />
                  <Input
                    label="Estado del Predio"
                    value={formData.estado_predio}
                    onChange={(e) => handleInputChange("estado_predio", e.target.value)}
                  />
                  <Input
                    label="Tipo de Predio"
                    value={formData.tipo_predio}
                    onChange={(e) => handleInputChange("tipo_predio", e.target.value)}
                  />
                  <Input
                    label="Condición del Predio"
                    value={formData.condicion_predio}
                    onChange={(e) => handleInputChange("condicion_predio", e.target.value)}
                  />
                  <Input
                    label="Área Total del Terreno (m²)"
                    type="number"
                    value={formData.area_total_terreno}
                    onChange={(e) => handleInputChange("area_total_terreno", e.target.value)}
                  />
                </div>
              </div>

              <Divider className="my-8"/>

              <div className="md:col-span-2">
                <h4 className="text-md font-semibold mb-4">Datos Complementarios del Predio (Servicios Básicos)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Agua */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.tiene_agua || false}
                        onChange={(e) => handleInputChange("tiene_agua", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Agua</span>
                    </label> 
                    <Input
                      label="N° de Suministro de Agua"
                      value={formData.numero_suministro_agua || ""}
                      onChange={(e) => handleInputChange("numero_suministro_agua", e.target.value)}
                      isDisabled={!formData.tiene_agua}
                      size="sm"  
                    />
                  </div>

                  {/* Luz */}
                  <div className="space-y-2">
                   <label className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       checked={formData.tiene_luz || false}
                       onChange={(e) => handleInputChange("tiene_luz", e.target.checked)}
                       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Luz</span>
                    </label>
                    <Input
                      label="N° de Suministro de Luz"
                      value={formData.numero_suministro_luz || ""}
                      onChange={(e) => handleInputChange("numero_suministro_luz", e.target.value)}
                      isDisabled={!formData.tiene_luz}
                      size="sm"
                    />
                  </div>

                  {/* Desagüe */}
                  <div className="space-y-2">
                   <label className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       checked={formData.tiene_desague || false}
                       onChange={(e) => handleInputChange("tiene_desague", e.target.checked)}
                       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Desagüe</span>
                    </label>
                    <Input
                      label="N° de Suministro de Desagüe"
                      value={formData.numero_suministro_desague || ""}
                      onChange={(e) => handleInputChange("numero_suministro_desague", e.target.value)}
                      isDisabled={!formData.tiene_desague}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h4 className="font-bold">Ubicación del Predio Rural</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Departamento"
                  value={formData.departamento}
                  onChange={(e) => handleInputChange("departamento", e.target.value)}
                />
                <Input
                  label="Provincia"
                  value={formData.provincia}
                  onChange={(e) => handleInputChange("provincia", e.target.value)}
                />
                <Input
                  label="Distrito"
                  value={formData.distrito}
                  onChange={(e) => handleInputChange("distrito", e.target.value)}
                />
                <Input
                  label="Zona donde se encuentra el Predio Rural"
                  value={formData.zona_predio_rural}
                  onChange={(e) => handleInputChange("zona_predio_rural", e.target.value)}
                />
                <Input
                  label="Nombre del Predio"
                  value={formData.nombre_predio}
                  onChange={(e) => handleInputChange("nombre_predio", e.target.value)}
                />
              </div>

              <Divider className="my-8"/>

              <div>
                <h4 className="text-md font-semibold mb-4">Deducción del Predio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.autoriza_deduccion || false}
                        onChange={(e) => handleInputChange("autoriza_deduccion", e.target.checked)}
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

              <Divider className="my-8"/>
              <div>
                <h4 className="text-md font-semibold mb-4">Datos del Predio (uso, estado, tipo)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Uso del Predio Urbano"
                    value={formData.uso_predio_urbano}
                    onChange={(e) => handleInputChange("uso_predio_urbano", e.target.value)}
                  />
                  <Input
                    label="Estado del Predio"
                    value={formData.estado_predio}
                    onChange={(e) => handleInputChange("estado_predio", e.target.value)}
                  />
                  <Input
                    label="Tipo de Predio"
                    value={formData.tipo_predio}
                    onChange={(e) => handleInputChange("tipo_predio", e.target.value)}
                  />
                  <Input
                    label="Condición del Predio"
                    value={formData.condicion_predio}
                    onChange={(e) => handleInputChange("condicion_predio", e.target.value)}
                  />
                <Input
                  label="Área del Terreno (HA)"
                  type="number"
                  value={formData.area_terreno_rural}
                  onChange={(e) => handleInputChange("area_terreno_rural", e.target.value)}
                />
                <Input
                  label="Grupo de Tierras"
                  value={formData.grupo_tierras}
                  onChange={(e) => handleInputChange("grupo_tierras", e.target.value)}
                />
                <Input
                  label="Rango de Altitud"
                  value={formData.rango_altitud}
                  onChange={(e) => handleInputChange("rango_altitud", e.target.value)}
                />
                <Input
                  label="Calidad Agrícola"
                  value={formData.calidad_agricola}
                  onChange={(e) => handleInputChange("calidad_agricola", e.target.value)}
                />
                <Input
                  label="Valor por Categoría"
                  value={formData.valor_categoria}
                  onChange={(e) => handleInputChange("valor_categoria", e.target.value)}
                />
              </div>
             </div>
            </CardBody>
          </Card>
        </div>
      )}
      </>
      )}

      {/* Características de construcción */}
      {seccion === "construccion" && (
        <Card className="mt-6">
          <CardHeader>
            <h4 className="font-bold">Información de construcciones</h4>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Nro. de Piso"
                value={formData.numero_piso}
                onChange={(e) => handleInputChange("numero_piso", e.target.value)}
              />
              <Input
                label="Sección de Piso"
                value={formData.seccion_piso}
                onChange={(e) => handleInputChange("seccion_piso", e.target.value)}
              />
              <Input
                label="Fecha de Construcción"
                type="date"
                value={formData.fecha_construccion}
                onChange={(e) =>
                  handleInputChange("fecha_construccion", e.target.value)
                }
              />
              <Input
                label="Material Estructural Predominante (MEP)"
                value={formData.material_estructural_predominante}
                onChange={(e) =>
                  handleInputChange("material_estructural_predominante", e.target.value)
                }
              />
              <Input
                label="Estado Conservación Acabados (ECC)"
                value={formData.estado_conservacion_acabados}
                onChange={(e) =>
                  handleInputChange(
                    "estado_conservacion_acabados",
                    e.target.value
                  )
                }
              />
              <Input
                label="Estado Conservación Estructura (ECS)"
                value={formData.estado_conservacion_estructura}
                onChange={(e) =>
                  handleInputChange(
                    "estado_conservacion_estructura",
                    e.target.value
                  )
                }
              />
              <Input
                label="Unidad de Medida de Construcción (UCA)"
                value={formData.unidad_medida_construccion}
                onChange={(e) =>
                  handleInputChange("unidad_medida_construccion", e.target.value)
                }
              />
              <Input
                label="Muros/Columnas"
                value={formData.muros}
                onChange={(e) =>
                  handleInputChange("muros", e.target.value)
                }
              />
              <Input
                label="Techos"
                value={formData.techos}
                onChange={(e) =>
                  handleInputChange("techos", e.target.value)
                }
              />
              <Input
                label="Pisos"
                value={formData.pisos}
                onChange={(e) =>
                  handleInputChange("pisos", e.target.value)
                }
              />
              <Input
                label="Revestimiento"
                value={formData.revestimiento}
                onChange={(e) =>
                  handleInputChange("revestimiento", e.target.value)
                }
              />
              <Input
                label="Baños"
                value={formData.banios}
                onChange={(e) => handleInputChange("banios", e.target.value)}
              />
              <Input
                label="Instalaciones Eléctricas Sanitarias"
                value={formData.instalaciones_electricas}
                onChange={(e) =>
                  handleInputChange("instalaciones_electricas", e.target.value)
                }
              />
              <Input
                label="Área Construida Declarada"
                value={formData.area_construida_declarada}
                onChange={(e) =>
                  handleInputChange("area_construida_declarada", e.target.value)
                }
              />
              <Input
                label="Área Construida Verificada"
                value={formData.area_construida_verificada}
                onChange={(e) =>
                  handleInputChange("area_construida_verificada", e.target.value)
                }
              />
            </div>

            <Divider className="my-8"/>

            <div>
              <h4 className="text-md font-semibold mb-4">Información para el Calculo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                label="Valor Unitario (M2)"
                value={formData.valor_unitario}
                onChange={(e) => handleInputChange("valor_unitario", e.target.value)}
              />
              <Input
                label="Depreciación"
                value={formData.depreciacion}
                onChange={(e) => handleInputChange("depreciacion", e.target.value)}
              />
              <Input
                label="Valor Unitario Depreciado"
                value={formData.valor_unitario_depreciado}
                onChange={(e) =>
                  handleInputChange("valor_unitario_depreciado", e.target.value)
                }
              />
              <Input
                label="Área Construida (M2)"
                value={formData.material_estructural_predominante}
                onChange={(e) =>
                  handleInputChange("material_estructural_predominante", e.target.value)
                }
              />
              <Input
                label="Valor Total de Áreas Construidas"
                value={formData.valor_total_areas}
                onChange={(e) =>
                  handleInputChange(
                    "valor_total_areas",
                    e.target.value
                  )
                }
              />
              <Input
                label="Valor de Construcción por Piso"
                value={formData.valor_construccion_piso}
                onChange={(e) =>
                  handleInputChange(
                    "valor_construccion_piso",
                    e.target.value
                  )
                }
              />
              <Input
                label="Valor Total de Construcción"
                value={formData.valor_total_construccion}
                onChange={(e) =>
                  handleInputChange("valor_total_construccion", e.target.value)
                }
              />
            </div>
          </div>
         </CardBody>
        </Card>
      )}

      {/* Otras instalaciones */}
      {seccion === "instalaciones" && (
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
                  onChange={(e) =>
                    handleInstalacionChange("codigo", e.target.value)
                  }
                />
                <Input
                  label="Descripción"
                  value={nuevaInstalacion.descripcion}
                  onChange={(e) =>
                    handleInstalacionChange("descripcion", e.target.value)
                  }
                />
                <Input
                  label="Uso"
                  value={nuevaInstalacion.uso}
                  onChange={(e) =>
                    handleInstalacionChange("uso", e.target.value)
                  }
                />
                <Input
                  label="MEP"
                  value={nuevaInstalacion.material_estructural_predominante}
                  onChange={(e) =>
                    handleInstalacionChange(
                      "material_estructural_predominante",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="ECC"
                  value={nuevaInstalacion.estado_conservacion_acabados}
                  onChange={(e) =>
                    handleInstalacionChange(
                      "estado_conservacion_acabados",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="ECS"
                  value={nuevaInstalacion.estado_conservacion_estructura}
                  onChange={(e) =>
                    handleInstalacionChange(
                      "estado_conservacion_estructura",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="Fecha de Construcción"
                  type="date"
                  value={nuevaInstalacion.fecha_construccion}
                  onChange={(e) =>
                    handleInstalacionChange(
                      "fecha_construccion",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="Unidad de Medida"
                  value={nuevaInstalacion.unidad_medida}
                  onChange={(e) =>
                    handleInstalacionChange("unidad_medida", e.target.value)
                  }
                />
                <Input
                  label="UCA"
                  value={nuevaInstalacion.unidad_medida_construccion}
                  onChange={(e) => 
                    handleInstalacionChange("unidad_medida_construccion", e.target.value)
                  }
                />
                <Input
                  label="% Valor Bien Común"
                  value={nuevaInstalacion.valor_bien_comun}
                  onChange={(e) =>
                    handleInstalacionChange("valor_bien_comun", e.target.value)
                  }
                />
                <Input
                  label="Largo"
                  value={nuevaInstalacion.largo}
                  onChange={(e) =>
                    handleInstalacionChange("largo", e.target.value)
                  }
                />
                <Input
                  label="Ancho"
                  value={nuevaInstalacion.ancho}
                  onChange={(e) =>
                    handleInstalacionChange("ancho", e.target.value)
                  }
                />
                <Input
                  label="Alto"
                  value={nuevaInstalacion.alto}
                  onChange={(e) =>
                    handleInstalacionChange("alto", e.target.value)
                  }
                />
                <Input
                  label="Total"
                  value={nuevaInstalacion.total}
                  onChange={(e) =>
                    handleInstalacionChange("total", e.target.value)
                  }
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
                          <th className="border border-gray-300 p-2 text-left">
                            Código
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Descripción
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Uso
                          </th>
                          <th className="border border-gray-300 p-2 text-left">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.otras_instalaciones.map(
                          (instalacion, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">
                                {instalacion.codigo}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {instalacion.descripcion}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {instalacion.uso}
                              </td>
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
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

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
                {fase === 2 &&
                  `Declaraciones de ${contribuyenteSeleccionado?.nombre}`}
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
