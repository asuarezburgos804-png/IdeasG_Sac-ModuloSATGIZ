import React from "react";
import { Input, Button } from "@nextui-org/react";

export default function ObservacionInput({ value, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Ingrese observación"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button color="danger" variant="light" onPress={onDelete}>
        ✖
      </Button>
    </div>
  );
}
