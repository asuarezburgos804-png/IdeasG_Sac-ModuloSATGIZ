class MantenimientoContribuyenteService {
  constructor() {
    this.contribuyentesData = [
      {
        id: 1,
        tipoDocumento: "DNI",
        numeroDocumento: "75257565",
        tipoContribuyente: "PERSONA NATURAL",
        nombre: "MARIA REYNA ANTUANET RODRIGUEZ CABANILLAS",
        condicionEspecial: "",
        telefono: "987654321",
        email: "maria.rodriguez@email.com",
        departamento: "CUSCO",
        provincia: "LA CONVENCIÓN", 
        distrito: "KIMBIRI",
        zonaPredioRural: "",
        codVia: "123456",
        tipoVia: "AVENIDA",
        nombreVia: "SN",
        codHU: "",
        nombreHabilitacion: "",
        nroMunicipal: "123",
        nombreEdificacion: "",
        nroInterior: "",
        sector: "",
        manzana: "123",
        lote: "123",
        subLote: "",
        grupoResidencial: "",
        estado: "ACTIVO",
        registrado: true
      },
      {
        id: 2,
        tipoDocumento: "DNI",
        numeroDocumento: "05232717",
        tipoContribuyente: "PERSONA NATURAL",
        nombre: "JUAN BOCANEGRA LINAREZ", 
        condicionEspecial: "",
        telefono: "987654322",
        email: "juan.bocanegra@email.com",
        departamento: "CUSCO",
        provincia: "LA CONVENCIÓN",
        distrito: "KIMBIRI",
        zonaPredioRural: "",
        codVia: "123456",
        tipoVia: "AVENIDA",
        nombreVia: "SN",
        codHU: "",
        nombreHabilitacion: "",
        nroMunicipal: "123",
        nombreEdificacion: "",
        nroInterior: "",
        sector: "",
        manzana: "123", 
        lote: "123",
        subLote: "",
        grupoResidencial: "",
        estado: "ACTIVO",
        registrado: true
      },
      {
        id: 3,
        tipoDocumento: "DNI",
        numeroDocumento: "7799915",
        tipoContribuyente: "PERSONA NATURAL",
        nombre: "RENZO GARCIA AUQUI",
        condicionEspecial: "",
        telefono: "987654323",
        email: "renzo.garcia@email.com",
        departamento: "CUSCO",
        provincia: "LA CONVENCIÓN",
        distrito: "KIMBIRI",
        zonaPredioRural: "",
        codVia: "123456",
        tipoVia: "AVENIDA",
        nombreVia: "SN",
        codHU: "",
        nombreHabilitacion: "",
        nroMunicipal: "123",
        nombreEdificacion: "",
        nroInterior: "",
        sector: "",
        manzana: "123",
        lote: "123",
        subLote: "",
        grupoResidencial: "",
        estado: "ACTIVO",
        registrado: false
      }
    ];
  }

  // Búsqueda progresiva de contribuyentes
  async buscarContribuyentes(termino) {
    try {
      console.log("Buscando contribuyentes con término:", termino);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!termino) {
        return [];
      }

      const resultadosFiltrados = this.contribuyentesData.filter(contribuyente =>
        contribuyente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        contribuyente.numeroDocumento.includes(termino)
      );

      return resultadosFiltrados.map(contribuyente => ({
        id: contribuyente.id,
        tipoContribuyente: contribuyente.tipoContribuyente,
        nombre: contribuyente.nombre,
        documento: contribuyente.numeroDocumento,
        estado: contribuyente.estado,
        registrado: contribuyente.registrado
      }));
    } catch (error) {
      console.error("Error al buscar contribuyentes:", error);
      return [];
    }
  }

  // Actualizar datos del contribuyente
  async actualizarContribuyente(datosContribuyente) {
    try {
      console.log("Actualizando contribuyente:", datosContribuyente);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = this.contribuyentesData.findIndex(c => c.id === datosContribuyente.id);
      if (index !== -1) {
        this.contribuyentesData[index] = { ...this.contribuyentesData[index], ...datosContribuyente };
        console.log("Contribuyente actualizado en datos temporales");
      }
      
      return {
        success: true,
        message: "Contribuyente actualizado correctamente",
        data: datosContribuyente
      };
    } catch (error) {
      console.error("Error al actualizar contribuyente:", error);
      throw error;
    }
  }

  // Obtener datos completos de un contribuyente
  async obtenerContribuyentePorId(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const contribuyente = this.contribuyentesData.find(c => c.id === id);
      return contribuyente || null;
    } catch (error) {
      console.error("Error al obtener contribuyente:", error);
      throw error;
    }
  }
}

export default new MantenimientoContribuyenteService();