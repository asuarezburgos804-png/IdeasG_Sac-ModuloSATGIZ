"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
} from "@nextui-org/react";
import { ModalRenderer } from "@/components/custom/custom_Miguel/VerificacionTecnica/ModalRenderer";
import {
  obtenerVerificacionAdministrativa,
} from "@/app/services/Miguel/VerificacionTecnica/tecnicoService";

export default function VerificacionTecnica({ expediente, origen, onBack, onNavigate }) {
  const [verificacionData, setVerificacionData] = useState(null);
  const [modal, setModal] = useState({ type: "", props: {} });

  // Cargar datos de verificación cuando se recibe un expediente
  useEffect(() => {
    const loadVerificacionData = async () => {
      if (expediente && expediente.id_solicitud) {
        try {
          const data = await obtenerVerificacionAdministrativa(
            expediente.id_solicitud
          );
          if (data && data.success) {
            setVerificacionData(data.data);
          } else {
            setVerificacionData(null);
          }
        } catch (error) {
          console.error("Error cargando datos de verificación:", error);
          setVerificacionData(null);
        }
      } else {
        setVerificacionData(null);
      }
    };

    loadVerificacionData();
  }, [expediente]);

  // Función para volver atrás
  const handleVolverAtras = () => {
    if (origen === "tecnicoVerificador") {
      // Si venimos del técnico verificador, volver allí
      sessionStorage.removeItem("origenVerificacion");
      sessionStorage.removeItem("expedienteVerificacion");
    }
    onBack(); // Usar la función proporcionada para volver
  };

  // Si no hay expediente, mostrar mensaje de error
  if (!expediente) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Verificación técnica</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Error: No se ha proporcionado un expediente válido
              </p>
              <Button 
                color="primary" 
                onPress={handleVolverAtras}
              >
                Volver atrás
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Verificación técnica</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Button
            size="sm"
            variant="light"
            onPress={handleVolverAtras}
            className="mb-2"
          >
            &lt;&lt; Volver atrás
          </Button>

          <div className="mb-2">
            <strong>Expediente:</strong>{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() =>
                setModal({
                  type: "detalleExpediente",
                  props: { data: expediente },
                })
              }
            >
              Visualizar
            </span>
          </div>

          <div className="mb-2">
            <strong>N° de expediente:</strong> {expediente.expediente}
          </div>

          <div className="mb-2">
            <strong>Administrado:</strong> {expediente.nombre_completo}
          </div>

          {/* Enlaces de navegación */}
          <div className="space-y-1 mb-6">
            <div 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => onNavigate("verificacion-administrativa", expediente)}
            >
              - Verificación administrativa
            </div>
            <div 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => onNavigate("observaciones", expediente)}
            >
              - Observaciones
            </div>
            <div 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => onNavigate("parametros-urbanisticos", expediente)}
            >
              - Parámetros urbanísticos
            </div>
            <div 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => onNavigate("documentos-presentados", expediente)}
            >
              - Documentos presentados
            </div>
            <div 
              className="text-blue-600 cursor-pointer hover:underline font-semibold"
              onClick={() => onNavigate("verificacion-cuadro-areas", expediente)}
            >
              - Verificación cuadro de áreas
            </div>
            <div 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => onNavigate("requisitos", expediente)}
            >
              - Requisitos
            </div>
          </div>

          {/* Botones de informe */}
          <div className="flex gap-4 mt-6">
            <Button color="danger" className="flex-1">
              Informe de improcedente
            </Button>
            <Button color="primary" className="flex-1">
              Informe de conformidad
            </Button>
          </div>
        </CardBody>
      </Card>

      <ModalRenderer modal={modal} closeModal={() => setModal({ type: "" })} />
    </div>
  );
}