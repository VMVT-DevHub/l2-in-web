import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';

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
      error={formatError(errors)}
      type={type}
      name={label}
      showError={true}
      disabled={!enabled}
      placeholder={uischema?.options?.placeholder}
    />
  );
};
