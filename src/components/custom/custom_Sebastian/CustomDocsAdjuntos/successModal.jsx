import React from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { CheckCircleIcon } from "@/icons/veci/condominio/modales/CheckCircleIcon";

function SuccessModal({
  isOpen,
  onClose,
  modalTitle = "¡Operación exitosa!",
  modalTextContent = "La operación se realizó correctamente",
  onConfirm,
  buttonText = "Aceptar",
  showCloseButton = false,
}) {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md" placement="center" hideCloseButton={!showCloseButton}>
      <ModalContent>
        {() => (
          <>
            <ModalBody className="pt-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-success-100 p-6 text-success">
                  <CheckCircleIcon className="text-5xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold">{modalTitle}</h3>
                  <p className="text-default-500">{modalTextContent}</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center pb-6">
              {/* {showCloseButton && (
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              )} */}
              <Button color="success" onPress={handleConfirm} className="px-8">
                {buttonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default SuccessModal;