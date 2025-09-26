import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
} from "@nextui-org/react";
import { obtenerExpediente } from "@/app/services/Miguel/Acotar/fuhuFueService";

export default function DetalleExpedienteModal({ isOpen, onClose, data }) {
  const [expedienteData, setExpedienteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && data && data.id_expediente) {
      setLoading(true);
      setError(null);
      obtenerExpediente(data.id_expediente)
        .then((response) => {
          if (response.success) {
            setExpedienteData(response.data);
          } else {
            setError("No se pudieron cargar los datos del expediente");
          }
        })
        .catch((err) => {
          console.error("Error obteniendo expediente:", err);
          setError("Error al cargar los datos del expediente");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, data]);

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="font-bold">
          Formulario Unico de Edificaciones
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : expedienteData ? (
            <div className="text-sm">
              <div className="mb-4">
                <strong>Solicitud</strong>
                <hr className="my-2" />
                <div>
                  <strong>Propietario:</strong> SI
                </div>
                <hr className="my-2" />
              </div>

              <div className="mb-4">
                <strong>Tipo de persona:</strong> Persona Natural
                <hr className="my-2" />
              </div>

              <div className="mb-4">
                <strong>Datos de Persona</strong>
                <hr className="my-2" />
                <div className="ml-4">
                  <div>
                    <strong>DNI:</strong>{" "}
                    {expedienteData.propietario?.c_num_doc || "N/A"}
                  </div>
                  <div>
                    <strong>Apellido pat:</strong>{" "}
                    {expedienteData.propietario?.c_appat_per || "N/A"}
                  </div>
                  <div>
                    <strong>Apellido mat:</strong>{" "}
                    {expedienteData.propietario?.c_apmat_per || "N/A"}
                  </div>
                  <div>
                    <strong>Nombres:</strong>{" "}
                    {expedienteData.propietario?.c_nomb_per || "N/A"}
                  </div>
                  <div>
                    <strong>Correo elect:</strong>{" "}
                    {expedienteData.propietario?.c_correo || "N/A"}
                  </div>
                  <div>
                    <strong>Teléfono:</strong>{" "}
                    {expedienteData.propietario?.c_telefono || "N/A"}
                  </div>
                  <div>
                    <strong>Estado civil:</strong>{" "}
                    {expedienteData.propietario?.cod_est_civil || "N/A"}
                  </div>
                </div>
                <hr className="my-2" />
              </div>

              <div className="mb-4">
                <strong>Domicilio</strong>
                <hr className="my-2" />
                <div className="ml-4">
                  <div>
                    <strong>Departamento:</strong>{" "}
                    {expedienteData.domicilio?.c_ubigeo_dep || "N/A"}
                  </div>
                  <div>
                    <strong>Provincia:</strong>{" "}
                    {expedienteData.domicilio?.c_ubigeo_prov || "N/A"}
                  </div>
                  <div>
                    <strong>Distrito:</strong>{" "}
                    {expedienteData.domicilio?.c_ubigeo_dist || "N/A"}
                  </div>
                  <div>
                    <strong>Urbanizacion:</strong>{" "}
                    {expedienteData.domicilio?.c_direccion || "N/A"}
                  </div>
                  <div>
                    <strong>Lote:</strong>{" "}
                    {expedienteData.domicilio?.c_lote || "N/A"}
                  </div>
                  <div>
                    <strong>Sublote:</strong>{" "}
                    {expedienteData.domicilio?.c_sublote || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              No hay datos disponibles
            </div>
          )}

          <Button onPress={onClose} className="mt-4" color="primary">
            Cerrar
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
