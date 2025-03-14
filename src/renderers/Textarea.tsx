import { TextAreaField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';

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
       error={formatError(errors)}
      name={label}
      showError={true}
      disabled={!enabled}
    />
  );
};
