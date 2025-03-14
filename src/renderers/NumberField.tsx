import { NumericField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';

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
    <NumericField
      value={data}
      onChange={(value) => handleChange(path, value || undefined)}
      label={label}
      error={formatError(errors)}
      name={label}
      showError={true}
      disabled={!enabled}
      {...uischema?.options}
    />
  );
};
