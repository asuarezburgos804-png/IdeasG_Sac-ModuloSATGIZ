import { 
  makeGetRequest, 
  makePostRequest, 
  makePutRequest, 
  makeDeleteRequest 
} from "@/utils/api/api";

import {
  fetchTipoVias,
  fetchTipoDoc,
  getDepartamentos,
  getProvincias,
  getDistritos,
  fetchMep,
  fetchEcs,
  fetchEcc,
  fetchUca,
  fetchCodUsoPredio,
  fetchClasifUso,
  fetchFormaAdquiPredio,
  fetchConstruccionInst,
  fetchMaterialPredominante,
  fetchEstConservacion,
  fetchEstConstruccion,
  fetchTipoEvalPredio,
  fetchTipoTitular,
  fetchCondTitular,
  fetchCondDeclarante,
  fetchEstCivil,
  fetchTipoPerJuridica,
  fetchCondEspTitular,
  fetchFormaAdqui,
  fetchCondEspPredio,
  fetchClasifPredio,
  fetchPredioCatEn
} from "@/app/services/master/master";

class DeclaracionJuradaService {
  constructor() {
    // ✅ DATOS TEMPORALES PARA CONTRIBUYENTES (mientras desarrollas backend)
    this.contribuyentesTemp = [
      {
        c_codigo: "DJ-001-2024",
        c_tipo_contribuyente: "PERSONA NATURAL",
        c_nombre: "JUAN CARLOS PEREZ GARCIA",
        c_num_documento: "12345678",
        c_estado: "ACTIVO",
        c_direccion: "AV. LOS PROCERES 123",
        c_telefono: "987654321",
        c_email: "juan.perez@email.com"
      },
      {
        c_codigo: "DJ-002-2024", 
        c_tipo_contribuyente: "PERSONA JURIDICA",
        c_nombre: "EMPRESAS CONSTRUCTORAS SAC",
        c_num_documento: "20123456789",
        c_estado: "ACTIVO",
        c_direccion: "CALLE LOS EMPRESARIOS 456",
        c_telefono: "987654322",
        c_email: "contacto@constructoras.com"
      },
      {
        c_codigo: "DJ-003-2024",
        c_tipo_contribuyente: "PERSONA NATURAL", 
        c_nombre: "MARIA ELENA RODRIGUEZ LOPEZ",
        c_num_documento: "87654321",
        c_estado: "ACTIVO",
        c_direccion: "JR. LAS FLORES 789",
        c_telefono: "987654323",
        c_email: "maria.rodriguez@email.com"
      },
      {
        c_codigo: "DJ-004-2024",
        c_tipo_contribuyente: "PERSONA JURIDICA",
        c_nombre: "INVERSIONES INMOBILIARIAS S.A.",
        c_num_documento: "20234567890",
        c_estado: "INACTIVO",
        c_direccion: "AV. COMERCIAL 321",
        c_telefono: "987654324",
        c_email: "info@inversiones.com"
      },
      {
        c_codigo: "DJ-005-2024",
        c_tipo_contribuyente: "PERSONA NATURAL",
        c_nombre: "CARLOS ALBERTO MARTINEZ VARGAS",
        c_num_documento: "11223344",
        c_estado: "ACTIVO",
        c_direccion: "PSJE. LOS PINOS 654",
        c_telefono: "987654325",
        c_email: "carlos.martinez@email.com"
      }
    ];

    // ✅ DATOS TEMPORALES PARA DECLARACIONES
    this.declaracionesTemp = [
      {
        id: 1,
        contribuyente_documento: "12345678",
        periodo: "2024",
        estado: "PENDIENTE",
        fecha_presentacion: "2024-01-15",
        monto_declarado: 15000.00,
        codigo: "DJ-001-2024",
        tipo_predio: "URBANO",
        ubicacion: "AV. LOS PROCERES 123",
        deduccion: "20% Zona de Conservación y Reexención - ASES NO",
        area_terreno: "0.002 ha"
      },
      {
        id: 2,
        contribuyente_documento: "20123456789", 
        periodo: "2024",
        estado: "APROBADO",
        fecha_presentacion: "2024-01-10",
        monto_declarado: 50000.00,
        codigo: "DJ-002-2024",
        tipo_predio: "RURAL",
        ubicacion: "ZONA AGRÍCOLA NORTE",
        deduccion: "NO",
        area_terreno: "1.5 ha"
      },
      {
        id: 3,
        contribuyente_documento: "87654321",
        periodo: "2023",
        estado: "APROBADO",
        fecha_presentacion: "2023-12-20",
        monto_declarado: 12000.00,
        codigo: "DJ-003-2023",
        tipo_predio: "URBANO",
        ubicacion: "JR. LAS FLORES 789",
        deduccion: "10% Zona Histórica",
        area_terreno: "123 m2"
      },
      {
        id: 4,
        contribuyente_documento: "87654321",
        periodo: "2024",
        estado: "PENDIENTE",
        fecha_presentacion: "2024-02-01",
        monto_declarado: 18000.00,
        codigo: "DJ-004-2024",
        tipo_predio: "URBANO",
        ubicacion: "JR. LAS FLORES 789",
        deduccion: "NO",
        area_terreno: "150 m2"
      },
      {
        id: 5,
        contribuyente_documento: "11223344",
        periodo: "2024",
        estado: "APROBADO",
        fecha_presentacion: "2024-01-25",
        monto_declarado: 25000.00,
        codigo: "DJ-005-2024",
        tipo_predio: "URBANO",
        ubicacion: "PSJE. LOS PINOS 654",
        deduccion: "15% Zona Residencial Especial",
        area_terreno: "100 m2"
      }
    ];
  }

