import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';
import styled from 'styled-components';

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
  const margin = uischema?.options?.margin;

  return (
    <StyledTextField
      value={data}
      onChange={(value) => handleChange(path, value || undefined)}
      label={label}
      error={formatError(errors)}
      type={type}
      name={label}
      margin={margin}
      showError={true}
      disabled={!enabled}
      placeholder={uischema?.options?.placeholder}
    />
  );
};

const StyledTextField = styled(TextField)<{ margin?: string }>`
  margin: ${({ margin }) => (margin ? `0px ${margin}` : '6px 0')};
`;
