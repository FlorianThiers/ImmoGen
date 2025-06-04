import React, { memo } from 'react';

const SelectField = memo(
  ({
    name,
    value,
    onChange,
    title,
    options,
    customStyles,
  }: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    title: string;
    options: { value: string; label: string; style?: React.CSSProperties }[];
    customStyles?: React.CSSProperties;
  }) => (
    <select
      name={name}
      value={value}
      onChange={onChange}
      title={title}
      style={customStyles}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} style={option.style}>
          {option.label}
        </option>
      ))}
    </select>
  )
);

export default SelectField;