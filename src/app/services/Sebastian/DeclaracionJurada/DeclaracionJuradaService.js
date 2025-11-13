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

// Importar servicios de contribuyente de SATGIZ
import { ContribuyenteService } from "@/app/services/SATGIZ/contribuyenteService";
import { UbicacionContribuyenteService } from "@/app/services/SATGIZ/ubicacionContribuyenteService";

// Importar servicios de declaración jurada de SATGIZ
import { DeclaracionJuradaService as SATGIZDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Declaracion_Jurada_Services";
import { DatosUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Datos_Urbano_Declaracion_Jurada_Services";
import { DatosComplementariosUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Datos_Complementarios_Urbano_Declaracion_Jurada_Services";
import { DeduccionUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Deduccion_Urbano_Declaracion_Jurada_Services";
import { UbicacionUrbanoDeclaracionJuradaService } from "@/app/services/SATGIZ/DeclaracionJurada/Ubicacion_Urbano_Declaracion_Jurada_Services";

class DeclaracionJuradaService {
  constructor() {
    //  DATOS TEMPORALES PARA CONTRIBUYENTES (mientras desarrollas backend)
    this.contribuyentesTemp = [
      {
        id: "1",
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

    //  DATOS TEMPORALES PARA DECLARACIONES
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

  // ========== MÉTODOS PARA CONTRIBUYENTES (USANDO SERVICIOS SATGIZ) ==========

  async obtenerTodosContribuyentes() {
    try {
      //  USAR SERVICIO SATGIZ
      const contribuyentes = await ContribuyenteService.obtenerTodos();
      
      // Transformar datos al formato esperado por Declaración Jurada
      const contribuyentesTransformados = [];
      
      for (const contribuyente of contribuyentes) {
        const direccion = await this.obtenerDireccionContribuyente(contribuyente.id);
        contribuyentesTransformados.push({
          c_codigo: `DJ-${contribuyente.id}-${new Date().getFullYear()}`,
          c_tipo_contribuyente: contribuyente.c_tipo_contribuyente || "PERSONA NATURAL",
          c_nombre: contribuyente.c_nombre || "N/A",
          c_num_documento: contribuyente.c_num_documento || "N/A",
          c_estado: "ACTIVO",
          c_direccion: direccion,
          c_telefono: contribuyente.c_telefono || "",
          c_email: contribuyente.c_correo_electronico || ""
        });
      }
      
      return contribuyentesTransformados;
    } catch (error) {
      // FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener contribuyentes de SATGIZ, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.contribuyentesTemp;
    }
  }

  async buscarContribuyentes(termino) {
    try {
      if (!termino) {
        return this.obtenerTodosContribuyentes();
      }

      // OBTENER TODOS LOS CONTRIBUYENTES Y FILTRAR LOCALMENTE
      const todosContribuyentes = await this.obtenerTodosContribuyentes();
      const terminoLower = termino.toLowerCase();
      
      return todosContribuyentes.filter(contribuyente =>
        contribuyente.c_codigo?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_tipo_contribuyente?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_nombre?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_num_documento?.includes(termino)
      );
    } catch (error) {
      // FALLBACK A BÚSQUEDA EN DATOS TEMPORALES
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

  async obtenerContribuyentePorDocumento(id) {
    try {
      //  USAR SERVICIO SATGIZ
      const contribuyente = await ContribuyenteService.obtenerPorDocumento(id);
      
      if (contribuyente) {
        const direccion = await this.obtenerDireccionContribuyente(contribuyente.id);
        return {
          c_codigo: `DJ-${contribuyente.id}-${new Date().getFullYear()}`,
          c_tipo_contribuyente: contribuyente.c_tipo_contribuyente || "PERSONA NATURAL",
          c_nombre: contribuyente.c_nombre || "N/A",
          c_num_documento: contribuyente.c_num_documento || "N/A",
          c_estado: "ACTIVO",
          c_direccion: direccion,
          c_telefono: contribuyente.c_telefono || "",
          c_email: contribuyente.c_correo_electronico || ""
        };
      } else {
        // FALLBACK A DATOS TEMPORALES
        console.warn("Contribuyente no encontrado en SATGIZ, usando datos temporales");
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.contribuyentesTemp.find(c => c.id === id) || null;
      }
    } catch (error) {
      // FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener contribuyente de SATGIZ, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.contribuyentesTemp.find(c => c.id === id) || null;
    }
  }

  // ========== MÉTODOS AUXILIARES PARA UBICACIONES ==========

  async obtenerDireccionContribuyente(id) {
    try {
      const ubicaciones = await UbicacionContribuyenteService.obtenerPorContribuyente(id);
      if (ubicaciones && ubicaciones.length > 0) {
        // Usar la primera ubicación para obtener la dirección
        return UbicacionContribuyenteService.formatearDireccion(ubicaciones[0]);
      }
      return "";
    } catch (error) {
      console.warn("Error al obtener dirección del contribuyente:", error);
      return "";
    }
  }

  async obtenerUbicacionesContribuyente(id) {
    try {
      return await UbicacionContribuyenteService.obtenerPorContribuyente(id);
    } catch (error) {
      console.warn("Error al obtener ubicaciones del contribuyente:", error);
      return [];
    }
  }

  // ========== MÉTODOS PARA DECLARACIONES (HÍBRIDOS) ==========

//-----------------------------------------------------------------------------------------------------------
  // Buscar declaraciones por nombre del contribuyente (usando servicios SATGIZ)
  async buscarDeclaracionesPorContribuyente(nombre) {
    try {
      // INTENTAR USAR SERVICIO SATGIZ
      const declaracionesSATGIZ = await SATGIZDeclaracionJuradaService.obtenerDeclaracionesPorContribuyente(nombre);
      
      // Mapear datos SATGIZ al formato esperado
      return declaracionesSATGIZ.map(declaracion => ({
        id: declaracion.id || declaracion.codigo,
        contribuyente_documento: declaracion.c_num_documento || "",
        periodo: declaracion.c_anio_liquidacion || new Date().getFullYear().toString(),
        estado: declaracion.estado || "PENDIENTE",
        fecha_presentacion: declaracion.fecha_presentacion || new Date().toISOString().split('T')[0],
        monto_declarado: declaracion.monto_declarado || 0,
        codigo: declaracion.codigo || `DJ-${declaracion.c_num_documento || ""}-${declaracion.c_anio_liquidacion || new Date().getFullYear()}`,
        tipo_predio: declaracion.c_tipo_predio || "URBANO",
        ubicacion: declaracion.ubicacion || "Sin ubicación",
        deduccion: declaracion.deduccion || "NO",
        area_terreno: declaracion.area_terreno || "0 m²"
      }));
    } catch (error) {
      // FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener declaraciones de SATGIZ, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.declaracionesTemp.filter(dj =>
        dj.contribuyente_documento?.toLowerCase().includes(nombre?.toLowerCase()) ||
        dj.codigo?.toLowerCase().includes(nombre?.toLowerCase())
      );
    }
  }
//-----------------------------------------------------------------------------------------------------------
//------------------------------REVISAR----------------------------------------------------------------------
  async obtenerDeclaracionPorId(id) {
    try {
      // INTENTAR API PRIMERO
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
          codigo: declaracion.codigo || `DJ-${declaracion.contribuyente_id || ""}-${declaracion.periodo || new Date().getFullYear()}`,
          tipo_predio: declaracion.tipo_predio || "URBANO",
          ubicacion: declaracion.ubicacion || "Sin ubicación",
          deduccion: declaracion.deduccion || "NO",
          area_terreno: declaracion.area_terreno || "0 m²"
        };
      } else {
        // FALLBACK A DATOS TEMPORALES
        console.warn("Usando declaración temporal - Backend no disponible");
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.declaracionesTemp.find(dj => dj.id === id) || null;
      }
    } catch (error) {
      //  FALLBACK A DATOS TEMPORALES
      console.warn("Error al obtener declaración, usando datos temporales:", error);
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.declaracionesTemp.find(dj => dj.id === id) || null;
    }
  }
//-----------------------------------------------------------------------------------------------------------

  async crearDeclaracionJurada(datosDeclaracion) {
    try {
      //  INTENTAR GUARDAR EN API
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
      //  FALLBACK: GUARDAR EN MEMORIA TEMPORAL
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
      //  INTENTAR ACTUALIZAR EN API
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
      //  FALLBACK: ACTUALIZAR EN MEMORIA TEMPORAL
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
      //  INTENTAR ELIMINAR EN API
      await makeDeleteRequest(`/declaraciones-juradas/${id}`);
      return {
        success: true,
        message: "Declaración Jurada eliminada correctamente"
      };
    } catch (error) {
      // FALLBACK: ELIMINAR DE MEMORIA TEMPORAL
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
      // Datos estáticos permanentes de departamentos
      const departamentosEstaticos = [
        { id: "01", nombre: "LIMA" },
        { id: "02", nombre: "AREQUIPA" },
        { id: "03", nombre: "CUSCO" },
        { id: "04", nombre: "LA LIBERTAD" },
        { id: "05", nombre: "PIURA" },
        { id: "06", nombre: "LAMBAYEQUE" },
        { id: "07", nombre: "ANCASH" },
        { id: "08", nombre: "JUNIN" },
        { id: "09", nombre: "PUNO" },
        { id: "10", nombre: "ICA" }
      ];
      return departamentosEstaticos;
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      return [];
    }
  }

  async obtenerProvincias(idDepartamento) {
    try {
      // Datos estáticos permanentes de provincias
      const provinciasEstaticas = [
        { id: "0101", nombre: "LIMA", departamento_id: "01" },
        { id: "0102", nombre: "CAÑETE", departamento_id: "01" },
        { id: "0103", nombre: "HUARAL", departamento_id: "01" },
        { id: "0104", nombre: "HUAURA", departamento_id: "01" },
        { id: "0201", nombre: "AREQUIPA", departamento_id: "02" },
        { id: "0202", nombre: "CAYLLOMA", departamento_id: "02" },
        { id: "0203", nombre: "CAMANA", departamento_id: "02" },
        { id: "0301", nombre: "CUSCO", departamento_id: "03" },
        { id: "0302", nombre: "QUISPICANCHI", departamento_id: "03" },
        { id: "0303", nombre: "CALCA", departamento_id: "03" }
      ];
      
      return provinciasEstaticas.filter(provincia => provincia.departamento_id === idDepartamento);
    } catch (error) {
      console.error("Error al obtener provincias:", error);
      return [];
    }
  }

  async obtenerDistritos(idProvincia) {
    try {
      // Datos estáticos permanentes de distritos
      const distritosEstaticos = [
        { id: "010101", nombre: "LIMA", provincia_id: "0101" },
        { id: "010102", nombre: "MIRAFLORES", provincia_id: "0101" },
        { id: "010103", nombre: "SAN ISIDRO", provincia_id: "0101" },
        { id: "010104", nombre: "BARRANCO", provincia_id: "0101" },
        { id: "010105", nombre: "SURQUILLO", provincia_id: "0101" },
        { id: "010201", nombre: "SAN VICENTE DE CAÑETE", provincia_id: "0102" },
        { id: "010202", nombre: "IMPERIAL", provincia_id: "0102" },
        { id: "010203", nombre: "LUNAHUANA", provincia_id: "0102" },
        { id: "010301", nombre: "HUARAL", provincia_id: "0103" },
        { id: "010302", nombre: "CHANCAY", provincia_id: "0103" },
        { id: "010401", nombre: "HUACHO", provincia_id: "0104" },
        { id: "010402", nombre: "SANTA MARÍA", provincia_id: "0104" },
        { id: "020101", nombre: "AREQUIPA", provincia_id: "0201" },
        { id: "020102", nombre: "CAYMA", provincia_id: "0201" },
        { id: "020103", nombre: "CERRO COLORADO", provincia_id: "0201" },
        { id: "020201", nombre: "CHIVAY", provincia_id: "0202" },
        { id: "020202", nombre: "CAYLLOMA", provincia_id: "0202" },
        { id: "020301", nombre: "CAMANÁ", provincia_id: "0203" },
        { id: "030101", nombre: "CUSCO", provincia_id: "0301" },
        { id: "030102", nombre: "SAN JERÓNIMO", provincia_id: "0301" },
        { id: "030103", nombre: "SAN SEBASTIÁN", provincia_id: "0301" },
        { id: "030201", nombre: "URCOS", provincia_id: "0302" },
        { id: "030202", nombre: "ANDAHUAYLILLAS", provincia_id: "0302" },
        { id: "030301", nombre: "CALCA", provincia_id: "0303" },
        { id: "030302", nombre: "URUBAMBA", provincia_id: "0303" }
      ];
      
      return distritosEstaticos.filter(distrito => distrito.provincia_id === idProvincia);
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
    console.log("🔄 Obteniendo clasificaciones de USO...");
    
    // Agregar timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout después de 3 segundos')), 3000)
    );
    
    const clasificacionesUsoPromise = fetchClasifUso();
    const data = await Promise.race([clasificacionesUsoPromise, timeoutPromise]);
    
    console.log("✅ Clasificaciones de USO obtenidas:", data);
    
    // Asegurar formato correcto
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id || item.value || item.codigo || "0",
        nombre: item.nombre || item.label || item.descripcion || "Sin nombre"
      }));
    }
    
    return data;
    
  } catch (error) {
    console.warn("❌ Error al obtener clasificaciones de USO, usando datos temporales:", error);
    
    // ✅ DATOS TEMPORALES PARA CLASIFICACIÓN DE USO
    return [
      { id: "01", nombre: "VIVIENDA UNIFAMILIAR" },
      { id: "02", nombre: "VIVIENDA MULTIFAMILIAR" },
      { id: "03", nombre: "COMERCIO" },
      { id: "04", nombre: "OFICINAS" },
      { id: "05", nombre: "INDUSTRIA" },
      { id: "06", nombre: "ALMACÉN" },
      { id: "07", nombre: "EDUCACIÓN" },
      { id: "08", nombre: "SALUD" },
      { id: "09", nombre: "CULTURAL" },
      { id: "10", nombre: "DEPORTIVO" },
      { id: "11", nombre: "AGRÍCOLA" },
      { id: "12", nombre: "GANADERO" }
    ];
  }
}

  async obtenerCodigosUsoPredio() {
  try {
    console.log("🔄 Obteniendo códigos de uso de predio...");
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout después de 3 segundos')), 3000)
    );
    
    const codigosUsoPromise = fetchCodUsoPredio();
    const data = await Promise.race([codigosUsoPromise, timeoutPromise]);
    
    console.log("✅ Códigos de uso de predio obtenidos:", data);
    
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id || item.value || item.codigo || "0",
        nombre: item.nombre || item.label || item.descripcion || "Sin nombre"
      }));
    }
    
    return data;
    
  } catch (error) {
    console.warn("❌ Error al obtener códigos de uso de predio, usando datos temporales:", error);
    
    return [
      { id: "01", nombre: "RESIDENCIAL" },
      { id: "02", nombre: "COMERCIAL" },
      { id: "03", nombre: "INDUSTRIAL" },
      { id: "04", nombre: "AGRÍCOLA" },
      { id: "05", nombre: "ESPECIAL" }
    ];
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

  async DeduccionPorId(id) {
    try {
      // Llamada al servicio que obtiene la deducción
      const response = await DeduccionUrbanoDeclaracionJuradaService.obtenerPorId(id);

      // Definimos las opciones para el select "¿Se autoriza?"
      const opcionesAutorizacion = [
        { id: "SI", nombre: "SI" },
        { id: "NO", nombre: "NO" }
      ];

      if (response && response.data) {
        const deduccion = response.data;

        return {
          ...deduccion,
          opcionesAutorizacion, // ← esto lo usas en tu Select del front
        };
      } else {
        console.warn("No se encontró información de deducción para el ID:", id);
        return {
          opcionesAutorizacion, // devuelve igual las opciones
        };
      }
    } catch (error) {
      console.error("Error al obtener deducción por ID:", error);
      throw error;
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
      
      //  FALLBACK: SIMULAR GENERACIÓN DE PDF
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
      
      //  FALLBACK: VALIDACIÓN BÁSICA LOCAL
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

  async obtenerPrediosCatastralesEn() {
    try {
      return await fetchPredioCatEn();
    } catch (error) {
      console.error("Error al obtener predios catastrales en:", error);
      return [];
    }
  }

  // ========== MÉTODOS ESPECÍFICOS PARA TIPOS DE PREDIO Y DENOMINACIÓN ==========

  async obtenerClasificacionesPredio() {
  try {
    console.log("🔄 Obteniendo clasificaciones de predio...");
    
    // Agregar timeout para evitar que se quede cargando indefinidamente
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout después de 3 segundos')), 3000)
    );
    
    const clasificacionesPromise = fetchClasifPredio();
    const data = await Promise.race([clasificacionesPromise, timeoutPromise]);
    
    console.log("✅ Clasificaciones de predio obtenidas:", data);
    
    // Asegurar que los datos tengan el formato correcto
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id || item.value || item.codigo || "0",
        nombre: item.nombre || item.label || item.descripcion || "Sin nombre"
      }));
    }
    
    return data;
    
  } catch (error) {
    console.warn("❌ Error al obtener clasificaciones de predio, usando datos temporales:", error);
    
    // DATOS TEMPORALES MEJORADOS Y MÁS REALISTAS
    return [
      { id: "01", nombre: "RESIDENCIAL" },
      { id: "02", nombre: "COMERCIAL" },
      { id: "03", nombre: "INDUSTRIAL" },
      { id: "04", nombre: "AGRÍCOLA" },
      { id: "05", nombre: "EDUCATIVO" },
      { id: "06", nombre: "SALUD" },
      { id: "07", nombre: "GUBERNAMENTAL" },
      { id: "08", nombre: "ESPECIAL" },
      { id: "09", nombre: "MIXTO" },
      { id: "10", nombre: "OTRO" }
    ];
  }
}

  async obtenerTiposDenominacion() {
  console.log("📋 Cargando tipos de denominación desde datos temporales");
  
  return [
    { id: "01", nombre: "EDIFICIO" },
    { id: "02", nombre: "CONDOMINIO" },
    { id: "03", nombre: "TORRE" },
    { id: "04", nombre: "CENTRO COMERCIAL" },
    { id: "05", nombre: "GALERÍA" },
    { id: "06", nombre: "RESIDENCIAL" },
    { id: "07", nombre: "OFICINAS" },
    { id: "08", nombre: "LOCAL COMERCIAL" },
    { id: "09", nombre: "DEPARTAMENTO" },
    { id: "10", nombre: "CASA" },
    { id: "11", nombre: "BUNGALOW" },
    { id: "12", nombre: "DÚPLEX" },
    { id: "13", nombre: "TRÍPLEX" },
    { id: "14", nombre: "PENTHOUSE" },
    { id: "15", nombre: "LOFT" }
  ];
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

  // ========== MÉTODOS ADICIONALES PARA VALIDACIONES CON SATGIZ ==========

  async validarContribuyenteSATGIZ(datosContribuyente) {
    try {
      return ContribuyenteService.validarContribuyente(datosContribuyente);
    } catch (error) {
      console.error("Error al validar contribuyente con SATGIZ:", error);
      return { isValid: false, errors: { general: "Error de validación" } };
    }
  }

  async validarUbicacionSATGIZ(datosUbicacion) {
    try {
      return UbicacionContribuyenteService.validarUbicacion(datosUbicacion);
    } catch (error) {
      console.error("Error al validar ubicación con SATGIZ:", error);
      return { isValid: false, errors: { general: "Error de validación" } };
    }
  }

  async crearContribuyenteSATGIZ(datosContribuyente) {
    try {
      const resultado = await ContribuyenteService.crear(datosContribuyente);
      return { success: true, data: resultado };
    } catch (error) {
      console.error("Error al crear contribuyente en SATGIZ:", error);
      return { success: false, message: error.message };
    }
  }

  async crearUbicacionSATGIZ(datosUbicacion) {
    try {
      const resultado = await UbicacionContribuyenteService.crear(datosUbicacion);
      return { success: true, data: resultado };
    } catch (error) {
      console.error("Error al crear ubicación en SATGIZ:", error);
      return { success: false, message: error.message };
    }
  }

  // ========== MÉTODOS PARA OBTENER DATOS COMPLETOS DE CONTRIBUYENTE ==========

  async obtenerDatosCompletosContribuyente(id) {
    try {
      const contribuyente = await this.obtenerContribuyentePorDocumento(id);
      const ubicaciones = await this.obtenerUbicacionesContribuyente(id);
      
      return {
        contribuyente,
        ubicaciones,
        tieneUbicaciones: ubicaciones && ubicaciones.length > 0
      };
    } catch (error) {
      console.error("Error al obtener datos completos del contribuyente:", error);
      return { contribuyente: null, ubicaciones: [], tieneUbicaciones: false };
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