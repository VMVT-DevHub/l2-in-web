import { TextAreaField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';

export const TextareaRenderer = ({
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
    <TextAreaField
      value={data}
      onChange={(value) => handleChange(path, value || undefined)}
      label={label}
      error={errors}
      name={label}
      showError={false}
      disabled={!enabled}
    />
  );
};
