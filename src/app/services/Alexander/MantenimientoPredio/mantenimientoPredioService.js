import {
  fetchUbicacionPredioMaestros,
  getDepartamentos,
  getProvincias,
  getDistritos,
  fetchTipoVias,
  fetchTipoDoc,
  fetchCondTitular,
  fetchEstCivil,
  fetchTipoPerJuridica,
  fetchFormaAdqui,
  fetchClasifPredio,
  fetchMep,
  fetchEcs,
  fetchEcc,
  fetchUca
} from "@/app/services/master/master";

class MantenimientoPredioService {
  constructor() {
    this.maestrosUbicacion = null;
    this.departamentosApi = [];
    this.tiposViaApi = [];
    this.tiposDocumento = [];
    this.condicionesTitular = [];
    this.estadosCiviles = [];
    this.tiposPersonaJuridica = [];
    this.formasAdquisicion = [];
    this.clasificacionesPredio = [];
    this.materialesPredominantes = [];
    this.estadosConservacion = [];
    this.estadosConstruccion = [];
    this.unidadesCatastrales = [];

    // Datos de predios (temporal hasta tener API real)
    this.prediosData = {
      "2022": [],
      "2023": [],
      "2024": []
    };

    // Contribuyentes (temporal hasta tener el api)
    this.contribuyentes = [
      { documento: "75257565", nombre: "MARIA REYNA ANTUANET RODRIGUEZ CABANILLAS" },
      { documento: "05232717", nombre: "JUAN BOCANEGRA LINAREZ" },
      { documento: "7799915", nombre: "RENZO GARCIA AUQUI" }
    ];

    // Datos estáticos como respaldo por si no hay datos en el backend
    this.departamentosBackup = [
      { value: "CUSCO", label: "Cusco" },
      { value: "LIMA", label: "Lima" },
      { value: "AREQUIPA", label: "Arequipa" }
    ];

    this.tiposViaBackup = [
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

  // ========== MÉTODOS PARA PREDIOS ==========

  async buscarPredios(termino, periodo) {
    try {
      // TODO: Reemplazar con API real cuando esté disponible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!termino) {
        return this.prediosData[periodo] || [];
      }

      const prediosDelPeriodo = this.prediosData[periodo] || [];
      
      const resultadosFiltrados = prediosDelPeriodo.filter(predio =>
        predio.codigo?.toLowerCase().includes(termino.toLowerCase()) ||
        predio.ubicacion?.toLowerCase().includes(termino.toLowerCase()) ||
        predio.area?.toLowerCase().includes(termino.toLowerCase()) ||
        predio.documento?.includes(termino) ||
        predio.nombreContribuyente?.toLowerCase().includes(termino.toLowerCase())
      );

      return resultadosFiltrados;
    } catch (error) {
      console.error("Error al buscar predios:", error);
      return [];
    }
  }

  async buscarPrediosGlobal(termino) {
    try {
      // TODO: Reemplazar con API real cuando esté disponible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!termino) {
        return [];
      }

      const todosLosPredios = Object.values(this.prediosData).flat();
      
      const resultadosFiltrados = todosLosPredios.filter(predio =>
        predio.codigo?.toLowerCase().includes(termino.toLowerCase()) ||
        predio.ubicacion?.toLowerCase().includes(termino.toLowerCase()) ||
        predio.area?.toLowerCase().includes(termino.toLowerCase()) ||
        predio.documento?.includes(termino) ||
        predio.nombreContribuyente?.toLowerCase().includes(termino.toLowerCase())
      );

      return resultadosFiltrados;
    } catch (error) {
      console.error("Error al buscar predios global:", error);
      return [];
    }
  }

