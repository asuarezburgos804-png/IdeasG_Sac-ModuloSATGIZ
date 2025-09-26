import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Checkbox,
} from "@nextui-org/react";
import {
  crearVerificacionAdministrativa,
  obtenerVerificacionAdministrativa,
} from "@/app/services/Miguel/VerificacionTecnica/tecnicoService";

export default function VerificacionAdministrativaModal({
  isOpen,
  onClose,
  expediente,
}) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    b_doc_identidad_completo: false,
    b_representacion_legal_completo: false,
    b_titulo_propiedad_completo: false,
    b_licencia_funcionamiento_completo: false,
    b_planos_arquitectonicos_completo: false,
    b_estudio_suelos_completo: false,
    b_estudio_topografico_completo: false,
    b_memoria_descriptiva_completo: false,
    b_certificado_zonificacion_completo: false,
    b_otros_documentos_completo: false,
    c_observaciones: "",
    id_verificacion: null,
  });

  useEffect(() => {
    if (isOpen && expediente) {
      loadExistingData();
      setIsEditing(false); // Reset to view mode when modal opens
    }
  }, [isOpen, expediente]);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const existingData = await obtenerVerificacionAdministrativa(
        expediente.id_solicitud
      );

      // Handle backend response safely
      if (existingData && existingData.success && existingData.data) {
        // Ensure we only set fields that actually exist in the response
        const safeData = {
          b_doc_identidad_completo:
            existingData.data.b_doc_identidad_completo || false,
          b_representacion_legal_completo:
            existingData.data.b_representacion_legal_completo || false,
          b_titulo_propiedad_completo:
            existingData.data.b_titulo_propiedad_completo || false,
          b_licencia_funcionamiento_completo:
            existingData.data.b_licencia_funcionamiento_completo || false,
          b_planos_arquitectonicos_completo:
            existingData.data.b_planos_arquitectonicos_completo || false,
          b_estudio_suelos_completo:
            existingData.data.b_estudio_suelos_completo || false,
          b_estudio_topografico_completo:
            existingData.data.b_estudio_topografico_completo || false,
          b_memoria_descriptiva_completo:
            existingData.data.b_memoria_descriptiva_completo || false,
          b_certificado_zonificacion_completo:
            existingData.data.b_certificado_zonificacion_completo || false,
          b_otros_documentos_completo:
            existingData.data.b_otros_documentos_completo || false,
          c_observaciones: existingData.data.c_observaciones || "",
          id_verificacion: existingData.data.id_verificacion || null,
        };
        setFormData(safeData);
      } else {
        // Reset to default state if no data or error
        setFormData({
          b_doc_identidad_completo: false,
          b_representacion_legal_completo: false,
          b_titulo_propiedad_completo: false,
          b_licencia_funcionamiento_completo: false,
          b_planos_arquitectonicos_completo: false,
          b_estudio_suelos_completo: false,
          b_estudio_topografico_completo: false,
          b_memoria_descriptiva_completo: false,
          b_certificado_zonificacion_completo: false,
          b_otros_documentos_completo: false,
          c_observaciones: "",
          id_verificacion: null,
        });
      }
    } catch (error) {
      console.error("Error loading verification data:", error);
      // Reset to default state on error
      setFormData({
        b_doc_identidad_completo: false,
        b_representacion_legal_completo: false,
        b_titulo_propiedad_completo: false,
        b_licencia_funcionamiento_completo: false,
        b_planos_arquitectonicos_completo: false,
        b_estudio_suelos_completo: false,
        b_estudio_topografico_completo: false,
        b_memoria_descriptiva_completo: false,
        b_certificado_zonificacion_completo: false,
        b_otros_documentos_completo: false,
        c_observaciones: "",
        id_verificacion: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await crearVerificacionAdministrativa(expediente.id_solicitud, formData);
      setIsEditing(false); // Return to view mode after saving
      onClose();
    } catch (error) {
      console.error("Error saving verification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadExistingData(); // Reload original data
  };

  const documentFields = [
    {
      key: "b_doc_identidad_completo",
      label: "Documento de identidad completo",
    },
    {
      key: "b_representacion_legal_completo",
      label: "Representación legal completa",
    },
    {
      key: "b_titulo_propiedad_completo",
      label: "Título de propiedad completo",
    },
    {
      key: "b_licencia_funcionamiento_completo",
      label: "Licencia de funcionamiento completa",
    },
    {
      key: "b_planos_arquitectonicos_completo",
      label: "Planos arquitectónicos completos",
    },
    { key: "b_estudio_suelos_completo", label: "Estudio de suelos completo" },
    {
      key: "b_estudio_topografico_completo",
      label: "Estudio topográfico completo",
    },
    {
      key: "b_memoria_descriptiva_completo",
      label: "Memoria descriptiva completa",
    },
    {
      key: "b_certificado_zonificacion_completo",
      label: "Certificado de zonificación completo",
    },
    { key: "b_otros_documentos_completo", label: "Otros documentos completos" },
  ];

  const hasExistingData = formData.id_verificacion;
  const isDisabled = hasExistingData && !isEditing;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="font-bold flex justify-between items-center">
          <span>Verificación Administrativa - {expediente?.expediente}</span>
          {hasExistingData && !isEditing && (
            <Button size="sm" color="primary" onPress={handleEditToggle}>
              Editar verificación
            </Button>
          )}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Documentos */}
            <div className="border p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3">
                Documentos Presentados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documentFields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between"
                  >
                    <label className="flex-1 text-sm">{field.label}</label>
                    <Checkbox
                      isSelected={formData[field.key]}
                      onChange={() => handleCheckboxChange(field.key)}
                      isDisabled={isDisabled}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div className="border p-4 rounded-lg">
              <Textarea
                label="Observaciones"
                value={formData.c_observaciones}
                onChange={(e) =>
                  handleChange("c_observaciones", e.target.value)
                }
                placeholder="Ingrese observaciones generales"
                rows={3}
                size="sm"
                isDisabled={isDisabled}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {isEditing ? (
            <>
              <Button color="default" onPress={handleCancelEdit}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button color="default" onPress={onClose}>
                Cerrar
              </Button>
              {!hasExistingData && (
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={loading}
                >
                  Guardar
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
