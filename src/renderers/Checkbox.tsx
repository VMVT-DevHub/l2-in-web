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
  description,
}: ControlProps) => {
  const margin = uischema?.options?.margin;

  return (
    <StyledCheckBox
      value={data}
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
  margin: ${({ margin }) => (margin ? `3px ${margin}` : '3px 0')};
`;
