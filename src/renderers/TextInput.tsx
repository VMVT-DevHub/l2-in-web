import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';

export const CustomTextRenderer = ({
  data,
  handleChange,
  errors,
  path,
  visible,
  label,
  enabled,
}: ControlProps) => {
  if (!visible) return <></>;

  return (
    <TextField
      value={data}
      onChange={(value) => handleChange(path, value)}
      label={label}
      error={errors}
      name={label}
      showError={false}
      disabled={!enabled}
    />
  );
};
