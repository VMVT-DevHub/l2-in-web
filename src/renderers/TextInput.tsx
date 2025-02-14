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
  schema,
  uischema,
}: ControlProps) => {
  if (!visible) return <></>;
  const type = schema?.type?.toString() || '';

  return (
    <TextField
      value={data}
      onChange={(value) => handleChange(path, value || undefined)}
      label={label}
      error={errors}
      type={type}
      name={label}
      showError={false}
      disabled={!enabled}
      placeholder={uischema?.options?.placeholder}
    />
  );
};
