"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { ModalRenderer } from "@/components/custom/custom_Miguel/VerificacionTecnica/ModalRenderer";
import requisitosService from "@/app/services/Miguel/Requisitos/requisitosService";

export default function Requisitos({ expediente: expedienteProp, onBack }) {
  const [expediente, setExpediente] = useState(null);
  const [expedienteCompleto, setExpedienteCompleto] = useState(null);
  const [editando, setEditando] = useState(false);
  const [requisitos, setRequisitos] = useState([
    { id: 1, nombre: "Fue", estado: "-" },
    {
      id: 2,
      nombre: "Copia literal de dominio expedida por la SUNARP",
      estado: "-",
    },
    { id: 3, nombre: "Propietario", estado: "-" },
    {
      id: 4,
      nombre: "Documento que acredite el derecho para edificar",
      estado: "-",
    },
    {
      id: 5,
      nombre: "Poder de representación en caso de Personas Jurídicas",
      estado: "-",
    },
    {
      id: 6,
      nombre: "Boleta de habilidad profesional (declaraciones juradas)",
      estado: "-",
    },
  ]);

  const [modal, setModal] = useState({ type: "", props: {} });

  // Cargar expediente y requisitos existentes
  useEffect(() => {
    const cargarDatos = async () => {
      // Llamar función de debug (comentada por defecto)
      // debugSessionStorage();

      // Si no hay expediente en props, intentar obtener de sessionStorage
      let expedienteData = expedienteProp;

      if (!expedienteData) {
        const expedienteGuardado = sessionStorage.getItem("expediente");
        if (expedienteGuardado) {
          expedienteData = JSON.parse(expedienteGuardado);
        }
      }

      if (
        expedienteData &&
        (expedienteData.expediente ||
          expedienteData.id_expediente ||
          expedienteData.id_solicitud)
      ) {
        // Usar el número de expediente como ID del expediente (ya que son lo mismo)
        const idExpediente =
          expedienteData.expediente ||
          expedienteData.id_expediente ||
          expedienteData.id_solicitud;

        // Estructura normalizada del expediente para mostrar
        const expedienteNormalizado = {
          numero: expedienteData.expediente || idExpediente || "",
          administrado:
            expedienteData.nombre_completo || expedienteData.administrado || "",
          id_expediente: idExpediente || "",
          dni: expedienteData.dni || "",
        };

        setExpediente(expedienteNormalizado.numero);
        setExpedienteCompleto(expedienteNormalizado);

        // Cargar requisitos existentes desde la API
        try {
          const requisitosAPI = await requisitosService.obtenerRequisitos(
            idExpediente
          );

          if (requisitosAPI) {
            const datosMapeados =
              requisitosService.mapearDatosDesdeAPI(requisitosAPI);

            setRequisitos(datosMapeados.requisitos || []);
          } else {
            // Si no hay requisitos, mantener la lista por defecto

            setRequisitos([
              { id: 1, nombre: "Fue", estado: "-" },
              {
                id: 2,
                nombre: "Copia literal de dominio expedida por la SUNARP",
                estado: "-",
              },
              { id: 3, nombre: "Propietario", estado: "-" },
              {
                id: 4,
                nombre: "Documento que acredite el derecho para edificar",
                estado: "-",
              },
              {
                id: 5,
                nombre: "Poder de representación en caso de Personas Jurídicas",
                estado: "-",
              },
              {
                id: 6,
                nombre:
                  "Boleta de habilidad profesional (declaraciones juradas)",
                estado: "-",
              },
            ]);
          }
        } catch (error) {
          console.error("Error al cargar requisitos:", error);
          // En caso de error, usar lista por defecto
          setRequisitos([
            { id: 1, nombre: "Fue", estado: "-" },
            {
              id: 2,
              nombre: "Copia literal de dominio expedida por la SUNARP",
              estado: "-",
            },
            { id: 3, nombre: "Propietario", estado: "-" },
            {
              id: 4,
              nombre: "Documento que acredite el derecho para edificar",
              estado: "-",
            },
            {
              id: 5,
              nombre: "Poder de representación en caso de Personas Jurídicas",
              estado: "-",
            },
            {
              id: 6,
              nombre: "Boleta de habilidad profesional (declaraciones juradas)",
              estado: "-",
            },
          ]);
        }
      } else {
        console.error("Expediente no válido o sin ID:", expedienteData);
      }
    };

    cargarDatos();
  }, [expedienteProp]);

  // Cambiar estado de cada requisito
  const handleEstadoChange = (id, value) => {
    setRequisitos((prev) =>
      prev.map((req) => (req.id === id ? { ...req, estado: value } : req))
    );
  };

  // Cancelar edición (solo sale del modo edición)
  const handleCancelar = () => {
    setEditando(false);
  };

  // Función para sessionStorage
  const debugSessionStorage = () => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
    }
  };

  // Guardar requisitos
  const handleGuardar = async () => {
    // Validar que todos los campos estén completos
    const validacion = requisitosService.validarRequisitos(requisitos);
    if (!validacion.valido) {
      setModal({
        type: "alert",
        props: {
          mensaje: `Debes completar todos los requisitos antes de guardar:\n${validacion.errores.join(
            "\n"
          )}`,
        },
      });
      return;
    }

    try {
      // Usar el expediente completo del estado en lugar de sessionStorage
      if (!expedienteCompleto) {
        throw new Error(
          "No se encontró el expediente en el estado del componente"
        );
      }

      // Usar el número de expediente como ID del expediente (ya que son lo mismo)
      const idExpediente = expedienteCompleto.id_expediente;

      if (!idExpediente) {
        throw new Error("No se pudo determinar el ID del expediente");
      }

      // ID del técnico (debería venir del contexto de autenticación)
      const idTecnico = 1; // Temporal - reemplazar con valor real

      // Determinar tipo de formulario
      const tipoFormulario =
        requisitosService.determinarTipoFormulario(requisitos);

      // Mapear datos para API
      const datosAPI = requisitosService.mapearDatosParaAPI(
        requisitos,
        tipoFormulario,
        idTecnico
      );

      // Guardar en la API
      const resultado = await requisitosService.guardarRequisitos(
        idExpediente,
        datosAPI
      );

      setEditando(false);

      // Generar resumen
      const resumen = requisitosService.generarResumen(requisitos);

      setModal({
        type: "alert",
        props: {
          mensaje: `Requisitos guardados correctamente.\nCumplimiento: ${resumen.porcentajeCumplimiento}%`,
        },
      });
    } catch (error) {
      console.error("Error al guardar requisitos:", error);
      setModal({
        type: "alert",
        props: {
          mensaje: `Error al guardar los requisitos: ${error.message}`,
        },
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Botón volver atrás - MODIFICADO */}
      <Button size="sm" variant="light" onPress={onBack} className="mb-4">
        &lt;&lt; Volver atrás
      </Button>

      {/* Número de expediente */}
      <div className="mb-6 flex items-center gap-3">
        <label className="font-semibold">N° de expediente:</label>
        <input
          type="text"
          value={expediente || ""}
          readOnly
          placeholder={expediente ? "" : "No hay expediente"}
          className="border p-2 rounded w-72 bg-gray-50"
        />
      </div>

      {/* Botón de edición */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Requisitos:</h2>
        <button
          onClick={() => setEditando(!editando)}
          className="text-blue-600 hover:underline"
        >
          Editar Requisitos
        </button>
      </div>

      {/* Tabla de requisitos */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Requisito</th>
            <th className="text-left p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {requisitos.map((req) => (
            <tr key={req.id} className="border-b">
              <td className="p-2">{req.nombre}</td>
              <td className="p-2">
                {editando ? (
                  <select
                    value={req.estado === "-" ? "" : req.estado}
                    onChange={(e) => handleEstadoChange(req.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Seleccione</option>
                    <option value="Si cumple">Si cumple</option>
                    <option value="No cumple">No cumple</option>
                  </select>
                ) : (
                  req.estado
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botones finales */}
      {editando && (
        <div className="flex gap-4 mt-6">
          <Button color="primary" className="flex-1" onPress={handleGuardar}>
            Guardar verificación
          </Button>
          <Button color="default" className="flex-1" onPress={handleCancelar}>
            Cancelar
          </Button>
        </div>
      )}

      {/* Modal para mensajes */}
      <ModalRenderer modal={modal} closeModal={() => setModal({ type: "" })} />
    </div>
  );
}
