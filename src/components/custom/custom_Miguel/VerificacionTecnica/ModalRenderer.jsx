import SuccessModal from "@/components/custom/successModal";
import ErrorModal from "@/components/custom/errorModal";
import DeleteModal from "@/components/custom/deleteModal";
import DetalleExpedienteModal from "@/components/custom/custom_Miguel/VerificacionTecnica/DetalleExpedienteModal";
import VerificacionAdministrativaModal from "@/components/custom/custom_Miguel/VerificacionTecnica/VerificacionAdministrativaModal";
import ParametrosUrbanisticosModal from "@/components/custom/custom_Miguel/VerificacionTecnica/ParametrosUrbanisticosModal";
import VerificacionCuadroAreaModal from "@/components/custom/custom_Miguel/VerificacionTecnica/VerificacionCuadroAreaModal";
import ObservacionesModal from "@/components/custom/custom_Miguel/VerificacionTecnica/ObservacionesModal";
import DocumentosPresentadosModal from "@/components/custom/custom_Miguel/VerificacionTecnica/DocumentosPresentadosModal";
import RequisitosModal from "@/components/custom/custom_Miguel/VerificacionTecnica/RequisitosModal";

export function ModalRenderer({ modal, closeModal }) {
  if (!modal.type) return null;

  switch (modal.type) {
    case "success":
      return (
        <SuccessModal isOpen={true} onClose={closeModal} {...modal.props} />
      );
    case "error":
      return <ErrorModal isOpen={true} onClose={closeModal} {...modal.props} />;
    case "delete":
      return (
        <DeleteModal isOpen={true} onClose={closeModal} {...modal.props} />
      );
    case "detalleExpediente":
      return (
        <DetalleExpedienteModal
          isOpen={true}
          onClose={closeModal}
          {...modal.props}
        />
      );
    case "verificacionAdministrativa":
      return (
        <VerificacionAdministrativaModal
          isOpen={true}
          onClose={closeModal}
          {...modal.props}
        />
      );
    case "parametrosUrbanisticos":
      return (
        <ParametrosUrbanisticosModal
          isOpen={true}
          onClose={closeModal}
          {...modal.props}
        />
      );
    case "verificacionCuadroArea":
      return (
        <VerificacionCuadroAreaModal
          isOpen={true}
          onClose={closeModal}
          {...modal.props}
        />
      );
    case "observaciones":
      return (
        <ObservacionesModal
          isOpen={true}
          onClose={closeModal}
          {...modal.props}
        />
      );
    case "documentosPresentados":
      return (
        <DocumentosPresentadosModal
          isOpen={true}
          onClose={closeModal}
          {...modal.props}
        />
      );
    case "requisitos":
      return (
        <RequisitosModal isOpen={true} onClose={closeModal} {...modal.props} />
      );
    default:
      return null;
  }
}
