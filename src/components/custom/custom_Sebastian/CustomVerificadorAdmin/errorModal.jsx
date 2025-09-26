import React from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { XCircleIcon } from "@/icons/veci/condominio/modales/XCircleIcon";

function ErrorModal({
  isOpen,
  onClose,
  modalTitle = "¡Ocurrió un error!",
  message = "Hubo un problema al realizar la operación.",
  errorDetail = "",
  icon = "lucide:x-circle",
  buttonText = "Entendido",
  showCloseButton = false,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md" placement="center" hideCloseButton={!showCloseButton}>
      <ModalContent>
        {() => (
          <>
            <ModalBody className="pt-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-danger-100 p-6 text-danger">
                  <XCircleIcon className="text-5xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">{modalTitle}</h3>
                  <p className="text-default-500">{message}</p>
                  {errorDetail && (
                    <span className="block mt-2 font-medium text-danger-500">{errorDetail}</span>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center pb-6">
              {showCloseButton && (
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              )}
              <Button color="danger" onPress={onClose} className="px-8">
                {buttonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ErrorModal;