  // ========== MÉTODOS PARA CONTRIBUYENTES (HÍBRIDOS) ==========

  async obtenerTodosContribuyentes() {
    try {
      // 🎯 INTENTAR API PRIMERO
      const data = await makeGetRequest("/contribuyentes");
      const contribuyentes = data.data || [];
      
      if (contribuyentes.length > 0) {
        return contribuyentes.map(contribuyente => ({
          c_codigo: contribuyente.codigo || `DJ-${contribuyente.num_documento}-${new Date().getFullYear()}`,
          c_tipo_contribuyente: contribuyente.tipo_contribuyente || "PERSONA NATURAL",
          c_nombre: contribuyente.nombre || contribuyente.razon_social || "N/A",
          c_num_documento: contribuyente.num_documento || "N/A",
          c_estado: contribuyente.estado || "ACTIVO",
          c_direccion: contribuyente.direccion || "",
          c_telefono: contribuyente.telefono || "",
          c_email: contribuyente.email || ""
        }));
      } else {
        // 🔄 FALLBACK A DATOS TEMPORALES
        console.warn("Usando datos temporales de contribuyentes - Backend no disponible");
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.contribuyentesTemp;
      }
    } catch (error) {
      // 🔄 FALLBACK A DATOS TEMPORALES EN ERROR
      console.warn("Error al obtener contribuyentes, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.contribuyentesTemp;
    }
  }

  async buscarContribuyentes(termino) {
    try {
      if (!termino) {
        return this.obtenerTodosContribuyentes();
      }

      // 🎯 INTENTAR API PRIMERO
      const data = await makeGetRequest(`/contribuyentes/buscar?q=${encodeURIComponent(termino)}`);
      const contribuyentes = data.data || [];
      
      if (contribuyentes.length > 0) {
        return contribuyentes.map(contribuyente => ({
          c_codigo: contribuyente.codigo || `DJ-${contribuyente.num_documento}-${new Date().getFullYear()}`,
          c_tipo_contribuyente: contribuyente.tipo_contribuyente || "PERSONA NATURAL",
          c_nombre: contribuyente.nombre || contribuyente.razon_social || "N/A",
          c_num_documento: contribuyente.num_documento || "N/A",
          c_estado: contribuyente.estado || "ACTIVO",
          c_direccion: contribuyente.direccion || "",
          c_telefono: contribuyente.telefono || "",
          c_email: contribuyente.email || ""
        }));
      } else {
        // 🔄 FALLBACK A BÚSQUEDA EN DATOS TEMPORALES
        console.warn("Buscando en datos temporales - Backend no disponible");
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const terminoLower = termino.toLowerCase();
        return this.contribuyentesTemp.filter(contribuyente =>
          contribuyente.c_codigo?.toLowerCase().includes(terminoLower) ||
          contribuyente.c_tipo_contribuyente?.toLowerCase().includes(terminoLower) ||
          contribuyente.c_nombre?.toLowerCase().includes(terminoLower) ||
          contribuyente.c_num_documento?.includes(termino)
        );
      }
    } catch (error) {
      // 🔄 FALLBACK A BÚSQUEDA EN DATOS TEMPORALES
      console.warn("Error en búsqueda, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const terminoLower = termino.toLowerCase();
      return this.contribuyentesTemp.filter(contribuyente =>
        contribuyente.c_codigo?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_tipo_contribuyente?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_nombre?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_num_documento?.includes(termino)
      );
    }
  }

  async obtenerContribuyentePorDocumento(documento) {
    try {
      // 🎯 INTENTAR API PRIMERO
      const data = await makeGetRequest(`/contribuyentes/documento/${documento}`);
      const contribuyente = data.data || null;
      
      if (contribuyente) {
        return {
          c_codigo: contribuyente.codigo || `DJ-${contribuyente.num_documento}-${new Date().getFullYear()}`,
          c_tipo_contribuyente: contribuyente.tipo_contribuyente || "PERSONA NATURAL",
          c_nombre: contribuyente.nombre || contribuyente.razon_social || "N/A",
          c_num_documento: contribuyente.num_documento || "N/A",
          c_estado: contribuyente.estado || "ACTIVO",
          c_direccion: contribuyente.direccion || "",
          c_telefono: contribuyente.telefono || "",
          c_email: contribuyente.email || ""
        };
      } else {
        // 🔄 FALLBACK A DATOS TEMPORALES
        console.warn("Usando datos temporales - Contribuyente no encontrado en backend");
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.contribuyentesTemp.find(c => c.c_num_documento === documento) || null;
      }
    } catch (error) {
      // 🔄 FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener contribuyente, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.contribuyentesTemp.find(c => c.c_num_documento === documento) || null;
    }
  }

  // ========== MÉTODOS PARA DECLARACIONES (HÍBRIDOS) ==========

  async obtenerDeclaracionesPorContribuyente(documento) {
    try {
      // 🎯 INTENTAR API PRIMERO
      const data = await makeGetRequest(`/declaraciones-juradas/contribuyente/${documento}`);
      const declaraciones = data.data || [];
      
      if (declaraciones.length > 0) {
        return declaraciones.map(declaracion => ({
          id: declaracion.id || declaracion.codigo,
          contribuyente_documento: declaracion.contribuyente_documento || documento,
          periodo: declaracion.periodo || new Date().getFullYear().toString(),
          estado: declaracion.estado || "PENDIENTE",
          fecha_presentacion: declaracion.fecha_presentacion || new Date().toISOString().split('T')[0],
          monto_declarado: declaracion.monto_declarado || 0,
          codigo: declaracion.codigo || `DJ-${documento}-${declaracion.periodo || new Date().getFullYear()}`,
          tipo_predio: declaracion.tipo_predio || "URBANO",
          ubicacion: declaracion.ubicacion || "Sin ubicación",
          deduccion: declaracion.deduccion || "NO",
          area_terreno: declaracion.area_terreno || "0 m²"
        }));
      } else {
        // 🔄 FALLBACK A DATOS TEMPORALES
        console.warn("Usando declaraciones temporales - Backend no disponible");
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.declaracionesTemp.filter(dj => dj.contribuyente_documento === documento);
      }
    } catch (error) {
      // 🔄 FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener declaraciones, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.declaracionesTemp.filter(dj => dj.contribuyente_documento === documento);
    }
  }

  async obtenerDeclaracionPorId(id) {
    try {
      // 🎯 INTENTAR API PRIMERO
      const data = await makeGetRequest(`/declaraciones-juradas/${id}`);
      const declaracion = data.data || null;
      
      if (declaracion) {
        return {
          id: declaracion.id || declaracion.codigo,
          contribuyente_documento: declaracion.contribuyente_documento || "",
          periodo: declaracion.periodo || new Date().getFullYear().toString(),
          estado: declaracion.estado || "PENDIENTE",
          fecha_presentacion: declaracion.fecha_presentacion || new Date().toISOString().split('T')[0],
          monto_declarado: declaracion.monto_declarado || 0,
          codigo: declaracion.codigo || `DJ-${declaracion.contribuyente_documento || ""}-${declaracion.periodo || new Date().getFullYear()}`,
          tipo_predio: declaracion.tipo_predio || "URBANO",
          ubicacion: declaracion.ubicacion || "Sin ubicación",
          deduccion: declaracion.deduccion || "NO",
          area_terreno: declaracion.area_terreno || "0 m²"
        };
      } else {
        // 🔄 FALLBACK A DATOS TEMPORALES
        console.warn("Usando declaración temporal - Backend no disponible");
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.declaracionesTemp.find(dj => dj.id === id) || null;
      }
    } catch (error) {
      // 🔄 FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener declaración, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.declaracionesTemp.find(dj => dj.id === id) || null;
    }
  }

  async crearDeclaracionJurada(datosDeclaracion) {
    try {
      // 🎯 INTENTAR GUARDAR EN API
      const datosParaAPI = {
        ...datosDeclaracion,
        fecha_creacion: new Date().toISOString(),
        estado: "PENDIENTE"
      };
      
      const response = await makePostRequest("/declaraciones-juradas", datosParaAPI);
      
      return {
        success: true,
        message: "Declaración Jurada creada correctamente",
        data: response.data
      };
    } catch (error) {
      // 🔄 FALLBACK: GUARDAR EN MEMORIA TEMPORAL
      console.warn("Error al crear en backend, guardando temporalmente:", error);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nuevaId = Math.max(0, ...this.declaracionesTemp.map(d => d.id)) + 1;
      const nuevaDeclaracion = {
        id: nuevaId,
        ...datosDeclaracion,
        fecha_creacion: new Date().toISOString(),
        estado: "PENDIENTE"
      };

      this.declaracionesTemp.push(nuevaDeclaracion);
      
      return {
        success: true,
        message: "Declaración Jurada creada temporalmente (Backend no disponible)",
        data: nuevaDeclaracion,
        temporal: true
      };
    }
  }

  async actualizarDeclaracionJurada(id, datosActualizados) {
    try {
      // 🎯 INTENTAR ACTUALIZAR EN API
      const response = await makePutRequest(`/declaraciones-juradas/${id}`, {
        ...datosActualizados,
        fecha_actualizacion: new Date().toISOString()
      });
      
      return {
        success: true,
        message: "Declaración Jurada actualizada correctamente",
        data: response.data
      };
    } catch (error) {
      // 🔄 FALLBACK: ACTUALIZAR EN MEMORIA TEMPORAL
      console.warn("Error al actualizar en backend, actualizando temporalmente:", error);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = this.declaracionesTemp.findIndex(dj => dj.id === id);
      if (index === -1) {
        throw new Error("Declaración Jurada no encontrada");
      }

      this.declaracionesTemp[index] = {
        ...this.declaracionesTemp[index],
        ...datosActualizados,
        fecha_actualizacion: new Date().toISOString()
      };

      return {
        success: true,
        message: "Declaración Jurada actualizada temporalmente (Backend no disponible)",
        data: this.declaracionesTemp[index],
        temporal: true
      };
    }
  }

  async eliminarDeclaracionJurada(id) {
    try {
      // 🎯 INTENTAR ELIMINAR EN API
      await makeDeleteRequest(`/declaraciones-juradas/${id}`);
      return {
        success: true,
        message: "Declaración Jurada eliminada correctamente"
      };
    } catch (error) {
      // 🔄 FALLBACK: ELIMINAR DE MEMORIA TEMPORAL
      console.warn("Error al eliminar en backend, eliminando temporalmente:", error);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = this.declaracionesTemp.findIndex(dj => dj.id === id);
      if (index === -1) {
        throw new Error("Declaración Jurada no encontrada");
      }

      this.declaracionesTemp.splice(index, 1);

      return {
        success: true,
        message: "Declaración Jurada eliminada temporalmente (Backend no disponible)",
        temporal: true
      };
    }
  }

  // ========== MÉTODOS PARA MAESTROS (SIEMPRE APIs REALES) ==========

  async obtenerTiposVia() {
    try {
      return await fetchTipoVias();
    } catch (error) {
      console.error("Error al obtener tipos de vía:", error);
      return [];
    }
  }

  async obtenerTiposDocumento() {
    try {
      return await fetchTipoDoc();
    } catch (error) {
      console.error("Error al obtener tipos de documento:", error);
      return [];
    }
  }

  async obtenerDepartamentos() {
    try {
      return await getDepartamentos();
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      return [];
    }
  }

  async obtenerProvincias(idDepartamento) {
    try {
      return await getProvincias(idDepartamento);
    } catch (error) {
      console.error("Error al obtener provincias:", error);
      return [];
    }
  }

  async obtenerDistritos(idProvincia) {
    try {
      return await getDistritos(idProvincia);
    } catch (error) {
      console.error("Error al obtener distritos:", error);
      return [];
    }
  }

  async obtenerMaterialesEstructurales() {
    try {
      return await fetchMep();
    } catch (error) {
      console.error("Error al obtener materiales estructurales:", error);
      return [];
    }
  }

  async obtenerEstadosConservacionEstructura() {
    try {
      return await fetchEcs();
    } catch (error) {
      console.error("Error al obtener estados de conservación de estructura:", error);
      return [];
    }
  }

  async obtenerEstadosConservacionAcabados() {
    try {
      return await fetchEcc();
    } catch (error) {
      console.error("Error al obtener estados de conservación de acabados:", error);
      return [];
    }
  }

  async obtenerUnidadesMedidaConstruccion() {
    try {
      return await fetchUca();
    } catch (error) {
      console.error("Error al obtener unidades de medida de construcción:", error);
      return [];
    }
  }

  async obtenerUsosPredio() {
    try {
      return await fetchCodUsoPredio();
    } catch (error) {
      console.error("Error al obtener usos de predio:", error);
      return [];
    }
  }

  async obtenerClasificacionesUso() {
    try {
      return await fetchClasifUso();
    } catch (error) {
      console.error("Error al obtener clasificaciones de uso:", error);
      return [];
    }
  }

  async obtenerFormasAdquisicion() {
    try {
      return await fetchFormaAdquiPredio();
    } catch (error) {
      console.error("Error al obtener formas de adquisición:", error);
      return [];
    }
  }

  async obtenerTiposConstruccionInstalacion() {
    try {
      return await fetchConstruccionInst();
    } catch (error) {
      console.error("Error al obtener tipos de construcción e instalación:", error);
      return [];
    }
  }

  async obtenerMaterialesPredominantesRural() {
    try {
      return await fetchMaterialPredominante();
    } catch (error) {
      console.error("Error al obtener materiales predominantes rural:", error);
      return [];
    }
  }

  async obtenerEstadosConservacionRural() {
    try {
      return await fetchEstConservacion();
    } catch (error) {
      console.error("Error al obtener estados de conservación rural:", error);
      return [];
    }
  }

  async obtenerEstadosConstruccionRural() {
    try {
      return await fetchEstConstruccion();
    } catch (error) {
      console.error("Error al obtener estados de construcción rural:", error);
      return [];
    }
  }

  // ========== MÉTODOS PARA PERIODOS ==========

  async obtenerPeriodosDisponibles() {
    try {
      const data = await makeGetRequest("/declaraciones-juradas/periodos");
      return data.data || [
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
        { value: "2020", label: "2020" }
      ];
    } catch (error) {
      console.error("Error al obtener periodos:", error);
      return [
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
        { value: "2020", label: "2020" }
      ];
    }
  }

  // ========== MÉTODOS PARA TIPOS DE PREDIO ==========

  async obtenerTiposPredio() {
    try {
      const data = await makeGetRequest("/maestros/tipos-predio");
      return data.data || [
        { value: "URBANO", label: "PREDIO URBANO" },
        { value: "RURAL", label: "PREDIO RURAL" }
      ];
    } catch (error) {
      console.error("Error al obtener tipos de predio:", error);
      return [
        { value: "URBANO", label: "PREDIO URBANO" },
        { value: "RURAL", label: "PREDIO RURAL" }
      ];
    }
  }

  // ========== MÉTODOS PARA DEDUCCIONES ==========

  async obtenerTiposDeduccion() {
    try {
      const data = await makeGetRequest("/maestros/tipos-deduccion");
      return data.data || [
        { value: "NO", label: "NO" },
        { value: "20% Zona de Conservación", label: "20% Zona de Conservación y Reexención - ASES NO" },
        { value: "10% Zona Histórica", label: "10% Zona Histórica" },
        { value: "15% Zona Residencial", label: "15% Zona Residencial Especial" },
        { value: "25% Zona Rural", label: "25% Zona Rural Protegida" }
      ];
    } catch (error) {
      console.error("Error al obtener tipos de deducción:", error);
      return [
        { value: "NO", label: "NO" },
        { value: "20% Zona de Conservación", label: "20% Zona de Conservación y Reexención - ASES NO" },
        { value: "10% Zona Histórica", label: "10% Zona Histórica" },
        { value: "15% Zona Residencial", label: "15% Zona Residencial Especial" },
        { value: "25% Zona Rural", label: "25% Zona Rural Protegida" }
      ];
    }
  }

  // ========== MÉTODOS PARA ESTADÍSTICAS ==========

  async obtenerEstadisticasDeclaraciones() {
    try {
      const data = await makeGetRequest("/declaraciones-juradas/estadisticas");
      return data.data || { 
        total: this.declaracionesTemp.length, 
        aprobadas: this.declaracionesTemp.filter(d => d.estado === "APROBADO").length, 
        pendientes: this.declaracionesTemp.filter(d => d.estado === "PENDIENTE").length, 
        rechazadas: this.declaracionesTemp.filter(d => d.estado === "RECHAZADO").length, 
        montoTotal: this.declaracionesTemp.reduce((sum, dj) => sum + (dj.monto_declarado || 0), 0) 
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return { 
        total: this.declaracionesTemp.length, 
        aprobadas: this.declaracionesTemp.filter(d => d.estado === "APROBADO").length, 
        pendientes: this.declaracionesTemp.filter(d => d.estado === "PENDIENTE").length, 
        rechazadas: this.declaracionesTemp.filter(d => d.estado === "RECHAZADO").length, 
        montoTotal: this.declaracionesTemp.reduce((sum, dj) => sum + (dj.monto_declarado || 0), 0) 
      };
    }
  }

  // ========== MÉTODOS PARA GENERAR PDF ==========

  async generarPDFDeclaracion(idDeclaracion) {
    try {
      const response = await makeGetRequest(`/declaraciones-juradas/${idDeclaracion}/pdf`);
      return {
        success: true,
        message: "PDF generado correctamente",
        url: response.data.url,
        data: response.data
      };
    } catch (error) {
      console.error("Error al generar PDF:", error);
      
      // 🔄 FALLBACK: SIMULAR GENERACIÓN DE PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const declaracion = this.declaracionesTemp.find(dj => dj.id === idDeclaracion);
      if (!declaracion) {
        throw new Error("Declaración no encontrada");
      }

      return {
        success: true,
        message: "PDF generado temporalmente (Backend no disponible)",
        url: `/pdf/declaracion-${idDeclaracion}.pdf`,
        data: declaracion,
        temporal: true
      };
    }
  }

  // ========== MÉTODOS PARA VALIDACIONES ==========

  async validarDeclaracionJurada(datosDeclaracion) {
    try {
      const response = await makePostRequest("/declaraciones-juradas/validar", datosDeclaracion);
      return response.data;
    } catch (error) {
      console.error("Error al validar declaración:", error);
      
      // 🔄 FALLBACK: VALIDACIÓN BÁSICA LOCAL
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const errores = [];
      
      if (!datosDeclaracion.tipo_predio) {
        errores.push("El tipo de predio es obligatorio");
      }
      
      if (!datosDeclaracion.area_terreno || datosDeclaracion.area_terreno <= 0) {
        errores.push("El área del terreno es obligatoria y debe ser mayor a 0");
      }
      
      if (!datosDeclaracion.contribuyente_documento) {
        errores.push("El documento del contribuyente es obligatorio");
      }

      return {
        valido: errores.length === 0,
        errores: errores
      };
    }
  }

  // ========== MÉTODOS ADICIONALES PARA MAESTROS ESPECIALIZADOS ==========

  async obtenerTiposEvaluacionPredio() {
    try {
      return await fetchTipoEvalPredio();
    } catch (error) {
      console.error("Error al obtener tipos de evaluación de predio:", error);
      return [];
    }
  }

  async obtenerTiposTitular() {
    try {
      return await fetchTipoTitular();
    } catch (error) {
      console.error("Error al obtener tipos de titular:", error);
      return [];
    }
  }

  async obtenerCondicionesTitular() {
    try {
      return await fetchCondTitular();
    } catch (error) {
      console.error("Error al obtener condiciones de titular:", error);
      return [];
    }
  }

  async obtenerCondicionesDeclarante() {
    try {
      return await fetchCondDeclarante();
    } catch (error) {
      console.error("Error al obtener condiciones de declarante:", error);
      return [];
    }
  }

  async obtenerEstadosCivil() {
    try {
      return await fetchEstCivil();
    } catch (error) {
      console.error("Error al obtener estados civil:", error);
      return [];
    }
  }

  async obtenerTiposPersonaJuridica() {
    try {
      return await fetchTipoPerJuridica();
    } catch (error) {
      console.error("Error al obtener tipos de persona jurídica:", error);
      return [];
    }
  }

  async obtenerCondicionesEspecialesTitular() {
    try {
      return await fetchCondEspTitular();
    } catch (error) {
      console.error("Error al obtener condiciones especiales de titular:", error);
      return [];
    }
  }

  async obtenerFormasAdquisicionCompletas() {
    try {
      return await fetchFormaAdqui();
    } catch (error) {
      console.error("Error al obtener formas de adquisición completas:", error);
      return [];
    }
  }

  async obtenerCondicionesEspecialesPredio() {
    try {
      return await fetchCondEspPredio();
    } catch (error) {
      console.error("Error al obtener condiciones especiales de predio:", error);
      return [];
    }
  }

  async obtenerClasificacionesPredio() {
    try {
      return await fetchClasifPredio();
    } catch (error) {
      console.error("Error al obtener clasificaciones de predio:", error);
      return [];
    }
  }

  async obtenerPrediosCatastralesEn() {
    try {
      return await fetchPredioCatEn();
    } catch (error) {
      console.error("Error al obtener predios catastrales en:", error);
      return [];
    }
  }

  // ========== MÉTODOS ADICIONALES ÚTILES ==========

  async verificarBackendDisponible() {
    try {
      await makeGetRequest("/health");
      return true;
    } catch (error) {
      return false;
    }
  }

  async migrarDatosTemporales() {
    try {
      console.log("Migrando datos temporales al backend...");
      
      // Migrar contribuyentes temporales
      for (const contribuyente of this.contribuyentesTemp) {
        await makePostRequest("/contribuyentes", {
          codigo: contribuyente.c_codigo,
          tipo_contribuyente: contribuyente.c_tipo_contribuyente,
          nombre: contribuyente.c_nombre,
          num_documento: contribuyente.c_num_documento,
          estado: contribuyente.c_estado,
          direccion: contribuyente.c_direccion,
          telefono: contribuyente.c_telefono,
          email: contribuyente.c_email
        });
      }
      
      // Migrar declaraciones temporales
      for (const declaracion of this.declaracionesTemp) {
        await makePostRequest("/declaraciones-juradas", declaracion);
      }
      
      // Limpiar datos temporales después de migración exitosa
      this.contribuyentesTemp = [];
      this.declaracionesTemp = [];
      
      return { success: true, message: "Migración completada exitosamente" };
    } catch (error) {
      console.error("Error en migración:", error);
      return { success: false, message: "Error en migración: " + error.message };
    }
  }

  // ========== MÉTODOS PARA LIMPIAR DATOS TEMPORALES ==========

  limpiarDatosTemporales() {
    this.contribuyentesTemp = [];
    this.declaracionesTemp = [];
    console.log("Datos temporales limpiados");
  }
}

export default new DeclaracionJuradaService();