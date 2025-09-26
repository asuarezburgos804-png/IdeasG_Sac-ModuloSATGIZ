import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  crearVerificacionCuadroArea,
  obtenerVerificacionCuadroArea,
} from "@/app/services/Miguel/VerificacionTecnica/tecnicoService";

export default function VerificacionCuadroAreaModal({
  isOpen,
  onClose,
  expediente,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    area_terreno: "",
    area_construida: "",
    area_libre: "",
    area_verde: "",
    area_techada: "",
    area_semicubierta: "",
    area_comun: "",
    coeficiente_edificacion: "",
    coeficiente_ocupacion: "",
    observaciones: "",
    estado: "PENDIENTE",
  });

  useEffect(() => {
    if (isOpen && expediente) {
      loadExistingData();
    }
  }, [isOpen, expediente]);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const existingData = await obtenerVerificacionCuadroArea(
        expediente.id_solicitud
      );
      if (existingData) {
        setFormData(existingData);
      }
    } catch (error) {
      console.error("Error loading area verification data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await crearVerificacionCuadroArea(expediente.id_solicitud, formData);
      onClose();
    } catch (error) {
      console.error("Error saving area verification:", error);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="font-bold">
          Verificación de Cuadro de Área - {expediente?.expediente}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Área de Terreno (m²)"
              type="number"
              value={formData.area_terreno}
              onChange={(e) => handleChange("area_terreno", e.target.value)}
            />

            <Input
              label="Área Construida (m²)"
              type="number"
              value={formData.area_construida}
              onChange={(e) => handleChange("area_construida", e.target.value)}
            />

            <Input
              label="Área Libre (m²)"
              type="number"
              value={formData.area_libre}
              onChange={(e) => handleChange("area_libre", e.target.value)}
            />

            <Input
              label="Área Verde (m²)"
              type="number"
              value={formData.area_verde}
              onChange={(e) => handleChange("area_verde", e.target.value)}
            />

            <Input
              label="Área Techada (m²)"
              type="number"
              value={formData.area_techada}
              onChange={(e) => handleChange("area_techada", e.target.value)}
            />

            <Input
              label="Área Semicubierta (m²)"
              type="number"
              value={formData.area_semicubierta}
              onChange={(e) =>
                handleChange("area_semicubierta", e.target.value)
              }
            />

            <Input
              label="Área Común (m²)"
              type="number"
              value={formData.area_comun}
              onChange={(e) => handleChange("area_comun", e.target.value)}
            />

            <Input
              label="Coeficiente de Edificación"
              type="number"
              step="0.01"
              value={formData.coeficiente_edificacion}
              onChange={(e) =>
                handleChange("coeficiente_edificacion", e.target.value)
              }
            />

            <Input
              label="Coeficiente de Ocupación"
              type="number"
              step="0.01"
              value={formData.coeficiente_ocupacion}
              onChange={(e) =>
                handleChange("coeficiente_ocupacion", e.target.value)
              }
            />

            <Select
              label="Estado"
              value={formData.estado}
              onChange={(e) => handleChange("estado", e.target.value)}
              className="col-span-2"
            >
              <SelectItem key="PENDIENTE">Pendiente</SelectItem>
              <SelectItem key="APROBADO">Aprobado</SelectItem>
              <SelectItem key="RECHAZADO">Rechazado</SelectItem>
            </Select>
          </div>

          <Textarea
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => handleChange("observaciones", e.target.value)}
            placeholder="Ingrese observaciones sobre la verificación de áreas"
            className="mt-4"
          />
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
