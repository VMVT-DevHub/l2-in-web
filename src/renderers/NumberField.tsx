import { NumericTextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';

export const CustomNumberRenderer = ({
  data,
  handleChange,
  errors,
  path,
  label,
  uischema,
  enabled,
}: ControlProps) => {
  return (
    <NumericTextField
      value={data}
      onChange={(value) => handleChange(path, value)}
      label={label}
      error={errors}
      name={label}
      showError={false}
      disabled={!enabled}
      {...uischema?.options}
    />
  );
};
