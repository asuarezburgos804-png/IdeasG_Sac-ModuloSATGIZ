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
  crearParametrosUrbanisticos,
  obtenerParametrosUrbanisticos,
} from "@/app/services/Miguel/VerificacionTecnica/tecnicoService";

export default function ParametrosUrbanisticosModal({
  isOpen,
  onClose,
  expediente,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    frente_minimo: "",
    area_minima: "",
    frente_efectivo: "",
    area_efectiva: "",
    densidad_maxima: "",
    altura_maxima: "",
    retiro_frontal: "",
    retiro_lateral: "",
    retiro_posterior: "",
    estacionamiento: "",
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
      const existingData = await obtenerParametrosUrbanisticos(
        expediente.id_solicitud
      );
      if (existingData) {
        setFormData(existingData);
      }
    } catch (error) {
      console.error("Error loading urban parameters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await crearParametrosUrbanisticos(expediente.id_solicitud, formData);
      onClose();
    } catch (error) {
      console.error("Error saving urban parameters:", error);
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
          Parámetros Urbanísticos - {expediente?.expediente}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Frente Mínimo (m)"
              type="number"
              value={formData.frente_minimo}
              onChange={(e) => handleChange("frente_minimo", e.target.value)}
            />

            <Input
              label="Área Mínima (m²)"
              type="number"
              value={formData.area_minima}
              onChange={(e) => handleChange("area_minima", e.target.value)}
            />

            <Input
              label="Frente Efectivo (m)"
              type="number"
              value={formData.frente_efectivo}
              onChange={(e) => handleChange("frente_efectivo", e.target.value)}
            />

            <Input
              label="Área Efectiva (m²)"
              type="number"
              value={formData.area_efectiva}
              onChange={(e) => handleChange("area_efectiva", e.target.value)}
            />

            <Input
              label="Densidad Máxima (viv/ha)"
              type="number"
              value={formData.densidad_maxima}
              onChange={(e) => handleChange("densidad_maxima", e.target.value)}
            />

            <Input
              label="Altura Máxima (m)"
              type="number"
              value={formData.altura_maxima}
              onChange={(e) => handleChange("altura_maxima", e.target.value)}
            />

            <Input
              label="Retiro Frontal (m)"
              type="number"
              value={formData.retiro_frontal}
              onChange={(e) => handleChange("retiro_frontal", e.target.value)}
            />

            <Input
              label="Retiro Lateral (m)"
              type="number"
              value={formData.retiro_lateral}
              onChange={(e) => handleChange("retiro_lateral", e.target.value)}
            />

            <Input
              label="Retiro Posterior (m)"
              type="number"
              value={formData.retiro_posterior}
              onChange={(e) => handleChange("retiro_posterior", e.target.value)}
            />

            <Input
              label="Estacionamientos Requeridos"
              type="number"
              value={formData.estacionamiento}
              onChange={(e) => handleChange("estacionamiento", e.target.value)}
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
            placeholder="Ingrese observaciones sobre los parámetros urbanísticos"
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
