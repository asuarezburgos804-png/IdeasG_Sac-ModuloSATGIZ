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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@nextui-org/react";
import {
  obtenerObservacionesPorExpediente,
  crearObservacion,
  actualizarObservacion,
  eliminarObservacion,
} from "@/app/services/Miguel/VerificacionTecnica/tecnicoService";

export default function ObservacionesModal({ isOpen, onClose, expediente }) {
  const [loading, setLoading] = useState(false);
  const [observaciones, setObservaciones] = useState([]);
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
    estado: "PENDIENTE",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isOpen && expediente) {
      loadObservaciones();
    }
  }, [isOpen, expediente]);

  const loadObservaciones = async () => {
    try {
      setLoading(true);
      const data = await obtenerObservacionesPorExpediente(
        expediente.id_solicitud
      );
      setObservaciones(data || []);
    } catch (error) {
      console.error("Error loading observaciones:", error);
      setObservaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const observacionData = {
        ...formData,
        id_expediente: expediente.id_solicitud,
      };

      if (editingId) {
        await actualizarObservacion(editingId, observacionData);
      } else {
        await crearObservacion(observacionData);
      }

      setFormData({ tipo: "", descripcion: "", estado: "PENDIENTE" });
      setEditingId(null);
      await loadObservaciones();
    } catch (error) {
      console.error("Error saving observación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (observacion) => {
    setFormData({
      tipo: observacion.tipo,
      descripcion: observacion.descripcion,
      estado: observacion.estado,
    });
    setEditingId(observacion.id_observacion);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await eliminarObservacion(id);
      await loadObservaciones();
    } catch (error) {
      console.error("Error deleting observación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ tipo: "", descripcion: "", estado: "PENDIENTE" });
    setEditingId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="font-bold">
          Observaciones - {expediente?.expediente}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select
              label="Tipo de Observación"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
            >
              <SelectItem key="DOCUMENTACION">Documentación</SelectItem>
              <SelectItem key="TECNICA">Técnica</SelectItem>
              <SelectItem key="URBANISTICA">Urbanística</SelectItem>
              <SelectItem key="ADMINISTRATIVA">Administrativa</SelectItem>
              <SelectItem key="OTRA">Otra</SelectItem>
            </Select>

            <Select
              label="Estado"
              value={formData.estado}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value })
              }
            >
              <SelectItem key="PENDIENTE">Pendiente</SelectItem>
              <SelectItem key="RESUELTA">Resuelta</SelectItem>
              <SelectItem key="DESESTIMADA">Desestimada</SelectItem>
            </Select>
          </div>

          <Textarea
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            placeholder="Ingrese la descripción de la observación"
            rows={3}
          />

          <div className="flex gap-2 mt-4">
            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
              {editingId ? "Actualizar" : "Agregar"}
            </Button>
            {editingId && (
              <Button color="default" onPress={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>

          <Divider className="my-4" />

          <h3 className="font-semibold mb-2">Observaciones Registradas</h3>
          {observaciones.length > 0 ? (
            <Table aria-label="Observaciones table">
              <TableHeader>
                <TableColumn>TIPO</TableColumn>
                <TableColumn>DESCRIPCIÓN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {observaciones.map((obs) => (
                  <TableRow key={obs.id_observacion}>
                    <TableCell>{obs.tipo}</TableCell>
                    <TableCell>{obs.descripcion}</TableCell>
                    <TableCell>{obs.estado}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => handleEdit(obs)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onPress={() => handleDelete(obs.id_observacion)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No hay observaciones registradas</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
