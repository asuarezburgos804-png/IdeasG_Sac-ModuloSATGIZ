class MantenimientoPredioService {
  constructor() {
    // Lista de contribuyentes disponibles
    this.contribuyentes = [
      { documento: "75257565", nombre: "MARIA REYNA ANTUANET RODRIGUEZ CABANILLAS" },
      { documento: "05232717", nombre: "JUAN BOCANEGRA LINAREZ" },
      { documento: "7799915", nombre: "RENZO GARCIA AUQUI" }
    ];

    // Datos temporales de predios por año
    this.prediosData = {
      "2022": [
        {
          id: 1,
          codigo: "P001-2022",
          tipo: "URBANO",
          ubicacion: "AV. SN Nº 123 MZNA. 123 LOTE 123",
          area: "100.0 m2",
          condicion: "HABITADO",
          documento: "75257565",
          nombreContribuyente: "MARIA REYNA ANTUANET RODRIGUEZ CABANILLAS"
        },
        {
          id: 2,
          codigo: "P002-2022", 
          tipo: "RURAL",
          ubicacion: "Zona Agricola - Sector A",
          area: "2.5 ha",
          condicion: "PRODUCCION",
          documento: "05232717",
          nombreContribuyente: "JUAN BOCANEGRA LINAREZ"
        },
        {
          id: 3,
          codigo: "P003-2022",
          tipo: "URBANO",
          ubicacion: "JR. LAS FLORES Nº 456",
          area: "150.0 m2",
          condicion: "VACIO",
          documento: "7799915",
          nombreContribuyente: "RENZO GARCIA AUQUI"
        }
      ],
      "2023": [
        {
          id: 4,
          codigo: "P001-2023",
          tipo: "URBANO",
          ubicacion: "AV. LAS AMERICAS Nº 789",
          area: "120.0 m2",
          condicion: "HABITADO",
          documento: "75257565",
          nombreContribuyente: "MARIA REYNA ANTUANET RODRIGUEZ CABANILLAS"
        },
        {
          id: 5,
          codigo: "P002-2023", 
          tipo: "RURAL",
          ubicacion: "Zona Ganadera - Sector B",
          area: "5.0 ha",
          condicion: "PRODUCCION",
          documento: "05232717",
          nombreContribuyente: "JUAN BOCANEGRA LINAREZ"
        }
      ],
      "2024": [
        {
          id: 6,
          codigo: "P001-2024",
          tipo: "URBANO",
          ubicacion: "AV. NUEVA Nº 321",
          area: "200.0 m2",
          condicion: "CONSTRUCCION",
          documento: "7799915",
          nombreContribuyente: "RENZO GARCIA AUQUI"
        }
      ]
    };

    this.departamentos = [
      { value: "CUSCO", label: "Cusco" },
      { value: "LIMA", label: "Lima" },
      { value: "AREQUIPA", label: "Arequipa" }
    ];

    this.provincias = {
      "CUSCO": [
        { value: "CUSCO", label: "Cusco" },
        { value: "LA_CONVENCION", label: "La Convención" },
        { value: "QUISPICANCHI", label: "Quispicanchi" }
      ],
      "LIMA": [
        { value: "LIMA", label: "Lima" },
        { value: "HUARAL", label: "Huaral" },
        { value: "CANTA", label: "Canta" }
      ],
      "AREQUIPA": [
        { value: "AREQUIPA", label: "Arequipa" },
        { value: "CAYLLOMA", label: "Caylloma" },
        { value: "CAMANA", label: "Camana" }
      ]
    };

    this.distritos = {
      "CUSCO": [
        { value: "KIMBIRI", label: "Kimbiri" },
        { value: "PICHARI", label: "Pichari" },
        { value: "SANTA_ANA", label: "Santa Ana" }
      ],
      "LA_CONVENCION": [
        { value: "QUILLABAMBA", label: "Quillabamba" },
        { value: "SANTA_TERESA", label: "Santa Teresa" },
        { value: "OLLANTAYTAMBO", label: "Ollantaytambo" }
      ]
    };

    this.tiposVia = [
      { value: "AVENIDA", label: "Avenida" },
      { value: "JIRON", label: "Jirón" },
      { value: "CALLE", label: "Calle" },
      { value: "PASAJE", label: "Pasaje" },
      { value: "CARRETERA", label: "Carretera" }
    ];

    this.denominacionesUrbanas = [
      { value: "URBANIZACION", label: "Urbanización" },
      { value: "ASENTAMIENTO_HUMANO", label: "Asentamiento Humano" },
      { value: "CONJUNTO_HABITACIONAL", label: "Conjunto Habitacional" },
      { value: "RESIDENCIAL", label: "Residencial" }
    ];

    this.usosPredio = [
      { value: "RESIDENCIAL", label: "Residencial" },
      { value: "COMERCIAL", label: "Comercial" },
      { value: "INDUSTRIAL", label: "Industrial" },
      { value: "MIXTO", label: "Mixto" }
    ];

    this.estadosPredio = [
      { value: "HABITADO", label: "Habitado" },
      { value: "DESHABITADO", label: "Deshabitado" },
      { value: "CONSTRUCCION", label: "En Construcción" },
      { value: "DEMOLICION", label: "En Demolición" }
    ];

    this.tiposPredio = [
      { value: "CASA", label: "Casa" },
      { value: "DEPARTAMENTO", label: "Departamento" },
      { value: "OFICINA", label: "Oficina" },
      { value: "LOCAL_COMERCIAL", label: "Local Comercial" }
    ];

    this.condicionesPredio = [
      { value: "BUENO", label: "Bueno" },
      { value: "REGULAR", label: "Regular" },
      { value: "MALO", label: "Malo" },
      { value: "REMODELLADO", label: "Remodelado" }
    ];
  }

  // Búsqueda progresiva de predios por código, ubicación, área, documento o nombre del contribuyente
    async buscarPrediosGlobal(termino) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!termino) {
          return [];
        }

        // Combinar todos los predios de todos los períodos
        const todosLosPredios = Object.values(this.prediosData).flat();
        
        const resultadosFiltrados = todosLosPredios.filter(predio =>
          predio.codigo.toLowerCase().includes(termino.toLowerCase()) ||
          predio.ubicacion.toLowerCase().includes(termino.toLowerCase()) ||
          predio.area.toLowerCase().includes(termino.toLowerCase()) ||
          predio.documento.includes(termino) ||
          predio.nombreContribuyente.toLowerCase().includes(termino.toLowerCase())
        );

        return resultadosFiltrados;
      } catch (error) {
        console.error("Error al buscar predios global:", error);
        return [];
      }
    }


  // Verificar si existe un predio (simulación)
  async verificarPredio(datosPredio) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulamos verificación por documento del titular
      const existe = Object.values(this.prediosData).flat().some(predio => 
        predio.documento === datosPredio.documento
      );

      return existe;
    } catch (error) {
      console.error("Error al verificar predio:", error);
      return false;
    }
  }

  // Registrar nuevo predio
  async registrarPredio(datosPredio, periodo) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Inicializar array si no existe para el período
      if (!this.prediosData[periodo]) {
        this.prediosData[periodo] = [];
      }
      
      // Generar un nuevo ID y código
      const nuevoId = Math.max(0, ...Object.values(this.prediosData).flat().map(p => p.id)) + 1;
      const nuevoCodigo = `P${String(this.prediosData[periodo].length + 1).padStart(3, '0')}-${periodo}`;
      
      const nuevoPredio = {
        id: nuevoId,
        codigo: nuevoCodigo,
        ...datosPredio
      };

      this.prediosData[periodo].push(nuevoPredio);
      
      return {
        success: true,
        message: "Predio registrado correctamente",
        data: nuevoPredio
      };
    } catch (error) {
      console.error("Error al registrar predio:", error);
      throw error;
    }
  }

  // Obtener predio por ID
  async obtenerPredioPorId(id, periodo) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const prediosDelPeriodo = this.prediosData[periodo] || [];
      const predio = prediosDelPeriodo.find(p => p.id === id);
      return predio || null;
    } catch (error) {
      console.error("Error al obtener predio:", error);
      throw error;
    }
  }

  // Obtener contribuyente por documento
  obtenerContribuyentePorDocumento(documento) {
    return this.contribuyentes.find(c => c.documento === documento);
  }

  // Obtener todos los contribuyentes
  obtenerContribuyentes() {
    return this.contribuyentes;
  }

    obtenerProvinciasPorDepartamento(departamento) {
    return this.provincias[departamento] || [];
  }

  obtenerDistritosPorProvincia(provincia) {
    return this.distritos[provincia] || [];
  }

  // Obtener periodos disponibles
  async obtenerPeriodos() {
    return [
      { value: "2022", label: "2022" },
      { value: "2023", label: "2023" },
      { value: "2024", label: "2024" }
    ];
  }
}

export default new MantenimientoPredioService();