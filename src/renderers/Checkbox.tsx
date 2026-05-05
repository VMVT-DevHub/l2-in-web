import { CheckBox } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';

export const CheckBoxRenderer = ({
  uischema,
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
  schema,
  description,
}: ControlProps) => {
  const margin = uischema?.options?.margin;
  const defaultValue = schema?.default;

  return (
    <StyledCheckBox
      value={defaultValue ? defaultValue : data}
      onChange={(value) => handleChange(path, value)}
      label={label}
      error={!!errors}
      disabled={!enabled}
      description={description}
      margin={margin}
      {...uischema?.options}
    />
  );
};

const StyledCheckBox = styled(CheckBox)<{ margin?: string }>`
  margin: ${({ margin }) => (margin ? `3px ${margin}` : '6px 0')};
`;
