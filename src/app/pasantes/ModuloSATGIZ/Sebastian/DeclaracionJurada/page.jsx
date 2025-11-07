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
import { DeclaracionJuradaService as SATGIZDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Declaracion_Jurada_Services";
import { DatosUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Datos_Urbano_Declaracion_Jurada_Services";
import { DeduccionUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Deduccion_Urbano_Declaracion_Jurada_Services";

export default function DeclaracionJurada() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [seccion, setSeccion] = useState("predio"); // Corregido: inicializado como string

  // Estados para las fases
  const [fase, setFase] = useState(1); // 1: Búsqueda, 2: Declaraciones, 3: Nueva DJ
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] = useState(null);
  const [declaraciones, setDeclaraciones] = useState([]);
  const [cargandoDeclaraciones, setCargandoDeclaraciones] = useState(false);

  // Estados para ubicaciones
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(false);

  // Estados para tipos de vía
  const [tiposVia, setTiposVia] = useState([]);
  const [cargandoTiposVia, setCargandoTiposVia] = useState(false);

  // Estados para tipos de predio
  const [tiposPredio, setTiposPredio] = useState([]);
  const [cargandoTiposPredio, setCargandoTiposPredio] = useState(false);

  // Estados para tipos de denominación
  const [tiposDenominacion, setTiposDenominacion] = useState([]);
  const [cargandoTiposDenominacion, setCargandoTiposDenominacion] = useState(false);

  // Estado para errores de validación  
  const [errores, setErrores] = useState({});

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
    deduccion: "",
    autoriza_deduccion: "",
    uso_predio_urbano: "",
    estado_predio: "",
    clasificacion_predio: "",
    condicion_predio: "",
    area_total_terreno: "",
    tiene_agua: "",
    numero_suministro_agua: "",
    tiene_luz: "",
    numero_suministro_luz: "",
    tiene_desague: "",
    numero_suministro_desague: "",
    
    // Datos del predio rural
    departamento_rural: "",
    provincia_rural: "",
    distrito_rural: "",
    zona_predio_rural: "",
    nombre_predio: "",
    deduccion_rural: "",
    autoriza_deduccion_rural: "",
    uso_predio_rural: "",
    estado_predio_rural: "",
    clasificacion_predio_rural: "",
    condicion_predio_rural: "",
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

  // FUNCIÓN DE VALIDACIÓN
const validarFormulario = () => {
  const errores = {};

  // Validar datos básicos
  if (!formData.periodo || formData.periodo.trim() === '') {
    errores.periodo = "El período es requerido";
  } else if (formData.periodo.length !== 4 || isNaN(formData.periodo)) {
    errores.periodo = "El período debe ser un año válido (4 dígitos)";
  }

  // Validar predio urbano
  if (formData.tipo_predio === "URBANO") {
    if (!formData.departamento) {
      errores.departamento = "El departamento es requerido";
    }
    if (!formData.provincia) {
      errores.provincia = "La provincia es requerida";
    }
    if (!formData.distrito) {
      errores.distrito = "El distrito es requerido";
    }
    if (!formData.tipo_via || formData.tipo_via.trim() === '') {
      errores.tipo_via = "El tipo de vía es requerido";
    }
    if (!formData.nombre_via || formData.nombre_via.trim() === '') {
      errores.nombre_via = "El nombre de vía es requerido";
    }
    if (!formData.area_total_terreno || formData.area_total_terreno <= 0) {
      errores.area_total_terreno = "El área total debe ser mayor a 0";
    }
  }

  // Validar predio rural
  if (formData.tipo_predio === "RURAL") {
    if (!formData.departamento_rural) {
      errores.departamento_rural = "El departamento es requerido";
    }
    if (!formData.zona_predio_rural || formData.zona_predio_rural.trim() === '') {
      errores.zona_predio_rural = "La zona del predio es requerida";
    }
    if (!formData.area_terreno_rural || formData.area_terreno_rural <= 0) {
      errores.area_terreno_rural = "El área del terreno debe ser mayor a 0";
    }
  }

  return {
    isValid: Object.keys(errores).length === 0,
    errores
  };
};


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
            id: contribuyente.id_contribuyente || contribuyente.c_id || contribuyente.id,
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

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        setCargandoUbicaciones(true);
        const departamentosData = await DeclaracionJuradaService.obtenerDepartamentos();
        console.log("Departamentos cargados:", departamentosData);
        setDepartamentos(departamentosData);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
        // Datos de prueba si falla la API
        setDepartamentos([
          { id: "01", nombre: "LIMA" },
          { id: "02", nombre: "AREQUIPA" },
          { id: "03", nombre: "CUSCO" },
          { id: "04", nombre: "LA LIBERTAD" },
          { id: "05", nombre: "PIURA" }
        ]);
      } finally {
        setCargandoUbicaciones(false);
      }
    };

    cargarDepartamentos();
  }, []);

  // Cargar tipos de vía al montar el componente
  useEffect(() => {
    const cargarTiposVia = async () => {
      try {
        setCargandoTiposVia(true);
        const tiposViaData = await DeclaracionJuradaService.obtenerTiposVia();
        console.log("Tipos de vía cargados:", tiposViaData);
        setTiposVia(tiposViaData);
      } catch (error) {
        console.error("Error al cargar tipos de vía:", error);
        // Datos de prueba si falla la API
        setTiposVia([
          { id: "01", nombre: "AVENIDA" },
          { id: "02", nombre: "CALLE" },
          { id: "03", nombre: "JIRÓN" },
          { id: "04", nombre: "PASAJE" },
          { id: "05", nombre: "PLAZA" }
        ]);
      } finally {
        setCargandoTiposVia(false);
      }
    };

    cargarTiposVia();
  }, []);

  // Cargar tipos de predio al montar el componente
  useEffect(() => {
    const cargarTiposPredio = async () => {
      try {
        setCargandoTiposPredio(true);
        const tiposPredioData = await DeclaracionJuradaService.obtenerClasificacionesPredio();
        console.log("Tipos de predio cargados:", tiposPredioData);
        setTiposPredio(tiposPredioData);
      } catch (error) {
        console.error("Error al cargar tipos de predio:", error);
        // Datos de prueba si falla la API
        setTiposPredio([
          { id: "01", nombre: "RESIDENCIAL" },
          { id: "02", nombre: "COMERCIAL" },
          { id: "03", nombre: "INDUSTRIAL" },
          { id: "04", nombre: "AGRÍCOLA" },
          { id: "05", nombre: "ESPECIAL" }
        ]);
      } finally {
        setCargandoTiposPredio(false);
      }
    };

    cargarTiposPredio();
  }, []);

  // Cargar tipos de denominación al montar el componente
  useEffect(() => {
    const cargarTiposDenominacion = async () => {
      try {
        setCargandoTiposDenominacion(true);
        const tiposDenominacionData = await DeclaracionJuradaService.obtenerTiposDenominacion();
        console.log("Tipos de denominación cargados:", tiposDenominacionData);
        setTiposDenominacion(tiposDenominacionData);
      } catch (error) {
        console.error("Error al cargar tipos de denominación:", error);
        // Datos de prueba si falla la API
        setTiposDenominacion([
          { id: "01", nombre: "EDIFICIO" },
          { id: "02", nombre: "CONDOMINIO" },
          { id: "03", nombre: "TORRE" },
          { id: "04", nombre: "CENTRO COMERCIAL" },
          { id: "05", nombre: "GALERÍA" }
        ]);
      } finally {
        setCargandoTiposDenominacion(false);
      }
    };

    cargarTiposDenominacion();
  }, []);

  // Manejar cambio de departamento - cargar provincias
  const handleDepartamentoChange = async (departamentoId) => {
    // Determinar si es para predio urbano o rural basado en el tipo de predio seleccionado
    if (formData.tipo_predio === "URBANO") {
      handleInputChange("departamento", departamentoId);
      // Limpiar provincias y distritos anteriores
      setProvincias([]);
      setDistritos([]);
      handleInputChange("provincia", "");
      handleInputChange("distrito", "");
    } else {
      handleInputChange("departamento_rural", departamentoId);
      // Limpiar provincias y distritos anteriores
      setProvincias([]);
      setDistritos([]);
      handleInputChange("provincia_rural", "");
      handleInputChange("distrito_rural", "");
    }

    if (departamentoId) {
      try {
        setCargandoUbicaciones(true);
        const provinciasData = await DeclaracionJuradaService.obtenerProvincias(departamentoId);
        console.log("Provincias cargadas:", provinciasData);
        setProvincias(provinciasData);
      } catch (error) {
        console.error("Error al cargar provincias:", error);
        // Datos de prueba si falla la API
        if (departamentoId === "01") {
          setProvincias([
            { id: "0101", nombre: "LIMA" },
            { id: "0102", nombre: "CAÑETE" },
            { id: "0103", nombre: "HUARAL" }
          ]);
        } else {
          setProvincias([
            { id: `${departamentoId}01`, nombre: "PROVINCIA 1" },
            { id: `${departamentoId}02`, nombre: "PROVINCIA 2" }
          ]);
        }
      } finally {
        setCargandoUbicaciones(false);
      }
    }
  };

  // Manejar cambio de provincia - cargar distritos
  const handleProvinciaChange = async (provinciaId) => {
    // Determinar si es para predio urbano o rural basado en el tipo de predio seleccionado
    if (formData.tipo_predio === "URBANO") {
      handleInputChange("provincia", provinciaId);
      // Limpiar distritos anteriores
      setDistritos([]);
      handleInputChange("distrito", "");
    } else {
      handleInputChange("provincia_rural", provinciaId);
      // Limpiar distritos anteriores
      setDistritos([]);
      handleInputChange("distrito_rural", "");
    }

    if (provinciaId) {
      try {
        setCargandoUbicaciones(true);
        const distritosData = await DeclaracionJuradaService.obtenerDistritos(provinciaId);
        console.log("Distritos cargados:", distritosData);
        setDistritos(distritosData);
      } catch (error) {
        console.error("Error al cargar distritos:", error);
        // Datos de prueba si falla la API
        if (provinciaId === "0101") {
          setDistritos([
            { id: "010101", nombre: "LIMA" },
            { id: "010102", nombre: "MIRAFLORES" },
            { id: "010103", nombre: "SAN ISIDRO" }
          ]);
        } else {
          setDistritos([
            { id: `${provinciaId}01`, nombre: "DISTRITO 1" },
            { id: `${provinciaId}02`, nombre: "DISTRITO 2" }
          ]);
        }
      } finally {
        setCargandoUbicaciones(false);
      }
    }
  };

  // Estados para opciones de autorización de deducción
  const [cargandoOpcionesAutorizacion, setCargandoOpcionesAutorizacion] = useState(false);
  const [opcionesAutorizacion, setOpcionesAutorizacion] = useState([]);

  // Cargar opciones de autorización al montar el componente
  useEffect(() => {
    const cargarOpcionesAutorizacion = async () => {
      try {
        setCargandoOpcionesAutorizacion(true);
        const opcionesData = await DeclaracionJuradaService.obtenerOpcionesAutorizacion();
        console.log("Opciones de autorización cargadas:", opcionesData);
        setOpcionesAutorizacion(opcionesData);
      } catch (error) {
        console.error("Error al cargar opciones de autorización:", error);
        // Datos de prueba si falla la API
        setOpcionesAutorizacion([
          { id: "SI", nombre: "Sí" },
          { id: "NO", nombre: "No" }
        ]);
      } finally {
        setCargandoOpcionesAutorizacion(false);
      }
    };

    cargarOpcionesAutorizacion();
  }, []);

  // Manejar selección de contribuyente - Transición a FASE 2
  const handleSeleccionarContribuyente = async (contribuyente) => {
    setContribuyenteSeleccionado(contribuyente);
    setCargandoDeclaraciones(true);
    try {
      console.log("Contribuyente seleccionado:", contribuyente);
      // Usar el nombre del contribuyente para buscar declaraciones (servicio SATGIZ busca por nombre)
      const declaracionesContribuyente =
        await DeclaracionJuradaService.buscarDeclaracionesPorContribuyente(
          contribuyente.nombre
        );
      setDeclaraciones(declaracionesContribuyente);
    } catch (error) {
      console.error("Error al obtener declaraciones:", error);
      // El servicio ya maneja el fallback con datos temporales
      // Así que podemos proceder a la fase 2 incluso si hay error
    } finally {
      setCargandoDeclaraciones(false);
      // Siempre pasar a fase 2, independientemente del resultado del servicio
      setFase(2);
    }
  };

  // Manejar ver declaración existente
  const handleVerDeclaracion = (declaracion) => {
    console.log("Ver declaración:", declaracion);
    // Aquí podrías abrir el PDF o mostrar los detalles
  };

  // Manejar nueva declaración jurada - Transición a FASE 3
  const handleNuevaDeclaracion = () => {
    // Validar que existe contribuyente seleccionado
    if (!contribuyenteSeleccionado) {
      alert("Error: No hay contribuyente seleccionado. Volviendo a búsqueda.");
      setFase(1);
      return;
    }
  
    console.log("Contribuyente seleccionado para nueva DJ:", contribuyenteSeleccionado);
  
    setFase(3);
    // Inicializar SIN sobrescribir el estado existente
    setFormData(prev => ({
      ...prev,
      periodo: new Date().getFullYear().toString(),
    }));
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

  // Guardar declaración jurada usando servicios SATGIZ directamente
  const guardarDeclaracion = async () => {
    try {
      console.log("📝 Iniciando guardado de declaración jurada...");

      // PRIMERO VALIDAR EL FORMULARIO
      const validacion = validarFormulario();
      if (!validacion.isValid) {
      setErrores(validacion.errores);
      alert("❌ Por favor, corrige los errores en el formulario antes de guardar.");
      return;
    }

    // Limpiar errores si la validación pasa
    setErrores({});

      // Validar datos mínimos
      if (!contribuyenteSeleccionado?.id) {
        alert("❌ Error: No hay contribuyente seleccionado");
        return;
      }

      // 1. PREPARAR DATOS PARA DECLARACIÓN PRINCIPAL
      const datosDeclaracionPrincipal = {
        c_anio_liquidacion: formData.periodo || new Date().getFullYear().toString(),
        c_num_id: contribuyenteSeleccionado.id.toString(),
        c_contribuyente_principal: contribuyenteSeleccionado.nombre || "N/A",
        c_tipo_predio: formData.tipo_predio || "URBANO",
        c_estado: "PENDIENTE"
      };

      console.log("Datos declaración principal:", datosDeclaracionPrincipal);

      // Validar antes de enviar
      const validacionPrincipal = SATGIZDeclaracionJuradaService.validarDeclaracionJurada(datosDeclaracionPrincipal);
      if (!validacionPrincipal.isValid) {
        throw new Error(`Validación falló: ${JSON.stringify(validacionPrincipal.errors)}`);
      }

      // CREAR DECLARACIÓN PRINCIPAL
      let declaracionPrincipal = await SATGIZDeclaracionJuradaService.crearNuevaDeclaracion(datosDeclaracionPrincipal);
      console.log("✅ Declaración principal creada:", declaracionPrincipal);

      // 2. DATOS URBANOS (solo para predios urbanos)
      if (formData.tipo_predio === "URBANO") {
        try {
          const datosUrbanosPayload = {
            c_uso_predio_urbano: formData.uso_predio_urbano || "",
            c_estado_predio: formData.estado_predio || "",
            c_tipo_predio: formData.clasificacion_predio || "",
            c_condicion_predio: formData.condicion_predio || "",
            n_area_total_terreno: parseFloat(formData.area_total_terreno) || 0
          };

          console.log("Datos urbanos:", datosUrbanosPayload);

          // Validar datos urbanos
          const validacionUrbana = DatosUrbanoDeclaracionJuradaService.validarDatoUrbano(datosUrbanosPayload);
          if (validacionUrbana.isValid) {
            await DatosUrbanoDeclaracionJuradaService.crearDatoUrbano(datosUrbanosPayload);
            console.log("✅ Datos urbanos creados");
          } else {
            console.warn("⚠️ Datos urbanos no válidos:", validacionUrbana.errors);
          }
        } catch (error) {
          console.warn("⚠️ Error en datos urbanos:", error);
        }
      }

      // 3. DEDUCCIÓN (si aplica)
      if (formData.deduccion && formData.deduccion !== "NO") {
        try {
          const deduccionPayload = {
            c_descripcion_deduccion: formData.deduccion || "",
            c_autorizado: formData.autoriza_deduccion === "SI"
          };

          console.log("Datos deducción:", deduccionPayload);

          // Validar deducción
          const validacionDeduccion = DeduccionUrbanoDeclaracionJuradaService.validarDeduccionUrbana(deduccionPayload);
          if (validacionDeduccion.isValid) {
            await DeduccionUrbanoDeclaracionJuradaService.crearDeduccion(deduccionPayload);
            console.log("✅ Deducción creada");
          } else {
            console.warn("⚠️ Deducción no válida:", validacionDeduccion.errors);
          }
        } catch (error) {
          console.warn("⚠️ Error en deducción:", error);
        }
      }

      // ÉXITO
      alert("✅ Declaración Jurada guardada exitosamente");

      // Actualizar lista y volver
      const declaracionesActualizadas = await DeclaracionJuradaService.buscarDeclaracionesPorContribuyente(
        contribuyenteSeleccionado.nombre
      );
      setDeclaraciones(declaracionesActualizadas);
      setFase(2);

    } catch (error) {
      console.error("❌ Error crítico al guardar:", error);
      
      // Mostrar error específico
      let mensajeError = "Error al guardar la declaración";
      if (error.message.includes("Validación falló")) {
        mensajeError = `Error de validación: ${error.message}`;
      } else if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
        mensajeError = "Error de conexión con el servidor. Verifique que el backend esté funcionando.";
      } else {
        mensajeError = error.message;
      }
      
      alert(`❌ ${mensajeError}`);
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
        <table className="min-w-full border-collapse border border-#d1d5dc">
          <thead>
            <tr className="bg-#f3f4f6">
              <th className="border border-#d1d5dc p-2 text-left">#</th>
              <th className="border border-#d1d5dc p-2 text-left">
                Tipo Contribuyente
              </th>
              <th className="border border-#d1d5dc p-2 text-left">
                Nombre/Razón Social
              </th>
              <th className="border border-#d1d5dc p-2 text-left">
                ID Contribuyente
              </th>
              <th className="border border-#d1d5dc p-2 text-left">Acción</th>
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
                  className="border-b hover:bg-#eff6ff transition-colors"
                >
                  <td className="p-2 border border-#d1d5dc font-mono text-sm">
                    {index + 1}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        contribuyente.tipoContribuyente === "PERSONA NATURAL"
                          ? "bg-#dbeafe text-#193cb8"
                          : "bg-#dcfce7 text-#016630"
                      }`}
                    >
                      {contribuyente.tipoContribuyente}
                    </span>
                  </td>
                  <td className="p-2 border border-#d1d5dc font-medium">
                    {contribuyente.nombre}
                  </td>
                  <td className="p-2 border border-#d1d5dc font-mono text-sm">
                    {contribuyente.id}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
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
                <td colSpan="5" className="p-8 text-center text-#6a7282">
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
      <div className="mb-6 p-4 bg-#eff6ff border border-#bedbff rounded-lg">
        <h3 className="font-bold text-lg mb-2">Contribuyente Seleccionado</h3>
        <p>
          <strong>Nombre:</strong> {contribuyenteSeleccionado.nombre}
        </p>
        <p>
          <strong>ID Contribuyente:</strong> {contribuyenteSeleccionado.id}
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
        <table className="min-w-full border-collapse border border-#d1d5dc">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-#d1d5dc p-2 text-left">#</th>
              <th className="border border-#d1d5dc p-2 text-left">Código</th>
              <th className="border border-#d1d5dc p-2 text-left">
                Tipo Predio
              </th>
              <th className="border border-#d1d5dc p-2 text-left">
                Ubicación
              </th>
              <th className="border border-#d1d5dc p-2 text-left">
                Deducción
              </th>
              <th className="border border-#d1d5dc p-2 text-left">
                Área Terreno
              </th>
              <th className="border border-#d1d5dc p-2 text-left">Acción</th>
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
                  className="border-b hover:bg-#eff6ff transition-colors"
                >
                  <td className="p-2 border border-#d1d5dc">{index + 1}</td>
                  <td className="p-2 border border-#d1d5dc font-mono text-sm">
                    {declaracion.codigo || "N/A"}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
                    {declaracion.tipo_predio || "URBANO"}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
                    {declaracion.ubicacion || "Sin ubicación"}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
                    {declaracion.deduccion || "NO"}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
                    {declaracion.area_terreno || "0 m²"}
                  </td>
                  <td className="p-2 border border-#d1d5dc">
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
                <td colSpan="7" className="p-8 text-center text-#6a7282">
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
  const renderFaseNuevaDeclaracion = () => {
    //  Validación EXTRA de seguridad
    /*if (!contribuyenteSeleccionado || !contribuyenteSeleccionado.id) {
      return (
        <div className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-bold text-lg mb-2">Error de datos</h3>
            <p className="text-red-600 mb-4">
              No se encontró información del contribuyente. 
              Esto puede pasar si hubo un error al cargar los datos.
            </p>
            <Button onPress={() => setFase(1)} color="danger">
              Volver a buscar contribuyente
            </Button>
          </div>
        </div>
      );
    }*/

    return (
      <div>
        <div className="mb-6 p-4 bg-#eff6ff border border-#bedbff rounded-lg">
          <h3 className="font-bold text-lg mb-2">Nueva Declaración Jurada</h3>
          <p>
            <strong>Contribuyente:</strong> {contribuyenteSeleccionado.nombre}
          </p>
          <p>
            <strong>ID Contribuyente:</strong> {contribuyenteSeleccionado.id}
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
                  <Select
                    label="Departamento"
                    selectedKeys={formData.departamento ? [formData.departamento] : []}
                    onChange={(e) => handleDepartamentoChange(e.target.value)}
                    isLoading={cargandoUbicaciones}
                    isInvalid={!!errores.departamento}
                    errorMessage={errores.departamento}
                  >
                    {departamentos.map((departamento) => (
                      <SelectItem key={departamento.id} value={departamento.id}>
                        {departamento.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Provincia"
                    selectedKeys={formData.provincia ? [formData.provincia] : []}
                    onChange={(e) => handleProvinciaChange(e.target.value)}
                    isLoading={cargandoUbicaciones}
                    isDisabled={!formData.departamento}
                    isInvalid={!!errores.provincia}
                    errorMessage={errores.provincia}
                  >
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Distrito"
                    selectedKeys={formData.distrito ? [formData.distrito] : []}
                    onChange={(e) => handleInputChange("distrito", e.target.value)}
                    isLoading={cargandoUbicaciones}
                    isDisabled={!formData.provincia}
                    isInvalid={!!errores.distrito}
                    errorMessage={errores.distrito}
                  >
                    {distritos.map((distrito) => (
                      <SelectItem key={distrito.id} value={distrito.id}>
                        {distrito.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Código de Vía"
                    value={formData.codigo_via}
                    onChange={(e) => handleInputChange("codigo_via", e.target.value)}
                  />
                  <Input
                    label="Tipo de Vía"
                    value={formData.tipo_via}
                    onChange={(e) => handleInputChange("tipo_via", e.target.value)}
                    placeholder="Ej: AVENIDA, CALLE, JIRÓN, etc."
                    isInvalid={!!errores.tipo_via}
                    errorMessage={errores.tipo_via}
                  />
                  <Input
                    label="Nombre de Vía"
                    value={formData.nombre_via}
                    onChange={(e) => handleInputChange("nombre_via", e.target.value)}
                    placeholder="Ingrese el nombre de la vía"
                    isInvalid={!!errores.nombre_via}
                    errorMessage={errores.nombre_via}
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
                    label="Lote Urbano"
                    value={formData.lote_urbano}
                    onChange={(e) => handleInputChange("lote_urbano", e.target.value)}
                  />
                  <Select
                    label="Tipo de Denominación Urbana"
                    selectedKeys={formData.tipo_denominacion_urbana ? [formData.tipo_denominacion_urbana] : []}
                    onChange={(e) => handleInputChange("tipo_denominacion_urbana", e.target.value)}
                    isLoading={cargandoTiposDenominacion}
                  >
                    {tiposDenominacion.map((tipoDenominacion) => (
                      <SelectItem key={tipoDenominacion.id} value={tipoDenominacion.id}>
                        {tipoDenominacion.nombre}
                      </SelectItem>
                    ))}
                  </Select>
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
                        <Input
                          label="La deducción sería"
                          value={formData.deduccion}
                          onChange={(e) => handleInputChange("deduccion", e.target.value)}
                        />
                        <Select
                          label="¿Se autoriza?"
                          selectedKeys={formData.autoriza_deduccion ? [formData.autoriza_deduccion] : []}
                          onChange={(e) => handleInputChange("autoriza_deduccion", e.target.value)}
                          isLoading={cargandoOpcionesAutorizacion}
                          isDisabled={!formData.deduccion}
                        >
                          {opcionesAutorizacion.map((opcionesAutorizacion) => (
                            <SelectItem key={opcionesAutorizacion.id} value={opcionesAutorizacion.id}>
                              {opcionesAutorizacion.nombre}
                            </SelectItem>
                          ))}
                        </Select>
                      </label>
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
                    <Select
                      label="Estado del Predio"
                      selectedKeys={formData.estado_predio ? [formData.estado_predio] : []}
                      onChange={(e) => handleInputChange("estado_predio", e.target.value)}
                    >
                      <SelectItem key="BUENO" value="BUENO">BUENO</SelectItem>
                      <SelectItem key="REGULAR" value="REGULAR">REGULAR</SelectItem>
                      <SelectItem key="MALO" value="MALO">MALO</SelectItem>
                    </Select>
                    <Select
                      label="Clasificación del Predio"
                      selectedKeys={formData.clasificacion_predio ? [formData.clasificacion_predio] : []}
                      onChange={(e) => handleInputChange("clasificacion_predio", e.target.value)}
                      isLoading={cargandoTiposPredio}
                    >
                      {tiposPredio.map((tipoPredio) => (
                        <SelectItem key={tipoPredio.id} value={tipoPredio.id}>
                          {tipoPredio.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Condición del Predio"
                      selectedKeys={formData.condicion_predio ? [formData.condicion_predio] : []}
                      onChange={(e) => handleInputChange("condicion_predio", e.target.value)}
                    >
                      <SelectItem key="PROPIO" value="PROPIO">PROPIO</SelectItem>
                      <SelectItem key="ALQUILADO" value="ALQUILADO">ALQUILADO</SelectItem>
                      <SelectItem key="PRESTADO" value="PRESTADO">PRESTADO</SelectItem>
                    </Select>
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
                          className="h-4 w-4 rounded border-#6a7282 text-#155dfc focus:ring-#2b7fff"
                        />
                        <span className="text-sm font-medium text-#364153">Agua</span>
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
                         className="h-4 w-4 rounded border-#d1d5dc text-#155dfc focus:ring-#2b7fff"
                        />
                        <span className="text-sm font-medium text-#364153">Luz</span>
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
                         className="h-4 w-4 rounded border-#d1d5dc text-#155dfc focus:ring-#2b7fff"
                        />
                        <span className="text-sm font-medium text-#364153">Desagüe</span>
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
                  <Select
                    label="Departamento"
                    selectedKeys={formData.departamento_rural ? [formData.departamento_rural] : []}
                    onChange={(e) => handleDepartamentoChange(e.target.value)}
                    isLoading={cargandoUbicaciones}
                  >
                    {departamentos.map((departamento) => (
                      <SelectItem key={departamento.id} value={departamento.id}>
                        {departamento.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Provincia"
                    selectedKeys={formData.provincia_rural ? [formData.provincia_rural] : []}
                    onChange={(e) => handleProvinciaChange(e.target.value)}
                    isLoading={cargandoUbicaciones}
                    isDisabled={!formData.departamento_rural}
                  >
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Distrito"
                    selectedKeys={formData.distrito_rural ? [formData.distrito_rural] : []}
                    onChange={(e) => handleInputChange("distrito_rural", e.target.value)}
                    isLoading={cargandoUbicaciones}
                    isDisabled={!formData.provincia_rural}
                  >
                    {distritos.map((distrito) => (
                      <SelectItem key={distrito.id} value={distrito.id}>
                        {distrito.nombre}
                      </SelectItem>
                    ))}
                  </Select>
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
                        <Input
                          label="La deducción sería"
                          value={formData.deduccion}
                          onChange={(e) => handleInputChange("deduccion", e.target.value)}
                        />
                        <Select
                          label="¿Se autoriza?"
                          selectedKeys={formData.autoriza_deduccion ? [formData.autoriza_deduccion] : []}
                          onChange={(e) => handleInputChange("autoriza_deduccion", e.target.value)}
                          isLoading={cargandoOpcionesAutorizacion}
                          isDisabled={!formData.deduccion}
                        >
                          {opcionesAutorizacion.map((opcionesAutorizacion) => (
                            <SelectItem key={opcionesAutorizacion.id} value={opcionesAutorizacion.id}>
                              {opcionesAutorizacion.nombre}
                            </SelectItem>
                          ))}
                        </Select>
                      </label>
                    </div>
                  </div>
                </div>

                <Divider className="my-8"/>
                <div>
                  <h4 className="text-md font-semibold mb-4">Datos del Predio (uso, estado, tipo)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Uso del Predio Rural"
                      value={formData.uso_predio_rural}
                      onChange={(e) => handleInputChange("uso_predio_rural", e.target.value)}
                    />
                    <Select
                      label="Estado del Predio"
                      selectedKeys={formData.estado_predio_rural ? [formData.estado_predio_rural] : []}
                      onChange={(e) => handleInputChange("estado_predio_rural", e.target.value)}
                    >
                      <SelectItem key="BUENO" value="BUENO">BUENO</SelectItem>
                      <SelectItem key="REGULAR" value="REGULAR">REGULAR</SelectItem>
                      <SelectItem key="MALO" value="MALO">MALO</SelectItem>
                    </Select>
                    <Select
                      label="Clasificación del Predio"
                      selectedKeys={formData.clasificacion_predio_rural ? [formData.clasificacion_predio_rural] : []}
                      onChange={(e) => handleInputChange("clasificacion_predio_rural", e.target.value)}
                      isLoading={cargandoTiposPredio}
                    >
                      {tiposPredio.map((tipoPredio) => (
                        <SelectItem key={tipoPredio.id} value={tipoPredio.id}>
                          {tipoPredio.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Condición del Predio"
                      selectedKeys={formData.condicion_predio_rural ? [formData.condicion_predio_rural] : []}
                      onChange={(e) => handleInputChange("condicion_predio_rural", e.target.value)}
                    >
                      <SelectItem key="PROPIO" value="PROPIO">PROPIO</SelectItem>
                      <SelectItem key="ALQUILADO" value="ALQUILADO">ALQUILADO</SelectItem>
                      <SelectItem key="PRESTADO" value="PRESTADO">PRESTADO</SelectItem>
                    </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-#f9fafb rounded-lg">
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
                      <table className="min-w-full border-collapse border border-#d1d5dc">
                        <thead>
                          <tr className="bg-#f3f4f6">
                            <th className="border border-#d1d5dc p-2 text-left">
                              Código
                            </th>
                            <th className="border border-#d1d5dc p-2 text-left">
                              Descripción
                            </th>
                            <th className="border border-#d1d5dc p-2 text-left">
                              Uso
                            </th>
                            <th className="border border-#d1d5dc p-2 text-left">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.otras_instalaciones.map(
                            (instalacion, index) => (
                              <tr key={index}>
                                <td className="border border-#d1d5dc p-2">
                                  {instalacion.codigo}
                                </td>
                                <td className="border border-#d1d5dc p-2">
                                  {instalacion.descripcion}
                                </td>
                                <td className="border border-#d1d5dc p-2">
                                  {instalacion.uso}
                                </td>
                                <td className="border border-#d1d5dc p-2">
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
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="flex justify-between items-center w-full">
            <div>
              <h2 className="text-xl font-bold">Declaración Jurada</h2>
              <p className="text-sm text-#4a5565 mt-1">
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