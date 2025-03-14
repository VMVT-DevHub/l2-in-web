import { FieldWrapper, TextFieldInput } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';

export const EmailFieldRenderer = ({
  data = '',
  handleChange,
  errors,
  path,
  uischema,
  visible,
  label,
  enabled,
}: ControlProps) => {
  if (!visible) return <></>;

  const handleBlur = () => {
    if (!/^https?:\/\//i.test(data)) {
      handleChange(path, 'https://' + data);
    }
  };

  return (
    <FieldWrapper
      handleBlur={handleBlur}
      label={label}
      error={formatError(errors)}
      showError={true}
    >
      <TextFieldInput
        value={data}
        name={label}
        error={formatError(errors)}
        onChange={(value) => handleChange(path, value || undefined)}
        disabled={!enabled}
        placeholder={uischema?.options?.placeholder || ''}
      />
    </FieldWrapper>
  );
};
