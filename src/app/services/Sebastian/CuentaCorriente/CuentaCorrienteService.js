class CuentaCorrienteService {
  constructor() {
    this.contribuyentes = [
      { documento: "71799113", nombre: "RENZO GARCIA AUQUI" },
      { documento: "75257565", nombre: "MARIA REYNA RODRIGUEZ" },
    ];

    this.predios = [
      { codigo: "P001-2023", tipo: "URBANO", valor: 1500, documento: "71799113" },
      { codigo: "P002-2023", tipo: "RURAL", valor: 1000, documento: "71799113" },
      { codigo: "P003-2023", tipo: "URBANO", valor: 800, documento: "75257565" },
    ];

    this.cuentas = [];
  }

  async buscarContribuyente(termino) {
    await new Promise((r) => setTimeout(r, 300));
    return this.contribuyentes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        c.documento.includes(termino)
    );
  }

  async obtenerPrediosPorContribuyente(documento) {
    await new Promise((r) => setTimeout(r, 200));
    return this.predios.filter((p) => p.documento === documento);
  }

  async generarCuentaCorriente(contribuyente, periodo) {
    await new Promise((r) => setTimeout(r, 1000));

    const predios = this.predios.filter((p) => p.documento === contribuyente.documento);
    const total = predios.reduce((acc, p) => acc + p.valor, 0);
    const cuenta = {
      id: this.cuentas.length + 1,
      contribuyente,
      periodo,
      total,
      fecha: new Date().toLocaleDateString(),
      predios,
    };
    this.cuentas.push(cuenta);
    return cuenta;
  }
}

export default new CuentaCorrienteService();
