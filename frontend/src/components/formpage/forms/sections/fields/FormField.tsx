import React, { memo } from 'react';

// Create a separate component for input fields to prevent them from losing focus
const FormField = memo(
  ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
    <div className="form-field">
      <label>{label}</label>
      {children}
    </div>
  )
);

export default FormField;