import React, { memo } from 'react';


// Create a separate component for each form field type
const InputField = memo(
  ({
    name,
    value,
    onChange,
    title,
    placeholder,
    type = "text",
    min,
    max,
    step,
  }: {
    name: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    title: string;
    placeholder: string;
    type?: string;
    min?: number;
    max?: number;
    step?: number;
  }) => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      title={title}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      style={type === "range" ? { width: "100%" } : undefined}
    />
  )
);

export default InputField;