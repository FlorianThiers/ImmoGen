import React, { memo } from 'react';
import SelectField from './SelectField';

// Reusable boolean selector component
const BooleanField = memo(
  ({
    name,
    value,
    onChange,
    title,
  }: {
    name: string;
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    title: string;
  }) => (
    <SelectField
      name={name}
      value={value.toString()}
      onChange={onChange}
      title={title}
      options={[
        { value: "false", label: "Nee" },
        { value: "true", label: "Ja" },
      ]}
    />
  )
);

export default BooleanField;