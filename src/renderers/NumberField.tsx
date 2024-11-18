import { NumericTextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useOptions } from '../utils/hooks';

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
      onChange={(value) => handleChange(path, Number(value))}
      label={label}
      error={errors}
      name={label}
      placeholder={uischema?.options?.placeholder}
      showError={false}
      disabled={!enabled}
    />
  );
};
