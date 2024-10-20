import { NumericTextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useOptions } from '../utils/hooks';

export const CustomNumberRenderer = ({
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
}: ControlProps) => {
  return (
    <NumericTextField
      value={data}
      onChange={(value) => handleChange(path, Number(value))}
      label={label}
      error={errors}
      name={label}
      showError={false}
      disabled={!enabled}
    />
  );
};
