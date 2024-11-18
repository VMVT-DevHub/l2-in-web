import { FieldWrapper, TextFieldInput } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';

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
    <FieldWrapper handleBlur={handleBlur} label={label} error={errors} showError={false}>
      <TextFieldInput
        value={data}
        name={label}
        error={errors}
        onChange={(value) => handleChange(path, value)}
        disabled={!enabled}
        placeholder={uischema?.options?.placeholder || ''}
      />
    </FieldWrapper>
  );
};
