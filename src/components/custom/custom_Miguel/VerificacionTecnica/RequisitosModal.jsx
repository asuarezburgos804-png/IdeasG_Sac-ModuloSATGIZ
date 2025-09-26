import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Textarea,
} from "@nextui-org/react";

export default function RequisitosModal({ isOpen, onClose, expediente }) {
  const [loading, setLoading] = useState(false);
  const [requisitos, setRequisitos] = useState({
    formulario_solicitud: false,
    documentacion_completa: false,
    planos_aprobados: false,
    estudio_tecnico: false,
    pago_tasas: false,
    licencia_municipal: false,
    observaciones: "",
  });

  useEffect(() => {
    if (isOpen) {
      // Load existing data if available
      // This would typically come from an API
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Save requisitos data to backend
      // await someService.actualizarRequisitos(expediente.id_solicitud, requisitos);
      onClose();
    } catch (error) {
      console.error("Error saving requisitos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (requisito) => {
    setRequisitos((prev) => ({
      ...prev,
      [requisito]: !prev[requisito],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="font-bold">
          Requisitos - {expediente?.expediente}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Checkbox
              isSelected={requisitos.formulario_solicitud}
              onChange={() => handleCheckboxChange("formulario_solicitud")}
            >
              Formulario de Solicitud Completo
            </Checkbox>

            <Checkbox
              isSelected={requisitos.documentacion_completa}
              onChange={() => handleCheckboxChange("documentacion_completa")}
            >
              Documentación Completa
            </Checkbox>

            <Checkbox
              isSelected={requisitos.planos_aprobados}
              onChange={() => handleCheckboxChange("planos_aprobados")}
            >
              Planos Aprobados
            </Checkbox>

            <Checkbox
              isSelected={requisitos.estudio_tecnico}
              onChange={() => handleCheckboxChange("estudio_tecnico")}
            >
              Estudio Técnico Presentado
            </Checkbox>

            <Checkbox
              isSelected={requisitos.pago_tasas}
              onChange={() => handleCheckboxChange("pago_tasas")}
            >
              Pago de Tasas Municipales
            </Checkbox>

            <Checkbox
              isSelected={requisitos.licencia_municipal}
              onChange={() => handleCheckboxChange("licencia_municipal")}
            >
              Licencia Municipal Vigente
            </Checkbox>

            <Textarea
              label="Observaciones"
              value={requisitos.observaciones}
              onChange={(e) =>
                setRequisitos({ ...requisitos, observaciones: e.target.value })
              }
              placeholder="Ingrese observaciones sobre los requisitos"
              rows={2}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