  async registrarPredio(datosPredio, periodo) {
    try {
      // TODO: Reemplazar con API real cuando esté disponible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!this.prediosData[periodo]) {
        this.prediosData[periodo] = [];
      }
      
      const nuevoId = Math.max(0, ...Object.values(this.prediosData).flat().map(p => p.id || 0)) + 1;
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

  // ========== MÉTODOS PARA MAESTROS Y UBICACIÓN ==========

  async cargarMaestrosUbicacion() {
    try {
      if (!this.maestrosUbicacion) {
        this.maestrosUbicacion = await fetchUbicacionPredioMaestros();
      }
      return this.maestrosUbicacion;
    } catch (error) {
      console.error("Error al cargar maestros de ubicación:", error);
      return [];
    }
  }

  async obtenerDepartamentosApi() {
    try {
      if (this.departamentosApi.length === 0) {
        const departamentos = await getDepartamentos();
        this.departamentosApi = departamentos.map(depto => ({
          value: depto.id_departamento?.toString(),
          label: depto.nombre_departamento
        }));
      }
      return this.departamentosApi;
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      return this.departamentosBackup;
    }
  }

  async obtenerProvinciasApi(idDepartamento) {
    try {
      const provincias = await getProvincias(idDepartamento);
      return provincias.map(prov => ({
        value: prov.id_provincia?.toString(),
        label: prov.nombre_provincia
      }));
    } catch (error) {
      console.error("Error al obtener provincias:", error);
      return [];
    }
  }

  async obtenerDistritosApi(idProvincia) {
    try {
      const distritos = await getDistritos(idProvincia);
      return distritos.map(dist => ({
        value: dist.id_distrito?.toString(),
        label: dist.nombre_distrito
      }));
    } catch (error) {
      console.error("Error al obtener distritos:", error);
      return [];
    }
  }

  async obtenerTiposViaApi() {
    try {
      if (this.tiposViaApi.length === 0) {
        const tiposVia = await fetchTipoVias();
        this.tiposViaApi = tiposVia.map(via => ({
          value: via.id_tipo_via?.toString(),
          label: via.nombre_tipo_via
        }));
      }
      return this.tiposViaApi;
    } catch (error) {
      console.error("Error al obtener tipos de vía:", error);
      return this.tiposViaBackup;
    }
  }

  // ========== MÉTODOS PARA MAESTROS GENERALES ==========

  async obtenerTiposDocumento() {
    try {
      if (this.tiposDocumento.length === 0) {
        const tiposDoc = await fetchTipoDoc();
        this.tiposDocumento = tiposDoc.data?.map(doc => ({
          value: doc.id_tipo_doc?.toString(),
          label: doc.descripcion_tipo_doc
        })) || [];
      }
      return this.tiposDocumento;
    } catch (error) {
      console.error("Error al obtener tipos de documento:", error);
      return [];
    }
  }

  async obtenerCondicionesTitular() {
    try {
      if (this.condicionesTitular.length === 0) {
        const condiciones = await fetchCondTitular();
        this.condicionesTitular = condiciones.data?.map(cond => ({
          value: cond.id_cond_titular?.toString(),
          label: cond.descripcion_cond_titular
        })) || [];
      }
      return this.condicionesTitular;
    } catch (error) {
      console.error("Error al obtener condiciones del titular:", error);
      return [];
    }
  }

  async obtenerEstadosCiviles() {
    try {
      if (this.estadosCiviles.length === 0) {
        const estados = await fetchEstCivil();
        this.estadosCiviles = estados.data?.map(estado => ({
          value: estado.id_est_civil?.toString(),
          label: estado.descripcion_est_civil
        })) || [];
      }
      return this.estadosCiviles;
    } catch (error) {
      console.error("Error al obtener estados civiles:", error);
      return [];
    }
  }

  async obtenerTiposPersonaJuridica() {
    try {
      if (this.tiposPersonaJuridica.length === 0) {
        const tipos = await fetchTipoPerJuridica();
        this.tiposPersonaJuridica = tipos.data?.map(tipo => ({
          value: tipo.id_tipo_per_juridica?.toString(),
          label: tipo.descripcion_tipo_per_juridica
        })) || [];
      }
      return this.tiposPersonaJuridica;
    } catch (error) {
      console.error("Error al obtener tipos de persona jurídica:", error);
      return [];
    }
  }

  async obtenerFormasAdquisicion() {
    try {
      if (this.formasAdquisicion.length === 0) {
        const formas = await fetchFormaAdqui();
        this.formasAdquisicion = formas.data?.map(forma => ({
          value: forma.id_forma_adqui?.toString(),
          label: forma.descripcion_forma_adqui
        })) || [];
      }
      return this.formasAdquisicion;
    } catch (error) {
      console.error("Error al obtener formas de adquisición:", error);
      return [];
    }
  }

  async obtenerClasificacionesPredio() {
    try {
      if (this.clasificacionesPredio.length === 0) {
        const clasificaciones = await fetchClasifPredio();
        this.clasificacionesPredio = clasificaciones.data?.map(clasif => ({
          value: clasif.id_clasif_predio?.toString(),
          label: clasif.descripcion_clasif_predio
        })) || [];
      }
      return this.clasificacionesPredio;
    } catch (error) {
      console.error("Error al obtener clasificaciones de predio:", error);
      return [];
    }
  }

  async obtenerMaterialesPredominantes() {
    try {
      if (this.materialesPredominantes.length === 0) {
        const materiales = await fetchMep();
        this.materialesPredominantes = materiales.data?.map(mat => ({
          value: mat.id_mep?.toString(),
          label: mat.descripcion_mep
        })) || [];
      }
      return this.materialesPredominantes;
    } catch (error) {
      console.error("Error al obtener materiales predominantes:", error);
      return [];
    }
  }

  async obtenerEstadosConservacion() {
    try {
      if (this.estadosConservacion.length === 0) {
        const estados = await fetchEcs();
        this.estadosConservacion = estados.data?.map(estado => ({
          value: estado.id_ecs?.toString(),
          label: estado.descripcion_ecs
        })) || [];
      }
      return this.estadosConservacion;
    } catch (error) {
      console.error("Error al obtener estados de conservación:", error);
      return [];
    }
  }

  async obtenerEstadosConstruccion() {
    try {
      if (this.estadosConstruccion.length === 0) {
        const estados = await fetchEcc();
        this.estadosConstruccion = estados.data?.map(estado => ({
          value: estado.id_ecc?.toString(),
          label: estado.descripcion_ecc
        })) || [];
      }
      return this.estadosConstruccion;
    } catch (error) {
      console.error("Error al obtener estados de construcción:", error);
      return [];
    }
  }

  async obtenerUnidadesCatastrales() {
    try {
      if (this.unidadesCatastrales.length === 0) {
        const unidades = await fetchUca();
        this.unidadesCatastrales = unidades.data?.map(uc => ({
          value: uc.id_uca?.toString(),
          label: uc.descripcion_uca
        })) || [];
      }
      return this.unidadesCatastrales;
    } catch (error) {
      console.error("Error al obtener unidades catastrales:", error);
      return [];
    }
  }

  // ========== MÉTODOS AUXILIARES ==========

  obtenerContribuyentePorDocumento(documento) {
    return this.contribuyentes.find(c => c.documento === documento);
  }

  obtenerContribuyentes() {
    return this.contribuyentes;
  }

  // Métodos de respaldo para ubicación (usados mientras se cargan los datos de API)
  obtenerProvinciasPorDepartamento(departamento) {
    // Esto es temporal hasta que carguemos desde API
    const provinciasPorDepto = {
      "CUSCO": [
        { value: "CUSCO", label: "Cusco" },
        { value: "LA_CONVENCION", label: "La Convención" }
      ],
      "LIMA": [
        { value: "LIMA", label: "Lima" },
        { value: "HUARAL", label: "Huaral" }
      ]
    };
    return provinciasPorDepto[departamento] || [];
  }

  obtenerDistritosPorProvincia(provincia) {
    // Esto es temporal hasta que carguemos desde API
    const distritosPorProv = {
      "CUSCO": [
        { value: "KIMBIRI", label: "Kimbiri" },
        { value: "PICHARI", label: "Pichari" }
      ],
      "LIMA": [
        { value: "LIMA", label: "Lima" },
        { value: "MIRAFLORES", label: "Miraflores" }
      ]
    };
    return distritosPorProv[provincia] || [];
  }

  async obtenerDatosUbicacion() {
    try {
      const [departamentos, tiposVia, maestrosUbicacion] = await Promise.all([
        this.obtenerDepartamentosApi(),
        this.obtenerTiposViaApi(),
        this.cargarMaestrosUbicacion()
      ]);

      return {
        departamentos,
        tiposVia,
        maestrosUbicacion
      };
    } catch (error) {
      console.error("Error al obtener datos de ubicación:", error);
      return {
        departamentos: this.departamentosBackup,
        tiposVia: this.tiposViaBackup,
        maestrosUbicacion: []
      };
    }
  }

  async obtenerTodosLosMaestros() {
    try {
      const [
        departamentos,
        tiposDocumento,
        condicionesTitular,
        estadosCiviles,
        tiposPersonaJuridica,
        formasAdquisicion,
        clasificacionesPredio,
        materialesPredominantes,
        estadosConservacion,
        estadosConstruccion,
        unidadesCatastrales
      ] = await Promise.all([
        this.obtenerDepartamentosApi(),
        this.obtenerTiposDocumento(),
        this.obtenerCondicionesTitular(),
        this.obtenerEstadosCiviles(),
        this.obtenerTiposPersonaJuridica(),
        this.obtenerFormasAdquisicion(),
        this.obtenerClasificacionesPredio(),
        this.obtenerMaterialesPredominantes(),
        this.obtenerEstadosConservacion(),
        this.obtenerEstadosConstruccion(),
        this.obtenerUnidadesCatastrales()
      ]);

      return {
        departamentos,
        tiposDocumento,
        condicionesTitular,
        estadosCiviles,
        tiposPersonaJuridica,
        formasAdquisicion,
        clasificacionesPredio,
        materialesPredominantes,
        estadosConservacion,
        estadosConstruccion,
        unidadesCatastrales
      };
    } catch (error) {
      console.error("Error al cargar todos los maestros:", error);
      return {};
    }
  }
}

export default new MantenimientoPredioService();