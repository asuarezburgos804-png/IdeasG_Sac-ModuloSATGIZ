import React, { useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function CustomFileUpload({
  onFilesChange,
  files = [],
  acceptTypes = "application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/tiff,application/zip,application/x-rar-compressed",
  onClose,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndSetFiles(selectedFiles);
  };

  const validateAndSetFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    // Validar número máximo de archivos (10)
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > 10) {
      alert("Máximo 10 archivos permitidos");
      return;
    }

    const validExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "jpg",
      "jpeg",
      "png",
      "tiff",
      "dwg",
      "dxf",
      "zip",
      "rar",
    ];

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/tiff",
      "application/zip",
      "application/x-rar-compressed",
    ];

    const validFiles = [];
    const errors = [];

    newFiles.forEach((file) => {
      // Check extension
      const ext = file.name.split(".").pop().toLowerCase();
      const isValidExt = validExtensions.includes(ext);
      const isValidType = validTypes.includes(file.type);

      if (!isValidExt || !isValidType) {
        errors.push(`"${file.name}": Tipo de archivo no permitido`);
        return;
      }

      // Validate file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSizeInBytes) {
        errors.push(`"${file.name}": Archivo demasiado grande (máximo 10MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(`Errores en los archivos:\n${errors.join("\n")}`);
    }

    if (validFiles.length > 0) {
      const allFiles = [...files, ...validFiles];
      onFilesChange(allFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  // Convert acceptTypes to human-readable format for display
  const displayTypes = "PDF, Word, Excel, Imágenes, AutoCAD, ZIP, RAR";

  return (
    <div className="pb-8">
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-verdeVeci bg-verdeVeci-50" : "border-default-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon
          icon="lucide:upload-cloud"
          className="w-12 h-12 mx-auto text-default-400"
        />
        <p className="mt-2 text-default-600">
          Arrastra y suelta tus archivos aquí o
        </p>
        <Button
          variant="flat"
          size="sm"
          className="mt-2 bg-verdeVeci text-white"
          onPress={() => fileInputRef.current?.click()}
        >
          Selecciona archivos
        </Button>
        <p className="mt-2 text-tiny text-default-400">
          {displayTypes} - Máximo 10MB por archivo
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptTypes}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Lista de archivos seleccionados */}
        {files.length > 0 && (
          <div className="mt-4 text-left">
            <p className="text-sm font-medium mb-2">
              Archivos seleccionados ({files.length}/10):
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-default-100 rounded p-2"
                >
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => removeFile(index)}
                    className="ml-2"
                  >
                    <Icon icon="lucide:x" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
