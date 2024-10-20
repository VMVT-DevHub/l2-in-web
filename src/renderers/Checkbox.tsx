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
}: ControlProps) => {
  return (
    <StyledCheckBox
      value={data}
      onChange={(value) => handleChange(path, value)}
      label={label}
      error={!!errors}
      disabled={!enabled}
      {...uischema?.options}
    />
  );
};

const StyledCheckBox = styled(CheckBox)`
  margin: 16px 0;
`;
