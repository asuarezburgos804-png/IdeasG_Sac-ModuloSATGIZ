import React from "react";
import { Input } from "@nextui-org/react";

export const CustomInput = ({
  label,
  placeholder,
  labelPlacement,
  variant,
  color,
  value,
  onChange,
  startContent,
  className = "",
  classNames = {
    label: "text-xs",
    input: "text-sm",
  },
  isInvalid,
  errorMessage,
  endContent,
  ...props
}) => {
  return (
    <Input
      label={label}
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      variant={variant}
      color={color}
      value={value}
      onChange={onChange}
      startContent={startContent}
      className={`w-full ${className}`}
      classNames={classNames}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      endContent={endContent}
      {...props}
    />
  );
};