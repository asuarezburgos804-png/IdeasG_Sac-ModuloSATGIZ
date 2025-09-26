import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";

export default function DetalleExpedienteModal({ isOpen, onClose, data }) {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="font-bold">Detalle de Expediente</ModalHeader>
        <ModalBody>
          <div className="text-sm space-y-2">
            <div>
              <strong>N° de Expediente:</strong> {data.expediente}
            </div>
            <div>
              <strong>DNI:</strong> {data.dni}
            </div>
            <div>
              <strong>Nombre Completo:</strong> {data.nombre_completo}
            </div>
            <div>
              <strong>Fecha de Registro:</strong> {data.fecha_registro}
            </div>
            {data.id_solicitud && (
              <div>
                <strong>ID Solicitud:</strong> {data.id_solicitud}
              </div>
            )}
          </div>
          <Button onPress={onClose} className="mt-4" color="primary">
            Cerrar
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
