class DeclaracionJuradaService {
  constructor() {
    // Datos temporales de contribuyentes para Declaración Jurada
    this.contribuyentes = [
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

    // Datos temporales de declaraciones juradas existentes
    this.declaracionesJuradas = [
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

  // ========== MÉTODOS PARA CONTRIBUYENTES ==========

  async obtenerTodosContribuyentes() {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.contribuyentes;
    } catch (error) {
      console.error("Error al obtener contribuyentes:", error);
      return this.contribuyentes;
    }
  }

  async buscarContribuyentes(termino) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!termino) {
        return this.contribuyentes;
      }

      const terminoLower = termino.toLowerCase();
      
      return this.contribuyentes.filter(contribuyente =>
        contribuyente.c_codigo?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_tipo_contribuyente?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_nombre?.toLowerCase().includes(terminoLower) ||
        contribuyente.c_num_documento?.includes(termino)
      );
    } catch (error) {
      console.error("Error al buscar contribuyentes:", error);
      return this.contribuyentes;
    }
  }

  async obtenerContribuyentePorDocumento(documento) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.contribuyentes.find(c => c.c_num_documento === documento) || null;
    } catch (error) {
      console.error("Error al obtener contribuyente:", error);
      return this.contribuyentes.find(c => c.c_num_documento === documento) || null;
    }
  }

  // ========== MÉTODOS PARA DECLARACIONES JURADAS ==========

  async obtenerDeclaracionesPorContribuyente(documento) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.declaracionesJuradas.filter(dj => dj.contribuyente_documento === documento);
    } catch (error) {
      console.error("Error al obtener declaraciones:", error);
      return [];
    }
  }

  async obtenerDeclaracionPorId(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.declaracionesJuradas.find(dj => dj.id === id) || null;
    } catch (error) {
      console.error("Error al obtener declaración:", error);
      return null;
    }
  }

  async crearDeclaracionJurada(datosDeclaracion) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nuevaId = Math.max(0, ...this.declaracionesJuradas.map(d => d.id)) + 1;
      const nuevaDeclaracion = {
        id: nuevaId,
        ...datosDeclaracion,
        fecha_creacion: new Date().toISOString(),
        estado: "PENDIENTE"
      };

      this.declaracionesJuradas.push(nuevaDeclaracion);
      
      return {
        success: true,
        message: "Declaración Jurada creada correctamente",
        data: nuevaDeclaracion
      };
    } catch (error) {
      console.error("Error al crear declaración jurada:", error);
      throw error;
    }
  }

  async actualizarDeclaracionJurada(id, datosActualizados) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = this.declaracionesJuradas.findIndex(dj => dj.id === id);
      if (index === -1) {
        throw new Error("Declaración Jurada no encontrada");
      }

      this.declaracionesJuradas[index] = {
        ...this.declaracionesJuradas[index],
        ...datosActualizados,
        fecha_actualizacion: new Date().toISOString()
      };

      return {
        success: true,
        message: "Declaración Jurada actualizada correctamente",
        data: this.declaracionesJuradas[index]
      };
    } catch (error) {
      console.error("Error al actualizar declaración jurada:", error);
      throw error;
    }
  }

  async eliminarDeclaracionJurada(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = this.declaracionesJuradas.findIndex(dj => dj.id === id);
      if (index === -1) {
        throw new Error("Declaración Jurada no encontrada");
      }

      this.declaracionesJuradas.splice(index, 1);

      return {
        success: true,
        message: "Declaración Jurada eliminada correctamente"
      };
    } catch (error) {
      console.error("Error al eliminar declaración jurada:", error);
      throw error;
    }
  }

  // ========== MÉTODOS PARA PERIODOS ==========

  async obtenerPeriodosDisponibles() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
        { value: "2020", label: "2020" }
      ];
    } catch (error) {
      console.error("Error al obtener periodos:", error);
      return [];
    }
  }

  // ========== MÉTODOS PARA TIPOS DE PREDIO ==========

  async obtenerTiposPredio() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        { value: "URBANO", label: "PREDIO URBANO" },
        { value: "RURAL", label: "PREDIO RURAL" }
      ];
    } catch (error) {
      console.error("Error al obtener tipos de predio:", error);
      return [];
    }
  }

  // ========== MÉTODOS PARA DEDUCCIONES ==========

  async obtenerTiposDeduccion() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        { value: "NO", label: "NO" },
        { value: "20% Zona de Conservación", label: "20% Zona de Conservación y Reexención - ASES NO" },
        { value: "10% Zona Histórica", label: "10% Zona Histórica" },
        { value: "15% Zona Residencial", label: "15% Zona Residencial Especial" },
        { value: "25% Zona Rural", label: "25% Zona Rural Protegida" }
      ];
    } catch (error) {
      console.error("Error al obtener tipos de deducción:", error);
      return [];
    }
  }

  // ========== MÉTODOS PARA ESTADÍSTICAS ==========

  async obtenerEstadisticasDeclaraciones() {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const totalDeclaraciones = this.declaracionesJuradas.length;
      const aprobadas = this.declaracionesJuradas.filter(d => d.estado === "APROBADO").length;
      const pendientes = this.declaracionesJuradas.filter(d => d.estado === "PENDIENTE").length;
      const rechazadas = this.declaracionesJuradas.filter(d => d.estado === "RECHAZADO").length;

      return {
        total: totalDeclaraciones,
        aprobadas,
        pendientes,
        rechazadas,
        montoTotal: this.declaracionesJuradas.reduce((sum, dj) => sum + (dj.monto_declarado || 0), 0)
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return { total: 0, aprobadas: 0, pendientes: 0, rechazadas: 0, montoTotal: 0 };
    }
  }

  // ========== MÉTODOS PARA GENERAR PDF ==========

  async generarPDFDeclaracion(idDeclaracion) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const declaracion = this.declaracionesJuradas.find(dj => dj.id === idDeclaracion);
      if (!declaracion) {
        throw new Error("Declaración no encontrada");
      }

      // Simular generación de PDF
      return {
        success: true,
        message: "PDF generado correctamente",
        url: `/pdf/declaracion-${idDeclaracion}.pdf`,
        data: declaracion
      };
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  }

  // ========== MÉTODOS PARA VALIDACIONES ==========

  async validarDeclaracionJurada(datosDeclaracion) {
    try {
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
    } catch (error) {
      console.error("Error al validar declaración:", error);
      throw error;
    }
  }
}

export default new DeclaracionJuradaService();