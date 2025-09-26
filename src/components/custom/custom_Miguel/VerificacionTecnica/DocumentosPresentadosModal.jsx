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

export default function DocumentosPresentadosModal({
  isOpen,
  onClose,
  expediente,
}) {
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState({
    dni: false,
    partida_nacimiento: false,
    documento_propiedad: false,
    poder_notarial: false,
    planos_arquitectonicos: false,
    estudio_suelos: false,
    certificado_habitabilidad: false,
    otros: "",
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
      // Save documentos data to backend
      // await someService.actualizarDocumentos(expediente.id_solicitud, documentos);
      onClose();
    } catch (error) {
      console.error("Error saving documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (documento) => {
    setDocumentos((prev) => ({
      ...prev,
      [documento]: !prev[documento],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="font-bold">
          Documentos Presentados - {expediente?.expediente}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Checkbox
              isSelected={documentos.dni}
              onChange={() => handleCheckboxChange("dni")}
            >
              DNI o Carnet de Extranjería
            </Checkbox>

            <Checkbox
              isSelected={documentos.partida_nacimiento}
              onChange={() => handleCheckboxChange("partida_nacimiento")}
            >
              Partida de Nacimiento
            </Checkbox>

            <Checkbox
              isSelected={documentos.documento_propiedad}
              onChange={() => handleCheckboxChange("documento_propiedad")}
            >
              Documento de Propiedad
            </Checkbox>

            <Checkbox
              isSelected={documentos.poder_notarial}
              onChange={() => handleCheckboxChange("poder_notarial")}
            >
              Poder Notarial (si aplica)
            </Checkbox>

            <Checkbox
              isSelected={documentos.planos_arquitectonicos}
              onChange={() => handleCheckboxChange("planos_arquitectonicos")}
            >
              Planos Arquitectónicos
            </Checkbox>

            <Checkbox
              isSelected={documentos.estudio_suelos}
              onChange={() => handleCheckboxChange("estudio_suelos")}
            >
              Estudio de Suelos
            </Checkbox>

            <Checkbox
              isSelected={documentos.certificado_habitabilidad}
              onChange={() => handleCheckboxChange("certificado_habitabilidad")}
            >
              Certificado de Habitabilidad
            </Checkbox>

            <Textarea
              label="Otros documentos"
              value={documentos.otros}
              onChange={(e) =>
                setDocumentos({ ...documentos, otros: e.target.value })
              }
              placeholder="Especifique otros documentos presentados"
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
